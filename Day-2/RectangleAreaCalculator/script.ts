(function(){
    'use strict';
    const areaForm = document.getElementById('areaForm') as HTMLFormElement;
    const lengthInput = document.getElementById('length') as HTMLInputElement;
    const widthInput = document.getElementById('width') as HTMLInputElement;
    const outputDiv = document.getElementById('output') as HTMLDivElement;
    // Function to calculate the area of a rectangle
    const rectangleArea = (Length:number, Width:number):number=>{
        return Length * Width;
    }
    // Function to display the area of a rectangle
    const displayArea  = (Length:number,Width:number):void=>{
        const area =rectangleArea(Length,Width);
        outputDiv.textContent = `The area of the Rectangle with length ${Length} and width ${Width} is ${area} square units.`;
        outputDiv.style.display="block";
        outputDiv.style.color="blue";
        outputDiv.style.fontSize="20px"
    };
    areaForm.addEventListener('submit', (event: Event) =>{
        event.preventDefault();
        const length = parseFloat(lengthInput.value);
        const width =parseFloat(widthInput.value);
        if(isNaN(length)||isNaN(width)){
            outputDiv.textContent ="Please enter valid numbers for length and width.";
            outputDiv.style.display ="block";
            outputDiv.style.color ="red";
            outputDiv.style.fontSize ="20px";
        }else{
            displayArea(length,width);
            areaForm.reset();
            lengthInput.focus();
        }
    })
})();