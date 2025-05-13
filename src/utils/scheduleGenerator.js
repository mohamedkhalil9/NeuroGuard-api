import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";

export const generateSchedule = (doctor, date) => {
  const hours = [];
  const requestedDate = new Date(date);

  // Get working hours for the requested day
  const dayOfWeek = requestedDate.getDay();
  // NOTE: work on a week ? or just a day

  const workingHours =
    // when there is day provided it will be used otherwise it will generate a default working day 9 to 5
    doctor.workingDays.find((wh) => wh.day === dayOfWeek) ||
    (doctor.defaultWorkingDays
      ? {
          start: "16:00",
          end: "22:00",
        }
      : null);

  if (!workingHours) return []; // Doctor doesn't work this day

  // Convert working hours to Date objects
  const [startHour, startMinute] = workingHours.start.split(":").map(Number);
  const [endHour, endMinute] = workingHours.end.split(":").map(Number);

  let current = new Date(requestedDate);
  current.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(requestedDate);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Generate hourly slots
  while (current < endTime) {
    const end = new Date(current.getTime() + 60 * 60 * 1000);
    if (end > endTime) break;

    hours.push({
      start: new Date(current),
      end: new Date(end),
    });

    current.setHours(current.getHours() + 1);
  }

  return hours;
};

export const getAvailableSchedule = async (doctorId, date) => {
  const doctor = await Doctor.findById(doctorId);
  const requestedDate = new Date(date);

  // Generate base schedule
  const schedule = generateSchedule(doctor, requestedDate);

  // Get existing appointments
  const appointments = await Appointment.find({
    doctor: doctorId,
    startTime: {
      $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
      $lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
    },
    status: "confirmed",
  });

  // Filter out booked hours
  const availableSchedule = schedule.filter((hour) => {
    return !appointments.some(
      (appt) => appt.startTime.getTime() === hour.start.getTime(),
    );
  });

  // Filter out past hours
  const now = new Date();
  return availableSchedule.filter((slot) => slot.start > now);
};
