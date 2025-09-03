import { useEffect, useState } from "react";
import api from "../api";

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [appName, setAppName] = useState("");

  const fetchKeys = async () => {
    try {
      const res = await api.get("/keys");
      setKeys(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createKey = async () => {
    if (!appName) return;
    try {
      await api.post("/keys", { app_name: appName });
      setAppName("");
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteKey = async (id) => {
    try {
      await api.delete(`/keys/${id}`);
      fetchKeys();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#003A74] mb-4">
        API Key Management
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter App Name"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
        <button
          onClick={createKey}
          className="bg-[#003A74] hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">App Name</th>
              <th className="p-2 border">Key</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {keys.length > 0 ? (
              keys.map((key) => (
                <tr key={key._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{key.app_name}</td>
                  <td className="p-2 border font-mono text-xs text-gray-600">
                    {key.key_value}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => deleteKey(key._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="3">
                  No API keys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApiKeys;
