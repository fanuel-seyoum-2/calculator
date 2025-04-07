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
	const bt = document.querySelector("#point");
	bt.classList.toggle("deactivated");
}

function handleInput(kpress, dispVs, opVars) {
	const btClass = kpress.getAttribute("class");
	const btTxt = kpress.textContent; 

	let [curOp, fullOp, output] = dispVs;
	let [op1, operator, op2] = opVars;

	switch (btClass) {
		case "number":
			if (btTxt === ".") {
				deactivated = true;
				toggleActivation();
			}
			curOp.textContent += btTxt;	

			if (output.textContent.trim() && fullOp.textContent.trim()) {
				if (operator === "=") {
					fullOp.textContent = curOp.textContent + " ";
				}
				else
					fullOp.textContent = output.textContent + " " + operator + " " + curOp.textContent;
			}
			else {
				fullOp.textContent += btTxt;
			}
			break;
		case "operator":
			[op1, operator, op2] = opVars;
			if (deactivated) 
				toggleActivation();

			if (op1) {
				op2 = output.textContent.trim() || op1; 
			}

			op1 = storeAndClear(curOp);
			fullOp.textContent += " " + op1 + " ";

			if (op1 && op2) {
				let res = operate(+op2, operator, +op1);
				output.textContent = res;
			}

			if (op2) {	
				if (operator === "=") {
					fullOp.textContent = op2 + " " + btTxt + " " + op1;
					if (btTxt === "=") {
						fullOp.textContent = op1 || op2;
					}
				}
				else 
					fullOp.textContent = op2 + " " + operator + " " + op1;
			}
			else if (op1 || curOp.textContent.trim()) {
				fullOp.textContent = op1 + " " + btTxt; 
				if (btTxt === "=")
					fullOp.textContent = op1;
			}
			operator = btTxt;
			opVars = [op1, operator, op2];
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
