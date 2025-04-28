"use strict";
(function () {
    const feedbackForm = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const outputDiv = document.getElementById('output');
    // Helper function to show error messages
    function showError(input, message) {
        const formControl = input.parentElement;
        const errorElement = formControl === null || formControl === void 0 ? void 0 : formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            formControl === null || formControl === void 0 ? void 0 : formControl.classList.add('error');
        }
    }
    // Helper function to clear error messages
    function clearError(input) {
        const formControl = input.parentElement;
        const errorElement = formControl === null || formControl === void 0 ? void 0 : formControl.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            formControl === null || formControl === void 0 ? void 0 : formControl.classList.remove('error');
        }
    }
    // Validation functions
    function validateName(name) {
        if (!name.trim()) {
            showError(nameInput, 'Name is required');
            return false;
        }
        clearError(nameInput);
        return true;
    }
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            showError(emailInput, 'Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            showError(emailInput, 'Please enter a valid email');
            return false;
        }
        clearError(emailInput);
        return true;
    }
    function validateMessage(message) {
        if (!message.trim()) {
            showError(messageInput, 'Message is required');
            return false;
        }
        if (message.trim().length < 10) {
            showError(messageInput, 'Message should be at least 10 characters');
            return false;
        }
        clearError(messageInput);
        return true;
    }
    if (feedbackForm && nameInput && emailInput && messageInput && outputDiv) {
        feedbackForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nameValue = nameInput.value;
            const emailValue = emailInput.value;
            const messageValue = messageInput.value;
            // Validate all fields
            const isNameValid = validateName(nameValue);
            const isEmailValid = validateEmail(emailValue);
            const isMessageValid = validateMessage(messageValue);
            if (isNameValid && isEmailValid && isMessageValid) {
                console.log("Name: ", nameValue);
                console.log("Email: ", emailValue);
                console.log("Message: ", messageValue);
                outputDiv.textContent = `Thank you for your feedback, ${nameValue}!`;
                outputDiv.style.color = 'green';
                feedbackForm.reset();
            }
        });
        // Add input event listeners for real-time validation
        nameInput.addEventListener('input', () => {
            validateName(nameInput.value);
        });
        emailInput.addEventListener('input', () => {
            validateEmail(emailInput.value);
        });
        messageInput.addEventListener('input', () => {
            validateMessage(messageInput.value);
        });
    }
    else {
        console.error('One or more form elements are missing from the page');
    }
})();
