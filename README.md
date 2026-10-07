# ✈️ TripTastic — Explore More. Worry Less.

🚀 **Live Demo:** [https://arasadaanishkarthik.github.io/TripTastic/](https://arasadaanishkarthik.github.io/TripTastic/)

## 🏷️ Badges

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4-000000?logo=express&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?logo=leaflet&logoColor=white)

## 🌍 About the Project

**TripTastic** is a modern travel planning web application designed to make discovering and planning trips easier. It brings destination discovery, travel information, interactive maps, weather, currency conversion, and AI-powered itinerary generation into one platform. Users can provide their destination, dates, group information, budget, and travel preferences to create a personalized travel plan. The application is designed for travelers who want a simpler and more interactive way to organize their trips.

## ✨ Key Features

- 🤖 **AI-Powered Itinerary Generation** — Generate personalized travel itineraries using Google Gemini.
- 🧭 **Interactive Trip Planner** — Plan trips through a guided planning workflow.
- 📍 **Destination Discovery** — Search and discover travel destinations and places.
- 🗺️ **Interactive Maps** — Explore locations using Leaflet and OpenStreetMap-based data.
- 🌦️ **Weather Information** — Get weather information for destinations.
- 💱 **Currency Conversion** — View currency exchange information.
- 🏞️ **Tourist Attractions** — Discover real tourist places using location services.
- 👥 **Group Trip Planning** — Configure group size, travelers, budget, and preferences.
- 💬 **AI Travel Assistant** — Interact with AI about the generated itinerary.
- 🖼️ **Destination Images** — Display destination imagery with optional Pexels integration.
- 🌙 **Modern Responsive UI** — Responsive interface with modern animations and theme support.
- ⚡ **Fast Frontend** — Built with React and Vite for a fast development and production experience.

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **Vite 6**
- **JavaScript / JSX**
- **Tailwind CSS 4**
- **React Router DOM**
- **Framer Motion**
- **GSAP**
- **Lenis** — smooth scrolling
- **Lucide React** — icons
- **Leaflet**
- **React Leaflet**

### Backend

- **Node.js**
- **Express.js**
- **Google GenAI**
- **Helmet**
- **CORS**
- **dotenv**
- **Nodemon**

### External APIs & Services

| Service | Purpose |
|---|---|
| Google Gemini | AI itinerary generation and travel assistant |
| Geoapify | Tourist place discovery |
| OpenStreetMap / Nominatim | Location search and geocoding |
| Open-Meteo | Weather information |
| ExchangeRate-API | Currency conversion |
| Pexels | Optional destination images |

## 📁 Project Structure

```text
TripTastic/
│
├── backend/
│   ├── src/
│   │   ├── routes/          # Backend API routes
│   │   ├── services/        # AI and external API services
│   │   ├── middleware/      # Express middleware
│   │   ├── app.js           # Express application
│   │   └── server.js        # Backend entry point
│   │
│   ├── .env.example         # Backend environment template
│   └── package.json         # Backend dependencies and scripts
│
├── frontend/                # Frontend-related project files
│
├── public/                  # Public/static assets
│
├── src/
│   ├── assets/              # Application assets
│   ├── components/          # Reusable React components
│   ├── context/             # Application context/state
│   ├── data/                # Static application data
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Main application pages
│   ├── sections/            # Landing page sections
│   ├── services/            # Frontend API services
│   ├── App.jsx              # Main React application
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
│
├── .env.example             # Frontend environment template
├── eslint.config.js         # ESLint configuration
├── index.html               # Vite HTML entry point
├── package.json              # Frontend dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── postcss.config.js        # PostCSS configuration
├── render.yaml              # Render backend deployment configuration
├── tailwind.config.js       # Tailwind configuration
├── vite.config.mjs          # Vite configuration
└── README.md                # Project documentation
