# 🧪 GoTesty

A lightweight desktop and web tool for testing RESTful APIs — built with **Go**, **Wails**, **React**, and **TailwindCSS**.

GoTesty helps developers quickly send HTTP requests, inspect JSON responses, and save test configurations — all without the overhead of big tools like Postman.

---

## 🚀 Features

- 🧰 Built-in request builder (GET, POST, PUT, DELETE)
- 📬 Custom headers and body support
- 💡 Pretty JSON output viewer
- 🌙 Clean, minimal UI with TailwindCSS
- 💻 Cross-platform (macOS, Windows, Linux)
- 🧱 Powered by Go + Wails for a native feel

---

## 🏗️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Backend | Go + Wails |
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Packaging | Wails CLI |

---

## 🧑‍💻 Getting Started

### Prerequisites
- [Go 1.23+](https://go.dev/dl/)
- [Node.js 18+](https://nodejs.org/)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

### Clone & Run

```bash
git clone https://github.com/jonathansteele/gotesty.git
cd gotesty
wails dev
```
### Build for Production
```bash
wails build
```
Output binaries will appear in the ```/bin``` folder.
