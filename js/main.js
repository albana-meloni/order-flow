/* ------------------- OPEN SIDE MENUS ------------------- */
openMenu(document.getElementById("user-btn"), document.getElementById("user-menu"));
openMenu(
	document.getElementById("orders-btn"),
	document.getElementById("orders-menu")
);

function openMenu(btn, menu) {
	btn.addEventListener("click", () => {
		const visibility = menu.getAttribute("aria-hidden");

		if (visibility === "false") {
			menu.setAttribute("aria-hidden", true);
			btn.setAttribute("aria-expanded", false);
		} else if (visibility === "true") {
			menu.setAttribute("aria-hidden", false);
			btn.setAttribute("aria-expanded", true);
		}
	});
}
/* ------------------- ------------------- ------------------- */

/* ------------------- GET USER GOALS ------------------- */
let userLS = JSON.parse(localStorage.getItem("USER"));

/* ------------------- orders ------------------- */
showMsgGoals(
	userLS.goalOrders,
	document.getElementById("orders-count"),
	localStorage.getItem("PEDIDOS"),
	document.getElementById("orders-div")
);
/* ------------------- tips ------------------- */
showMsgGoals(
	userLS.goalTips,
	document.getElementById("tip-count"),
	localStorage.getItem("PROPINA"),
	document.getElementById("tip-div"),
	true
);

function showMsgGoals(goal, count, ls, div, tip = false) {
	if (tip === false) {
		if (goal !== 0) {
			count.innerText = `${String(ls).padStart(2, "0")}/${String(
				goal
			).padStart(2, "0")}`;
			if (ls >= goal * 2) {
				div.lastElementChild.innerText = "ESTO ES IMPRESIONANTE!!!";
			} else if (ls >= goal) {
				div.lastElementChild.innerText = "SOS GENIAL!!! Seguí superándote!";
			} else if (ls > goal / 2) {
				div.lastElementChild.innerText = "Ya casi cumplís tu objetivo!";
			}
		} else {
			count.innerText = `${ls.padStart(2, "0")}`;
		}
	} else {
		if (goal !== 0) {
			count.innerText = `$${String(ls).padStart(2, "0")}/$${String(
				goal
			).padStart(2, "0")}`;
			if (ls >= goal * 2) {
				div.lastElementChild.innerText = "ESTO ES IMPRESIONANTE!!!";
			} else if (ls >= goal) {
				div.lastElementChild.innerText = "SOS GENIAL!!! Seguí superándote!";
			} else if (ls > goal / 2) {
				div.lastElementChild.innerText = "Ya casi cumplís tu objetivo!";
			}
		} else {
			count.innerText = `${ls.padStart(2, "0")}`;
		}
	}
}
/* ------------------- ------------------- ------------------- */

/* ------------------- GET USER TABLES ------------------- */
const tableSections = document.getElementById("sections");
const tableSelector = document.getElementById("table-selector");

let userTables = userLS.tables;
let countSections = 0;

for (let section in userTables) {
	let badge = `<input type="radio" id="section-${countSections}" name="section" class="badge" title="${section}" />`;
	tableSections.insertAdjacentHTML("beforeend", badge);
	countSections++;
}
let badges = document.querySelectorAll(".badge");
badges[0].checked = true;
showTables(badges);
/* ------------------- table object ------------------- */
let tableObj = {
	mesa: null,
	seccion: null,
	personas: null,
	pedido: null,
	estado: null,
	propina: null,
};

/* ------------------- show tables ------------------- */
function showTables(sections) {
	let countTables = 0;
	tableSelector.innerHTML = "";
	let currentSection;
	sections.forEach((badge) => {
		if (badge.checked == true) {
			currentSection = badge.title;
		}
	});
	for (let section in userTables) {
		let sectionName;
		section.split(" ").length === 1
			? (sectionName = section)
			: (sectionName = section.split(" ").join("_"));

		userTables[section].forEach((table) => {
			if (section === currentSection) {
				let tableBtn = `
				<button name="${sectionName}" value="${table}" type="submit" class="table" data-occupied="false">
					<div>
						<img src="../assets/icons/users.svg" alt="Personas" />
						<span id="table-people">-</span>
					</div>
					<h2 class="title">M${String(table).padStart(2, "0")}</h2>
					<span id="table-time"></span>
				</button>`;
				tableSelector.insertAdjacentHTML("beforeend", tableBtn);
				countTables++;
			}
		});
	}
	if (countTables % 4 === 0 && countTables !== 4) {
		tableSelector.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
	} else if (countTables % 3 === 0) {
		tableSelector.style.gridTemplateColumns = "1fr 1fr 1fr";
	} else if (countTables % 2 === 0) {
		tableSelector.style.gridTemplateColumns = "1fr 1fr";
	}
}

/* ------------------- availability ------------------- */
let totalTables;
document.querySelectorAll(".table .title").forEach((title) => {
	totalTables = parseInt(title.textContent.split("M")[1]);
});

document.querySelectorAll(".table").forEach((table) => {
	let timer;
	let startTime = 0;
	let elapsedTime = 0;
	let isRunning = false;
	let tableLS;
	for (let i = 1; i <= totalTables; i++) {
		if (
			localStorage.getItem(`MESA${i}-${table.name}`) !== null &&
			parseInt(table.value) === i
		) {
			tableLS = JSON.parse(localStorage.getItem(`MESA${i}-${table.name}`));
			table.setAttribute("data-occupied", true);
			table.children[0].children[1].textContent = tableLS.personas;
		}
		if (table.getAttribute("data-occupied") === "true") {
			if (
				tableLS.estado !== "Eligiendo del menú" &&
				tableLS.estado !== "Pedido pagado"
			) {
				if (!isRunning) {
					startTime = Date.now() - elapsedTime;
					timer = setInterval(() => {
						const currentTime = Date.now();
						elapsedTime = currentTime - startTime;

						let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
						let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
						let seconds = Math.floor((elapsedTime / 1000) % 60);

						hours = String(hours).padStart(2, "0");
						minutes = String(minutes).padStart(2, "0");
						seconds = String(seconds).padStart(2, "0");

						table.children[2].textContent = `${hours}:${minutes}:${seconds}`;
					}, 10);
				}
			} else if (tableLS.estado === "Pedido pagado") {
				clearInterval(timer);
				startTime = 0;
				elapsedTime = 0;
				isRunning = false;
				table.children[2].textContent.innerText = "";
				table.setAttribute("data-occupied", false);
				localStorage.removeItem(`MESA${i}-${table.name}`);
			}
		}
	}
	/* ------------------- occupied table ------------------- */

	table.addEventListener("click", () => {
		for (let i = 1; i <= totalTables; i++) {
			if (
				localStorage.getItem(`MESA${i}-${table.name}`) !== null &&
				parseInt(table.value) === i
			) {
				tableLS = JSON.parse(localStorage.getItem(`MESA${i}-${table.name}`));
				table.setAttribute("data-occupied", true);
				document.getElementById("table-people").textContent =
					tableLS.personas;
				tableObj = tableLS;
			}
		}
		localStorage.setItem(`MESA${table.value}-${table.name}`, JSON.stringify(tableObj));
	});
});

tableSections.addEventListener("change", () => {
	showTables(badges);
});
/* ------------------- ------------------- ------------------- */

/* ------------------- MANAGE TABLE SELECTOR ------------------- */
/* ------------------- movement ------------------- */
let isClickDown = false;
let startX;
let scrollLeft;

tableSelector.addEventListener("mousedown", (e) => {
	isClickDown = true;
	tableSelector.classList.add("active");
	startX = e.pageX;
	scrollLeft = tableSelector.scrollLeft;
});

tableSelector.addEventListener("mouseleave", () => {
	isClickDown = false;
	tableSelector.classList.remove("active");
});

tableSelector.addEventListener("mouseup", () => {
	isClickDown = false;
	tableSelector.classList.remove("active");
});

tableSelector.addEventListener("mousemove", (e) => {
	if (!isClickDown) return;
	const x = e.pageX;
	const movement = x - startX;
	tableSelector.scrollLeft = scrollLeft - movement;
});
/* ------------------- ------------------- ------------------- */
