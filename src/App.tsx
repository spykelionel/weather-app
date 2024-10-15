import {
  AlertTriangle,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  localtime: string;
}

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherCurrent {
  temp_c: number;
  feelslike_c: number;
  humidity: number;
  wind_kph: number;
  condition: WeatherCondition;
}

interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

const DEFAULT_WEATHER: WeatherData = {
  location: {
    name: "Bamenda",
    region: "Nord-Ouest",
    country: "Cameroon",
    localtime: "2024-10-15 10:26",
  },
  current: {
    temp_c: 21.1,
    feelslike_c: 21.2,
    humidity: 67,
    wind_kph: 3.6,
    condition: {
      text: "Patchy rain nearby",
      icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
      code: 1063,
    },
  },
};

const WeatherComponent: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${lat},${lon}&aqi=no`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: WeatherData = await response.json();
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(
        "Failed to fetch current weather data. Showing default information."
      );
      setWeather(DEFAULT_WEATHER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setError(
            "Failed to get your location. Showing default location data."
          );
          setWeather(DEFAULT_WEATHER);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const WeatherIcon: React.FC<{ condition: string; className?: string }> = ({
    condition,
    className,
  }) => {
    const iconProps = { className, size: 64, strokeWidth: 1.5 };
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun {...iconProps} />;
      case "partly cloudy":
      case "cloudy":
      case "overcast":
        return <Cloud {...iconProps} />;
      case "patchy rain nearby":
      case "light rain":
      case "moderate rain":
      case "heavy rain":
        return <CloudRain {...iconProps} />;
      case "snow":
      case "light snow":
      case "heavy snow":
        return <CloudSnow {...iconProps} />;
      case "thundery outbreaks possible":
      case "thunderstorm":
        return <CloudLightning {...iconProps} />;
      default:
        return <Cloud {...iconProps} />;
    }
  };

  const renderContent = () => (
    <>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold">{weather.location.name}</h2>
          <p className="text-lg">
            {weather.location.region}, {weather.location.country}
          </p>
          <p className="text-sm">{weather.location.localtime}</p>
        </div>
        <WeatherIcon
          condition={weather.current.condition.text}
          className="text-yellow-300"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-6xl font-bold">
          {Math.round(weather.current.temp_c)}°C
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end">
            <Thermometer size={20} className="mr-1" />
            <span>Feels like {Math.round(weather.current.feelslike_c)}°C</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <Droplets size={20} className="mr-1 text-blue-200" />
          <span>Humidity: {weather.current.humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind size={20} className="mr-1 text-blue-200" />
          <span>Wind: {Math.round(weather.current.wind_kph)} km/h</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-yellow-300 text-sm flex items-center">
          <AlertTriangle size={16} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
    </>
  );

  return (
    <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mr-3"></div>
          <span>Loading weather data...</span>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default WeatherComponent;
