var counterDisplay = document.getElementById('counter');
var incrementButton = document.getElementById('incrementBtn');
var decrementButton = document.getElementById('decrementBtn');
var count = 0;
function updateCounter(value) {
    if (counterDisplay) {
        counterDisplay.textContent = value.toString();
    }
}
function incrementCounter() {
    count++;
    updateCounter(count);
}
function decrementCounter() {
    count--;
    updateCounter(count);
}
if (incrementButton) {
    incrementButton.addEventListener('click', incrementCounter);
}
else {
    console.error('Increment button not found');
}
if (decrementButton) {
    decrementButton.addEventListener('click', decrementCounter);
}
else {
    console.error('Decrement button not found');
}
updateCounter(count);
