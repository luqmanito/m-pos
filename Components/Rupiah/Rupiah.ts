const RupiahFormatter = (value: number | string | null): string => {
  if (!value) {
    return '';
  } else {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    const formattedNumber = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numberValue);
    return formattedNumber;
  }
};

export default RupiahFormatter;
