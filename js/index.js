/* ------------------- LOADER ------------------- */
let userLS = JSON.parse(localStorage.getItem("USER"));
window.addEventListener("load", () => {
	setTimeout(() => {
		document.getElementById("loader").setAttribute("data-status", "loaded");
		document.body.removeChild(document.getElementById("loader"));
		if (userLS !== null && userLS.remindMe === true) {
			let div = document.querySelector(".py-8");

			let currentDate = new Date();
			let currentDay = currentDate
				.toLocaleDateString("es-ES", { weekday: "long" })
				.toLowerCase();
			let currentTime =
				currentDate.getHours() + ":" + currentDate.getMinutes();
			let nextShiftInfo = getNextShift(
				userLS.workDays,
				currentDay,
				currentTime
			);
			console.log(nextShiftInfo);

			if (nextShiftInfo) {
				updateTimeRemaining(div, nextShiftInfo);
			}

			loginForm.removeChild(document.getElementById("name"));
			loginForm.removeChild(document.querySelector(".input-flex"));
			document.getElementById("legend").innerHTML = "";
		}
	}, 1500);
});

function getNextShift(workDays, currentDay, currentTime) {
	const daysOfWeek = [
		"domingo",
		"lunes",
		"martes",
		"miercoles",
		"jueves",
		"viernes",
		"sabado",
	];
	let currentDayIndex = daysOfWeek.indexOf(currentDay);

	for (let day in workDays) {
		let shiftHours = workDays[day];

		if (day === currentDay) {
			let startTime = shiftHours[0];
			let endTime = shiftHours[1];

			let startInMs = convertToMs(startTime);
			let endInMs = convertToMs(endTime);
			let currentInMs = convertToMs(currentTime);

			if (endInMs <= startInMs) {
				endInMs += 24 * 60 * 60 * 1000;
			}

			if (currentInMs < startInMs) {
				return {
					day: day,
					startTime: startTime,
					endTime: endTime,
					status: "beforeShift",
				};
			} else if (currentInMs >= startInMs && currentInMs < endInMs) {
				return {
					day: day,
					startTime: startTime,
					endTime: endTime,
					status: "duringShift",
				};
			}
		}
	}

	for (let i = 1; i <= 7; i++) {
		let nextDayIndex = (currentDayIndex + i) % 7;
		let nextDay = daysOfWeek[nextDayIndex];

		if (workDays[nextDay]) {
			let shiftHours = workDays[nextDay];
			return {
				day: nextDay,
				startTime: shiftHours[0],
				status: "beforeShift",
			};
		}
	}

	return null;
}
function convertToMs(time) {
	let [hours, minutes] = time.split(":").map(Number);
	return hours * 60 * 60 * 1000 + minutes * 60 * 1000;
}
function calculateTimeRemaining(currentDate, targetTime) {
	let [targetHour, targetMinute] = targetTime.split(":");
	let targetDate = new Date(currentDate);
	targetDate.setHours(targetHour, targetMinute, 0, 0);

	if (targetDate < currentDate) {
		targetDate.setDate(targetDate.getDate() + 1);
	}

	let timeDiff = targetDate - currentDate;
	let hours = Math.floor(timeDiff / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2,	"0")}:${String(seconds).padStart(2, "0")}`;
}
function updateTimeRemaining(div, nextShiftInfo) {
	setInterval(() => {
		let currentDate = new Date();
		let timeRemaining;

		if (nextShiftInfo.status === "beforeShift") {
			timeRemaining = calculateTimeRemaining(
				currentDate,
				nextShiftInfo.startTime
			);
			div.innerHTML = `
                <h1 class="title txt-center">¡Bienvenido/a, ${userLS.name}!</h1>
                <p class="txt-center pt-7">
                    Tu próximo turno comienza en...
                </p>
                <h2 class="title txt-center">${timeRemaining}</h2>`;
		} else if (nextShiftInfo.status === "duringShift") {
			timeRemaining = calculateTimeRemaining(
				currentDate,
				nextShiftInfo.endTime
			);
			div.innerHTML = `
                <h1 class="title txt-center">¡Bienvenido/a, ${userLS.name}!</h1>
                <p class="txt-center pt-7">
                    Para que termine tu turno faltan...
                </p>
                <h2 class="title txt-center">${timeRemaining}</h2>`;
		}
	}, 10);
}

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

/* ------------------- USER LOGIN AND REGISTER ------------------- */
const loginForm = document.getElementById("login-access");
const loginInput = document.getElementById("name");
const loginBtn = document.getElementById("login-btn");
const remindMe = document.getElementById("remind-me");
const errorMessage = document.getElementById("error-msg");

loginForm.addEventListener("submit", (e) => {
	let userName = loginInput.value.toLowerCase();
	let userPin = "";
	inputsPin.forEach((input) => {
		userPin += input.value;
	});

	if (loginBtn.getAttribute("data-button") === "login") {
		let userLS = JSON.parse(localStorage.getItem("USER"));
		if (userLS !== null && userLS.pin === userPin) {
			if (userLS.remindMe === true) {
				if (remindMe.checked === true) {
					userLS.remindMe = true;
					localStorage.setItem("USER", JSON.stringify(userLS));
				}
			} else {
				if (userLS.name === userName) {
					if (remindMe.checked === true) {
						userLS.remindMe = true;
						localStorage.setItem("USER", JSON.stringify(userLS));
					}
				}
			}
		} else {
			e.preventDefault();
			errorMessage.setAttribute("aria-hidden", false);
			loginInput.value = "";
			inputsPin.forEach((input) => {
				input.value = "";
			});
		}
	} else if (loginBtn.getAttribute("data-button") === "register") {
		let userLS = JSON.parse(localStorage.getItem("USER"));
		if (userLS === null) {
			let remind = false;
			if (remindMe.checked === true) {
				remind = true;
			}
			let user = {
				name: userName,
				pin: userPin,
				workDays: {},
				tables: {},
				goalOrders: 0,
				goalTips: 0,
				remindMe: remind,
			};
			localStorage.setItem("USER", JSON.stringify(user));
		} else if (
			userLS !== null &&
			userLS.name === userName &&
			userLS.pin === userPin
		) {
			e.preventDefault();
			errorMessage.setAttribute("aria-hidden", false);
			errorMessage.innerText = "Usuario existente";
			loginInput.value = "";
			inputsPin.forEach((input) => {
				input.value = "";
			});
		}
	}
});
/* ------------------- ------------------- ------------------- */

/* ------------------- CHANGE TO REGISTER FORM ------------------- */
const registerLink = document.getElementById("register-link");
const bottomLegend = document.getElementById("legend");

registerLink.addEventListener("click", (e) => {
	e.preventDefault();
	loginBtn.innerText = "Registrar";
	loginBtn.setAttribute("data-button", "register");
	bottomLegend.innerHTML =
		"¿Ya tenes una cuenta? <a href='index.html'>Inicia sesión acá</a>";
	loginForm.setAttribute("action", "./views/register.html");
});

/* ------------------- ------------------- ------------------- */
