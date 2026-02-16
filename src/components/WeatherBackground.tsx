import { useEffect, useState } from "react";
import "./WeatherBackground.css";

interface WeatherState {
  scene: string;
  condition: string;
  temp: number;
  isDay: boolean;
}

/* ---------- helpers for randomized elements ---------- */
const randomBetween = (a: number, b: number) =>
  Math.random() * (b - a) + a;

const makeStars = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${randomBetween(2, 55)}%`,
    left: `${randomBetween(2, 98)}%`,
    size: randomBetween(1, 2.8),
    delay: `${randomBetween(0, 6)}s`,
    duration: `${randomBetween(3, 8)}s`,
  }));

const makeRaindrops = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(-5, 105)}%`,
    delay: `${randomBetween(0, 2.5)}s`,
    duration: `${randomBetween(0.4, 0.9)}s`,
    opacity: randomBetween(0.2, 0.6),
  }));

const makeSnowflakes = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(0, 100)}%`,
    size: randomBetween(3, 9),
    delay: `${randomBetween(0, 10)}s`,
    duration: `${randomBetween(6, 14)}s`,
    opacity: randomBetween(0.4, 1),
  }));

/* pre-generate once so elements stay consistent between renders */
const STARS = makeStars(25);
const RAINDROPS = makeRaindrops(60);
const SNOWFLAKES = makeSnowflakes(40);

/* ---------- map scene -> CSS modifier classes ---------- */
function sceneToClasses(scene: string): string {
  const s = scene.toLowerCase();
  const classes: string[] = [];

  // time of day
  if (s.includes("night")) classes.push("night");
  else classes.push("day");

  // condition
  if (s.includes("storm") || s.includes("thunder"))
    classes.push("stormy");
  else if (
    s.includes("snow") ||
    s.includes("sleet") ||
    s.includes("blizzard")
  )
    classes.push("snowy");
  else if (s.includes("fog") || s.includes("mist") || s.includes("haze"))
    classes.push("foggy");
  else if (s.includes("rain") || s.includes("drizzle"))
    classes.push("rainy");
  else if (s.includes("overcast")) classes.push("cloudy");
  else if (s.includes("cloudy"))
    classes.push(s.includes("partly") ? "partly-cloudy" : "cloudy");
  else if (s.includes("clear") || s.includes("sunny"))
    classes.push("clear");
  else classes.push("default");

  return classes.join(" ");
}

/* ======================================================
   Component — layered cinematic sky
   ====================================================== */
export default function WeatherBackground() {
  const [state, setState] = useState<WeatherState>({
    scene: "",
    condition: "",
    temp: 20,
    isDay: true,
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d) setState(d);
    };
    window.addEventListener("weather-update", handler);
    return () => window.removeEventListener("weather-update", handler);
  }, []);

  const cls = state.scene
    ? sceneToClasses(state.scene)
    : "day clear default";

  return (
    <div className={`weather-bg ${cls}`}>
      {/* 1. Horizon warm glow */}
      <div className="horizon-glow" />

      {/* 2. Atmospheric haze */}
      <div className="haze-layer" />

      {/* 3. Sun rays (conic gradient rotated by CSS) */}
      <div className="sun-rays" />

      {/* 4. Sun/Moon glow */}
      <div className="glow" />

      {/* 5. Stars */}
      <div className="stars-layer">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      {/* 6. Realistic multi-span clouds */}
      <div className="clouds-layer">
        <div className="realistic-cloud rc-1">
          <span /><span /><span /><span />
        </div>
        <div className="realistic-cloud rc-2">
          <span /><span /><span /><span />
        </div>
        <div className="realistic-cloud rc-3">
          <span /><span /><span /><span /><span />
        </div>
        <div className="realistic-cloud rc-4">
          <span /><span /><span />
        </div>
        <div className="realistic-cloud rc-5">
          <span /><span /><span /><span />
        </div>
        <div className="realistic-cloud rc-6">
          <span /><span /><span /><span /><span />
        </div>
      </div>

      {/* 7. Rain */}
      <div className="rain-layer">
        {RAINDROPS.map((r) => (
          <div
            key={r.id}
            className="raindrop"
            style={{
              left: r.left,
              animationDelay: r.delay,
              animationDuration: r.duration,
              opacity: r.opacity,
            }}
          />
        ))}
      </div>

      {/* 8. Snow */}
      <div className="snow-layer">
        {SNOWFLAKES.map((f) => (
          <div
            key={f.id}
            className="snowflake"
            style={{
              left: f.left,
              width: f.size,
              height: f.size,
              animationDelay: f.delay,
              animationDuration: f.duration,
              opacity: f.opacity,
            }}
          />
        ))}
      </div>

      {/* 9. Fog bands */}
      <div className="fog-layer">
        <div className="fog-band fb-1" />
        <div className="fog-band fb-2" />
        <div className="fog-band fb-3" />
      </div>

      {/* 10. Lightning flash overlay */}
      <div className="lightning-overlay" />
    </div>
  );
}
