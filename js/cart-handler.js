document.addEventListener("DOMContentLoaded", async function () {
    
    updateCartCount();

    if (window.location.pathname.includes("cart.html")) {
        await loadCart();

        
        window.addEventListener("cartUpdated", () => {
            loadCart();
            updateCartCount();
        });
    }

    if (window.location.pathname.includes("checkout.html")) {
        await loadCheckout();
    }
});

async function loadCart() {
    const cartContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");

    if (!cartContainer) return;

    try {
        cartContainer.innerHTML =
            '<p class="loading-text">Loading your cart...</p>';

        let cart = null;

        
        if (api.isAuthenticated()) {
            const response = await api.getCart();
            if (response.success && response.data.cart) {
                cart = response.data.cart;
            } else {
                throw new Error("Failed to load cart");
            }
        } else {
            const items = api.getLocalCart();

            if (!items || items.length === 0) {
                displayEmptyCart();
                return;
            }

            
            const restaurantName = items[0]?.restaurantName || "Restaurant";
            cart = {
                items: items.map((item) => ({
                    id: item.id,
                    menuItemId: item.menuItemId,
                    price: parseFloat(item.price) || 0,
                    quantity: parseInt(item.quantity) || 1,
                    menuItem: {
                        name: item.name,
                        image: item.image,
                        description: item.description || "",
                    },
                    specialInstructions: item.specialInstructions || "",
                })),
                restaurant: { name: restaurantName },
                subtotal: 0,
                tax: 0,
            };

            
            cart.subtotal = cart.items.reduce((sum, item) => {
                return (
                    sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)
                );
            }, 0);
            cart.tax = parseFloat((cart.subtotal * 0.05).toFixed(2));
            cart.deliveryFee = cart.subtotal > 0 ? 50 : 0;
            cart.total = cart.subtotal + cart.tax + cart.deliveryFee;
        }

        if (!cart || !cart.items || cart.items.length === 0) {
            displayEmptyCart();
            return;
        }

        displayCartItems(cart);

        if (cartSummary) {
            displayCartSummary(cart);
        }
    } catch (error) {
        console.error("Error loading cart:", error);
        cartContainer.innerHTML = `
            <div class="error-message">
                <h3>Unable to load cart</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }
}

function displayEmptyCart() {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;

    cartContainer.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Add items from restaurants to get started</p>
            <a href="/restaurants.html" class="browse-btn">Browse Restaurants</a>
        </div>
    `;

    const cartSummary = document.getElementById("cartSummary");
    if (cartSummary) {
        cartSummary.style.display = "none";
    }
}

function displayCartItems(cart) {
    const cartContainer = document.getElementById("cartItems");
    if (!cartContainer) return;

    const restaurantName = cart.restaurant ? cart.restaurant.name : "Restaurant";

    cartContainer.innerHTML = `
        <div class="cart-header">
            <h2>Your Cart</h2>
            <p class="restaurant-name">From: ${restaurantName}</p>
        </div>
        <div class="cart-items-list">
            ${cart.items
            .map(
                (item) => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.menuItem?.image || "images/food-placeholder.jpg"}" 
                             alt="${item.menuItem?.name || "Item"}"
                             onerror="this.src='images/food-placeholder.jpg'">
                    </div>
                    <div class="item-details">
                        <h3>${item.menuItem?.name || "Item"}</h3>
                        <p class="item-price">₹${item.price}</p>
                        ${item.specialInstructions
                        ? `<p class="special-instructions">${item.specialInstructions}</p>`
                        : ""
                    }
                    </div>
                    <div class="item-quantity">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-total">
                        <p>₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `,
            )
            .join("")}
        </div>
        <div class="cart-actions">
            <button class="clear-cart-btn" onclick="clearCart()">Clear Cart</button>
        </div>
    `;
}

function displayCartSummary(cart) {
    const cartSummary = document.getElementById("cartSummary");
    if (!cartSummary) return;

    cartSummary.style.display = "block";
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-row">
            <span>Subtotal</span>
            <span>₹${parseFloat(cart.subtotal || 0).toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (5%)</span>
            <span>₹${parseFloat(cart.tax || 0).toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Delivery Fee</span>
            <span>₹${parseFloat(cart.deliveryFee || 0).toFixed(2)}</span>
        </div>
        <div class="summary-row total">
            <span>Total</span>
            <span>₹${parseFloat(cart.total || 0).toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">
            Proceed to Checkout
        </button>
    `;
}


window.updateQuantity = async function (
    cartItemId,
    newQuantity,
    silent = false,
) {
    
    if (newQuantity < 1) {
        try {
            
            let cart = api.getLocalCart();
            const originalCart = [...cart];
            cart = cart.filter(
                (i) => String(i.id) !== String(cartItemId) && String(i.menuItemId) !== String(cartItemId),
            );
            api.saveLocalCart(cart);
            window.dispatchEvent(new Event("cartUpdated"));
            updateCartCount();

            if (api.isAuthenticated()) {
                const response = await api.removeFromCart(cartItemId);
                if (!response.success) {
                    
                    api.saveLocalCart(originalCart);
                    window.dispatchEvent(new Event("cartUpdated"));
                    updateCartCount();
                } else {
                    await syncCartToLocalStorage();
                }
            }
        } catch (error) {
            console.error("Error removing item:", error);
        }
        return;
    }

    try {
        
        let cart = api.getLocalCart();
        const originalCart = [...cart];
        const item = cart.find(
            (i) => String(i.id) === String(cartItemId) || String(i.menuItemId) === String(cartItemId),
        );
        if (item) {
            item.quantity = newQuantity;
            api.saveLocalCart(cart);
            window.dispatchEvent(new Event("cartUpdated"));
            updateCartCount();
        }

        if (api.isAuthenticated()) {
            const response = await api.updateCartItem(cartItemId, newQuantity);
            if (response.success && response.data.cart) {
                
                updateLocalCartFromData(response.data.cart);
            } else if (!response.success) {
                
                api.saveLocalCart(originalCart);
                window.dispatchEvent(new Event("cartUpdated"));
                updateCartCount();
                showNotification(response.message || "Failed to update cart", "error");
            }
        }

        
        if (window.location.pathname.includes("cart.html")) {
            loadCart();
        }
    } catch (error) {
        console.error("Error updating cart:", error);
        showNotification("Failed to update cart", "error");
    }
};


window.removeFromCart = async function (cartItemId) {
    if (!confirm("Remove this item from cart?")) {
        return;
    }

    try {
        if (api.isAuthenticated()) {
            const response = await api.removeFromCart(cartItemId);
            if (response.success && response.data.cart) {
                showNotification("Item removed from cart", "success");
                updateLocalCartFromData(response.data.cart);
            } else if (response.success) {
                
                showNotification("Item removed from cart", "success");
                localStorage.setItem("cart", "[]");
            } else {
                showNotification(response.message || "Failed to remove item", "error");
            }
        } else {
            
            let cart = api.getLocalCart();
            cart = cart.filter(
                (i) => i.id != cartItemId && i.menuItemId != cartItemId,
            );
            api.saveLocalCart(cart);
            showNotification("Item removed from cart", "success");
        }

        
        window.dispatchEvent(new Event("cartUpdated"));

        
        if (window.location.pathname.includes("cart.html")) {
            loadCart();
        }

        
        updateCartCount();
    } catch (error) {
        console.error("Error removing item:", error);
        showNotification(error.message || "Failed to remove item", "error");
    }
};


window.clearCart = async function () {
    if (!confirm("Are you sure you want to clear your cart?")) {
        return;
    }

    try {
        if (api.isAuthenticated()) {
            const response = await api.clearCart();
            if (response.success) {
                showNotification("Cart cleared", "success");
                await syncCartToLocalStorage();
                displayEmptyCart();
                updateCartCount();
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                showNotification(response.message || "Failed to clear cart", "error");
            }
        } else {
            
            api.saveLocalCart([]);
            localStorage.removeItem("currentRestaurant");
            showNotification("Cart cleared", "success");
            displayEmptyCart();
            updateCartCount();
            window.dispatchEvent(new Event("cartUpdated"));
        }
    } catch (error) {
        console.error("Error clearing cart:", error);
        showNotification(error.message || "Failed to clear cart", "error");
    }
};

function proceedToCheckout() {
    window.location.href = "checkout.html";
}

async function loadCheckout() {
    const checkoutContainer = document.getElementById("checkoutContainer");
    if (!checkoutContainer) return;

    try {
        const response = await api.getCart();

        if (response.success && response.data.cart) {
            const cart = response.data.cart;

            if (!cart.items || cart.items.length === 0) {
                
                console.log("Cart is empty in checkout view");
                return;
            }

            displayCheckoutForm(cart);
        } else {
            throw new Error("Failed to load cart");
        }
    } catch (error) {
        console.error("Error loading checkout:", error);
        showNotification(error.message || "Failed to load checkout", "error");
    }
}

function displayCheckoutForm(cart) {
    const checkoutContainer = document.getElementById("checkoutContainer");
    if (!checkoutContainer) return;

    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    checkoutContainer.innerHTML = `
        <div class="checkout-content">
            <div class="checkout-form">
                <h2>Delivery Details</h2>
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="deliveryAddress">Delivery Address *</label>
                        <textarea id="deliveryAddress" required 
                                  placeholder="Enter your complete address">${user.address || ""}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="deliveryCity">City *</label>
                            <input type="text" id="deliveryCity" required 
                                   value="${user.city || ""}" placeholder="City">
                        </div>
                        <div class="form-group">
                            <label for="deliveryState">State *</label>
                            <input type="text" id="deliveryState" required 
                                   value="${user.state || ""}" placeholder="State">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="deliveryZipCode">Zip Code *</label>
                            <input type="text" id="deliveryZipCode" required 
                                   value="${user.zipCode || ""}" placeholder="Zip Code">
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone *</label>
                            <input type="tel" id="phone" required 
                                   value="${user.phone || ""}" placeholder="Phone Number">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="specialRequests">Special Requests (Optional)</label>
                        <textarea id="specialRequests" 
                                  placeholder="Any special instructions for delivery"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="paymentMethod">Payment Method *</label>
                        <select id="paymentMethod" required>
                            <option value="cash">Cash on Delivery</option>
                            <option value="card">Credit/Debit Card</option>
                            <option value="upi">UPI</option>
                            <option value="wallet">Wallet</option>
                        </select>
                    </div>
                    <button type="submit" class="place-order-btn">Place Order</button>
                </form>
            </div>
            <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-items">
                    ${cart.items
            .map(
                (item) => `
                        <div class="summary-item">
                            <span>${item.menuItem?.name || "Item"} x ${item.quantity}</span>
                            <span>₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                    `,
            )
            .join("")}
                </div>
                <div class="summary-totals">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₹${parseFloat(cart.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax</span>
                        <span>₹${parseFloat(cart.tax || 0).toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹${parseFloat(cart.deliveryFee || 0).toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>₹${parseFloat(cart.total || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", handleCheckoutSubmit);
    }
}


function showNotification(message, type = "success") {
    
    if (
        typeof window.showNotification === "function" &&
        window.showNotification !== showNotification
    ) {
        window.showNotification(message, type);
    } else {
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === "success" ? "#27ae60" : "#e74c3c"};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(-20px)";
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}


window.addToCart = async function (
    menuItemId,
    itemName,
    price,
    restaurantId,
    restaurantName,
    image,
) {
    try {
        
        price = parseFloat(price);

        if (api.isAuthenticated()) {
            try {
                const response = await api.addToCart({
                    menuItemId,
                    quantity: 1,
                    restaurantId,
                });

                if (response.success && response.data.cart) {
                    
                    updateLocalCartFromData(response.data.cart);
                    updateCartCount();
                    window.dispatchEvent(new Event("cartUpdated"));
                }
            } catch (error) {
                console.warn("Add to cart error:", error.message);
                const msg = (error.message || "").toLowerCase();
                if (
                    msg.includes("different restaurant") ||
                    msg.includes("clear cart first")
                ) {
                    
                    const clearRes = await api.clearCart();
                    if (clearRes.success) {
                        await syncCartToLocalStorage();
                        showNotification("Cart cleared to add items from new restaurant", "info");
                        return addToCart(menuItemId, itemName, price, restaurantId, restaurantName, image);
                    }
                    return;
                }
                throw error;
            }
        } else {
            
            let cart = api.getLocalCart();

            
            const savedRestId =
                localStorage.getItem("currentRestaurant") ||
                localStorage.getItem("selectedRestaurant");

            if (
                savedRestId &&
                String(savedRestId) !== String(restaurantId) &&
                cart.length > 0
            ) {
                
                cart = [];
                localStorage.removeItem("currentRestaurant");
                localStorage.removeItem("selectedRestaurant");
                showNotification("Cart cleared to add items from new restaurant", "info");
            }

            const cleanRestaurantId = String(restaurantId || "");
            localStorage.setItem("currentRestaurant", cleanRestaurantId);

            const existing = cart.find(
                (i) =>
                    String(i.id) === String(menuItemId) ||
                    String(i.menuItemId) === String(menuItemId),
            );

            if (existing) {
                existing.quantity = (parseInt(existing.quantity) || 0) + 1;
            } else {
                cart.push({
                    id: String(menuItemId),
                    menuItemId: String(menuItemId),
                    name: String(itemName || "Item"),
                    price: parseFloat(price) || 0,
                    quantity: 1,
                    image: image || "",
                    restaurantId: cleanRestaurantId,
                    restaurantName: String(restaurantName || "Restaurant"),
                });
            }

            api.saveLocalCart(cart);
            
            updateCartCount();
            window.dispatchEvent(new Event("cartUpdated"));
        }
    } catch (error) {
        const msg = (error.message || "").toLowerCase();
        if (
            msg &&
            !msg.includes("different restaurant") &&
            !msg.includes("clear cart first")
        ) {
            console.error("Error adding to cart:", error);
            showNotification(error.message || "Error adding to cart", "error");
        }
    }
};

async function handleCheckoutSubmit(e) {
    e.preventDefault();

    const deliveryAddress = document.getElementById("deliveryAddress").value;
    const deliveryCity = document.getElementById("deliveryCity").value;
    const deliveryState = document.getElementById("deliveryState").value;
    const deliveryZipCode = document.getElementById("deliveryZipCode").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    const specialRequests = document.getElementById("specialRequests").value;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : "Place Order";

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Placing Order...";
        }

        const response = await api.createOrder({
            deliveryAddress,
            deliveryCity,
            deliveryState,
            deliveryZipCode,
            paymentMethod,
            specialRequests,
        });

        if (response.success && response.data.order) {
            showNotification("Order placed successfully!", "success");
            setTimeout(() => {
                window.location.href = `/order-confirmation.html?orderId=${response.data.order.id}`;
            }, 1500);
        } else {
            throw new Error(response.message || "Failed to place order");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        showNotification(error.message || "Failed to place order", "error");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
}


async function updateCartCount() {
    try {
        let totalItems = 0;

        if (api.isAuthenticated()) {
            try {
                const cart = await api.getUnifiedCart();
                const items = cart.items || [];
                totalItems = items.reduce(
                    (sum, item) => sum + (parseInt(item.quantity) || 0),
                    0,
                );
            } catch (err) {
                console.warn("Could not fetch unified cart:", err);
            }
        } else {
            
            const cart = api.getLocalCart();
            totalItems = cart.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0,
            );
        }

        const cartBadges = document.querySelectorAll(".cart-count, #cartCount");
        cartBadges.forEach((badge) => {
            if (badge) {
                badge.textContent = totalItems;
                badge.style.display = totalItems > 0 ? "flex" : "none";
            }
        });
    } catch (error) {
        console.error("Error updating cart count:", error);
    }
}


window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.showNotification = showNotification;
window.updateCartCount = updateCartCount;
window.handleCheckoutSubmit = handleCheckoutSubmit;
window.syncCartToLocalStorage = syncCartToLocalStorage;


updateCartCount();

function updateLocalCartFromData(cart) {
    if (!cart || !cart.items) return;

    const items = cart.items.map((i) => ({
        id: i.menuItemId,
        menuItemId: i.menuItemId,
        name: i.name || (i.menuItem ? i.menuItem.name : "Unknown"),
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurant ? cart.restaurant.name : ""
    }));

    localStorage.setItem("cart", JSON.stringify(items));
    if (cart.restaurantId) {
        localStorage.setItem("currentRestaurant", String(cart.restaurantId));
    }
}

async function syncCartToLocalStorage() {
    if (api.isAuthenticated()) {
        try {
            const response = await api.getCart();
            if (response.success && response.data.cart) {
                updateLocalCartFromData(response.data.cart);
            }
        } catch (e) {
            console.warn("Sync failed:", e);
        }
    }
}


if (api.isAuthenticated()) {
    syncCartToLocalStorage();
}
