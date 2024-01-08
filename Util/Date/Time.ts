export function getCurrentDateTime(): string {
  const now = new Date();

  // Get the individual components of the date and time
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of the year
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month (0-based index)
  const day = now.getDate().toString().padStart(2, '0'); // Day of the month
  const hours = now.getHours().toString().padStart(2, '0'); // Hours (24-hour format)
  const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes

  // Format the date and time as a string
  const formattedDateTime = `${year}-${month}-${day} ${hours}.${minutes} WIB`;

  return formattedDateTime;
}
