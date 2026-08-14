import { SupportedCurrency, CurrencyConfig } from '../types';

export const CURRENCY_LIST: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar', rateAgainstUSD: 1 },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro', rateAgainstUSD: 0.92 },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound', rateAgainstUSD: 0.79 },
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee', rateAgainstUSD: 83.5 },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen', rateAgainstUSD: 155 },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar', rateAgainstUSD: 1.52 },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$) - Canadian Dollar', rateAgainstUSD: 1.37 },
  { code: 'AED', symbol: 'AED ', label: 'AED (د.إ) - UAE Dirham', rateAgainstUSD: 3.67 },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$) - Singapore Dollar', rateAgainstUSD: 1.35 },
  { code: 'CHF', symbol: 'Fr ', label: 'CHF (Fr) - Swiss Franc', rateAgainstUSD: 0.90 },
];

export const CURRENCIES = CURRENCY_LIST;

export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return '$';
  const found = CURRENCY_LIST.find((c) => c.code.toUpperCase() === currencyCode.toUpperCase());
  if (found) return found.symbol;
  if (currencyCode.toUpperCase() === 'INR') return '₹';
  if (currencyCode.toUpperCase() === 'EUR') return '€';
  if (currencyCode.toUpperCase() === 'GBP') return '£';
  if (currencyCode.toUpperCase() === 'JPY') return '¥';
  return currencyCode + ' ';
}

export function formatPrice(amount: number | string, currencyCode?: string): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(numeric)) return String(amount || '0');

  const symbol = getCurrencySymbol(currencyCode);
  const formattedNumber = new Intl.NumberFormat(currencyCode === 'INR' ? 'en-IN' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(numeric);

  return `${symbol}${formattedNumber}`;
}

export const formatCurrency = formatPrice;
