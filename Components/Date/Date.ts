const formatDate = (timestamp: string | undefined): string => {
  if (!timestamp) {
    return ''; // Placeholder for undefined date
  }
  const date = new Date(timestamp);

  // Convert month number to month abbreviation
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agt',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];
  const monthAbbreviation = months[date.getMonth()];

  // Format the date and time
  const formattedDate = `${date.getDate()} ${monthAbbreviation} ${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;

  // Assuming "WIB" stands for "Western Indonesian Time" (UTC+7)
  const timezone = 'WIB';

  return `${formattedDate}, ${formattedTime} ${timezone}`;
};

export default formatDate;
