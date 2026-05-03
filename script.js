let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function addToCart(name, price) {
    let item = cart.find(p => p.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
}

function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
}

function renderCart() {
    let list = document.getElementById("cart-list");
    list.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        let li = document.createElement("li");

        li.innerHTML = `
            ${item.name} - ₹${item.price} x ${item.qty}
            <button onclick="removeItem('${item.name}')">X</button>
        `;

        list.appendChild(li);

        total += item.price * item.qty;
    });

    document.getElementById("total-price").innerText = total;
}

function searchProduct(query) {
    let products = document.querySelectorAll(".product");

    products.forEach(p => {
        let name = p.querySelector("h3").innerText.toLowerCase();

        p.style.display = name.includes(query.toLowerCase()) ? "block" : "none";
    });
}

function applyCoupon() {
    let code = prompt("Enter coupon code:");

    if (code === "SAVE10") {
        let total = parseInt(document.getElementById("total-price").innerText);
        total = total - (total * 0.1);
        document.getElementById("total-price").innerText = total;
        alert("10% discount applied!");
    } else {
        alert("Invalid coupon");
    }
}

renderCart();
