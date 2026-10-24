
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay(value = expression || "0") {
  display.value = value;
}

function add(value) {
  if (finished) {
    if ("+-*/".includes(value)) {
      finished = false;
    } else {
      expression = "";
      finished = false;
    }
  }

  if ("+-*/".includes(value)) {
    if (!expression) {
      if (value !== "-") return;
    } else if (/[+\-*/.]$/.test(expression)) {
      expression = expression.slice(0, -1);
    }
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/]/).pop();

    if (currentNumber.includes(".")) return;

    if (!currentNumber) {
      expression += "0";
    }
  }

  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  finished = false;
  updateDisplay("0");
}

function removeLast() {
  if (finished) {
    clearAll();
    return;
  }

  expression = expression.slice(0, -1);
  updateDisplay();
}

// Parse basic arithmetic without evaluating arbitrary JavaScript.
function calculateExpression(input) {
  const tokens = input.match(
    /(?:\d+\.?\d*|\.\d+)|[+\-*/]/g
  );

  if (!tokens || tokens.join("") !== input) {
    throw new Error("Invalid expression");
  }

  let position = 0;

  function parseNumber() {
    let sign = 1;

    if (tokens[position] === "-") {
      sign = -1;
      position++;
    } else if (tokens[position] === "+") {
      position++;
    }

    const token = tokens[position];

    if (!token || !/^(?:\d+\.?\d*|\.\d+)$/.test(token)) {
      throw new Error("Invalid expression");
    }

    position++;

    return sign * Number(token);
  }

  function parseTerm() {
    let value = parseNumber();

    while (
      tokens[position] === "*" ||
      tokens[position] === "/"
    ) {
      const operator = tokens[position++];
      const right = parseNumber();

      if (operator === "/" && right === 0) {
        throw new Error("Cannot divide by zero");
      }

      value = operator === "*" ? value * right : value / right;
    }

    return value;
  }

  function parseExpression() {
    let value = parseTerm();

    while (
      tokens[position] === "+" ||
      tokens[position] === "-"
    ) {
      const operator = tokens[position++];
      const right = parseTerm();

      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  const result = parseExpression();

  if (position !== tokens.length || !Number.isFinite(result)) {
    throw new Error("Invalid expression");
  }

  return result;
}

function calculate() {
  if (!expression || /[+\-*/.]$/.test(expression)) {
    return;
  }

  try {
    const result = calculateExpression(expression);

    expression = String(Number(result.toPrecision(12)));
    finished = true;
    updateDisplay();
  } catch (error) {
    display.value = error.message === "Cannot divide by zero"
      ? "Cannot divide by zero"
      : "Invalid expression";

    expression = "";
    finished = true;
  }
}

buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.action === "clear") {
    clearAll();
  } else if (button.dataset.action === "delete") {
    removeLast();
  } else if (button.dataset.action === "calculate") {
    calculate();
  } else if (button.dataset.value !== undefined) {
    add(button.dataset.value);
  }
});
