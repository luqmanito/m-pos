export const formatTime = (timestamp: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Jakarta', // Set your desired time zone here
  };

  const formattedTime: string = new Intl.DateTimeFormat(
    'en-US',
    options,
  ).format(new Date(timestamp));

  return formattedTime;
};
