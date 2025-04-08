// Arithmetic Operations
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
		case "+": return add(op1, op2);
		case "-": return subtract(op1, op2);
		case "*": return multiply(op1, op2);
		case "/": return divide(op1, op2);
	}
}

// Button Creation
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

function toggleActivation() {
	deactivated = !deactivated;
	const bt = document.querySelector("#point");
	bt.classList.toggle("deactivated");
}

function handleNumericInput(btTxt, dispVs, opVars) {
	let [curOp, fullOp, output] = dispVs;
	let [op1, operator, op2] = opVars;

	if (btTxt === ".") toggleActivation();
	curOp.textContent += btTxt;	

	if (operator && operator !== "=")
		fullOp.textContent += btTxt;
	else
		fullOp.textContent = curOp.textContent;
}
function handleOperator(btTxt, dispVs, opVars) {
	let [curOp, fullOp, output] = dispVs;
	let [op1, operator, op2] = opVars;

	if (deactivated) toggleActivation();

	// Operand Assignment
	if (op1) op2 = output.textContent.trim() || op1;
	op1 = storeAndClear(curOp);
	
	// FullOp Display
	if (op1 || operator !== btTxt) {
		const cstr = fullOp.textContent.trim();
		if (operator === "=") {
			fullOp.textContent = curOp.textContent || op1 || op2 + " ";
			if (btTxt !== operator)
				fullOp.textContent += btTxt + " ";
		}
		else if (operator !== "=" || btTxt !== "=") {
			if (cstr[cstr.length - 1] === operator) 
				fullOp.textContent = cstr.textContent.slice(0, cstr.length - 1);
			fullOp.textContent +=  " " + (btTxt) + " ";
		}
	}

	// Output Display
	if (op1 && op2) {
		let result = operate(+op2, operator, +op1);
		output.textContent = result;
	}
	
	// Operator Assignment
	operator = btTxt;
	return [op1, operator, op2]
}

function handleInput(kpress, dispVs, opVars) {
	const btClass = kpress.getAttribute("class");
	const btTxt = kpress.textContent; 

	switch (btClass) {
		case "number":
			handleNumericInput(btTxt, dispVs, opVars);
			break;
		case "operator":
			opVars = handleOperator(btTxt, dispVs, opVars);
			break;
		case "util":
			opVars = handleUtil(kpress, dispVs, opVars);
			break;
	}

	return opVars; 
}
function handleUtil(kpress, dispVs, opVars) {
	let [curOp, fullOp, output] = dispVs;

	const btTxt = kpress.textContent; 
	const str = curOp.textContent;
	const cstr = fullOp.textContent;

	switch (kpress.id) {
		case "uti-ac":
			window.location.reload();
			break;
		case "uti-del":
			if (curOp.textContent.trim()) {
				curOp.textContent = str.slice(0, str.length - 1);
				fullOp.textContent = cstr.slice(0, cstr.length - 1);
			}
			break;
		case "percent":
			if (curOp.textContent.trim()) {
				curOp.textContent = percent(+curOp.textContent);
				fullOp.textContent = cstr.slice(0, cstr.length - str.length) + curOp.textContent;
			}
			break;
		case "negate":
			if (curOp.textContent.trim()) {
				curOp.textContent = negate(+curOp.textContent);
				fullOp.textContent = cstr.slice(0, cstr.length - str.length) + curOp.textContent;
			}
			break;
	}
	return opVars;
}

function storeAndClear(divNm) {
	let val = divNm.textContent;
	divNm.textContent = null;
	return val;
}

// Keyboard Events
function simulateClick(kp, dispVs, opVars) {
	const validKeys = "9876543210+-*/=";
	if (validKeys.indexOf(`${kp}`) >= 0) {
		let id = opId[kp] || `num-${kp}` ;
		let kpress = document.querySelector(`#${id}`);
		return handleInput(kpress, dispVs, opVars);
	}
	else {
		switch (kp) {
			case "Enter":
				let ent = document.querySelector(`#equals`);
				return handleInput(ent, dispVs, opVars);
			case "Backspace":
				let bsp = document.querySelector("#uti-del");
				return handleInput(bsp, dispVs, opVars);	
		}
	}
	return opVars;
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
	"%": "percent",
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

let deactivated = false;

// Storage Variables
let opVars = ["", "", ""];

// Display divs
let curOp = document.querySelector(".cur-op");
let fullOp = document.querySelector(".op");
let output = document.querySelector(".output");

let dispDivs = [curOp, fullOp, output];

let kp = document.querySelector(".keypad");

kp.addEventListener("click", (e) => {
	let bt = e.target;
	opVars = handleInput(bt, dispDivs, opVars);
});
document.addEventListener("keydown", (e) => {
	opVars = simulateClick(e.key, dispDivs, opVars);
});
