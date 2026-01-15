# QueueBot Backend

---

## 🚀 Getting Started

Follow these steps to get your local development environment up and running.

### 1. Environment Configuration
Create a `.env` file in the root directory and add the development credentials:

`BOT_TOKEN="your_development_bot_token_here"`
`JWT_SECRET="your_jwt_secret_here"`
`DATABASE_URL="your_database_url_here"`

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

## 🚀 Endpoint Documentation

### `/queue/status`
To check if queue is opened or closed.
- **Method:** `GET`
- **Auth:** Required
- **Success (200 OK):** `{ "status": boolean }`
- **Possible Errors:**

  | Code | Error Message         | Reason                           |
  |:-----|:----------------------|:---------------------------------|
  | 500  | `No queue configured` | No queue exists in the database. |

### `/queue/status`
Opens or closes the queue.
- **Method:** `PATCH`
- **Auth:** Required (Admin)
- **Query Params:** `open=<boolean>`
- **Success (200 OK):** Returns the full updated `QueueConfig` object.
- **Possible Errors:**

  | Code | Error Message | Reason                                      |
  |:-----|:--------------|:--------------------------------------------|
  | 400  |               | invalid query parameters                    |
  | 403  | `Forbidden`   | User is not an admin.                       |
  | 500  |               | Failed to write the update to the database. |

### `/queue/config` 
Retrieves the current queue configuration parameters.
- **Method:** `GET`
- **Auth:** Required (Admin)
- **Success (200 OK):** Returns the full `QueueConfig` object.
- **Possible Errors:**

| Code | Error Message         | Reason                                          |
|:-----|:----------------------|:------------------------------------------------|
| 403  | `Forbidden`           | User is not an admin.                           |
| 500  | `No queue configured` | No configuration record exists in the database. |


### `/queue/config` 
Updates the configuration parameters for the queue.
- **Method:** `PATCH`
- **Auth:** Required (Admin)
- **Query Params:** - `positionBeforePing=<number>`: The position threshold for sending a notification.
- **Success (200 OK):** Returns the full updated `QueueConfig` object.
- **Possible Errors:**

| Code | Error Message         | Reason                                    |
|:-----|:----------------------|:------------------------------------------|
| 400  |                       | Invalid query parameters.                 |
| 403  | `Forbidden`           | User is not an admin.                     |
| 500  | `No queue configured` | No configuration record exists to update. |

### `/queue/next`
Advances the queue by removing the person at the front and notifying the next `N` users in line via Telegram.
- **Method:** `POST`
- **Auth:** Required (Admin)
- **Success (200 OK):** Returns the updated queue or an empty list if queue is empty.
- **Possible Errors:**

| Code | Error Message | Reason                              |
|:-----|:--------------|:------------------------------------|
| 403  | `Forbidden`   | User is not authorized as an admin. |

### `/queue/entries` 
Updates the configuration parameters for the queue.
- **Method:** `GET`
- **Auth:** Required (Admin)
- **Success (200 OK):** `{ "entries": Queue[] }`
- **Possible Errors:**

| Code | Error Message                   | Reason                                          |
|:-----|:--------------------------------|:------------------------------------------------|
| 403  | `Forbidden`                     | User is not an admin.                           |
| 500  | `Failed to fetch queue entries` | Failed to read queue entries from the database. |

### `/queue/entries`
Adds the current user to the queue.
- **Method:** `POST`
- **Auth:** Required
- **Success (200 OK):** `{ "joined": boolean, "position": number, "ahead": number }`
- **Possible Errors:**

| Code | Error Message           | Reason                                          |
|:-----|:------------------------|:------------------------------------------------|
| 409  | `User already in queue` | User is already in the queue.                   |
| 500  | `No queue configured`   | No configuration record exists in the database. |

### `/queue/entries/me`
Removes the current user from the queue.
- **Method:** `DELETE`
- **Auth:** Required
- **Success (200 OK):** `{ "left": true }`
- **Possible Errors:**

| Code | Error Message           | Reason                                |
|:-----|:------------------------|:--------------------------------------|
| 400  | `User not in queue`     | User is not currently in the queue.   |
| 500  | `Failed to leave queue` | Failed to remove user from the queue. |

### `/queue/entries/me`
Returns how many people are ahead of the current user in the queue.
- **Method:** `GET`
- **Auth:** Required
- **Success (200 OK):** `{ "ahead": number }`
- **Possible Errors:**

| Code | Error Message         | Reason                                          |
|:-----|:----------------------|:------------------------------------------------|
| 400  | `User not in queue`   | User is not currently in the queue.             |
| 500  | `No queue configured` | No configuration record exists in the database. |

### `/admins` 
Retrieves a list of all current users with administrative privileges.
- **Method:** `GET`
- **Auth:** Required (Admin)
- **Success (200 OK):** Returns an array of `Admin` objects.
- **Possible Errors:**

| Code | Error Message | Reason                                                 |
|:-----|:--------------|:-------------------------------------------------------|
| 403  | `Forbidden`   | User is not an admin.                                  |


### `/admins/:targetId`
Revokes administrative privileges from a specific user and removes them from the admin table.
- **Method:** `DELETE`
- **Auth:** Required (Admin)
- **Path Params:** - `targetId=<string>`: The Telegram ID of the admin to be removed.
- **Success (200 OK):** Returns a confirmation message.
- **Possible Errors:**

| Code | Error Message     | Reason                                             |
|:-----|:------------------|:---------------------------------------------------|
| 403  | `Forbidden`       | User is not an admin.                              |
| 404  | `Admin not found` | No admin user exists with the provided `targetId`. |

### `/admins/requests` 
Retrieves a list of all current pending admin requests.
- **Method:** `GET`
- **Auth:** Required (Admin)
- **Success (200 OK):** Returns an array of `AdminRequester` objects.
- **Possible Errors:**

| Code | Error Message | Reason                |
|:-----|:--------------|:----------------------|
| 403  | `Forbidden`   | User is not an admin. |


### `/admins/requests/:targetId`
Submits a new request for a user to become an admin.
- **Method:** `POST`
- **Auth:** Required
- **Path Params:** - `targetId=<string>`: The Telegram ID of the user requesting admin status.
- **Query Params:** - `username=<string>`: The Telegram username of the requester.
- **Success (200 OK):** Returns the created `AdminRequester` object.
- **Possible Errors:**

| Code | Error Message                     | Reason                                                         |
|:-----|:----------------------------------|:---------------------------------------------------------------|
| 400  | `Request for user already exists` | A request with this `targetId` already exists in the database. |


### `/admins/requests/:targetId`
Accepts or rejects a pending admin request. If accepted, the user is moved from the requesters list to the admins list.
- **Method:** `PATCH`
- **Auth:** Required (Admin)
- **Path Params:** - `targetId=<string>`: The Telegram ID of the requester to process.
- **Query Params:** - `accepts=<boolean>`: Whether to grant admin status (`true`) or deny it (`false`).
- **Success (200 OK):** Returns a confirmation message.
- **Possible Errors:**

| Code | Error Message           | Reason                                                                |
|:-----|:------------------------|:----------------------------------------------------------------------|
| 403  | `Forbidden`             | User is not an admin.                                                 |
| 404  | `Requester not found`   | No pending request exists for the provided `targetId`.                |
| 400  | `User is already admin` | The request was accepted, but the user is already in the admin table. |
