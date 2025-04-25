import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GCP Certification Dashboard</h1>
      <p className="mb-6">Welcome to your personalized Google Cloud certification dashboard.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-3">Dashboard Content</h2>
        <p>We're currently optimizing the dashboard for better performance.</p>
        <p className="mt-2 text-blue-700">More features coming soon!</p>
      </div>
    </div>
  );
}

// Basic page layout implementation
Dashboard.getLayout = (page) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white p-4 border-b shadow-sm">
      <h1 className="text-xl font-semibold">Cloud Certify</h1>
    </header>
    <main className="p-4">
      {page}
    </main>
  </div>
);