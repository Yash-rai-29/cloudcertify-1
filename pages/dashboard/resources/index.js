import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function Resources() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Resources</h1>
      <p className="text-gray-600">Access study materials, guides, and documentation for Google Cloud certifications.</p>
    </div>
  );
}

// Set the dashboard layout for this page
Resources.getLayout = (page) => getDashboardLayout(page, 'Resources');