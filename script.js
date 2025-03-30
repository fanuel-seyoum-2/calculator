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
	children: [9, 8, 7, 6, 5, 4, 3, 2, 1, "+/-", 0, '.'],
};
let utilObj = {
	parentDiv: "utils",
	children: ["ac", "del"],
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
