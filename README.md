# Farm Assist

## Description

This is a REST API service for Farm Assist application. It is an agricultural data collition and a marketplace software.

## Installation

```bash
$ yarn
```

## Setup

Provide requested variables in example.env.

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Base url

```http
    http://localhost:{{PORT}}/api/v{{API_VERSION}}/
```

| Field         | Description                                                       |
| :------------ | :---------------------------------------------------------------- |
| `PORT`        | **Required**. Http server port (Check example.env for more info.) |
| `API_VERSION` | **Required**. API version (Check example.env for more info.)      |

## Authorization

All API requests require the use of a generated API JWT. Generate a new one, by navigating to the `/auth endpoint`. Checkout \APIs in the root directory.

To authenticate an API request, you should provide your `access_token` in the `Authorization` header.

```http
POST /auth
```

```javascript
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
  "phone" : string,
  "password" : string
}
```

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Gophish returns a JSON response in the following format:

### Success

```javascript
{
  {
  "statusCode": 200,
  "data": {
        "access_token": string
      }
    }
}
```

### Denied

```javascript
{
  "statusCode": 401,
  "message": "Incorrect login credentials",
  "error": "Unauthorized"
}
```

### Unauthorized

```javascript
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Status Codes

Farm Assist returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 401         | `UNAUTHORIZED`          |
| 409         | `CONFILICT`             |
| 500         | `INTERNAL SERVER ERROR` |
