# 🔥 Roast My Code — Frontend

> An AI-powered code roaster that tears your code apart like a savage senior dev — then actually fixes it.

🌐 **Live Demo:** [roast-code-frontend.vercel.app](https://roast-code-frontend.vercel.app)

---

## 🚀 What is this?

**Roast My Code** is a fun full-stack web app where you paste any code snippet and AI roasts it with brutal humor — then explains what's actually wrong and gives you a quick fix.

3 roast intensity levels:
- 😏 **Mild** — light jabs, still friendly
- 🔥 **Medium** — no mercy, honest feedback
- 💀 **Brutal** — full destruction mode

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Styling | Pure CSS (scoped, no libraries) |
| Fonts | JetBrains Mono + Space Grotesk |
| Deployment | Vercel |
| API | Connects to Express backend (Gemini API) |

---

## 📁 Project Structure

```
roast-my-code/
├── public/
├── src/
│   ├── App.jsx
│   ├── RoastMyCode.jsx   ← main component
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/mdnazishpatel/roast-code-frontend.git
cd roast-code-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Point to your backend

In `RoastMyCode.jsx`, update the fetch URL to your backend:

```js
const res = await fetch("http://localhost:3001/api/roast", {
```

> For production, replace with your Render backend URL.

### 4. Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder.

---

## 🚀 Deploy to Vercel

```bash
npx vercel deploy --prod
```

Make sure to set **Output Directory** to `dist` in Vercel project settings.

---

## 🔗 Backend

This frontend connects to a separate Express backend powered by Gemini API.

👉 Backend repo: [roast-code-backend](https://github.com/mdnazishpatel/Roast-code-backend)

---

## ✨ Features

- 🖥️ Terminal-style code editor with line numbers
- ⌨️ Typewriter tagline animation
- 🎚️ 3 roast intensity levels
- 🃏 Animated result cards (roast → issues → fix)
- 📱 Fully responsive
- 🌑 Dark theme with fire orange accents

---

## 👤 Author

**Nazish ali** — Built to roast. Just for fun. 🔥

---

## 📄 License

MIT — do whatever you want with it. Just don't write bad code. 😂
