# API Documentation

Base URL:

```txt
http://localhost:5000

Authentication

Protected APIs require a Bearer token.

Authorization: Bearer <token>
Health Check
GET /health

Check if backend server is running.

Response
{
  "status": "OK",
  "message": "Secure Event Api is Running"
}
GET /health/db

Check database connection.

Response
{
  "status": "OK",
  "message": "Database connection is working",
  "database": "secure-event-db"
}
Auth APIs
POST /api/auth/register

Register a new user.

Request Body
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "123456"
}
Success Response
{
  "message": "User Registered Successfully",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  }
}
POST /api/auth/login

Login and receive JWT token.

Request Body
{
  "email": "admin@example.com",
  "password": "123456"
}
Success Response
{
  "message": "Login Successful",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "<jwt_token>"
}
GET /api/auth/profile

Get current logged-in user profile.

Headers
Authorization: Bearer <token>
Success Response
{
  "message": "Profile loaded successfully",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
User APIs
GET /api/users

Get user list.

Headers
Authorization: Bearer <token>
Success Response
{
  "message": "Get users successfully",
  "users": []
}
Event APIs
POST /api/events

Create a new event.

Headers
Authorization: Bearer <token>
Request Body
{
  "title": "DevOps Workshop",
  "description": "Learn Docker and CI/CD",
  "location": "Bangkok",
  "event_date": "2026-06-10 10:00:00"
}
Success Response
{
  "message": "Create Event Successfully",
  "event": {
    "id": 1,
    "title": "DevOps Workshop",
    "description": "Learn Docker and CI/CD",
    "location": "Bangkok",
    "event_date": "2026-06-10T03:00:00.000Z",
    "created_by": 1,
    "is_deleted": 0
  }
}
GET /api/events

Get all events that are not soft deleted.

Headers
Authorization: Bearer <token>
Success Response
{
  "message": "Get Event List Successfully",
  "events": []
}
GET /api/events/:id

Get event detail by id.

Headers
Authorization: Bearer <token>
Success Response
{
  "message": "Get Event Successfully",
  "event": {
    "id": 1,
    "title": "DevOps Workshop"
  }
}
PUT /api/events/:id

Update event by id.

Headers
Authorization: Bearer <token>
Request Body
{
  "title": "Updated DevOps Workshop",
  "description": "Updated description",
  "location": "Bangkok",
  "event_date": "2026-06-15 13:00:00"
}
Success Response
{
  "message": "Event updated successfully",
  "event": {
    "id": 1,
    "title": "Updated DevOps Workshop"
  }
}
DELETE /api/events/:id

Soft delete event by id.

This API does not remove the row from database. It updates is_deleted to 1.

Headers
Authorization: Bearer <token>
Success Response
{
  "message": "Event deleted successfully"
}
Admin APIs
GET /api/admin/users

Get all users. Admin only.

Headers
Authorization: Bearer <admin_token>
Success Response
{
  "message": "Users loaded successfully",
  "users": []
}
Common Error Responses
No token
{
  "message": "No token provided"
}
Invalid token
{
  "message": "Invalid or expired token"
}
Forbidden
{
  "message": "Admin access required"
}
Not Found
{
  "message": "Event not found"
}