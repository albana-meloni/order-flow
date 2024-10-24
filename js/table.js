openMenu(
	document.getElementById("stages-btn"),
	document.getElementById("stages-menu")
);
openMenu(
	document.getElementById("modal-btn"),
	document.getElementById("order-modal")
);
openMenu(
	document.getElementById("close-modal"),
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
