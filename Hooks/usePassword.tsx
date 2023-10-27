import {useState} from 'react';

const usePassword = () => {
  const [strongPassword, setStrongPassword] = useState(false);

  function isStrongPassword(input: string): void {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (passwordPattern.test(input) === true) {
      setStrongPassword(true);
    } else {
      setStrongPassword(false);
    }
  }
  return {strongPassword, isStrongPassword, setStrongPassword};
};

export default usePassword;
