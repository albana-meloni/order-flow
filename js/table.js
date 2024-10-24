/* ------------------- MANAGE MENUS ------------------- */
/* ------------------- modal ------------------- */
openMenu(
	document.getElementById("modal-btn"),
	document.getElementById("order-modal")
);
openMenu(
	document.getElementById("close-modal"),
	document.getElementById("order-modal")
);
openMenu(
	document.getElementById("save-modal"),
	document.getElementById("order-modal")
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

/* ------------------- SHOW TABLE INFO ------------------- */
const url = new URLSearchParams(window.location.search);
let section = url.keys().next().value;
let number = url.get(section);

let table = JSON.parse(localStorage.getItem(`MESA${number}-${section}`));

document.getElementById("table-number").textContent = number;
document.getElementById("section").textContent = section.split("_").join(" ");
/* ------------------- ------------------- ------------------- */

/* ------------------- CANCEL TABLE ------------------- */
function load() {
	if (table.mesa === null) {
		/* ------------------- pop up ------------------- */
		openMenu(
			document.getElementById("go-back"),
			document.getElementById("popup")
		);
		openMenu(
			document.getElementById("close-popup"),
			document.getElementById("popup")
		);
		document.getElementById("close-table").addEventListener("click", () => {
			localStorage.removeItem(`MESA${number}-${section}`);
		});
	} else {
		loadOrder();
		document.getElementById("go-back").addEventListener("click", () => {
			window.location = "./main.html";
		});
	}
}
document.addEventListener("DOMContentLoaded", () => {
	load();
});
/* ------------------- ------------------- ------------------- */

/* ------------------- SAVE & LOAD ORDER ------------------- */
function saveOrder() {
	table.mesa = parseInt(number);
	table.seccion = section.split("_").join(" ");
	table.personas = parseInt(document.getElementById("people").value);
	table.pedido = document.getElementById("order").value.split("\n");
	table.estado = document.getElementById("order-stage").value;
	table.propina = parseInt(document.getElementById("tip").value) || null;
	localStorage.setItem(`MESA${number}-${section}`, JSON.stringify(table));
}
function loadOrder() {
	document.getElementById("people").value = table.personas;
	document.getElementById("order").value = table.pedido.join("\n");
	addProduct();
	document.getElementById("order-stage").value = table.estado;
	table.propina = parseInt(document.getElementById("tip").value) || null;
}
/* ------------------- ------------------- ------------------- */

/* ------------------- CREATE PRODUCT ORDER ------------------- */
function addProduct() {
	document.querySelector(".product-container").innerHTML = "";
	table.pedido.forEach((line) => {
		let quantity = "1";
		let name = line;
		if (line.includes("x")) {
			quantity = line.split("x")[1];
			name = line.split("x")[0];
		}
		let productCard = `
			<div class="product">
				<span class="product__quantity">${quantity}</span>
				<p class="product__name">${name}</p>
				<div>
					<button type="button" class="btn btn-primary product__edit"><img src="../assets/icons/edit-2.svg" alt="Editar producto"></button>
					<button type="button" class="btn btn-primary product__remove"><img src="../assets/icons/trash-2.svg" alt="Eliminar producto"></button>
				</div>
			</div>
		`;
		if (line !== "") {
			document
				.querySelector(".product-container")
				.insertAdjacentHTML("beforeend", productCard);
		}
	});
}
document.getElementById("save-modal").addEventListener("click", () => {
	saveOrder();
	addProduct();
	load();
});
document.getElementById("save-changes").addEventListener("click", () => {
	saveOrder();
	load();
	window.location = "./main.html";
});
/* ------------------- ------------------- ------------------- */


/* ------------------- ENTER TIP ------------------- */
document.getElementById("order-stage").addEventListener("change", () => {
	if (document.getElementById("order-stage").value === "Pedido pagado") {
		document.getElementById("tip").placeholder = "Ingresa la propina"
		document.getElementById("tip").removeAttribute("disabled")
	}
});
/* ------------------- ------------------- ------------------- */
