# QueueBot Backend

---

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Environment Configuration
Create a `.env` file in the root directory and add the development credentials:

`BOT_TOKEN=your_development_bot_token_here`
`JWT_SECRET=your_jwt_secret_here`
`DATABASE_URL=your_database_url_here`

### 2. Install Dependencies
Install the required packages using npm:

```bash
npm install
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Launch Dev Server
```bash
npm run dev
```

## 📁 API Routing

JWT check is toggled based on directory

| Directory            | Access Level      | Description                     |
|:---------------------|:------------------|:--------------------------------|
| `src/routes/public`  | **Unprotected**   | Open endpoints like `/auth`.    |
| `src/routes/private` | **Authenticated** | Requires a valid JWT to access. |

## Endpoints Documentation

### `/queue/status`
To check if queue is opened or closed.
- **Method:** `GET`
- **Auth:** Require
- **Success (200 OK):** `{ "status": boolean }`
- **Possible Errors:**

  | Code | Error Message         | Reason                           |
  |:-----|:----------------------|:---------------------------------|
  | 500  | `No queue configured` | No queue exists in the database. |

### `/queue/status`
Opens or closes the queue.
- **Method:** `PATCH`
- **Auth:** Require (Admin)
- **Query Params:** `open=<boolean>`
- **Success (200 OK):** Returns the full updated `QueueConfig` object.
- **Possible Errors:**

  | Code | Error Message | Reason                                      |
  |:-----|:--------------|:--------------------------------------------|
  | 400  |               | invalid query parameters                    |
  | 403  | `Forbidden`   | User is not an admin.                       |
  | 500  |               | Failed to write the update to the database. |