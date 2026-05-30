# Real Estate Management

A modern web application for real estate partners to manage projects, properties, customers, and office team members. Built with **Vite**, **React**, and **Tailwind CSS**, ready to deploy on **Netlify**.

## Features

- **Dashboard** — Overview stats for projects, properties, customers, and team members
- **Projects** — Track development projects with status, timeline, and budget
- **Properties** — Manage listings (residential, commercial, land, industrial)
- **Customers** — Maintain buyer, seller, tenant, and landlord records
- **Team Members** — Manage office staff, agents, and partners

Data is persisted in the browser via `localStorage` (no backend required for the initial version).

## Getting Started

```bash
cd real-estate-mgmt
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

Output is in the `dist/` folder.

## Deploy to Netlify

### Option 1 — Git-based deploy

1. Push this folder to a Git repository
2. In [Netlify](https://app.netlify.com), click **Add new site → Import an existing project**
3. Set:
   - **Base directory:** `real-estate-mgmt` (if in a monorepo)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy

The included `netlify.toml` handles SPA routing automatically.

### Option 2 — Drag & drop

```bash
npm run build
```

Drag the `dist/` folder to Netlify's deploy drop zone.

## Tech Stack

- [Vite](https://vite.dev/) — Build tool
- [React 19](https://react.dev/) — UI framework
- [React Router](https://reactrouter.com/) — Client-side routing
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Lucide React](https://lucide.dev/) — Icons

## Project Structure

```
src/
├── components/     # Shared UI (Layout, Modal, StatCard, etc.)
├── context/        # DataContext with localStorage persistence
├── pages/          # Dashboard, Projects, Properties, Customers, Members
├── App.jsx         # Router setup
└── main.jsx        # Entry point
```

## License

ISC
