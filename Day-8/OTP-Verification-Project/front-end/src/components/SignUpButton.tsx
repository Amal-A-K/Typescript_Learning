import React, { useEffect } from 'react';

// Extend Window interface to include phoneEmailSignUpListener
declare global {
  interface Window {
    phoneEmailSignUpListener?: (userObj: UserObj) => void;
  }
}

interface UserObj {
  user_json_url: string;
}

const SignUpButton: React.FC = () => {
  useEffect(() => {
    // Load the external script
    const script = document.createElement('script');
    script.src = "https://www.phone.email/sign_up_button_v1.js";
    script.async = true;

    const buttonContainer = document.querySelector('.pe_signup_button');
    if (buttonContainer) {
      buttonContainer.appendChild(script);
    }

    // Define the listener function for sign-up
    window.phoneEmailSignUpListener = function (userObj: UserObj) {
      const { user_json_url } = userObj;
      const debugMessage = `
        Phone Verification Successful!<br />
        User JSON URL: ${user_json_url}<br />
        (Remove this debug message in production)
      `;

      const buttonContainer = document.querySelector('.pe_signup_button');
      if (buttonContainer) {
        buttonContainer.insertAdjacentHTML('beforeend', `<div>${debugMessage}</div>`);
      }

      // Send user_json_url to your backend for further processing
      console.log('User data URL:', user_json_url);
    };

    // Cleanup
    return () => {
      window.phoneEmailSignUpListener = undefined;
    };
  }, []);

  return (
    <div
      className="pe_signup_button"
      data-client-id="15695407177920574360" // Replace with your actual client ID
    ></div>
  );
};

export default SignUpButton;