"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  ArrowLeft,
  Check,
  Zap,
  Shield,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

interface Subscription {
  id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  plan: {
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
  };
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  description: string;
}

const BillingPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
    fetchPlans();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/payments/subscription', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/payments/plans', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        // Fallback to default plans if API fails
        setPlans([
          {
            id: 'starter',
            name: 'Starter',
            price: 0,
            interval: 'month',
            description: 'Perfect for individual developers',
            features: [
              '5 repositories',
              'Basic vulnerability scanning',
              'Email notifications',
              'Community support'
            ]
          },
          {
            id: 'pro',
            name: 'Professional',
            price: 29,
            interval: 'month',
            description: 'For growing teams and projects',
            popular: true,
            features: [
              'Unlimited repositories',
              'Advanced vulnerability scanning',
              'AI-powered analysis',
              'Priority support',
              'Custom integrations',
              'Detailed reporting'
            ]
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            interval: 'month',
            description: 'For large organizations',
            features: [
              'Everything in Professional',
              'SSO integration',
              'Advanced compliance reporting',
              'Dedicated support',
              'Custom deployment options',
              'SLA guarantee'
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    setProcessingPlan(planId);
    
    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/payments/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan_id: planId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        }
      } else {
        alert('Failed to start subscription process. Please try again.');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const cancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      const response = await fetch('https://backend.vibesec.app/api/v2/payments/cancel', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Subscription cancelled successfully. You will retain access until the end of your billing period.');
        fetchSubscription();
      } else {
        alert('Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Billing & Subscription</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Subscription */}
        {subscription && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900 mr-3">{subscription.plan.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    ${subscription.plan.price}/{subscription.plan.interval}
                  </p>
                  <p className="text-sm text-gray-500">
                    Current period: {new Date(subscription.current_period_start).toLocaleDateString()} - {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                  {subscription.cancel_at_period_end && (
                    <div className="flex items-center mt-2 text-yellow-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Subscription will cancel at the end of the billing period</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {!subscription.cancel_at_period_end && (
                    <button
                      onClick={cancelSubscription}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600">Select the perfect plan for your security scanning needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg border-2 ${
                  plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.interval}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => subscribeToPlan(plan.id)}
                    disabled={processingPlan === plan.id || (subscription?.plan.name === plan.name)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      subscription?.plan.name === plan.name
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {processingPlan === plan.id ? (
                      'Processing...'
                    ) : subscription?.plan.name === plan.name ? (
                      'Current Plan'
                    ) : plan.price === 0 ? (
                      'Get Started Free'
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <div className="mt-12 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                <p className="text-gray-600">Manage your payment methods and billing details through our secure payment portal.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Billing History</h3>
                <p className="text-gray-600">View and download your invoices and payment history.</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <a
                href="https://backend.vibesec.app/api/v2/payments/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </a>
            </div>
          </div>
        </div>
      </main>
      </div>
    </AppLayout>
  );
};

export default BillingPage;
