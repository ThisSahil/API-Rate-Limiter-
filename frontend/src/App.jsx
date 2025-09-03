import ApiKeys from "./components/ApiKeys";
import BlockedIPs from "./components/BlockedIPs";
import LiveMonitoring from "./components/LiveMonitoring";
import UsageAnalytics from "./components/UsageAnalytics";
import UsageCharts from "./components/UsageCharts";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003A74] text-white p-4 shadow">
        <h1 className="text-xl font-bold text-center">
          API Rate Limiter Dashboard
        </h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="grid gap-6">
          <ApiKeys />
          <UsageAnalytics />
          <UsageCharts />
          <BlockedIPs />
          <LiveMonitoring />
        </div>
      </main>
    </div>
  );
}
