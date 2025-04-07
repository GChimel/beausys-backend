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

  - [User](#user)
    - [GET by id](#user-by-id)
    - [PUT user](#update-user)
  - [Company](#company)
    - [POST create](#create-company)
    - [GET all](#company-all-by-user)
    - [GET by id](#company-by-id)
    - [DELETE by id](#company-delete)

---

## Without authentication

## Auth and register

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

## User

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

### Update user

**`PUT /user/:id`**

**Request body:**

- name -> string
- taxId -> string (CPF/CNPJ)
- email -> string
- password -> string
- new_password -> string
- cellPhone -> string

```json
{
  "name": "Mr jhon",
  "email": "mrjhon@gmail.com",
  "password": "123456",
  "new_password": "123123",
  "cellPhone": "42999999999",
  "taxId": "12345678909"
}
```

**Response (200 Ok):**

```json
{
  "id": "d2f1e3f9-d32a-4cc9-89c2-c196f223e730",
  "name": "Mr jhon",
  "email": "mrjhon@gmail.com",
  "password": "$2b$08$YS3f6MjikgK2a5VK4/.X..MMmO/6Wu1ToNAK51hNYxDNN9AOp946a",
  "cellPhone": "42999999999",
  "taxId": 12345678909,
  "createdAt": "2025-03-28T09:36:21.560Z",
  "googleId": null
}
```

## Company

### Create company

**`POST /company`**

**Request body:**

- userId -> string UUID
- name -> string
- color -> hex
- address -> string
- address_number -> number
- zipCode -> string
- cellPhone -> string
- photo -> string | null

```json
{
  "userId": "d2f1e3f9-d32a-4cc9-89c2-c196f223e730",
  "name": "test",
  "color": "#000",
  "address": "example street",
  "address_number": 90,
  "zipCode": "84500000",
  "cellPhone": "42999999999"
}
```

**Response (201 CREATED):**

```json
{
  "id": "a92d4a2c-1350-4763-a15e-ac309681fc8d",
  "userId": "d2f1e3f9-d32a-4cc9-89c2-c196f223e730",
  "name": "test",
  "color": "#000",
  "address": "example street",
  "addressNumber": 90,
  "zipCode": "84500000",
  "cellPhone": "42999999999",
  "photo": null,
  "createdAt": "2025-03-28T09:50:57.757Z",
  "updatedAt": "2025-03-28T09:50:57.758Z"
}
```

### Company all (by user)

**`GET /company?userId=`**

- id by query param

**Response (200 Ok):**

```json
{
  "id": "a92d4a2c-1350-4763-a15e-ac309681fc8d",
  "userId": "d2f1e3f9-d32a-4cc9-89c2-c196f223e730",
  "name": "test",
  "color": "#000",
  "address": "example street",
  "addressNumber": 90,
  "zipCode": "84500000",
  "cellPhone": "42999999999",
  "photo": null,
  "createdAt": "2025-03-28T09:50:57.757Z",
  "updatedAt": "2025-03-28T09:50:57.758Z"
}
```

### Company by id

**`GET /company/:id`**

**Response (200 Ok):**

```json
{
  "id": "a92d4a2c-1350-4763-a15e-ac309681fc8d",
  "userId": "d2f1e3f9-d32a-4cc9-89c2-c196f223e730",
  "name": "test",
  "color": "#000",
  "address": "example street",
  "addressNumber": 90,
  "zipCode": "84500000",
  "cellPhone": "42999999999",
  "photo": null,
  "createdAt": "2025-03-28T09:50:57.757Z",
  "updatedAt": "2025-03-28T09:50:57.758Z"
}
```

### Company delete

**`DELETE /company/:id`**

**Response (204 - NO CONTENT):**
