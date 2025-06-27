# NeuroGuard API

NeuroGuard API is a Node.js-based backend application designed to provide various functionalities for healthcare-related services, including stroke prediction using AI models, patient and doctor management, appointment booking, and secure authentication.

---

## 📚 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Routes](#routes)

  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
  - [Patient Routes](#patient-routes)
  - [Doctor Routes](#doctor-routes)
  - [Appointment Routes](#appointment-routes)
  - [Stroke Routes](#stroke-routes-requires-external-models-server)
  - [AI Assistant & Document Analysis](#ai-assistant--document-analysis-via-model-server)

- [Run Locally](#run-locally)
- [Dependencies](#dependencies)
- [License](#license)

---

## 🚀 Features

- User authentication (local and Google OAuth)
- Stroke prediction using various GAN models (SRGAN, CycleGAN, Denoising GAN)
- Image upload and processing
- Patient and doctor management
- Appointment booking and management
- Chat assistant with RAG capabilities
- PDF upload and analysis with chat integration
- API documentation using Swagger

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/mohamedkhalil9/NeuroGuard-api.git
cd NeuroGuard-api
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up the environment variables** (see [Environment Variables](#environment-variables))

4. **Start the development server:**

```bash
npm run dev
```

> ⚠️ **Important:** To enable model-based predictions and RAG assistant features, you must also run the external models server from:
> [https://github.com/abdallateef-sa/NeuroGuard-Models](https://github.com/abdallateef-sa/NeuroGuard-Models)

---

## 🌐 Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
DB_URI=mongodb://localhost:27017/Neuroguard-DB
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL=your-email@gmail.com
PASS=your-email-password
BASE_URI=http://127.0.0.1:8000   # URL of the model server
```

---

## 📖 API Documentation

- [Apidog Live API Documentation](https://6hjm278nfp.apidog.io)
* Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* JSON Spec: [http://localhost:3000/docs.json](http://localhost:3000/docs.json)

---

## 📌 Routes

### 🔐 Auth Routes

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| POST   | /api/v1/auth/login           | Login users                 |
| GET    | /api/v1/auth/logout          | Logout users                |
| GET    | /api/v1/auth/google          | Google OAuth login          |
| GET    | /api/v1/auth/google/callback | Google OAuth callback       |
| POST   | /api/v1/auth/forgot-password | Send OTP for password reset |
| POST   | /api/v1/auth/verify-otp      | Verify OTP                  |
| PATCH  | /api/v1/auth/reset-password  | Reset password              |

### 👤 User Routes

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| GET    | /api/v1/users/profile | Get user profile    |
| PATCH  | /api/v1/users/profile | Update user profile |
| DELETE | /api/v1/users/profile | Delete user profile |

### 🧑‍⚕️ Patient Routes

| Method | Endpoint                         | Description                  | Users Allowed |
| ------ | -------------------------------- | ---------------------------- | ------------- |
| POST   | `api/v1/patients/register`       | Register a new patient       | public        |
| GET    | `api/v1/patients/profile`        | Get patient profile          | patient       |
| PATCH  | `api/v1/patients/profile`        | Update patient profile       | patient       |
| DELETE | `api/v1/patients/profile`        | Delete patient profile       | patient       |
| POST   | `api/v1/patients/profile/upload` | Upload patient profile image | patient       |
| GET    | `api/v1/patients/favorites`      | Get favorite doctors         | patient       |
| PATCH  | `api/v1/patients/favorites`      | Toggle favorite doctor       | patient       |
| GET    | `api/v1/patients/`               | Get list of patients         | doctor        |
| GET    | `api/v1/patients/:id`            | Get patient by ID            | doctor        |

### 👨‍⚕️ Doctor Routes

| Method | Endpoint                             | Description                 | Users Allowed |
| ------ | ------------------------------------ | --------------------------- | ------------- |
| POST   | `api/v1/doctors/register`            | Register a new doctor       | public        |
| GET    | `api/v1/doctors/profile`             | Get doctor profile          | doctor        |
| PATCH  | `api/v1/doctors/profile`             | Update doctor profile       | doctor        |
| DELETE | `api/v1/doctors/profile`             | Delete doctor profile       | doctor        |
| POST   | `api/v1/doctors/profile/upload`      | Upload doctor profile image | doctor        |
| GET    | `api/v1/doctors/`                    | Get list of doctors         | public        |
| GET    | `api/v1/doctors/:id`                 | Get doctor by ID            | public        |
| GET    | `api/v1/doctors/:id/schedule/:date`  | Get doctor schedule by date | public        |
| POST   | `api/v1/doctors/search/:searchQuery` | Search doctors              | public        |

### 📅 Appointment Routes

| Method | Endpoint                      | Description           | Users Allowed   |
| ------ | ----------------------------- | --------------------- | --------------- |
| POST   | `api/v1/appointments/`        | Create appointment    | patient         |
| GET    | `api/v1/appointments/`        | Get all appointments  | doctor, patient |
| GET    | `api/v1/appointments/:id`     | Get appointment by ID | doctor, patient |
| POST   | `api/v1/appointments/:id/pay` | Pay for appointment   | patient         |

### 🧠 Stroke Routes (Requires External Models Server)

| Method | Endpoint                         | Description                 |
| ------ | -------------------------------- | --------------------------- |
| POST   | /api/v1/stroke/predict           | Predict stroke risk         |
| POST   | /api/v1/stroke/upload-image      | Upload image for prediction |
| POST   | /api/v1/stroke/predict/srgan     | SRGAN-based prediction      |
| POST   | /api/v1/stroke/predict/denoising | Denoising GAN prediction    |
| POST   | /api/v1/stroke/predict/cyclegan  | CycleGAN-based prediction   |

### 🤖 AI Assistant & Document Analysis (via Model Server)

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| POST   | /chat/stream  | Stream chat with RAG assistant      |
| POST   | /pdf/upload   | Upload and analyze PDF              |
| GET    | /chat_history | Retrieve chat history by session ID |

#### 1. **Stream Chat (RAG)**

**URL:** `POST /chat/stream`
**Body (JSON):**

```json
{
  "input": "Hello, how can you assist me?",
  "session_id": "session_123"
}
```

**Response:** Server-Sent Events (`text/event-stream`)
**Notes:**

- Use Postman’s "Event Stream" or `curl -N` to follow the stream.
- Maintains history per `session_id`.

#### 2. **Upload & Analyze PDF**

**URL:** `POST /pdf/upload`
**Body (form-data):**

- `session_id`: string
- `file`: PDF (`application/pdf`)

**Response (JSON):**

```json
{
  "status": "success",
  "message": "PDF Uploaded successfully",
  "analysis": "<extracted and summarized text>"
}
```

**Notes:**

- Extracted text is automatically appended to the next `/chat/stream` call.

#### 3. **Get Chat History**

**URL:** `GET /chat_history`

- `session_id`: string (query or form)

**Response (JSON):**

```json
{
  "chat_history": [
    { "sender": "user", "message": "Hi" },
    { "sender": "assistant", "message": "Hello!" }
  ]
}
```

**Error:** 404 if `session_id` not found.

---

## 🧪 Run Locally

1. **Start MongoDB server:**

```bash
mongod
```

2. **Start the application:**

```bash
npm run dev
```

3. **Access the API:** [http://localhost:3000](http://localhost:3000)

---

## 📦 Dependencies

Key dependencies used in this project:

- **Express**: Web framework for Node.js
- **Mongoose**: MongoDB object modeling
- **Passport**: Authentication middleware
- **Swagger**: API documentation
- **Multer**: File upload handling
- **Axios**: HTTP client for API requests
- **Nodemailer**: Email sending
- **Bcrypt**: Password hashing

For the full list, see `package.json`.
