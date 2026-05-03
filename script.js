let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountAmount = Number(localStorage.getItem("discountAmount")) || 0;

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
    alert("Logged out successfully!");
    updateAuthUI();
  } else {
    window.location.href = "login.html";
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("discountAmount", discountAmount);
  renderCart();
}

function addToCart(name, price) {
  if (!getUser()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  const item = cart.find(product => product.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
}

function increaseQty(name) {
  const item = cart.find(product => product.name === name);

  if (item) {
    item.qty++;
  }

  saveCart();
}

function decreaseQty(name) {
  const item = cart.find(product => product.name === name);

  if (item && item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(product => product.name !== name);
  }

  saveCart();
}

function removeItem(name) {
  cart = cart.filter(product => product.name !== name);
  saveCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${item.name} - ₹${item.price} x ${item.qty}</span>
      <div class="cart-actions">
        <button class="plus" onclick="increaseQty('${item.name}')">+</button>
        <button class="minus" onclick="decreaseQty('${item.name}')">-</button>
        <button class="remove" onclick="removeItem('${item.name}')">Remove</button>
      </div>
    `;

    cartList.appendChild(li);
  });

  if (subtotal === 0 || discountAmount > subtotal) {
    discountAmount = 0;
  }

  const finalTotal = subtotal - discountAmount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discountAmount;
  document.getElementById("final-total").innerText = finalTotal;
  document.getElementById("nav-total").innerText = finalTotal;
}

function searchProduct() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    const name = product.querySelector("h3").innerText.toLowerCase();

    if (name.includes(query)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function applyCoupon() {
  if (!getUser()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  const subtotal = Number(document.getElementById("subtotal").innerText);

  if (subtotal === 0) {
    alert("Add items first!");
    return;
  }

  const code = prompt("Enter coupon code: SAVE10");

  if (code === "SAVE10") {
    discountAmount = Math.floor(subtotal * 0.10);
    saveCart();
    alert("Coupon applied: 10% discount");
  } else {
    alert("Invalid coupon");
  }
}

function clearCart() {
  cart = [];
  discountAmount = 0;
  saveCart();
}

function checkout() {
  if (!getUser()) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  window.location.href = "checkout.html";
}

updateAuthUI();
renderCart();
