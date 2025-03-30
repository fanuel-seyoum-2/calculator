function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) {
	if (b === 0) {
		alert("Attempting to divide by Zero");
		console.error("DivisionByZero");
		return "Infinity"
	}
	return (a / b).toFixed(5);
}
function percent(a) { return a / 100; }
function negate (a) { return a * -1; }

function operate(op1, operator, op2) {
	switch (operator) {
		case "+":
			return add(op1, op2);
		case "-": 
			return subtract(op1, op2);
		case "*": 
			return multiply(op1, op2);
		case "/": 
			return divide(op1, op2);
	}
}

function createButtons(objArr) {
	for (let objIt of objArr) {
		let parNm = `${objIt.parentDiv}`
		let parDiv = document.querySelector(`.${parNm}`);
		for (let child of objIt.children) {
			let bt = document.createElement("button");
			bt.textContent = `${child}`.toUpperCase();
			bt.setAttribute("id", opId[child] || parNm.slice(0,3) + "-" + child);
			bt.setAttribute("class", parNm.slice(0, parNm.length - 1));
			parDiv.appendChild(bt);
		}
	}
}

// Button Objects
let numObj = {
	parentDiv: "numbers",
	children: [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, '.'],
};
let utilObj = {
	parentDiv: "utils",
	children: ["ac", "del", "%", "+/-"],
};
let opObj = {
	parentDiv: "operators",
	children: ["+", "-", "*", "/", "="],
};
// ids
let opId = {
	".": "point",
	"+/-": "negate",
	"+": "plus",
	"-": "minus",
	"*": "times",
	"/": "over",
	"=": "equals",
}

let objArr = [numObj, utilObj, opObj];
createButtons(objArr);
