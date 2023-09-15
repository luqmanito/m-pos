import RupiahFormatter from '../Components/Rupiah/Rupiah';

describe('RupiahFormatter', () => {
  test('should return an empty string when the value is undefined', () => {
    const value = undefined;
    const formattedNumber = RupiahFormatter(value);
    expect(formattedNumber).toBe('');
  });

  test('should return the value as a string when the value is a number', () => {
    const value = 10000;
    const formattedNumber = RupiahFormatter(value);
    const output = 'Rp 10.000';
    expect(formattedNumber).toBe(output);
  });

  test('should return the value as a string when the value is a string', () => {
    const value = '10000';
    const formattedNumber = RupiahFormatter(value);
    expect(formattedNumber).toBe('Rp 10.000');
  });
});
