import { useEffect, useState } from "react";
import api from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // green for allowed, red for blocked

const UsageCharts = () => {
  const [apiKey, setApiKey] = useState("");
  const [usage, setUsage] = useState(null);
  const [violations, setViolations] = useState([]);

  const fetchData = async () => {
    if (!apiKey) return;

    try {
      // usage summary
      const usageRes = await api.get(`/usage/${apiKey}`);
      setUsage(usageRes.data);

      // violations list
      const vioRes = await api.get("/violations");
      setViolations(vioRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (apiKey) fetchData();
  }, [apiKey]);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#003A74] mb-4">
        Usage Charts
      </h2>

      {/* API Key Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
        <button
          onClick={fetchData}
          className="bg-[#003A74] hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          Load Charts
        </button>
      </div>

      {/* Pie Chart for Allowed vs Blocked */}
      {usage && (
        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Allowed vs Blocked</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: "Allowed", value: usage.allowed_requests },
                  { name: "Blocked", value: usage.blocked_requests },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart for Violations (by endpoint) */}
      {violations.length > 0 && (
        <div>
          <h3 className="text-md font-medium mb-2">Violations by Endpoint</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={violations.map((v) => ({
                endpoint: v.endpoint,
                blocked: 1,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="endpoint" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="blocked" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default UsageCharts;
