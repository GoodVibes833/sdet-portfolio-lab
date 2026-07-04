"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";

interface Props {
  city: string;
}

const cityCoords: Record<string, { lat: number; lon: number }> = {
  toronto: { lat: 43.6532, lon: -79.3832 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  montreal: { lat: 45.5017, lon: -73.5673 },
  ottawa: { lat: 45.4215, lon: -75.6972 },
  calgary: { lat: 51.0447, lon: -114.0719 },
  edmonton: { lat: 53.5461, lon: -113.4938 },
  victoria: { lat: 48.4284, lon: -123.3656 },
  winnipeg: { lat: 49.8951, lon: -97.1384 },
};

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
}

export default function WeatherWidget({ city }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const coords = cityCoords[city.toLowerCase()];
    if (!coords) return;

    setLoading(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
    )
      .then((r) => r.json())
      .then((data) => {
        const code = data.current_weather?.weathercode ?? 0;
        const temp = data.current_weather?.temperature ?? 0;
        setWeather({
          temp: Math.round(temp),
          description: getWeatherDesc(code),
          icon: getWeatherIcon(code),
          city: city,
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setLoading(false));
  }, [city]);

  if (loading) return <div className="text-xs text-slate-400">날씨 로딩...</div>;
  if (!weather) return null;

  return (
    <div className="flex items-center gap-2 bg-blue-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm">
      <span className="text-lg">{weather.icon}</span>
      <div>
        <div className="font-bold text-slate-700 dark:text-slate-200">{weather.temp}°C</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{weather.description}</div>
      </div>
    </div>
  );
}

function getWeatherDesc(code: number): string {
  if (code === 0) return "맑음";
  if (code <= 3) return "흐림";
  if (code <= 48) return "안개";
  if (code <= 67) return "비";
  if (code <= 77) return "눈";
  if (code <= 82) return "소나기";
  if (code <= 86) return "눈보라";
  if (code <= 99) return "천둥번개";
  return "알 수 없음";
}

function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}
