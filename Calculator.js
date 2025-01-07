document.addEventListener("DOMContentLoaded", function () {
  let display = document.getElementById("display");
  let calculation = document.getElementById("calculation");
  let currentInput = "";
  let expression = "";
  let resultDisplayed = false;
  let lastOperator = "";
  let lastOperand = "";

  window.displayNumber = function (number) {
    highlightButton(number);
    if (resultDisplayed) {
      currentInput = number;
      resultDisplayed = false;
      calculation.textContent = "";
    } else {
      currentInput += number;
    }
    expression += number;
    display.value = expression;
  };

  window.performOperation = function (op) {
    highlightButton(op);
    if (resultDisplayed) {
      resultDisplayed = false;
      calculation.textContent = "";
    }
    if (currentInput !== "") {
      expression += " " + op + " ";
      currentInput = "";
      display.value = expression;
    }
  };

  window.calculateResult = function () {
    highlightButton("=");
    try {
      if (resultDisplayed && lastOperator && lastOperand) {
        // Réutilise le dernier opérateur et opérande
        expression = expression + " " + lastOperator + " " + lastOperand;
      } else if (!resultDisplayed) {
        // Sauvegarde le dernier opérateur et opérande
        const parts = expression.split(" ");
        if (parts.length >= 3) {
          lastOperator = parts[parts.length - 2];
          lastOperand = parts[parts.length - 1];
        }
      }

      const result = eval(expression.replace(/,/g, "."));
      calculation.textContent = expression + " =";
      display.value = result;
      expression = result.toString();
      resultDisplayed = true;
    } catch (error) {
      display.value = "Error";
      expression = "";
      lastOperator = "";
      lastOperand = "";
      resultDisplayed = true;
    }
  };

  window.clearDisplay = function () {
    highlightButton("C");
    display.value = "";
    calculation.textContent = "";
    currentInput = "";
    expression = "";
    resultDisplayed = false;
    lastOperator = "";
    lastOperand = "";
  };

  document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (!isNaN(key)) {
      displayNumber(key);
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      performOperation(key);
    } else if (key === "Enter" || key === "=") {
      calculateResult();
    } else if (
      key === "Escape" ||
      key === "C" ||
      key === "c" ||
      key === "Delete"
    ) {
      clearDisplay();
    } else if (key === "," || key === ".") {
      displayNumber(",");
    } else if (key === "Backspace") {
      backspace();
    }
  });

  function backspace() {
    if (expression.length > 0) {
      expression = expression.slice(0, -1);
      display.value = expression;
    }
  }

  function highlightButton(key) {
    const button = Array.from(document.querySelectorAll("button")).find(
      (btn) =>
        btn.textContent === key || (key === "Enter" && btn.textContent === "=")
    );
    if (button) {
      button.classList.add("highlight");
      setTimeout(() => {
        button.classList.remove("highlight");
      }, 200);
    }
  }
});
