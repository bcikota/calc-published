        //Your calculator is going to contain functions for all of the basic math
        // operators you typically find on simple calculators, 
        //so start by creating functions for the following items and testing them in your browser’s console.
        let num1;
        let num2;
        function add(num1, num2){
            return num1 + num2;
        }

        function subtract(num1, num2){
            return num1 - num2;
        }

        function multiply(num1, num2){
            return num1 * num2;
        }

        function divide(num1, num2){
            return num1 / num2;
        }
     
        
        //Create a new function "operate" that takes an operator and 2 numbers 
        //and then calls one of the above functions on the numbers.
        let operator;

        function operate(num1, operator, num2) {
            switch(operator) {
                case '+' :
                    return add(num1, num2);
                    break;
                case '-' :
                    return subtract(num1, num2);
                    break;
                case '*':
                    return multiply(num1, num2);
                    break;
                default:
                    return divide(num1, num2);
            }
        }

        
        //Create the functions that populate the display when you click the number buttons…
        // you should be storing the ‘display value’ in a variable somewhere for use in the next step.
        let numBtn = document.querySelectorAll('.numBtn');
        let display = document.querySelector('#display');
        let str;
        let arr;
        let newArr = [];
        let operatorIndex;
        let num;
        let numOfOperators;
        let numOfMultiplicationDivision;
        let multiplicationDivision = [];
        let multiplicationDivisionIndex;
        let additionSubtraction = [];
        let decimalTrueFalse = false;
        let operatorTrueFalse = false;
        let displayArr;

        

        //listening number buttons
        numBtn.forEach(btn => {
            btn.addEventListener('click', function(){
                if(decimalTrueFalse === true) {
                    decimalBtn.disabled = 'true';
                } else {
                    decimalBtn.disabled = false;
                }

                if(display.textContent === '0'){
                    display.textContent = '';
                }
                display.textContent += btn.textContent;
            });
        });

        //listening operatorBtn
        let operatorBtn = document.querySelectorAll('.operatorBtn');
        operatorBtn.forEach(btn => {
            btn.addEventListener('click', function(){
                
                display.textContent += btn.textContent;
                displayArr = display.textContent;
                displayArr = displayArr.split('');
                decimalTrueFalse = false;
                let secondLast = displayArr[displayArr.length-2];
                let last = displayArr[displayArr.length-1];
                if((secondLast === '+' || secondLast === '-' || secondLast === '*' || secondLast === '/') && (last === '+' || last === '-' || last === '*' || last === '/')) {
                    displayArr.splice(displayArr.length-2,1);
                    displayArr = displayArr.join('');
                    display.textContent = displayArr;
                }
            });
            
        });
    
        //Disable the decimal button if there’s already one in the display
        let decimalBtn = document.querySelector('#decimalBtn');
        decimalBtn.addEventListener('click', function(){
            decimalTrueFalse = true;
            let decCounter = 0;
            decCounter++;
            if(decCounter > 0) {
                    decimalBtn.disabled = 'true';
                } else {
                    decimalBtn.disabled = false;
                }
            display.textContent += decimalBtn.textContent;
            
        });

         // Add a “backspace” button, so the user can undo if they click the wrong number
         let backspace = document.querySelector('#c');
        function backspaceFunction(){
            let displayStr;
            displayStr = display.textContent;
            displayArr = displayStr.split('');
            displayArr.pop();
            display.textContent = displayArr.join('');
        }
        backspace.addEventListener('click', backspaceFunction);


        //Operate() on them when the user presses the “=” key

        //result function
        function result(){
            str = display.textContent;
            arr = str.split("");
            if(arr[0] === '-'){
                arr.unshift(0);
            }

            if(arr[arr.length-1] === '+' || arr[arr.length-1] === '-' || arr[arr.length-1] === '*' || arr[arr.length-1] === '/') {
                arr.pop();
            }
           
           //make numbers from arr elements [2,5,+,2,5] = 25z
           //loop through arr, find operators
           numOfOperators = arr.filter(element => element === '+' || element === '-' || element === '*' || element === '/');
           for(let i = 0; i < numOfOperators.length; i++) {
            operatorIndex = arr.findIndex(element => element === '+' || element === '-' || element === '*' || element === '/');
            num = arr.slice(0,operatorIndex);
            num = num.join('');
            num = parseFloat(num);
            newArr.push(num)
            operator = arr[operatorIndex];
            newArr.push(operator);
            arr = arr.slice(operatorIndex+1);
           }
           arr = arr.join('');
           arr = parseFloat(arr);
           newArr.push(arr);

           //operations precedence

           let error = false;
           
            //loop through newArr, find Multiplication,Division points, operate() on them and send them back to newArr
            //for Addition/Subtraction
            numOfMultiplicationDivision = newArr.filter(item => item === '*' || item === '/');
            for(let i = 0; i < numOfMultiplicationDivision.length; i++) {
                multiplicationDivisionIndex = newArr.findIndex(item => item === '*' || item === '/');
                multiplicationDivision.push(newArr[multiplicationDivisionIndex-1]);
                multiplicationDivision.push(newArr[multiplicationDivisionIndex]);
                multiplicationDivision.push(newArr[multiplicationDivisionIndex+1]);
                 //Display a snarky error message if the user tries to divide by 0
                 
                 if(newArr[multiplicationDivisionIndex] === '/' && newArr[multiplicationDivisionIndex+1] === 0){
                    error = true;
                 } else {
                    newArr[multiplicationDivisionIndex-1] = operate(newArr[multiplicationDivisionIndex-1], newArr[multiplicationDivisionIndex],newArr[multiplicationDivisionIndex+1]);
                    newArr.splice(multiplicationDivisionIndex, 2);
                 }
            }
           
           if(error === false) {
            

            additionSubtraction = newArr.filter(item => item === '+' || item === '-');
     
            //loop through newArr, find additionSubtraction points,
            // ( operate() on first three elements, return result to first position) * additionSubtraction.length
            for (let i = 0; i< additionSubtraction.length && newArr.length>2; i++) {
                num1 = newArr[0];
                operator = newArr[1];
                num2 = newArr[2];
                newArr.shift(num1);
                newArr.shift(operator);
                newArr.shift(num2);
                let result;
                result = operate(num1, operator, num2);
                newArr.unshift(result);
            }

            //round answers with long decimals so that they don’t overflow the screen
            function round(number, places) {
                number = parseFloat(number, 10);
                var e  = parseInt(places || 2, 10);
                var m = Math.pow(10, e);
                return Math.floor(number * m) / m;
            }

            
            display.textContent = round(newArr[0], 3);
            newArr = [];
           } else {
               display.textContent = 'Error'
           }
            
           
        } 

        //listening result button
        let res = document.getElementById('res');
        res.addEventListener('click', result);

        
        // Add keyboard support
        document.addEventListener('keypress',function(evt){
            if(onOff.textContent === 'OFF') {
                evt = evt || window.event;
                let charCode = evt.keyCode || evt.which;
                let charStr = String.fromCharCode(charCode);
    
                //pressing number buttons
                if(charStr === '9' || charStr === '8' || charStr === '7' || charStr === '6' || charStr === '5' || charStr === '4' || charStr === '3' || charStr === '2' || charStr === '1' || charStr === '0') {
                    if(decimalTrueFalse === true) {
                        decimalBtn.disabled = 'true';
                    } else {
                        decimalBtn.disabled = false;
                    }
    
                    if(display.textContent === '0'){
                        display.textContent = '';
                    }
                    display.textContent += charStr;
                } else if(charStr === '+' || charStr === '-' || charStr === '*' || charStr === '/') {
                    //pressing operator buttons
                    display.textContent += charStr;
                    displayArr = display.textContent;
                    displayArr = displayArr.split('');
                    decimalTrueFalse = false;
                    let secondLast = displayArr[displayArr.length-2];
                    let last = displayArr[displayArr.length-1];
                    if((secondLast === '+' || secondLast === '-' || secondLast === '*' || secondLast === '/') && (last === '+' || last === '-' || last === '*' || last === '/')) {
                        displayArr.splice(displayArr.length-2,1);
                        displayArr = displayArr.join('');
                        display.textContent = displayArr;
                    }
                } else if (charStr === '.') {
                    //pressing decimal button
                    decimalBtn.click();
                } else if(charCode === 13) {
                    //pressing enter
                    result();
                }
            }
            
        });

        
        document.addEventListener('keydown',function(evt){
            if(onOff.textContent === 'OFF') {
                evt = evt || window.event;
                let charCode = evt.keyCode || evt.which;
                //pressing delete button
                if(charCode === 46) {
                    resetAll();
                } else if(charCode === 8) {
                    //pressing backspace button
                    backspaceFunction();
                }
            }
            
        });


        //Pressing “ac” should wipe out any existing data
        function resetAll(){
            num1 = '';
            num2 = '';
            operator = '';
            arr = [];
            num = '';
            newArr = [];
            display.textContent = '0';
            decimalTrueFalse = false;
        }
        let ac = document.querySelector('#ac');
        ac.addEventListener('click', resetAll);

        // on/off button
        let allBtn = document.querySelectorAll('.allBtn');
        allBtn.forEach(btn => {
            btn.disabled = 'true';
            btn.style.opacity = '0.6';
        });

        let onOff = document.querySelector('#onOff');
        onOff.addEventListener('click', function(){
            if (backspace.disabled === true) {
                onOff.textContent = 'OFF';
                display.textContent = '0';
                allBtn.forEach(btn => {
                    btn.disabled = false;
                    btn.style.opacity = '1';
                });
            } else {
                resetAll();
                display.textContent = '';
                onOff.textContent = 'ON';
                allBtn.forEach(btn => {
                    btn.disabled = 'true';
                    btn.style.opacity = '0.6';
                });
            }
        });