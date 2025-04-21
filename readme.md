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
    - [PUT](#update-user)
  - [Company](#company)
    - [POST create](#create-company)
    - [GET all](#company-all-by-user)
    - [GET by id](#company-by-id)
    - [PUT](#update-company)
    - [DELETE by id](#company-delete)
  - [Product](#product)
    - [POST create](#create-product)
    - [GET all](#product-all-by-company)
    - [GET by id](#product-by-id)
    - [PUT](#update-product)
    - [DELETE by id](#product-delete)
  - [Service](#service)
    - [POST create](#create-service)
    - [GET all](#service-all-by-company)
    - [GET by id](#service-by-id)
    - [PUT](#update-service)
    - [DELETE by id](#service-delete)
  - [Available Schedule](#availabe-schedule)
    - [POST create](#create-available-schedule)
  - [Schedule](#schedule)
    - [POST create](#create-schedule)
    - [GET all](#schedule-all-by-company)
    - [GET by id](#schedule-by-id)
    - [DELETE](#schedule-delete)
  - [Clients](#clients)
    - [POST create `register`](#create-client)
    - [GET all](#find-all-clients-by-company)
    - [GET by name](#find-clients-by-name)

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
- email -> string
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
  "email": "example@example.com",
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
  "email": "example@example.com",
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
  "email": "example@example.com",
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
  "email": "example@example.com",
  "address": "example street",
  "addressNumber": 90,
  "zipCode": "84500000",
  "cellPhone": "42999999999",
  "photo": null,
  "createdAt": "2025-03-28T09:50:57.757Z",
  "updatedAt": "2025-03-28T09:50:57.758Z"
}
```

### Update company

**`PUT /company/:id`**

**Request body:**

- userId -> string UUID
- name -> string
- color -> hex
- email -> string
- address -> string
- address_number -> number
- zipCode -> string
- cellPhone -> string
- photo -> string | null

```json
{
  "userId": "f7e7373d-ab5f-4b95-b79d-6a172ad39a65",
  "name": "new name",
  "color": "#445760",
  "email": "example@example.com",
  "address": "new address",
  "addressNumber": 99,
  "zipCode": "84500000",
  "cellPhone": "42999999999"
}
```

**Response (200 OK):**

```json
{
  "id": "70c598be-7187-40ca-8edc-20d8092a335e",
  "userId": "f7e7373d-ab5f-4b95-b79d-6a172ad39a65",
  "name": "new name",
  "color": "#445760",
  "email": "example@example.com",
  "address": "new address",
  "addressNumber": 99,
  "zipCode": "84500000",
  "cellPhone": "42999999999",
  "photo": null,
  "createdAt": "2025-04-07T16:50:51.315Z",
  "updatedAt": "2025-04-07T17:04:51.912Z"
}
```

### Company delete

**`DELETE /company/:id`**

**Response (204 - NO CONTENT):**

## Product

### Create Product

**`POST /product`**

**Request body:**

- companyId -> string UUID
- name -> string
- price -> number
- quantity -> number (int)
- description -> string
- photo -> string | null

```json
{
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "price": 200.56,
  "quantity": 20,
  "description": "product example"
}
```

**Response (201 CREATED):**

```json
{
  "id": "b793bf17-e397-4dae-b51e-603e74f7dd86",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "price": 200.56,
  "quantity": 20,
  "description": "product example",
  "photo": null,
  "createdAt": "2025-04-07T16:51:05.595Z",
  "updatedAt": "2025-04-07T16:51:05.595Z"
}
```

### Product all (by company)

**`GET /product?companyId=`**

- company id by query param

**Response (200 Ok):**

```json
[
  {
    "id": "b793bf17-e397-4dae-b51e-603e74f7dd86",
    "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
    "name": "example",
    "price": 200.56,
    "quantity": 20,
    "description": "product example",
    "photo": null,
    "createdAt": "2025-04-07T16:51:05.595Z",
    "updatedAt": "2025-04-07T16:51:05.595Z"
  }
]
```

### Product by id

**`GET /product/:id`**

**Response (200 Ok):**

```json
{
  "id": "b793bf17-e397-4dae-b51e-603e74f7dd86",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "price": 200.56,
  "quantity": 20,
  "description": "product example",
  "photo": null,
  "createdAt": "2025-04-07T16:51:05.595Z",
  "updatedAt": "2025-04-07T16:51:05.595Z"
}
```

### Update product

**`PUT /product/:id`**

**Request body:**

- companyId -> string UUID
- name -> string
- price -> number
- quantity -> number (int)
- description -> string
- photo -> string | null

```json
{
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example2",
  "price": 200.56,
  "quantity": 10,
  "description": "new example"
}
```

**Response (200 OK):**

```json
{
  "id": "b793bf17-e397-4dae-b51e-603e74f7dd86",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example2",
  "price": 200.56,
  "quantity": 10,
  "description": "new example",
  "photo": null,
  "createdAt": "2025-04-07T16:51:05.595Z",
  "updatedAt": "2025-04-07T16:55:22.139Z"
}
```

### Product delete

**`DELETE /product/:id`**

**Response (204 - NO CONTENT):**

## Service

### Create Service

**`POST /service`**

**Request body:**

- companyId -> string UUID
- name -> string
- price -> number
- description -> string
- expectedMinutes -> number
- photo -> string | null

```json
{
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "price": 100.0,
  "description": "example",
  "expectedMinutes": 30
}
```

**Response (201 CREATED):**

```json
{
  "id": "21adb2be-9787-425b-890b-7fb5308424d0",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "description": "example",
  "expectedMinutes": 30,
  "price": 100,
  "photo": null,
  "createdAt": "2025-04-07T17:12:01.234Z",
  "updatedAt": "2025-04-07T17:12:01.234Z"
}
```

### Service all (by company)

**`GET /service?companyId=`**

- company id by query param

**Response (200 Ok):**

```json
[
  {
    "id": "21adb2be-9787-425b-890b-7fb5308424d0",
    "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
    "name": "example",
    "description": "example",
    "expectedMinutes": "30"
    "price": 100,
    "photo": null,
    "createdAt": "2025-04-07T17:12:01.234Z",
    "updatedAt": "2025-04-07T17:12:01.234Z"
  }
]
```

### Service by id

**`GET /service/:id`**

**Response (200 Ok):**

```json
{
  "id": "21adb2be-9787-425b-890b-7fb5308424d0",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "example",
  "description": "example",
  "expectedMinutes": 30
  "price": 100,
  "photo": null,
  "createdAt": "2025-04-07T17:12:01.234Z",
  "updatedAt": "2025-04-07T17:12:01.234Z"
}
```

### Update service

**`PUT /service/:id`**

**Request body:**

- companyId -> string UUID
- name -> string
- expectedMinutes -> number
- price -> number
- description -> string
- photo -> string | null

```json
{
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "new example",
  "price": 10.0,
  "description": "new example",
  "expectedMinutes": 5
}
```

**Response (200 OK):**

```json
{
  "id": "21adb2be-9787-425b-890b-7fb5308424d0",
  "companyId": "70c598be-7187-40ca-8edc-20d8092a335e",
  "name": "new example",
  "description": "new example",
  "expectedMinutes": 5,
  "price": 10,
  "photo": null,
  "createdAt": "2025-04-07T17:12:01.234Z",
  "updatedAt": "2025-04-07T17:14:21.257Z"
}
```

### Service delete

**`DELETE /service/:id`**

**Response (204 - NO CONTENT):**

## Availabe Schedule

Available opening hours

### Create available schedule

**`POST /schedule/available`**

**Request body:**

- companyId -> string UUID
- startTime -> string
- endTime -> string
- intervalInMinutes -> number
- days -> `arr<Number>`
- periodStart -> string
- periodEnd -> string

days: <br>
0 -> Monday<br>
6 -> Saturday

```json
{
  "companyId": "08db8ff9-194c-4c5e-9048-fa29a5e7b66c",
  "startTime": "08:00",
  "endTime": "17:00",
  "intervalInMinutes": 30,
  "days": [1, 2, 3, 4, 5],
  "periodStart": "2025-04-13",
  "periodEnd": "2025-04-20"
}
```

**Response (201 CREATED):**

```json
{
  "message": "Schedules created",
  "count": 90
}
```

## Schedule

### Create schedule

**`POST /schedule`**

The schedule status is `CONFIRMED` by default, but it can be `PENDING` if the total expected duration of all services exceeds the available schedule time..

**Request body:**

- companyId -> string UUID
- clientId -> string UUID
- availableScheduleId -> string UUID
- products -> obj OPTIONAL
- services -> obj

```json
products: [
  {
    "productId": "7a38386d-ddb2-43e9-99fa-bd97303f3fb9",
    "quantity": 1,
    "discount": 0
  }
],
services: [
  {
    "serviceId": "c3fdda2c-0d79-4296-88ae-90243e14322b"
  },
]
```

Example:

```json
{
  "companyId": "08db8ff9-194c-4c5e-9048-fa29a5e7b66c",
  "clientId": "c166669d-2eb7-4d3c-8df5-7c3411054c3d",
  "availableScheduleId": "0a7f1690-8b64-48fe-9023-cab6662fa6c3",
  "services": [
    {
      "serviceId": "c3fdda2c-0d79-4296-88ae-90243e14322b"
    },
    {
      "serviceId": "c3fdda2c-0d79-4296-88ae-90243e14322b"
    },
    {
      "serviceId": "c3fdda2c-0d79-4296-88ae-90243e14322b"
    },
    {
      "serviceId": "c3fdda2c-0d79-4296-88ae-90243e14322b"
    }
  ]
}
```

**Response (201 CREATED):**

```json

```

**Response (409 CONFLICT):**
<br>
This erros hapens when you make a post with a already used available schedule.

```json
 "message": "Schedule with this available schedule already exists"
```

### Schedule all (by company)

**`GET /schedule?companyId=`**

- company id by query param

**Response (200 Ok):**

```json
[
  {
    "id": "a216372d-524a-4422-b432-3ed4a2882cee",
    "companyId": "08db8ff9-194c-4c5e-9048-fa29a5e7b66c",
    "availableId": "04442202-e1ea-4019-aaf3-c821c8dc0956",
    "clientId": "c166669d-2eb7-4d3c-8df5-7c3411054c3d",
    "createdAt": "2025-04-13T18:40:17.590Z",
    "updatedAt": "2025-04-13T18:40:17.590Z",
    "situation": "CONFIRMED"
  }
]
```

### Schedule by id

**`GET /schedule/${id}`**

**Response (200 Ok):**

```json
{
  "id": "47d8ced8-4cb1-43ef-aba8-645beeaa431f",
  "companyId": "ddfb3a99-1581-4017-9a1b-babccd4dc2e8",
  "availableId": "0fb121ff-f3b2-4416-8e8e-73acb10f28f8",
  "clientId": "e3e31b28-178c-4059-a886-b0dd44eba8fe",
  "createdAt": "2025-04-19T12:32:09.965Z",
  "updatedAt": "2025-04-19T12:32:09.965Z",
  "situation": "PENDING"
}
```

### Schedule delete

Deleting a schedule maked the isBooked in AvailableSchedule returns to false.

**`DELETE /schedule/${id}:`**

**Response (204 - NO CONTENT):**

## Clients

### Create client

Each customer is created as a record in the system and is per company

**`POST /client`**

**Request body:**

- companyId -> string UUID
- name -> string
- email -> string
- password -> string
- cellPhone -> string
- googleId -> string | null
- photo -> string | null

Example:

```json
{
  "companyId": "08db8ff9-194c-4c5e-9048-fa29a5e7b66c",
  "name": "Jhon",
  "email": "jhon@eexample.com",
  "password": "123456",
  "cellPhone": "42999999999"
}
```

**Response (201 CREATED):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlM2UzMWIyOC0xNzhjLTQwNTktYTg4Ni1iMGRkNDRlYmE4ZmUiLCJpYXQiOjE3NDUwNjQyMDYsImV4cCI6MTc0NTE1MDYwNn0.U8S3qIjulcjcsxmo467r1hG6ddoL2dY0fWeiFGQhclA",
  "refreshToken": "d60528fe-d25b-4b71-8fd7-cc0a90a6c537"
}
```

### Find all clients (by company)

**`GET /client?companyId=`**

- company id by query param

**Response (200 Ok):**

```json
[
  {
    "id": "e3e31b28-178c-4059-a886-b0dd44eba8fe",
    "companyId": "ddfb3a99-1581-4017-9a1b-babccd4dc2e8",
    "name": "Jhon",
    "email": "jhon@example.com",
    "password": "$2b$08$pIZ0pz0v4iKqchbC71yqYuEJjqephkdvz9/ZYFrxSwjhZlGoWEllO",
    "cellPhone": "42999999999",
    "googleId": null,
    "photo": null,
    "registeredAt": "2025-04-19T12:03:26.728Z"
  }
]
```

### Find clients by name

**`GET /client/${name}?companyId=`**

- company id by query param

**Reponse (200 Ok):**

req: /client/Jho?companyId=ddfb3a99-1581-4017-9a1b-babccd4dc2e8

```json
[
  {
    "id": "e3e31b28-178c-4059-a886-b0dd44eba8fe",
+    "companyId": "ddfb3a99-1581-4017-9a1b-babccd4dc2e8",
    "name": "Jhon",
    "email": "jhon@example.com",
    "password": "$2b$08$pIZ0pz0v4iKqchbC71yqYuEJjqephkdvz9/ZYFrxSwjhZlGoWEllO",
    "cellPhone": "42999999999",
    "googleId": null,
    "photo": null,
    "registeredAt": "2025-04-19T12:03:26.728Z"
  }
]
```
