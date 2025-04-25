import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function Tests() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Test Library</h1>
      <p className="text-gray-600">Here you'll find all available practice tests for your Google Cloud certifications.</p>
    </div>
  );
}

// Set the dashboard layout for this page
Tests.getLayout = (page) => getDashboardLayout(page, 'Test Library');