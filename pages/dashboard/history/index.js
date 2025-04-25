import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function History() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Test History</h1>
      <p className="text-gray-600">View your past test attempts and track your progress over time.</p>
    </div>
  );
}

// Set the dashboard layout for this page
History.getLayout = (page) => getDashboardLayout(page, 'Test History');