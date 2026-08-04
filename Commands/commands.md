# ⚛️ React CLI Cheat Sheet

Quick terminal reference for setting up and running React projects (Linux + VS Code).

---

## 🧰 Prerequisites

```bash
node -v     # should be >= 20
npm -v
```

If outdated:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20
```

---

## ⚡ Create React App (Vite — Recommended)

```bash
npm create vite@latest my-react-app
cd my-react-app
npm install
npm run dev
```

URL → [http://localhost:5173](http://localhost:5173)

---

## 🧱 Create React App (Legacy CRA)

```bash
npx create-react-app my-app
cd my-app
npm start
```

URL → [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Common Commands

```bash
npm run dev       # start Vite dev server
npm start         # start CRA app
npm run build     # production build
npm install <pkg> # install package
npm uninstall <pkg>
code .            # open project in VS Code
```

---

## 🧩 Optional Tools

```bash
npm install react-router-dom              # routing
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p                   # Tailwind setup
```

---

## 🧹 Troubleshooting

```bash
nvm install 20 && nvm use 20    # fix Node version errors
rm -rf node_modules package-lock.json && npm install
```

---

📄 *Save this as `react-cheatsheet.md` for quick reference in terminal.*
