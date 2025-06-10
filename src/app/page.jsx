import FeedWeightChart from "./components/FeedWeightChart";
import EatingChart from "./components/EatingChart";
import FeedSchedule from "./components/FeedSchedule";
import CountdownTimer from "./components/CountdownTimer";
import ManualFeed from "./components/ButtonFeed";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 p-4">
    <header className="bg-[#0547b0] text-white p-4 text-center text-2xl font-bold rounded">
      AutoCatFeeder
    </header>{" "}
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
      <FeedWeightChart />
      {/* <EatingChart /> */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <FeedSchedule />
      <CountdownTimer />
      <ManualFeed />
    </div>
  </div>
  );
}
