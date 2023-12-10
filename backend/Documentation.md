# API Documentation

## 1. Endpoints

### 1.1 User Login

- **Name**: User Login
- **Path**: `/auth/login`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**: `{"username": "<username>", "password": "<password>"}`
- **Function**: Authenticates the user and returns an access token and a refresh token. The refresh token is also stored in a secure HTTP-only cookie.
- **Response**: `{"access_token": "<access_token>"}`
- **Error Responses**: `{"statusCode": 401, "error": "Unauthorized", "message": "User not found"}` or `{"statusCode": 401, "error": "Unauthorized", "message": "Wrong password"}`

## 1.2 Get User Profile

- **Name**: Get User Profile
- **Path**: `/auth/profile`
- **Method**: GET
- **Headers**: `Authorization: Bearer <access_token>`
- **Function**: Returns the user's profile. This endpoint is protected and requires a valid access token.
- **Response**: `<user_profile>`
- **Error Responses**: `{"statusCode": 401, "error": "Unauthorized", "message": "Unauthorized"}`

## 1.3 Refresh Token

- **Name**: Refresh Token
- **Path**: `/auth/refresh-token`
- **Method**: POST
- **Function**: Refreshes the access token using the refresh token stored in the secure HTTP-only cookie.
- **Response**: `{"access_token": "<access_token>"}`
- **Error Responses**: `{"statusCode": 401, "error": "Unauthorized", "message": "Invalid refresh token"}` or `{"statusCode": 401, "error": "Unauthorized", "message": "Refresh token has expired"}`

## 1.4 Revoke Token

- **Name**: Revoke Token
- **Path**: `/auth/revoke-token`
- **Method**: POST
- **Body**: `{"userId": "<user_id>"}`
- **Function**: Revokes the refresh token for a specific user.
- **Response**: `{"message": "Token revoked successfully"}`
- **Error Responses**: `{"statusCode": 404, "error": "Not Found", "message": "User not found"}`

## 1.5 Logout

- **Name**: Logout
- **Path**: `/auth/logout`
- **Method**: POST
- **Function**: Logs out the user by clearing the refresh token cookie.
- **Response**: `{"message": "Successfully logged out"}`
- **Error Responses**: `{"statusCode": 500, "error": "Internal Server Error", "message": "<error_message>"}`


## 2. Channel Endpoints

### 2.1 Create Channel

- **Name**: Create Channel
- **Path**: `/channels`
- **Method**: POST
- **Body**: `{"creator": "<creator_username>", "name": "<channel_name>", "isPrivate": "<true_or_false>"}`
- **Function**: Creates a new channel with the provided details.
- **Response**: `<channel>`
- **Error Responses**: `{"statusCode": 400, "error": "Bad Request", "message": "Creator not found"}`

### 2.2 Get Channels

- **Name**: Get Channels
- **Path**: `/channels`
- **Method**: GET
- **Function**: Returns a list of all channels.
- **Response**: `<channels>`
- **Error Responses**: `{"statusCode": 500, "error": "Internal Server Error", "message": "<error_message>"}`

### 2.3 Update Channel

- **Name**: Update Channel
- **Path**: `/channels/:id`
- **Method**: PUT
- **Body**: `{"name": "<channel_name>", "isPrivate": "<true_or_false>"}`
- **Function**: Updates the channel with the provided id.
- **Response**: `<channel>`
- **Error Responses**: `{"statusCode": 404, "error": "Not Found", "message": "Channel not found"}`

### 2.4 Invite to Channel

- **Name**: Invite to Channel
- **Path**: `/channels/:channelId/invite/:userId`
- **Method**: POST
- **Function**: Invites a user to a channel.
- **Response**: `{"message": "User invited successfully"}`
- **Error Responses**: `{"statusCode": 404, "error": "Not Found", "message": "User not found"}`

### 2.5 Accept Invite

- **Name**: Accept Invite
- **Path**: `/channels/:channelId/accept-invite`
- **Method**: PATCH
- **Function**: Accepts an invitation to a channel.
- **Response**: `{"message": "Invite accepted successfully"}`
- **Error Responses**: `{"statusCode": 404, "error": "Not Found", "message": "Invite not found"}`

### 2.6 Get User Channels

- **Name**: Get User Channels
- **Path**: `/channels/channels`
- **Method**: GET
- **Function**: Returns a list of channels the user is part of.
- **Response**: `<channels>`
- **Error Responses**: `{"statusCode": 500, "error": "Internal Server Error", "message": "<error_message>"}`



3. Chat Endpoints
3.1 Get Messages

    Name: Get Messages
    Path: /chat/messages
    Method: GET
    Function: Returns a list of all messages.
    Response: <messages>
    Error Responses: {"statusCode": 500, "error": "Internal Server Error", "message": "<error_message>"}

The format of the response and the body for each endpoint would be defined by the Message entity used in the service methods. For example, the Message entity in the ChatService would define the structure of the response body for the getAllMessages method 2, 3, 4, 5.


4. Users Endpoints
4.1 Register

    Name: Register
    Path: /register
    Method: POST
    Body: {"username": "<username>", "password": "<password>", "email": "<email>"}
    Function: Registers a new user with the provided details.
    Response: {"message": "User registered successfully"}
    Error Responses: {"statusCode": 400, "error": "Bad Request", "message": "<error_message>"}

4.2 Get User Data

    Name: Get User Data
    Path: /data
    Method: GET
    Function: Returns the data of the currently authenticated user.
    Response: <user_data>
    Error Responses: {"statusCode": 401, "error": "Unauthorized", "message": "Unauthorized"}

4.3 Update Profile

    Name: Update Profile
    Path: /users/update-profile
    Method: PUT
    Headers: Content-Type: multipart/form-data
    Body: {"username": "<username>", "email": "<email>", "profileImage": "<file>"}
    Function: Updates the profile of the currently authenticated user.
    Response: {"message": "Profile updated successfully"}
    Error Responses: {"statusCode": 401, "error": "Unauthorized", "message": "Unauthorized"}


6. WebSocket Endpoints
6.1 Join Channel

    Name: Join Channel
    Event: joinChannel
    Data: {"channelId": "<channel_id>", "userId": "<user_id>"}
    Function: Joins a user to a specific channel.
    Response: {"message": "User joined the channel successfully"}
    Error Responses: {"statusCode": 400, "error": "Bad Request", "message": "<error_message>"}

6.2 Leave Channel

    Name: Leave Channel
    Event: leaveChannel
    Data: {"channelId": "<channel_id>", "userId": "<user_id>"}
    Function: Removes a user from a specific channel.
    Response: {"message": "User left the channel successfully"}
    Error Responses: {"statusCode": 400, "error": "Bad Request", "message": "<error_message>"}

6.3 Send Message

    Name: Send Message
    Event: sendMessage
    Data: {"content": "<message_content>", "senderId": "<sender_id>", "channelId": "<channel_id>"}
    Function: Sends a message to a specific channel.
    Response: {"message": "Message sent successfully"}
    Error Responses: {"statusCode": 400, "error": "Bad Request", "message": "<error_message>"}


## 2. DTOs

### 2.1 User DTO

- **Fields**: `id` (string), `username` (string), `password` (string)
- **Function**: Represents a user in the system

### 2.2 Channel DTO

- **Fields**: `id` (string), `name` (string), `description` (string)
- **Function**: Represents a channel in the system

## 3. Services

### 3.1 User Service

- **Function**: Handles user-related operations such as login, registration, and data fetching
- **Methods**: `login(username, password)`, `register(user)`, `fetchUserData(token)`

### 3.2 Channel Service

- **Function**: Handles channel-related operations such as creating, fetching, and updating channels
- **Methods**: `createChannel(channel)`, `fetchChannels()`, `updateChannel(channel)`

## 4. Error Handling

- **Format**: JSON
- **Error Codes**: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error)

## 5. WebSocket

- **Endpoint**: `wss://your-websocket-server.com/channel/<channel_id>`
- **Authentication**: JWT token in `Authorization` header

## 6. CORS

- **Configuration**: Allows requests from any origin
