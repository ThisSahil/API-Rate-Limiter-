import { useEffect, useState } from "react";
import api from "../api";

const LiveMonitoring = () => {
  const [apiKey, setApiKey] = useState("");
  const [limits, setLimits] = useState(null);
  const [health, setHealth] = useState(null);

  const fetchData = async () => {
    if (apiKey) {
      try {
        const res = await api.get(`/limits/${apiKey}`);
        setLimits(res.data);
      } catch (err) {
        console.error("Limits error:", err);
        setLimits(null);
      }
    }

    try {
      const res = await api.get("/health");
      setHealth(res.data);
    } catch (err) {
      console.error("Health error:", err);
      setHealth(null);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiKey]);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#003A74] mb-4">
        Live Monitoring
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
      </div>

      {limits && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Minute Usage</p>
            <p className="text-xl font-bold">{limits.minute_usage}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Daily Usage</p>
            <p className="text-xl font-bold">{limits.daily_usage}</p>
          </div>
        </div>
      )}

      {health && (
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`rounded-lg p-4 text-center ${
              health.server === "up" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="text-sm text-gray-600">Server</p>
            <p className="text-xl font-bold">{health.server.toUpperCase()}</p>
          </div>
          <div
            className={`rounded-lg p-4 text-center ${
              health.mongo === "up" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="text-sm text-gray-600">MongoDB</p>
            <p className="text-xl font-bold">{health.mongo.toUpperCase()}</p>
          </div>
          <div
            className={`rounded-lg p-4 text-center ${
              health.redis === "up" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p className="text-sm text-gray-600">Redis</p>
            <p className="text-xl font-bold">{health.redis.toUpperCase()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMonitoring;
