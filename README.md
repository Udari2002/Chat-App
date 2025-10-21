# QuickChat (MERN + Socket.io)

A modern, real‑time chat application with a clean three‑column layout (Sidebar | Chat | Profile). Built with React + Vite, Tailwind CSS, Node/Express, MongoDB, and Socket.io. Supports text and image messages, presence (online users), unseen counts, and a polished UI that mirrors popular messengers.

## Features

- Realtime chat with Socket.io (text + image messages)
- Presence: online users list with live updates
- Unread counts and message seen tracking
- Three‑column responsive layout
  - 2 columns by default (Sidebar | Chat)
  - 3 columns when a user is selected (Sidebar | Chat | Right panel)
- Sticky input bar, middle‑column‑only scrolling, safe image previews
- Auth flow with JWT (login/logout), axios interceptor for auth headers
- MongoDB models for Users and Messages

## Tech Stack

- Frontend: React 19, Vite 6, Tailwind CSS, React Router, Socket.io‑client, Axios
- Backend: Node.js, Express, Socket.io, Mongoose, Cloudinary (image upload)
- Database: MongoDB

## Monorepo structure

```
Chat app/
├── client/           # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── server/           # Node/Express + Socket.io backend
    ├── models/
    ├── routes/
    ├── middleware/
    └── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- Cloudinary account (for image uploads)

## Environment variables

Create a `.env` file in both folders as needed.

client/.env
```
VITE_BACKEND_URL=http://localhost:5000
```

server/.env
```
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

## Install and run

From the project root, install both:

```bash
# in Windows PowerShell
cd "client"; npm install; cd ..
cd "server"; npm install; cd ..
```

Start backend (port 5000):

```bash
cd "server"; npm run dev
```

Start frontend (Vite chooses a free 517x port):

```bash
cd "client"; npm run dev
```

Then open the printed Local URL (for example, http://localhost:5176/).

## Usage tips

- Login to create a session; the axios interceptor attaches your token automatically.
- Selecting a user switches to the 3‑column layout and loads the conversation.
- Only the middle chat column scrolls; new messages scroll smoothly to bottom. Switching users jumps to the bottom instantly.
- You can upload images using the gallery icon; receivers will see images inline.

## Scripts

Frontend (client):
- `npm run dev` – start Vite dev server
- `npm run build` – build for production
- `npm run preview` – preview the production build

Backend (server):
- `npm run dev` – start server with nodemon
- `npm start` – start server with node

## Troubleshooting

- Port already in use
  - If `5000` is busy, stop the existing Node process or change PORT in `server/.env`.
  - Vite will auto‑select another 517x port if the default is taken.
- CORS or 401 errors
  - Ensure `VITE_BACKEND_URL` points to your backend and that login succeeds (JWT set in localStorage).
- Images not showing
  - Verify Cloudinary env vars and that messages contain `image` URLs/base64 strings.

## License

MIT – feel free to use and modify for your projects.
