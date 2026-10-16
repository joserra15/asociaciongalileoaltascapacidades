(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".menu");
  if (!toggle || !menu) return;

  // Avoid header backdrop-filter trapping position:fixed by parking the menu on body
  const placeholder = document.createComment("menu-placeholder");
  let onBody = false;

  function parkOnBody() {
    if (onBody) return;
    menu.parentNode.insertBefore(placeholder, menu);
    document.body.appendChild(menu);
    onBody = true;
  }

  function restore() {
    if (!onBody) return;
    placeholder.parentNode.insertBefore(menu, placeholder);
    placeholder.remove();
    onBody = false;
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      parkOnBody();
      menu.classList.add("open");
      document.body.style.overflow = "hidden";
    } else {
      menu.classList.remove("open");
      document.body.style.overflow = "";
      restore();
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();
