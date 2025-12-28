# OpenWatch API Documentation

## Base URL

```
Production: https://your-backend-url.onrender.com/api
Development: http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "official"
  }
}
```

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "citizen"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "2",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

#### GET /auth/me

Get current user information (requires authentication).

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "official"
  }
}
```

### Records

#### GET /records

Get all public records with optional filtering.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Records per page (default: 20)
- `search` (string): Search in title and description
- `department` (string): Filter by department
- `status` (string): Filter by status
- `createdBy` (string): Filter by creator ID

**Response:**

```json
{
  "success": true,
  "records": [
    {
      "id": "1",
      "title": "City Budget Allocation 2024",
      "description": "Detailed breakdown...",
      "department": "Finance",
      "status": "Active",
      "createdBy": "1",
      "createdByName": "Demo Official",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

#### GET /records/:id

Get a specific record by ID.

**Response:**

```json
{
  "success": true,
  "record": {
    "id": "1",
    "title": "City Budget Allocation 2024",
    "description": "Detailed breakdown...",
    "department": "Finance",
    "status": "Active",
    "createdBy": "1",
    "createdByName": "Demo Official",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

#### POST /records

Create a new record (requires official or admin role).

**Request Body:**

```json
{
  "title": "New Government Record",
  "description": "Detailed description of the record",
  "department": "Health",
  "status": "Active"
}
```

**Response:**

```json
{
  "success": true,
  "record": {
    "id": "6",
    "title": "New Government Record",
    "description": "Detailed description of the record",
    "department": "Health",
    "status": "Active",
    "createdBy": "1",
    "createdByName": "Demo Official",
    "createdAt": "2024-02-28T12:00:00.000Z",
    "updatedAt": "2024-02-28T12:00:00.000Z"
  }
}
```

#### PUT /records/:id

Update an existing record (requires official or admin role).

**Request Body:**

```json
{
  "title": "Updated Record Title",
  "status": "Under Review"
}
```

**Response:**

```json
{
  "success": true,
  "record": {
    "id": "1",
    "title": "Updated Record Title",
    "description": "Detailed breakdown...",
    "department": "Finance",
    "status": "Under Review",
    "createdBy": "1",
    "createdByName": "Demo Official",
    "updatedBy": "1",
    "updatedByName": "Demo Official",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-02-28T12:00:00.000Z"
  }
}
```

#### DELETE /records/:id

Delete a record (requires admin role).

**Response:**

```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

### Audit

#### GET /audit/:recordId

Get audit trail for a specific record.

**Response:**

```json
{
  "success": true,
  "recordId": "1",
  "auditTrail": [
    {
      "id": "1",
      "recordId": "1",
      "action": "CREATE",
      "userId": "1",
      "userName": "Demo Official",
      "changes": {
        "title": "City Budget Allocation 2024",
        "description": "Detailed breakdown...",
        "department": "Finance",
        "status": "Active"
      },
      "timestamp": "2024-01-15T00:00:00.000Z",
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

#### GET /audit/system/all

Get system-wide audit logs (requires admin role).

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Logs per page (default: 50)
- `action` (string): Filter by action type
- `userId` (string): Filter by user ID
- `startDate` (string): Filter by start date (ISO format)
- `endDate` (string): Filter by end date (ISO format)

**Response:**

```json
{
  "success": true,
  "auditLogs": [
    {
      "id": "1",
      "recordId": "1",
      "action": "CREATE",
      "userId": "1",
      "userName": "Demo Official",
      "changes": {...},
      "timestamp": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 50,
  "totalPages": 1
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Data Validation

### Record Validation Rules

- `title`: Minimum 5 characters, maximum 500 characters
- `description`: Minimum 10 characters
- `department`: Required, minimum 2 characters
- `status`: Must be one of: "Active", "Archived", "Under Review"

### User Validation Rules

- `name`: Minimum 2 characters
- `email`: Valid email format, unique
- `password`: Minimum 6 characters
- `role`: Must be one of: "citizen", "official", "admin"

## Blockchain Integration

When blockchain features are enabled, records include additional fields:

```json
{
  "blockchainHash": "0x1234567890abcdef...",
  "blockchainTx": "0xabcdef1234567890...",
  "verified": true
}
```

## Health Check

#### GET /health

Check API health status.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-02-28T12:00:00.000Z",
  "environment": "production"
}
```
