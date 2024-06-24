# WebSocket Server Documentation

## Overview

This WebSocket server provides real-time bidirectional event-based communication. It is developed using Node.js and leverages libraries like Express, Socket.io, and CORS for handling cross-origin requests.

## Getting Started

### Prerequisites

You need to have Node.js installed on your machine to run this server. You can download and install it from the official [Node.js website](https://nodejs.org/).

### Installation

To set up the server, follow these steps:

1. Clone the repository or download the source code to your local machine.
2. Navigate to the directory where you stored the files.
3. Install the required node modules by running the following command:

```sh
npm install
```

### Configuration

Before starting the server, ensure to configure the environment variables. Create a `.env` file in the root directory and set your configuration as follows:

```shell
NODE_ENV=development
IP=
PORT=
DOMAIN=
APP_URL=
```

Also, adjust `config/environment` file accordingly to match your specific environment settings.

### Running the Server

To start the server, use one of the predefined scripts:

For production:
```sh
npm start
```

For development (with nodemon for auto-restarting):
```sh
npm run dev
```

### Connecting to the Server

Once the server is running, clients can connect to it via the configured `APP_URL` and port. Ensure that the client-side application is allowed in the CORS configuration of the server to establish a connection successfully.

## Features

- Real-time two-way communication between clients and server
- CORS enabled for cross-origin resource sharing
- Environment-specific configuration
- Middleware for user IP verification.

---

Thank you for using this WebSocket server. Happy coding!