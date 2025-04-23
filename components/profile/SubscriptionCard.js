import React from 'react';
import { FiCreditCard } from 'react-icons/fi';
import Button from '../ui/Button';
import { formatDate } from '../../utils/services/dashboardService';

/**
 * Subscription Card component for displaying user subscription details
 */
const SubscriptionCard = ({ subscription }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {subscription?.tier || 'Free'} Plan
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Status: {subscription?.isActive ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-blue-500 text-white p-2 rounded-full">
            <FiCreditCard size={20} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {subscription?.startDate && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Start Date</span>
            <span className="font-medium">{formatDate(subscription.startDate)}</span>
          </div>
        )}
        
        {subscription?.endDate && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Renewal Date</span>
            <span className="font-medium">{formatDate(subscription.endDate)}</span>
          </div>
        )}
        
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600">Auto-Renew</span>
          <span className="font-medium">{subscription?.autoRenew ? 'On' : 'Off'}</span>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="primary">
          Upgrade Subscription
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionCard;