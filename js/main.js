openMenu(document.getElementById("user-btn"), document.getElementById("user-menu"));
openMenu(document.getElementById("orders-btn"), document.getElementById("orders-menu"));

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
