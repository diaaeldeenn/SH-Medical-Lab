<div align="center">

<img src="https://sh-medical-lab.vercel.app/logo.png" alt="SH Medical Lab Logo" width="80" height="80" onerror="this.style.display='none'"/>

# SH Medical Lab

**A full-stack medical laboratory management system built to streamline lab workflows, from test booking to result delivery.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-5E9C91?style=for-the-badge&logo=vercel)](https://sh-medical-lab.vercel.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Postman-orange?style=for-the-badge&logo=postman)](https://documenter.getpostman.com/view/49715513/2sBYArSrcC)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/diaaeldeenn/SH-Medical-Lab)

</div>

---

## Overview

SH Medical Lab is a web application that manages the end-to-end workflow of a medical laboratory. It supports two user roles: **Patients** who book lab tests, and **Specialists** who process samples, enter results, and manage the entire lifecycle of each request.

The system covers everything from appointment scheduling and sample collection to result entry, locking, and PDF generation.

---
## Highlights

-  Multi-role system
-  End-to-end laboratory workflow
-  Dynamic test result forms
-  Automated result evaluation
-  PDF medical reports
-  Role-based access control
-  Appointment management
-  Result locking
-  Firebase notification
-  Test catalog management

---

## Features

### For Patients
- Register, log in, and manage their profile
- Browse available lab tests with search and category filtering
- Book multi-test requests with appointment scheduling (date + time)
- View and download test results as PDF
- Receive in-app notifications on status changes
- Reschedule or cancel pending appointments

### For Specialists
- Full request management dashboard with filters (status, date range, search)
- Step-by-step workflow: Attend patient > Collect sample > Start processing > Enter results > Complete
- Dynamic result entry forms per test parameter type (Number, Text, Select, Positive/Negative)
- Auto-evaluation against reference ranges (with gender and age segmentation)
- Lock individual test results to prevent further edits
- CRUD management of the test catalog with configurable parameters

### System
- JWT-based authentication with role-based access control
- Real-time notifications via Firebase
- PDF report generation (PDFKit)
- Rate limiting, Helmet security headers, and CORS
- Soft delete for test catalog entries
- Full input validation (Zod) on both frontend and backend

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework with Server Actions |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| NextAuth.js | Authentication session management |
| React Hook Form + Zod | Form handling and validation |
| Motion | Animations |
| shadcn/ui + Base UI | Component library |
| React Toastify | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| Bcrypt | Password hashing |
| Zod | Schema validation |
| Firebase Admin | Push notifications |
| PDFKit | PDF generation |
| Nodemailer | Email service |
| Helmet + express-rate-limit | Security |

### Infrastructure
| Service | Usage |
|---|---|
| Vercel | Frontend deployment |
| MongoDB Atlas | Cloud database |
| Firebase | Notification service |

---

## Security

- JWT authentication with role-based authorization
- Password hashing with Bcrypt
- Server-side token handling through Next.js Server Actions
- Request validation using Zod
- HTTP security headers with Helmet
- Rate limiting for API protection
- Configured CORS policies

---

## Architecture

The project follows a clean layered architecture on both ends:

**Frontend** uses Next.js Server Actions as a proxy layer between the client and the API, keeping tokens server-side. Components are organized by domain (requests, tests, notifications, specialist) with shared UI primitives.

**Backend** follows a Repository Pattern with a generic `BaseRepository` handling common DB operations, and domain-specific repositories extending it. Each module has its own Controller (routing), Service (business logic), and Schema (Zod validation middleware).

```
BackEnd/
  src/
    modules/          # auth | labRequest | result | test | notification
      *.controller    # Route definitions
      *.service       # Business logic
    DB/
      models/         # Mongoose schemas
      repository/     # BaseRepository + domain repos
    common/
      middleware/     # Auth guard + Zod schema validators
      utils/          # Error handler, success response, security
      service/        # PDF builder, notification service

FrontEnd/
  src/
    app/              # Next.js pages (App Router)
    action/           # Server Actions (auth, request, result, test, notification)
    components/       # Domain components + shared UI
    service/          # API fetch wrappers
    validation/       # Zod schemas
    interfaces/       # TypeScript types
```

---

## Request Lifecycle

```
User books request
       |
  [PENDING] -- User can reschedule or cancel
       |
  Specialist marks ATTENDED
       |
  [SAMPLE_COLLECTED]
       |
  [IN_PROGRESS]
       |
  Specialist enters + locks results per test
       |
  [COMPLETED] -- User gets notification + can download PDF
```

---

## Demo Accounts

Try the live demo at [sh-medical-lab.vercel.app](https://sh-medical-lab.vercel.app) using these accounts:

| Role | Phone | Password |
|---|---|---|
| Specialist | 01000000000 | Specialist12345 |
| User | 010000000001 | User12345 |

---

## API Documentation

Full REST API reference is available on Postman:

[View API Docs](https://documenter.getpostman.com/view/49715513/2sBYArSrcC)

Endpoints include:
- `POST /auth/register` `POST /auth/login` `PATCH /auth/change-password`
- `GET /test` `POST /test` `PATCH /test/:id` `DELETE /test/:id`
- `POST /request` `GET /request/my` `PATCH /request/:id/attend` `PATCH /request/:id/sample` `PATCH /request/:id/start` `PATCH /request/:id/complete` `PATCH /request/:id/cancel`
- `POST /result/requests/:requestId/tests/:testId` `PATCH /result/:id` `PATCH /result/:id/lock` `GET /result/requests/:requestId/tests/:testId/pdf`
- `GET /notifications` `PATCH /notifications/:id/read` `PATCH /notifications/read-all`

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB instance
- Firebase project (for notifications)

### Backend Setup

```bash
cd BackEnd
npm install
# Add your .env (MongoDB URI, JWT secret, Firebase credentials, etc.)
npm run dev
```

### Frontend Setup

```bash
cd FrontEnd
npm install
# Add your .env.local (NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, etc.)
npm run dev
```

---

## Author

**Diaa Eldeen** - Full-Stack Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-elseady--space.vercel.app-2867A8?style=flat-square)](https://elseady-space.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-diaaelseady-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/diaaelseady)
[![GitHub](https://img.shields.io/badge/GitHub-diaaeldeenn-181717?style=flat-square&logo=github)](https://github.com/diaaeldeenn)
