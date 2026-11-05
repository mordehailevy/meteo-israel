# Weather Israel

A small React app to check the current weather in Israeli cities, with a search history page.

## Features

- **Home:** search a city and see its current weather
- **Search history:** the cities you looked up
- **About:** information about the project
- Animated background that follows the weather
- City list from the Israeli open-data portal (data.gov.il), weather from WeatherAPI

## Tech stack

React 19 · TypeScript · React Router · Vite · WeatherAPI · data.gov.il

## Getting started

```bash
git clone https://github.com/mordehailevy/meteo-israel.git
cd meteo-israel
npm install
cp .env.example .env   # add your free key from weatherapi.com
npm run dev
```

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Background

One of my first React projects, built at the start of the John Bryce Full Stack & AI program (Tel Aviv).

**Author:** [Mordehai Levy](https://github.com/mordehailevy) · [LinkedIn](https://www.linkedin.com/in/mordehailevy)
