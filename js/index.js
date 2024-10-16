/* ------------------- FUNCTIONS ------------------- */
Object.defineProperty(String.prototype, "capitalize", {
	value: function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	},
	enumerable: false,
});
/* ------------------- ------------------- ------------------- */

/* ------------------- HANDLE INPUT 4-DIGIT PIN ------------------- */

const inputsPin = document.querySelectorAll("#input-pin .input");

inputsPin.forEach((input, index) => {
	input.dataset.index = index;
	input.addEventListener("keyup", handlePin);
});

function handlePin(event) {
	const input = event.target;
	let value = input.value;
	input.value = "";
	input.value = value ? value[0] : "";

	let fieldIndex = input.dataset.index;
	if (value.length > 0 && fieldIndex < inputsPin.length - 1) {
		input.nextElementSibling.focus();
	}
	if (event.key === "Backspace" && fieldIndex > 0) {
		input.previousElementSibling.focus();
	}
}
/* ------------------- ------------------- ------------------- */

/* ------------------- USER LOGIN ------------------- */
const loginBtn = document.getElementById("login-btn");
const loginForm = document.getElementById("login-access");

loginBtn.addEventListener("click", (e) => {
	e.preventDefault();
});
/* ------------------- ------------------- ------------------- */
