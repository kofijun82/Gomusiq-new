import { logger } from './logger';

const PAYSTACK_PUBLIC_KEY = 'pk_test_f6b05f8187b360f763ac56859524b17f26189715';

interface PaystackConfig {
  email: string;
  amount: number;
  currency?: 'NGN' | 'GHS' | 'USD' | 'ZAR';
  ref?: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export const initializePaystack = () => {
  return new Promise<void>((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
};

export const processPayment = async ({
  email,
  amount,
  currency = 'GHS',
  callback,
  onClose
}: PaystackConfig) => {
  try {
    // Ensure Paystack is initialized
    await initializePaystack();

    if (!window.PaystackPop) {
      throw new Error('Paystack not initialized');
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: Math.round(amount * 100), // Convert to lowest currency unit and ensure integer
      currency,
      ref: `gomusiq_${Math.floor(Math.random() * 1000000000)}`,
      callback: (response: PaystackResponse) => {
        logger.info('Payment successful', { reference: response.reference });
        callback(response);
      },
      onClose: () => {
        logger.info('Payment window closed');
        onClose();
      },
    });
    
    handler.openIframe();
  } catch (error) {
    logger.error('Payment initialization failed', error as Error);
    throw new Error('Payment initialization failed');
  }
};