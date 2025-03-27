# BEAUSYS - API

Beausys is a SaaS platform designed to facilitate service scheduling and sales management. Users can register, create a company, and manage products and services. Their customers can then schedule appointments for services.

- [Features](#features)
- [Endpoints](#endpoints)

## Features

### User Management

- User registration, authentication, and token refresh
- Profile management (update user information)

### Company Management

- Create, update, delete, and list companies
- Assign users to companies

### Product Management

- Create, update, delete, and list products for a company

### Service Management

- Create, update, delete, and list services
- Define duration and pricing for services

### Scheduling System

- Customers can book services
- View and manage scheduled appointments

## Endpoints

- [Without authentication](#without-authentication)

  - [Sign-up](#sign-up)
  - [Sign-in](#sign-in)
  - [Refresh-token](#refresh-token)

- [With authentication](#with-authentication)
  - All of these requests require a **Bearer Token** in the `Authorization` header.

---

### Without authentication

### Sign-up

**`POST /auth/sign-up`**

Creates a new user and return a `JWT` and `REFRESH_TOKEN`.

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (201 Created):**

```json
{
  "accessToken": "jwt_example",
  "refreshToken": "refresh_token_id"
}
```

### Sign-in

**`POST /auth/sign-in`**

Use to login in the system.

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200 Ok):**

```json
{
  "accessToken": "jwt_example",
  "refreshToken": "refresh_token_id"
}
```

**Response (401 - Unauthorized):**

```json
{
  "error": true,
  "message": "Invalid credentials"
}
```

### Refresh token

**`POST /auth/refresh-token`**

**Request body:**

- Refresh-token uuid

```json
{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200 Ok):**

```json
{
  "accessToken": "new_jwt_example",
  "refreshToken": "new_refresh_token_id"
}
```

---

### With authentication

### User by id

**`GET /user/:id`**

**Response (200 Ok):**

```json
{
  "id": "7db9e84a-437c-4b0b-af2f-05977157bcb4",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$08$m2H6fTIICvs/m6lIHFJVM.fzzJ69HXayjAthYbfPy/DDq1avOTu1.",
  "cellPhone": "42999999999",
  "taxId": "",
  "createdAt": "2025-03-24T09:41:40.338Z",
  "googleId": null
}
```
