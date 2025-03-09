import mongoose from "mongoose";

const connecgDB = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => console.log(`db connected on ${conn.connection.host}`))
    .catch((err) => console.log(err));
};

export default connecgDB;
