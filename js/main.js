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

/* ------------------- GET USER TABLES ------------------- */
const tableSections = document.getElementById("sections");
const tableSelector = document.getElementById("table-selector");

let userLS = JSON.parse(localStorage.getItem("USER"));
let userTables = userLS.tables;
let countSections = 1;

for (let section in userTables) {
	let badge = `<input type="radio" id="section-${countSections}" name="section" class="badge" title="${section}" />`;
	tableSections.insertAdjacentHTML("beforeend", badge);
	countSections++;
}

/* ------------------- tables selector ------------------- */
tableSections.addEventListener("change", () => {
	let countTables = 1;
	tableSelector.innerHTML = "";
	let sections = document.getElementsByName("section");
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
			: (sectionName = section.split(" ").join("-"));

		userTables[section].forEach((table) => {
			if (section === currentSection) {
				let tableBtn = `
				<button id="table-${sectionName}-${countTables}" type="button" class="table" data-availability="true">
						<span>M${String(table).padStart(2, "0")}</span>
						<span></span>
				</button>`;
				tableSelector.insertAdjacentHTML("beforeend", tableBtn);
				countTables++;
			}
		});
	}
});
/* ------------------- ------------------- ------------------- */

/* ------------------- GET USER GOALS ------------------- */
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
			count.innerText = `$${String(ls).padStart(2, "0")}/$${String(goal).padStart(2, "0")}`;
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
