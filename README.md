
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
    "lastname": "Doe"    // optional
  },
  "email": "john@example.com",
  "password": "s3cr3t123"
}
````

#### Required fields and validation rules

| Field                | Required   | Validation Rule | Validation Message                             |
| -------------------- | ---------- | --------------- | ---------------------------------------------- |
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
    { "msg": "Password must be at least 6 character long", "param": "password", "location": "body" }
  ]
}
```

---

#### ❌ **500 Internal Server Error**

**Description:** Unexpected server or database error (e.g., user creation failed).

---

### Implementation Notes

* Passwords are **hashed** before storing (`userModel.hashPassword` used).
* A JWT token is generated via `user.generateAuthToken()` after creation.
* Validation handled with **express-validator** in `routes/user.route.js`.

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

* Ensure `Content-Type: application/json` header is set.
* Verify all required fields meet validation rules.
* Make sure server is running and `/users` route is mounted in `app.js` or `server.js`.

---

### Future Improvement Suggestion

If desired, add an **OpenAPI/Swagger** definition for `/users/register` for auto-documentation.

---

**Generated based on:**

* `routes/user.route.js`
* `controllers/user.controller.js`
* `services/user.service.js`


