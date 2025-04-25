import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';

export default function Chat() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">AI Chatbot</h1>
      <p className="text-gray-600">Get instant help with your GCP certification questions.</p>
    </div>
  );
}

// Set the dashboard layout for this page
Chat.getLayout = (page) => getDashboardLayout(page, 'AI Chatbot');