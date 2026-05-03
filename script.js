let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discount = 0;

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(name, price) {
  let item = cart.find(p => p.name === name);

  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  saveCart();
}

function renderCart() {
  let list = document.getElementById("cart-list");
  list.innerHTML = "";

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.qty;

    let li = document.createElement("li");
    li.innerHTML = `${item.name} ₹${item.price} x ${item.qty}
      <button onclick="removeItem('${item.name}')">X</button>`;

    list.appendChild(li);
  });

  let final = subtotal - discount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discount;
  document.getElementById("final-total").innerText = final;
  document.getElementById("nav-total").innerText = final;
}

function removeItem(name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
}

function applyCoupon() {
  let code = prompt("Enter code: SAVE10");

  if (code === "SAVE10") {
    let subtotal = Number(document.getElementById("subtotal").innerText);
    discount = subtotal * 0.1;
    renderCart();
  }
}

function searchProduct() {
  let query = document.getElementById("searchInput").value.toLowerCase();
  let products = document.querySelectorAll(".product");

  products.forEach(p => {
    let name = p.querySelector("h3").innerText.toLowerCase();
    p.style.display = name.includes(query) ? "block" : "none";
  });
}

function checkout() {
  if (cart.length === 0) return alert("Cart empty!");
  alert("Order placed!");
  cart = [];
  discount = 0;
  saveCart();
}

function clearCart() {
  cart = [];
  discount = 0;
  saveCart();
}

function goToLogin() {
  window.location.href = "login.html";
}

renderCart();
