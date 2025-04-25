import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function Leaderboard() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      <p className="text-gray-600">See how you rank against other GCP certification candidates.</p>
    </div>
  );
}

// Set the dashboard layout for this page
Leaderboard.getLayout = (page) => getDashboardLayout(page, 'Leaderboard');