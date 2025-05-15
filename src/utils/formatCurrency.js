export const formatCurrency = (amount) => {
  if (isNaN(amount)) {
    return 'Invalid number';
  }

  return amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};


export const formatCurrencyUs = (amount, currency = 'USD') => {
  if (isNaN(amount)) {
    return '';
  }

  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
};
