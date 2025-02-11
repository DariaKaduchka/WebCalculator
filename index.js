// @ts-check

    // Wait for the DOM to load before attaching events
    document.addEventListener('DOMContentLoaded', () => {
      const display = document.querySelector('.display');
      const numberButtons = document.querySelectorAll('button.number');
      const operatorButtons = document.querySelectorAll('button.operator');
      const functionButtons = document.querySelectorAll('button.function');

      let currentOperand = '';
      let previousOperand = '';
      let operation = null;

      // Updates the display with the current operand (or "0" if empty)
      function updateDisplay() {
        display.value = currentOperand || '0';
        // Count only digit characters (ignoring commas, minus signs, etc.)
        const digitCount = (currentOperand.match(/\d/g) || []).length;
        if (digitCount > 7) {
          display.classList.add('small');
        } else {
          display.classList.remove('small');
        }
      }


      function appendNumber(number) {
        // Allow only one comma.
        if (number === ',' && currentOperand.includes(',')) return;
        
        // Prevent more than one comma (decimal separator)
        if (number === ',' && currentOperand.includes(',')) return;

        // Count only digit characters already in the operand.
        const digitCount = (currentOperand.match(/\d/g) || []).length;
        // Only check if the pressed button is a digit (not a comma)
        if (number !== ',' && digitCount >= 7) {
          alert("Maximum 7 digits reached");
          return;
        }
        
        // If currentOperand is "0", replace it; otherwise, append.
        currentOperand = currentOperand === '0' ? number : currentOperand + number;
      }
      // Sets the current operator and moves currentOperand to previousOperand
      function chooseOperation(op) {
        if (currentOperand === '') return;
        // If an operation is already pending, compute first
        if (previousOperand !== '') {
          compute();
        }
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
      }

      // Computes the result of the current operation
      function compute() {
        let result;
        // Convert comma to period for JavaScript parsing
        const prev = parseFloat(previousOperand.replace(',', '.'));
        const current = parseFloat(currentOperand.replace(',', '.'));
        if (isNaN(prev) || isNaN(current)) return;
        switch (operation) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '×':
            result = prev * current;
            break;
          case '÷':
            // Avoid division by zero
            result = current === 0 ? 'Error' : prev / current;
            break;
          default:
            return;
        }
        // Convert result back to string with a comma as decimal separator
        currentOperand = result.toString().replace('.', ',');
        operation = null;
        previousOperand = '';
      }

      // Event listeners for number buttons (digits and comma)
      numberButtons.forEach(button => {
        button.addEventListener('click', () => {
          appendNumber(button.textContent);
          updateDisplay();
        });
      });

      // Event listeners for operator buttons (+, -, ×, ÷, and =)
      operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
          if (button.textContent === '=') {
            compute();
            updateDisplay();
          } else {
            chooseOperation(button.textContent);
          }
        });
      });

      // Event listeners for function buttons (AC, +/-, %)
      functionButtons.forEach(button => {
        button.addEventListener('click', () => {
          const action = button.textContent;
          if (action === 'AC') {
            // Clear all entries
            currentOperand = '';
            previousOperand = '';
            operation = null;
            updateDisplay();
          } else if (action === '+/-') {
            // Toggle the sign of the current operand
            if (currentOperand !== '') {
              if (currentOperand.startsWith('-')) {
                currentOperand = currentOperand.slice(1);
              } else {
                currentOperand = '-' + currentOperand;
              }
              updateDisplay();
            }
          } else if (action === '%') {
            // Convert the current operand to a percentage (divide by 100)
            if (currentOperand !== '') {
              const value = parseFloat(currentOperand.replace(',', '.'));
              currentOperand = (value / 100).toString().replace('.', ',');
              updateDisplay();
            }
          }
        });
      });
    });


