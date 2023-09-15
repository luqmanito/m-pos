import {useEffect, useState} from 'react';

export function useGenerateInvoiceNumber() {
  const [invoiceNumber, setInvoiceNumber] = useState('');

  useEffect(() => {
    function generateInvoiceNumber() {
      // Get the current date and time
      const now = new Date();

      // Extract date components
      const year = now.getFullYear().toString().slice(-2); // Get the last two digits of the year
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month starts from 0
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      // Generate a random 3-digit number
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');

      // Combine date and time components into an invoice number
      const generatedInvoiceNumber = `${year}${month}${day}${hours}${minutes}${seconds}${random}`;

      setInvoiceNumber(generatedInvoiceNumber);
    }

    generateInvoiceNumber(); // Initial generation
  }, []);

  return invoiceNumber;
}
