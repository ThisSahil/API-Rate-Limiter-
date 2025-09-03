import { useState } from "react";
import api from "../api";

const UsageAnalytics = () => {
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsage = async () => {
    if (!apiKey) return;
    try {
      setLoading(true);
      const res = await api.get(`/usage/${apiKey}`);
      setUsage(res.data);
    } catch (err) {
      console.error(err);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#003A74] mb-4">
        Usage Analytics
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
        <button
          onClick={fetchUsage}
          className="bg-[#003A74] hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          Check Usage
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {usage && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-xl font-bold">{usage.total_requests}</p>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Allowed</p>
            <p className="text-xl font-bold text-green-700">
              {usage.allowed_requests}
            </p>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Blocked</p>
            <p className="text-xl font-bold text-red-700">
              {usage.blocked_requests}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageAnalytics;
