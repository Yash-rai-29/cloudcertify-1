import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function Profile() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <p className="text-gray-600">Manage your account settings and certification goals.</p>
    </div>
  );
}

// Set the dashboard layout for this page
Profile.getLayout = (page) => getDashboardLayout(page, 'Profile');