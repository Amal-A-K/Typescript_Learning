(function(){
    
const feedbackForm = document.getElementById('feedbackForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const outputDiv = document.getElementById('output');

// Helper function to show error messages
function showError(input: HTMLElement, message: string) {
    const formControl = input.parentElement;
    const errorElement = formControl?.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        formControl?.classList.add('error');
    }
}

// Helper function to clear error messages
function clearError(input: HTMLElement) {
    const formControl = input.parentElement;
    const errorElement = formControl?.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
        formControl?.classList.remove('error');
    }
}

// Validation functions
function validateName(name: string): boolean {
    if (!name.trim()) {
        showError(nameInput as HTMLElement, 'Name is required');
        return false;
    }
    clearError(nameInput as HTMLElement);
    return true;
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
        showError(emailInput as HTMLElement, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(emailInput as HTMLElement, 'Please enter a valid email');
        return false;
    }
    
    clearError(emailInput as HTMLElement);
    return true;
}

function validateMessage(message: string): boolean {
    if (!message.trim()) {
        showError(messageInput as HTMLElement, 'Message is required');
        return false;
    }
    
    if (message.trim().length < 10) {
        showError(messageInput as HTMLElement, 'Message should be at least 10 characters');
        return false;
    }
    
    clearError(messageInput as HTMLElement);
    return true;
}

if (feedbackForm && nameInput && emailInput && messageInput && outputDiv) {
    feedbackForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        const nameValue = (nameInput as HTMLInputElement).value;
        const emailValue = (emailInput as HTMLInputElement).value;
        const messageValue = (messageInput as HTMLTextAreaElement).value;

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
            
            (feedbackForm as HTMLFormElement).reset();
        }
    });

    // Add input event listeners for real-time validation
    nameInput.addEventListener('input', () => {
        validateName((nameInput as HTMLInputElement).value);
    });

    emailInput.addEventListener('input', () => {
        validateEmail((emailInput as HTMLInputElement).value);
    });

    messageInput.addEventListener('input', () => {
        validateMessage((messageInput as HTMLTextAreaElement).value);
    });
} else {
    console.error('One or more form elements are missing from the page');
}
})();