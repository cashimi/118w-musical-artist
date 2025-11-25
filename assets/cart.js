function getCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("Cart parsing error:", e);
      return [];
    }
  }
  
  // Save cart to localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();  // updates item count in header (future feature)
  }
  
  // Add item to cart
  function addToCart(item) {
    const cart = getCart();
  
    // Check for existing item with same ID + same option (size/section)
    const existing = cart.find(
      (i) => i.id === item.id && i.option === item.option
    );
  
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
  
    saveCart(cart);
    alert("Added to Cart!");
  }
  
  // Remove item by index
  function removeFromCart(index) {
    const cart = getCart();
  
    if (cart[index]) {
      cart.splice(index, 1);
      saveCart(cart);
    }
  
    // Only call renderCart() if the page has it
    if (typeof renderCart === "function") {
      renderCart();
    }
  }
  
  // Update item quantity
  function updateQuantity(index, qty) {
    const cart = getCart();
  
    if (!cart[index]) return;
  
    // Don't allow 0 or negative quantities — instead remove item
    if (qty <= 0) {
      removeFromCart(index);
      return;
    }
  
    cart[index].quantity = Number(qty);
    saveCart(cart);
  
    if (typeof renderCart === "function") {
      renderCart();
    }
  }
  
  // OPTIONAL: update cart count badge in header
  function updateCartBadge() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  
    const badge = document.getElementById("cart-count");
    if (badge) {
      badge.textContent = totalQty > 0 ? totalQty : "";
      badge.style.display = totalQty > 0 ? "flex" : "none";
    }
  }
  
  // Run badge update on load (safe even if badge is not present)
  updateCartBadge();
  
