const menuBtn = document.getElementById("menuBtn");
const shopNav = document.getElementById("shopNav");
const chips = document.querySelectorAll(".chip");
const productsGrid = document.getElementById("productsGrid");
const productCards = () => Array.from(document.querySelectorAll(".product-card"));
const addButtons = () => Array.from(document.querySelectorAll(".add-btn"));
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const CART_KEY = "shopsphere_jordan_cart_v1";
let cart = loadCart();

menuBtn?.addEventListener("click", () => {
  shopNav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => shopNav.classList.remove("open"));
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    filterAndSortProducts();
  });
});

searchInput?.addEventListener("input", filterAndSortProducts);
sortSelect?.addEventListener("change", filterAndSortProducts);

function getVisibleByFilter(card) {
  const activeCategory = document.querySelector(".chip.active")?.dataset.filter || "all";
  const q = (searchInput?.value || "").trim().toLowerCase();
  const category = card.dataset.category || "";
  const name = (card.dataset.name || "").toLowerCase();
  const categoryMatch = activeCategory === "all" || category === activeCategory;
  const searchMatch = !q || name.includes(q);
  return categoryMatch && searchMatch;
}

function sortCards(cards) {
  const mode = sortSelect?.value || "default";
  if (mode === "price-low") {
    cards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (mode === "price-high") {
    cards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  } else if (mode === "name") {
    cards.sort((a, b) => (a.dataset.name || "").localeCompare(b.dataset.name || ""));
  }
  return cards;
}

function filterAndSortProducts() {
  const cards = productCards();

  cards.forEach((card) => {
    card.style.display = getVisibleByFilter(card) ? "block" : "none";
  });

  const visible = cards.filter((c) => c.style.display !== "none");
  sortCards(visible).forEach((card) => productsGrid.appendChild(card));
}

function bindAddButtons() {
  addButtons().forEach((btn) => {
    btn.onclick = () => {
      const card = btn.closest(".product-card");
      const name = card.dataset.name;
      const price = Number(card.dataset.price || 0);

      const existing = cart.find((item) => item.name === name);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: `${name}-${Date.now()}`,
          name,
          price,
          qty: 1
        });
      }

      saveCart();
      renderCart();
    };
  });
}

clearCartBtn?.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function updateQty(id, delta) {
  cart = cart
    .map((item) => {
      if (item.id === id) {
        return { ...item, qty: item.qty + delta };
      }
      return item;
    })
    .filter((item) => item.qty > 0);

  saveCart();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = String(totalCount);

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
  } else {
    emptyCartMessage.style.display = "none";
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.qty;

    const li = document.createElement("li");
    li.className = "cart-item";

    const left = document.createElement("div");

    const name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = `${item.price} JOD x ${item.qty}`;

    const qtyWrap = document.createElement("div");
    qtyWrap.style.display = "flex";
    qtyWrap.style.gap = "6px";
    qtyWrap.style.marginTop = "6px";

    const minusBtn = document.createElement("button");
    minusBtn.className = "remove-item";
    minusBtn.textContent = "-";
    minusBtn.addEventListener("click", () => updateQty(item.id, -1));

    const plusBtn = document.createElement("button");
    plusBtn.className = "remove-item";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => updateQty(item.id, 1));

    qtyWrap.appendChild(minusBtn);
    qtyWrap.appendChild(plusBtn);

    left.appendChild(name);
    left.appendChild(price);
    left.appendChild(qtyWrap);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-item";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeItem(item.id));

    li.appendChild(left);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });

  cartSubtotal.textContent = String(subtotal);
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));

bindAddButtons();
filterAndSortProducts();
renderCart();
