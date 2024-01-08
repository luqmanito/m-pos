import {format} from 'date-fns';
import id from 'date-fns/locale/id';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Agt',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const today = new Date();
const day = today.getDate();
const month = months[today.getMonth()];
const year = today.getFullYear();

const formattedDate = `${day} ${month} ${year}`;
export default formattedDate;

const currentDate = new Date(); // Get the current date
export const todayBahasa = format(currentDate, 'EEEE, dd MMM yyyy', {
  locale: id,
});

const yearDate = today.getFullYear();
const monthDate = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
const dayDate = String(today.getDate()).padStart(2, '0');

// Create the yyyy-mm-dd formatted date string
export const dates = `${yearDate}-${monthDate}-${dayDate}`;
