# MovieLibrary

Movie Library is a MERN stack project designed for effortless movie searches using the OMDb API. With Movie Library, you can create and curate your own movie lists seamlessly.

## Steps to Run the Project

### 1. Set Up Frontend

Navigate to the frontend directory and install the required Node.js modules:

```bash
cd frontend
npm install
```

Run the frontend project:

```bash
npm run dev
```

### 2. Set Up Backend

Navigate to the server directory:

```bash
cd server
```

Install the necessary Node.js modules:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the server directory. Specify the following environment variables:

```dotenv
PORT=4500
MONGO_URL="mongodb://127.0.0.1:27017/movielibrary"
```
Note: You can change PORT number and MONGO_URL database name.
### 4. Start the Server

Start the server:

```bash
npm run start
```
