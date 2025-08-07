**Read in other languages:** [Українська](README.md) | [English](README.en.md)

---

<div align="center" class="text-center" id="start"><h1>Dsgn Academy — Освітня платформа для дизайнерів</h1> 
<img alt="last-commit" src="https://img.shields.io/github/last-commit/Aleks-corp/dsgn-academy?style=flat&logo=git&logoColor=white&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/Aleks-corp/dsgn-academy?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/Aleks-corp/dsgn-academy?style=flat&color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;"> 
<p><em>Розроблено за допомогою:</em></p> 
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="NextJS" src="https://img.shields.io/badge/next.js-000000?style=flat&logo=nextdotjs&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<br>
<img alt="Node" src="https://img.shields.io/badge/node.js-339933?style=flat&logo=Node.js&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="Express" src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=mongodb&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> 
<img alt="OpenAI" src="https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;"> </div>

---

**Dsgn Academy** — це україномовна освітня платформа для дизайнерів.

Ми перекладаємо, адаптуємо і збираємо найкращі відео, курси, інтерв’ю з UI/UX, графічного дизайну, Webflow, Figma, Spline, Framer та інших тем, щоб зробити їх доступними для кожного.

Мова більше не бар’єр. Рости, вчися, надихайся!

## 📦 Cтруктура репозиторію

```

dsgn-academy/
├── backend/            # Express API (Node.js, MongoDB)
│   ├── src/
│   ├── .env.example    # Приклад налаштувань для середовища
│   └── ...
├── frontend/           # Next.js App (React 19, App Router, TailwindCSS)
│   ├── src/
│   ├── .env.example    # Приклад налаштувань для середовища
│   └── ...
└── README.md           # (Цей файл)

```

## ⚡️ Основні можливості

- 🎬 **Відеобібліотека** — колекція топових освітніх відео для дизайнерів
- 📚 **Курси** — структуровані курси з практичними завданнями
- 🔎 **Пошук і фільтри** — швидкий пошук та підбір по категоріях, інструментах і тегах
- 🇺🇦 **Все українською** — адаптація та переклад найкращого світового контенту
- 💎 **Преміум-доступ** - ексклюзивні матеріали для підписників
- 🏆 **Збереження прогресу** — обране, історія переглядів, персональні рекомендації
- 🦾 **Інтеграція з AI** - автоматичний переклад та рекомендовані відео
- 📲 **Адаптивність** - платформа доступна з будь-якого пристрою

---

## 🚀 Швидкий старт

> Перед запуском переконайся, що в тебе встановлено [Node.js](https://nodejs.org/), [Yarn](https://yarnpkg.com/), [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (або локальна Mongo).

## 🌱 Змінні середовища

- Для запуску проєкту потрібен файл `.env` із змінними середовища.
- Приклад заповнення шукай у `.env.example` в кожній папці (`frontend/`, `backend/`).
- Вкажи свої ключі API, шляхи до БД, та інші налаштування.

### 1. Клонування репозиторію

```bash
git clone https://github.com/Aleks-corp/dsgn-academy.git
cd dsgn-academy
```

### 2. Налаштуй змінні середовища

- Скопіюй `.env.example` у `.env` у папках `frontend/` і `backend/`
- Заповни відповідні значення (MongoDB URI, токени GPT, API URL і т.д.)

### 3. Запусти бекенд

```bash
cd backend
yarn
yarn dev
```

### 4. Запусти фронтенд

```bash
cd frontend
yarn
yarn dev
```

- Фронт буде на http://localhost:3000
- API — на http://localhost:3030

## ⚙️ Основні технології

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4
- Redux Toolkit + Persist
- Express.js 5
- MongoDB + Mongoose
- OpenAI GPT-4 API (автоматичний переклад)
- TypeScript
- ESLint + Prettier

## 🛠️ Для розробників

- Зручна типізація й модульна структура
- Швидке розгортання на Render, Vercel, Railway
- Мінімум залежностей, максимум ефективності
- Просте налаштування під будь-яке середовище

## 🌐 Деплой

Можна розгортати на:

- Render.com
- Vercel
- Railway
- Або будь-який сервер із Node.js

### Для Render:

- Вкажи `frontend/` або `backend/` як root directory відповідно до сервісу
- Build commands:
  - **Фронт:**
    - Build Command: `yarn && yarn build`
    - Start Command: `yarn start`
  - **Бек:**
    - Build Command: `yarn && yarn build`
    - Start Command: `yarn start`

[⬆️ Повернутись до початку](#start)
