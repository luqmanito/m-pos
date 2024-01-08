const currencyFormatter = (
  value: number | string | null | undefined,
  currencyCode: string = 'IDR',
): string => {
  if (!value) {
    return '';
  } else {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    const formattedNumber = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(numberValue);
    return formattedNumber;
  }
};

export default currencyFormatter;
