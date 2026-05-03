let total = 0;

// Add item to cart
function addToCart(item, price) {
    
    // Create list item
    let li = document.createElement("li");
    li.innerText = item + " - ₹" + price;

    // Add to cart list
    document.getElementById("cart-list").appendChild(li);

    // Update total
    total = total + price;
    document.getElementById("total").innerText = total;
}
