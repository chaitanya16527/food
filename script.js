let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountAmount = Number(localStorage.getItem("discountAmount")) || 0;

/* ================= USER ================= */

function getUser() {
  return localStorage.getItem("user");
}

function updateAuthUI() {
  const user = getUser();
  const logo = document.getElementById("logo");
  const authBtn = document.getElementById("authBtn");
  const warning = document.getElementById("login-warning");

  if (user) {
    logo.innerText = "🛒 MyShop Pro (" + user + ")";
    authBtn.innerText = "Logout";
    warning.style.display = "none";
  } else {
    logo.innerText = "🛒 MyShop Pro";
    authBtn.innerText = "Login";
    warning.style.display = "block";
  }
}

function handleAuth() {
  if (getUser()) {
    localStorage.removeItem("user");
    alert("Logged out!");
    updateAuthUI();
  } else {
    window.location.href = "login.html";
  }
}

/* ================= CART ================= */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("discountAmount", discountAmount);
  renderCart();
}

function addToCart(name, price) {
  if (!getUser()) {
    alert("Login first!");
    window.location.href = "login.html";
    return;
  }

  let item = cart.find(p => p.name === name);

  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  saveCart();
}

function increaseQty(name) {
  let item = cart.find(p => p.name === name);
  if (item) item.qty++;
  saveCart();
}

function decreaseQty(name) {
  let item = cart.find(p => p.name === name);

  if (item && item.qty > 1) item.qty--;
  else cart = cart.filter(p => p.name !== name);

  saveCart();
}

function removeItem(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
}

function clearCart() {
  cart = [];
  discountAmount = 0;
  saveCart();
}

/* ================= RENDER CART ================= */

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

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

    cartList.appendChild(li);
  });

  if (subtotal === 0 || discountAmount > subtotal) {
    discountAmount = 0;
  }

  let total = subtotal - discountAmount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discountAmount;
  document.getElementById("final-total").innerText = total;
  document.getElementById("nav-total").innerText = total;
}

/* ================= PRODUCTS ================= */

function loadDynamicProducts() {
  const container = document.getElementById("products-container");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (products.length === 0) {
    products = [
      {name:"Phone",price:15000,image:"https://cdn-icons-png.flaticon.com/512/545/545245.png"},
      {name:"Laptop",price:55000,image:"https://cdn-icons-png.flaticon.com/512/3474/3474360.png"},
      {name:"Headphones",price:2000,image:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png"},
      {name:"Watch",price:3000,image:"https://cdn-icons-png.flaticon.com/512/2972/2972531.png"}
    ];
  }

  container.innerHTML = "";

  products.forEach(p => {
    let div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.name}',${p.price})">Add</button>
    `;

    container.appendChild(div);
  });
}

/* ================= SEARCH ================= */

function searchProduct() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach(p => {
    const name = p.querySelector("h3").innerText.toLowerCase();
    p.style.display = name.includes(query) ? "block" : "none";
  });
}

/* ================= COUPON ================= */

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

  let code = prompt("Enter coupon: SAVE10");

  if (code === "SAVE10") {
    discountAmount = Math.floor(subtotal * 0.10);
    saveCart();
    alert("Discount applied!");
  } else {
    alert("Invalid coupon");
  }
}

/* ================= CHECKOUT ================= */

function checkout() {
  if (!getUser()) {
    alert("Login first!");
    return;
  }

  if (cart.length === 0) {
    alert("Cart empty!");
    return;
  }

  window.location.href = "checkout.html";
}

/* ================= INIT ================= */

updateAuthUI();
renderCart();
loadDynamicProducts();
