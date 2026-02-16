import { useCallback, useEffect, useState } from "react";
import { fetchCities } from "../services/api";
import type { City } from "../services/api";
import { addSearchHistory } from "../services/history";

const WEATHER_API_KEY = "31d063ce9c564d9d831133455230512";

function getWeatherScene(
  condition: string,
  temp: number,
  isDay: boolean
): string {
  const c = condition.toLowerCase();
  const dn = isDay ? "day" : "night";

  if (c.includes("thunder") || c.includes("storm")) return `stormy-${dn}`;
  if (c.includes("snow") || c.includes("sleet") || c.includes("blizzard"))
    return `snowy-${dn}`;
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower"))
    return `rainy-${dn}`;
  if (c.includes("fog") || c.includes("mist") || c.includes("haze"))
    return `foggy-${dn}`;
  if (c.includes("overcast") || c.includes("cloudy")) return `cloudy-${dn}`;
  if (c.includes("partly")) return `partly-cloudy-${dn}`;

  // Clear sky — vary by temperature
  if (!isDay) return "clear-night";
  if (temp <= 10) return "clear-day-cold";
  if (temp >= 33) return "clear-day-hot";
  return "clear-day";
}

interface Weather {
  city: string;
  country: string;
  temperature: number;
  description: string;
  windKph: number;
  iconUrl: string;
  humidity: number;
  feelsLike: number;
}

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityEn, setSelectedCityEn] = useState<string>("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clean up scene attribute on unmount
  useEffect(() => {
    return () => {
      document.body.removeAttribute("data-scene");
    };
  }, []);

  useEffect(() => {
    setLoadingCities(true);
    fetchCities()
      .then((data) => {
        const validCities = data
          .filter(
            (city) =>
              city.city_name_he?.trim() && city.city_name_en?.trim()
          )
          .sort((a, b) => a.city_name_he.localeCompare(b.city_name_he, "he"));
        setCities(validCities);
      })
      .catch((err) => {
        console.error("Cities fetch error", err);
        setError("Could not load cities list. Please refresh the page.");
      })
      .finally(() => setLoadingCities(false));
  }, []);

  const fetchWeather = useCallback(
    async (cityEn: string) => {
      if (!cityEn) {
        setWeather(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const trimmedCity = cityEn.trim();
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${trimmedCity}`
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        const iconUrl = data?.current?.condition?.icon
          ? data.current.condition.icon.startsWith("//")
            ? `https:${data.current.condition.icon}`
            : data.current.condition.icon
          : "";

        const nextWeather: Weather = {
          city: data.location.name,
          country: data.location.country,
          temperature: data.current.temp_c,
          description: data.current.condition.text,
          windKph: data.current.wind_kph,
          iconUrl,
          humidity: data.current.humidity,
          feelsLike: data.current.feelslike_c,
        };

        setWeather(nextWeather);

        // Compute the scene and apply it
        const isDay = data.current.is_day === 1;
        const scene = getWeatherScene(
          data.current.condition.text,
          data.current.temp_c,
          isDay
        );
        document.body.setAttribute("data-scene", scene);

        // Notify background component
        window.dispatchEvent(
          new CustomEvent("weather-update", {
            detail: {
              scene,
              condition: data.current.condition.text,
              temp: data.current.temp_c,
              isDay,
            },
          })
        );

        const matchedCity = cities.find((c) => c.city_name_en === cityEn);
        addSearchHistory({
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          city: matchedCity?.city_name_he || cityEn,
          country: data.location.country,
        });
      } catch (err) {
        setError("Could not load weather data. Please try again.");
        console.error("Weather fetch error", err);
      } finally {
        setLoading(false);
      }
    },
    [cities]
  );

  const handleCityChange = (value: string) => {
    setSelectedCityEn(value);
    fetchWeather(value);
  };

  return (
    <section className="page">
      <div className="page-title">
        <h2>Home</h2>
        <p>Select a city to view its current weather.</p>
      </div>

      <div className="card">
        <label className="field-label" htmlFor="city-select">
          Choose a city
        </label>
        <select
          id="city-select"
          value={selectedCityEn}
          onChange={(event) => handleCityChange(event.target.value)}
          disabled={loading || loadingCities}
        >
          <option value="">
            {loadingCities ? "Loading cities..." : "Select a city..."}
          </option>
          {cities.map((city) => (
            <option key={city.city_name_en.trim()} value={city.city_name_en.trim()}>
              {city.city_name_he.trim()}
            </option>
          ))}
        </select>

        {loading && <div className="loading">⏳ Loading weather...</div>}
        {error && <div className="error">{error}</div>}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-main">
              <div>
                <h3>{weather.city}</h3>
                <p className="country">{weather.country}</p>
              </div>
              {weather.iconUrl && (
                <img
                  className="weather-icon"
                  src={weather.iconUrl}
                  alt={weather.description}
                />
              )}
            </div>
            <div className="temp">{weather.temperature}°C</div>
            <div className="condition">{weather.description}</div>
            <div className="weather-details">
              <div className="detail-box">
                <span className="detail-label">💨 Wind</span>
                <span className="detail-value">{weather.windKph} kph</span>
              </div>
              <div className="detail-box">
                <span className="detail-label">💧 Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-box">
                <span className="detail-label">🌡️ Feels Like</span>
                <span className="detail-value">{weather.feelsLike}°C</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
