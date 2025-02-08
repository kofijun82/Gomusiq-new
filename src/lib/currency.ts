import { logger } from './logger';

export const formatPrice = (price: number, locale?: string) => {
  try {
    // Get user's locale or fallback to 'en-US'
    const userLocale = locale || navigator.language || 'en-US';
    
    // Get currency based on locale
    const currency = new Intl.NumberFormat(userLocale, { 
      style: 'currency', 
      currency: getCurrencyFromLocale(userLocale),
    });

    return currency.format(price);
  } catch (error) {
    logger.error('Failed to format price', error as Error);
    // Fallback to USD
    return `$${price.toFixed(2)}`;
  }
};

const getCurrencyFromLocale = (locale: string): string => {
  // First check if user is in Ghana based on locale
  if (locale.startsWith('ak') || // Akan
      locale.startsWith('ee') || // Ewe
      locale.startsWith('ga') || // Ga
      locale.includes('-GH') ||  // Any language in Ghana
      locale === 'en-GH') {     // English (Ghana)
    return 'GHS';
  }

  // Map common locales to their default currencies
  const localeCurrencyMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-CA': 'CAD',
    'en-AU': 'AUD',
    'en-NZ': 'NZD',
    'ja-JP': 'JPY',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'it-IT': 'EUR',
    'es-ES': 'EUR',
    'zh-CN': 'CNY',
    'ko-KR': 'KRW',
    'ru-RU': 'RUB',
    'pt-BR': 'BRL',
    'hi-IN': 'INR',
    'en-GH': 'GHS', // Add explicit mapping for English (Ghana)
  };

  // Try to match the full locale first
  if (localeCurrencyMap[locale]) {
    return localeCurrencyMap[locale];
  }

  // Try to match just the language part
  const language = locale.split('-')[0];
  const languageMatch = Object.keys(localeCurrencyMap).find(key => key.startsWith(language + '-'));
  if (languageMatch) {
    return localeCurrencyMap[languageMatch];
  }

  // Try to get currency from browser's geolocation
  if ('geolocation' in navigator) {
    // This is async, but we can't make this function async
    // so we'll default to USD and update the UI later if needed
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
        );
        const data = await response.json();
        if (data.countryCode === 'GH') {
          // We're in Ghana, but since we can't return asynchronously,
          // the UI will need to be updated separately
          logger.info('User location detected as Ghana');
          // You could emit an event or use a callback here
        }
      } catch (error) {
        logger.error('Failed to get user location', error as Error);
      }
    });
  }

  // Default to USD if no match found
  return 'USD';
};

// Add a function to convert prices to GHS
export const convertToGHS = (usdPrice: number): number => {
  // As of 2024, 1 USD ≈ 12.35 GHS (you should use a real exchange rate API in production)
  const exchangeRate = 12.35;
  return usdPrice * exchangeRate;
};

// Function to detect if user is in Ghana
export const isInGhana = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code === 'GH';
  } catch (error) {
    logger.error('Failed to detect country', error as Error);
    return false;
  }
};