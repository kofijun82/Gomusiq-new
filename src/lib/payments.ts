import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { logger } from './logger';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

export const createPaymentIntent = async (amount: number): Promise<PaymentIntent> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Failed to create payment intent', error as Error);
    throw new Error('Failed to create payment intent');
  }
};

export const processPayment = async (
  clientSecret: string,
  paymentMethod: { id: string }
): Promise<void> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id
    });

    if (error) throw error;
    logger.info('Payment processed successfully');
  } catch (error) {
    logger.error('Payment failed', error as Error);
    throw new Error('Payment failed');
  }
};

export const createSubscription = async (priceId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: { priceId }
    });

    if (error) throw error;
    return data.subscriptionId;
  } catch (error) {
    logger.error('Failed to create subscription', error as Error);
    throw new Error('Failed to create subscription');
  }
};

export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    });

    if (error) throw error;
    logger.info('Subscription cancelled successfully');
  } catch (error) {
    logger.error('Failed to cancel subscription', error as Error);
    throw new Error('Failed to cancel subscription');
  }
};

export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-payment-methods');
    if (error) throw error;
    return data.paymentMethods;
  } catch (error) {
    logger.error('Failed to get payment methods', error as Error);
    throw new Error('Failed to get payment methods');
  }
};

export const addPaymentMethod = async (paymentMethodId: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('add-payment-method', {
      body: { paymentMethodId }
    });

    if (error) throw error;
    logger.info('Payment method added successfully');
  } catch (error) {
    logger.error('Failed to add payment method', error as Error);
    throw new Error('Failed to add payment method');
  }
};

export const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('remove-payment-method', {
      body: { paymentMethodId }
    });

    if (error) throw error;
    logger.info('Payment method removed successfully');
  } catch (error) {
    logger.error('Failed to remove payment method', error as Error);
    throw new Error('Failed to remove payment method');
  }
};