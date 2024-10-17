const registerForm = document.getElementById("register-access");
const registerBtn = document.getElementById("register-btn");

let dayCount = 1;
document.getElementById("add-day").addEventListener("click", () => {
	dayCount++;
	if (dayCount <= 7) {
		let inputFlex = `
            <div class="input-flex" id="day-${dayCount}">
                <select class="input">
                    <option value="0" disabled selected>--</option>
                    <option value="lunes">Lunes</option>
                    <option value="martes">Martes</option>
                    <option value="miercoles">Miércoles</option>
                    <option value="jueves">Jueves</option>
                    <option value="viernes">Viernes</option>
                    <option value="sabado">Sábado</option>
                    <option value="domingo">Domingo</option>
                </select>
                <input type="time" class="input" />
                <input type="time" class="input" />
            </div>`;
		document
			.getElementById("workdays-container")
			.insertAdjacentHTML("beforeend", inputFlex);
	}
});

let tablesCount = 1;
document.getElementById("add-tables").addEventListener("click", () => {
	tablesCount++;
	let inputFlex = `
        <div class="input-flex" id="tables-${tablesCount}">
            <input type="text" class="input" placeholder="Primer piso" />
            <input type="text" class="input" placeholder="10, 11, 12, 13, 14,..." />
        </div>`;
	document
		.getElementById("tables-container")
		.insertAdjacentHTML("beforeend", inputFlex);
});

registerForm.addEventListener("submit", () => {
	let userLS = JSON.parse(localStorage.getItem("USER"));

	for (let index = 1; index <= dayCount; index++) {
		let dayInputs = document.getElementById(`day-${index}`);
		let day = dayInputs.firstElementChild;
		let hours = [];
		let inHour = day.nextElementSibling;
		let outHour = inHour.nextElementSibling;

		if (inHour.value !== "" && outHour.value !== "") {
			hours.push(inHour.value);
			hours.push(outHour.value);

			if (day !== null && day.value !== "") {
				userLS.workDays[day.value] = hours;
			}
		}
	}
	localStorage.setItem("USER", JSON.stringify(userLS));
});
