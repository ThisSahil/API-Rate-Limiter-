import { useEffect, useState } from "react";
import api from "../api";

const BlockedIPs = () => {
  const [ips, setIps] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(60);

  const fetchBlockedIps = async () => {
    try {
      const res = await api.get("/blocked-ips");
      setIps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const blockIp = async () => {
    if (!ipAddress) return;
    try {
      await api.post("/block-ip", {
        ip_address: ipAddress,
        reason,
        duration_minutes: duration,
      });
      setIpAddress("");
      setReason("");
      setDuration(60);
      fetchBlockedIps();
    } catch (err) {
      console.error(err);
    }
  };

  const unblockIp = async (ip) => {
    try {
      await api.delete(`/block-ip/${ip}`);
      fetchBlockedIps();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlockedIps();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold text-[#003A74] mb-4">Blocked IPs</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input
          type="text"
          placeholder="IP Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
        <input
          type="text"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
        <input
          type="number"
          placeholder="Minutes"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#003A74] outline-none"
        />
      </div>
      <button
        onClick={blockIp}
        className="bg-[#003A74] hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
      >
        Block IP
      </button>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm border rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">IP Address</th>
              <th className="p-2 border">Blocked Until</th>
              <th className="p-2 border">Reason</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ips.length > 0 ? (
              ips.map((ip) => (
                <tr key={ip._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{ip.ip_address}</td>
                  <td className="p-2 border">
                    {new Date(ip.blocked_until).toLocaleString()}
                  </td>
                  <td className="p-2 border">{ip.reason || "-"}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => unblockIp(ip.ip_address)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan="4">
                  No blocked IPs
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockedIPs;
