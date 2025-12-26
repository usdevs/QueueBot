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

| Directory | Access Level | Description                             |
| :--- | :--- |:----------------------------------------|
| `src/routes/public` | **Unprotected** | Open endpoints like `/auth`.            |
| `src/routes/private` | **Authenticated** | Requires a valid JWT to access.         |

