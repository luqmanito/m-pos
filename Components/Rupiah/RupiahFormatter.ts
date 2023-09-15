export const formatPrice = (value: string): number | null => {
  const numericValue = value.replace(/[^\d]/g, '');
  return numericValue ? Number(numericValue) : null;
};
