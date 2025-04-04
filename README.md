# 🎬 Wexo Movie App (Vue 3 + Vite + TypeScript)

This is a modern movie discovery app built for **Wexo**, using [Vue 3](https://vuejs.org/), [Vite](https://vitejs.dev/), and TypeScript. It features genre-based browsing, infinite scrolling, favorites, and more.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/MikkelVibeUCN/WexoCase.git
cd wexo-movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Your app will be running at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Tech Stack

- Vite for fast dev experience
- Vue 3 with `<script setup>`
- TypeScript for type safety
- Scoped + modern CSS
- Modular services for API interaction
- TMDB API integration

---

## 📁 Project Structure

```
src/
├─ components/        # Reusable Vue components
├─ views/             # Route-based views
├─ Services/          # API logic & utilities
├─ assets/            # Static images & styles
├─ router/            # Vue Router setup
└─ main.ts            # App entry point
```

---

## 🔐 Environment Variables

Create a `.env` file in the root with the following:

```
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_KEY=your_tmdb_token
```

---

## 🛠 Scripts

| Command           | Description                 |
|------------------|-----------------------------|
| `npm run dev`     | Start local dev server      |
| `npm run build`   | Build for production        |
| `npm run preview` | Preview built app locally   |
| `npm run lint`    | Lint code with ESLint       |

---
