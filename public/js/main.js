
document.addEventListener("DOMContentLoaded", () => {
  loadMenu();
  setupNav();
  setupReserveForm();
});


function setupNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}


async function loadMenu() {
  const container = document.getElementById("menuGroups");
  const groupLabels = {
    coffee: "Coffee",
    bakes: "Bakes",
    light_meals: "Light meals",
  };

  try {
    const res = await fetch("/api/menu");
    if (!res.ok) throw new Error("Menu request failed");
    const menu = await res.json();

    container.innerHTML = "";

    Object.keys(menu).forEach((key) => {
      const group = document.createElement("div");
      group.className = "menu-group";

      const heading = document.createElement("h3");
      heading.textContent = groupLabels[key] || key;
      group.appendChild(heading);

      menu[key].forEach((item) => {
        const row = document.createElement("div");
        row.className = "menu-item";
        row.innerHTML = `
          <div class="menu-item-row">
            <span class="menu-item-name">${escapeHTML(item.name)}</span>
            <span class="menu-item-leader"></span>
            <span class="menu-item-price">₹${item.price}</span>
          </div>
          <p class="menu-item-note">${escapeHTML(item.note)}</p>
        `;
        group.appendChild(row);
      });

      container.appendChild(group);
    });
  } catch (err) {
    container.innerHTML = `<p class="menu-loading">Couldn't load the menu right now. Make sure the server is running.</p>`;
    console.error(err);
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


function setupReserveForm() {
  const form = document.getElementById("reserveForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      status.textContent = `Table booked for ${payload.guests} on ${payload.date} at ${payload.time}. See you then.`;
      status.classList.add("success");
      form.reset();
    } catch (err) {
      status.textContent = err.message || "Could not submit reservation.";
      status.classList.add("error");
    }
  });
}
