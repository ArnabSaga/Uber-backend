# Backend API Documentation

## `/users/register` Endpoint

### Endpoint

**POST** `/users/register`

This endpoint registers a new user. It expects a JSON body with a `fullname` object, `email`, and `password`.  
The route is defined in `routes/user.route.js` and is typically mounted under `/users` in the app, so the full path is `/users/register`.

---

### Request

**Headers:**

- `Content-Type: application/json`

**Body (JSON):**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe" // optional
  },
  "email": "john@example.com",
  "password": "s3cr3t123"
}
```

#### Required fields and validation rules

| Field                | Required    | Validation Rule | Validation Message                             |
| -------------------- | ----------- | --------------- | ---------------------------------------------- |
| `fullname.firstname` | ✅ Yes      | ≥ 3 characters  | "First name must be at least 3 character long" |
| `email`              | ✅ Yes      | Valid email     | "Invalid Email"                                |
| `password`           | ✅ Yes      | ≥ 6 characters  | "Password must be at least 6 character long"   |
| `fullname.lastname`  | ❌ Optional | -               | -                                              |

> Note: The controller also checks server-side that required fields exist. If missing, an error is thrown.

---

### Responses / Status Codes

#### ✅ **201 Created**

**Description:** User successfully registered. Response contains an auth token and created user object.

**Example:**

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
  }
}
```

---

#### ⚠️ **400 Bad Request**

**Description:** Validation failed (via `express-validator`).

**Example:**

```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    {
      "msg": "Password must be at least 6 character long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

#### ❌ **500 Internal Server Error**

**Description:** Unexpected server or database error (e.g., user creation failed).

---

### Implementation Notes

- Passwords are **hashed** before storing (`userModel.hashPassword` used).
- A JWT token is generated via `user.generateAuthToken()` after creation.
- Validation handled with **express-validator** in `routes/user.route.js`.

---

### Example (PowerShell-friendly cURL)

```powershell
$body = @{
  fullname = @{ firstname = 'John'; lastname = 'Doe' }
  email = 'john@example.com'
  password = 's3cr3t123'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/users/register" -Body $body -ContentType "application/json"
```

---

### Troubleshooting

- Ensure `Content-Type: application/json` header is set.
- Verify all required fields meet validation rules.
- Make sure server is running and `/users` route is mounted in `app.js` or `server.js`.

---

## `/users/login` Endpoint

### Endpoint

**POST** `/users/login`

This endpoint authenticates a user and returns an auth token. It expects a JSON body with `email` and `password`.  
The route is defined in `routes/user.route.js` and is typically mounted under `/users` in the app, so the full path is `/users/login`.

---

### Request

**Headers:**

- `Content-Type: application/json`

**Body (JSON):**

```json
{
  "email": "john@example.com",
  "password": "s3cr3t123"
}
```

#### Required fields and validation rules

| Field      | Required | Validation Rule | Validation Message                           |
| ---------- | -------- | --------------- | -------------------------------------------- |
| `email`    | ✅ Yes   | Valid email     | "Invalid Email"                              |
| `password` | ✅ Yes   | ≥ 6 characters  | "Password must be at least 6 character long" |

> Note: The controller also checks server-side that required fields exist. If missing, an error is thrown.

---

### Responses / Status Codes

#### ✅ **200 OK**

**Description:** User successfully authenticated. Response contains an auth token and user object.

**Example:**

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "...",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com"
  }
}
```

---

#### ⚠️ **400 Bad Request**

**Description:** Validation failed (via `express-validator`).

**Example:**

```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    {
      "msg": "Password must be at least 6 character long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

#### ❌ **401 Unauthorized**

**Description:** Invalid email or password combination.

**Example:**

```json
{
  "message": "Invalid email and password"
}
```

---

#### ❌ **500 Internal Server Error**

**Description:** Unexpected server or database error (e.g., database connection failed).

---

### Implementation Notes

- Passwords are **compared** using bcrypt (`user.comparePassword` method).
- A JWT token is generated via `user.generateAuthToken()` after successful authentication.
- Validation handled with **express-validator** in `routes/user.route.js`.
- Password field is excluded from user queries by default (`select: false` in schema) but explicitly included for login verification.

---

### Example (PowerShell-friendly cURL)

```powershell
$body = @{
  email = 'john@example.com'
  password = 's3cr3t123'
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:3000/users/login" -Body $body -ContentType "application/json"
```

---

### Troubleshooting

- Ensure `Content-Type: application/json` header is set.
- Verify email format is valid and password meets minimum length requirement.
- Make sure server is running and `/users` route is mounted in `app.js` or `server.js`.
- Check that user exists in database and password is correct.

---

## `/users/profile` Endpoint

### Endpoint

**GET** `/users/profile`

This endpoint returns the authenticated user's profile. It requires a valid JWT provided via `Authorization: Bearer <token>` header or `token` cookie. The route is defined in `routes/user.route.js` and is typically mounted under `/users`, so the full path is `/users/profile`.

---

### Request

**Headers:**

- `Authorization: Bearer <jwt-token>` (or `token` cookie)
- `Content-Type: application/json` (optional)

> Note: You must first obtain a token from `/users/register` or `/users/login`.

---

### Responses / Status Codes

#### ✅ **200 OK**

**Description:** Returns the authenticated user's profile.

**Example:**

```json
{
  "_id": "...",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john@example.com"
}
```

---

#### ❌ **401 Unauthorized**

**Description:** Missing or invalid token, or user not found.

**Example:**

```json
{ "message": "Unauthorized" }
```

or

```json
{ "message": "User not found" }
```

---

#### ❌ **500 Internal Server Error**

**Description:** Unexpected server error.

---

### Implementation Notes

- Route protected by `authMiddleware.authUser` (`routes/user.route.js`).
- Middleware verifies JWT from cookie or `Authorization` header using `process.env.JWT_TOKEN_SECRET` and loads the user (`middleware/auth.middleware.js`).
- Controller responds with `req.user` (`controllers/user.controller.js`).

---

### Example (PowerShell-friendly cURL)

```powershell
$token = '<jwt-token>'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/users/profile" -Headers @{ Authorization = "Bearer $token" }
```

---

### Troubleshooting

- Ensure the `Authorization` header includes a valid Bearer token or a `token` cookie is set.
- Verify the JWT secret (`JWT_TOKEN_SECRET`) is configured and matches the one used to sign tokens.
- Make sure the server is running and `/users` route is mounted in `app.js` or `server.js`.

---

## `/users/logout` Endpoint

### Endpoint

**GET** `/users/logout`

This endpoint logs out the authenticated user by clearing the authentication token cookie and blacklisting the token so it can no longer be used. It requires a valid JWT provided via the `Authorization: Bearer <token>` header or `token` cookie. The route is defined in `routes/user.route.js` and is typically mounted under `/users`, so the full path is `/users/logout`.

---

### Request

**Headers:**

- `Authorization: Bearer <jwt-token>` (or `token` cookie)
- `Content-Type: application/json` (optional)

> Note: You must be authenticated to access this endpoint.

---

### Responses / Status Codes

#### ✅ **200 OK**

**Description:** User successfully logged out. The auth token is cleared from the cookie and added to a blacklist so it cannot be reused.

**Example:**

```json
{ "message": "Logged out" }
```

---

#### ❌ **401 Unauthorized**

**Description:** Missing or invalid token, or token already blacklisted.

**Example:**

```json
{ "message": "Unauthorized" }
```

---

#### ❌ **500 Internal Server Error**

**Description:** Unexpected server or database error.

---

### Implementation Notes

- Route protected by `authMiddleware.authUser` (`routes/user.route.js`).
- Middleware verifies JWT from cookie or `Authorization` header using `process.env.JWT_TOKEN_SECRET`.
- Token is removed from the client via `res.clearCookie("token")` and added to the blacklist in MongoDB (`models/blackListToken.model.js`) so it is denied on subsequent requests.
- On future requests, the middleware checks the blacklist and will reject any blacklisted tokens.

---

### Example (PowerShell-friendly cURL)

```powershell
$token = '<jwt-token>'
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/users/logout" -Headers @{ Authorization = "Bearer $token" }
```

---

### Troubleshooting

- Ensure the `Authorization` header includes a valid Bearer token or a `token` cookie is set.
- Verify that the JWT secret (`JWT_TOKEN_SECRET`) is configured and matches the one used to sign tokens.
- Make sure MongoDB is running (required for blacklisting).
- If you see "Unauthorized", check if the token is valid and not previously blacklisted.

---
