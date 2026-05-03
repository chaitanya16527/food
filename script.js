// Load data from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountAmount = Number(localStorage.getItem("discountAmount")) || 0;

// Get logged user
function getUser() {
  return localStorage.getItem("user");
}

// ================= AUTH UI =================
function updateAuthUI() {
  const user = getUser();
  const logo = document.getElementById("logo");
  const authBtn = document.getElementById("authBtn");
  const warning = document.getElementById("login-warning");

  if (user) {
    logo.innerText = "🛒 MyShop Pro (" + user + ")";
    authBtn.innerText = "Logout";
    if (warning) warning.style.display = "none";
  } else {
    logo.innerText = "🛒 MyShop Pro";
    authBtn.innerText = "Login";
    if (warning) warning.style.display = "block";
  }
}

// Login / Logout button
function handleAuth() {
  if (getUser()) {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    updateAuthUI();
  } else {
    window.location.href = "login.html";
  }
}

// ================= CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("discountAmount", discountAmount);
  renderCart();
}

// Add item
function addToCart(name, price) {
  if (!getUser()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  let item = cart.find(p => p.name === name);

  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  saveCart();
}

// Increase quantity
function increaseQty(name) {
  let item = cart.find(p => p.name === name);
  if (item) item.qty++;
  saveCart();
}

// Decrease quantity
function decreaseQty(name) {
  let item = cart.find(p => p.name === name);

  if (item && item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(p => p.name !== name);
  }

  saveCart();
}

// Remove item
function removeItem(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
}

// ================= RENDER CART =================
function renderCart() {
  let list = document.getElementById("cart-list");

  if (!list) return;

  list.innerHTML = "";
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    let li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} - ₹${item.price} x ${item.qty}</span>
      <div class="cart-actions">
        <button class="plus" onclick="increaseQty('${item.name}')">+</button>
        <button class="minus" onclick="decreaseQty('${item.name}')">-</button>
        <button class="remove" onclick="removeItem('${item.name}')">X</button>
      </div>
    `;

    list.appendChild(li);
  });

  if (subtotal === 0) discountAmount = 0;

  let finalTotal = subtotal - discountAmount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discountAmount;
  document.getElementById("final-total").innerText = finalTotal;
  document.getElementById("nav-total").innerText = finalTotal;
}

// ================= SEARCH =================
function searchProduct() {
  let query = document.getElementById("searchInput").value.toLowerCase();
  let products = document.querySelectorAll(".product");

  products.forEach(p => {
    let name = p.querySelector("h3").innerText.toLowerCase();
    p.style.display = name.includes(query) ? "block" : "none";
  });
}

// ================= COUPON =================
function applyCoupon() {
  if (!getUser()) {
    alert("Login first!");
    return;
  }

  let subtotal = Number(document.getElementById("subtotal").innerText);

  if (subtotal === 0) {
    alert("Add items first!");
    return;
  }

  let code = prompt("Enter coupon code: SAVE10");

  if (code === "SAVE10") {
    discountAmount = Math.floor(subtotal * 0.10);
    saveCart();
    alert("10% discount applied!");
  } else {
    alert("Invalid coupon");
  }
}

// ================= CHECKOUT =================
function checkout() {
  if (!getUser()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  // Go to checkout page
  window.location.href = "checkout.html";
}

// ================= CLEAR CART =================
function clearCart() {
  cart = [];
  discountAmount = 0;
  saveCart();
}

// ================= INIT =================
updateAuthUI();
renderCart();
