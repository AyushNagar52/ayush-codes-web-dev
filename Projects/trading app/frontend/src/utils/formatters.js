/**
 * Format currency to USD standard format ($1,234.56)
 */
export const formatCurrency = (value, showDecimals = true) => {
  if (value === undefined || value === null || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format percentage (+2.45% / -1.12%)
 */
export const formatPercent = (value, includeSign = true) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Format date string into human-readable format
 */
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (includeTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
