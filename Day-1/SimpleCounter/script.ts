const counterDisplay = document.getElementById('counter');
const incrementButton = document.getElementById('incrementBtn');
const decrementButton = document.getElementById('decrementBtn');

let count: number = 0;

function updateCounter(value: number): void {
    if (counterDisplay) {
        counterDisplay.textContent = value.toString();
    }
}

function incrementCounter(): void {
    count++;
    updateCounter(count);
}

function decrementCounter(): void {
    count--;
    updateCounter(count);
}

if (incrementButton) {
    incrementButton.addEventListener('click', incrementCounter);
} else {
    console.error('Increment button not found');
}

if (decrementButton) {
    decrementButton.addEventListener('click', decrementCounter);
} else {
    console.error('Decrement button not found');
}

updateCounter(count);