const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menu-toggle");
menuToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", () => { menu.classList.remove("open"); menuToggle.setAttribute("aria-expanded", false); });
