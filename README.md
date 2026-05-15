# Real-Time Chat Application

A simple yet powerful real-time chat application built with React, Node.js, Express, and Socket.IO.

## Features

- **Join Rooms**: Multiple users can join specific rooms using a Room ID.
- **Real-Time Messaging**: Instant message delivery using WebSockets.
- **Typing Indicators**: See when others in the room are typing.
- **User Presence**: Live count of online users per room.
- **Timestamps**: Messages show the time they were sent.
- **Auto-Scroll**: Automatically scrolls to the latest message.
- **Responsive Design**: Beautiful UI built with Tailwind CSS, fully mobile-friendly.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io.

## Getting Started

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 2. Setup the Server
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:3001`.

### 3. Setup the Client
```bash
cd client
npm install
npm run dev
```
The client will run on `http://localhost:5173`.

### 4. How to use
1. Open the application in your browser.
2. Enter a username and a Room ID.
3. Open another browser window or tab and join the same Room ID with a different username.
4. Start chatting in real-time!

## Project Structure

- `client/`: React frontend source code and configuration.
- `server/`: Node.js server with Socket.IO event handling.
