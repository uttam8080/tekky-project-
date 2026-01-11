
function displayRestaurantDetails() {
    const restaurantId = localStorage.getItem('selectedRestaurant');
    const restaurant = getRestaurantById(restaurantId);

    if (!restaurant) {
        window.location.href = 'restaurants.html';
        return;
    }

    // Update page title
    document.title = `${restaurant.name} - FoodHub`;

    // Display header
    const headerContainer = document.getElementById('restaurantHeader');
    headerContainer.innerHTML = `
        <div class="container">
            <div class="restaurant-header-content">
                <div class="restaurant-header-image">${restaurant.image}</div>
                <div class="restaurant-header-details">
                    <h1>${restaurant.name}</h1>
                    <p>${restaurant.cuisine}</p>
                    <p>${restaurant.distance} km away • ${restaurant.price}</p>
                </div>
            </div>
        </div>
    `;

    // Update restaurant info
    document.getElementById('restaurantRating').textContent = restaurant.rating;
    document.getElementById('deliveryTime').textContent = restaurant.deliveryTime;
    document.getElementById('deliveryCharge').textContent = restaurant.deliveryFee === 0 ? 'Free' : '₹' + restaurant.deliveryFee;
    document.getElementById('cuisineType').textContent = restaurant.cuisine.split(',')[0];

    // Display menu categories
    const categoriesList = document.getElementById('categoriesList');
    const categories = Object.keys(restaurant.menu);
    
    categoriesList.innerHTML = categories.map((category, index) => `
        <button class="category-btn ${index === 0 ? 'active' : ''}" onclick="displayCategory('${category}')">
            ${category}
        </button>
    `).join('');

    // Display menu items
    displayCategory(categories[0]);
}

// ============ MENU DISPLAY ============
// Display menu items for selected category
function displayCategory(category) {
    const restaurantId = localStorage.getItem('selectedRestaurant');
    const restaurant = getRestaurantById(restaurantId);

    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === category) {
            btn.classList.add('active');
        }
    });

    // Display items
    const menuContainer = document.getElementById('menuItemsContainer');
    const items = restaurant.menu[category];

    menuContainer.innerHTML = `
        <div class="menu-category-section">
            <h3>${category}</h3>
            ${items.map(item => `
                <div class="menu-item">
                    <div class="menu-item-content">
                        <div class="menu-item-name">${item.name}</div>
                        <div class="menu-item-description">${item.description}</div>
                        <div class="menu-item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="menu-item-actions">
                        <div class="quantity-control" id="qty-${item.id}" style="display: none;">
                            <button onclick="decreaseQuantity(${item.id})">−</button>
                            <span id="qty-value-${item.id}">0</span>
                            <button onclick="increaseQuantity(${item.id})">+</button>
                        </div>
                        <button class="add-btn" id="add-btn-${item.id}" onclick="addItemToCart(${item.id}, '${item.name}', ${item.price})">
                            Add
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============ CART OPERATIONS ============
// Add item to cart from restaurant menu
function addItemToCart(itemId, itemName, price) {
    const restaurantId = localStorage.getItem('selectedRestaurant');
    const restaurant = getRestaurantById(restaurantId);

    const item = {
        id: itemId,
        name: itemName,
        price: price
    };

    addToCart(item, restaurantId, restaurant.name);

    // Update UI
    document.getElementById(`add-btn-${itemId}`).style.display = 'none';
    document.getElementById(`qty-${itemId}`).style.display = 'flex';
    document.getElementById(`qty-value-${itemId}`).textContent = '1';

    // Update summary
    updateOrderSummary();
}

// ============ QUANTITY MANAGEMENT ============
// Increase item quantity in cart
function increaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity++;
        document.getElementById(`qty-value-${itemId}`).textContent = cartItem.quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateOrderSummary();
    }
}

// Decrease quantity
function decreaseQuantity(itemId) {
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            document.getElementById(`qty-value-${itemId}`).textContent = cartItem.quantity;
        } else {
            removeFromCart(itemId);
            document.getElementById(`add-btn-${itemId}`).style.display = 'block';
            document.getElementById(`qty-${itemId}`).style.display = 'none';
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateOrderSummary();
    }
}

// ============ ORDER SUMMARY ============
// Update and display order summary panel
function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    const summaryItemsContainer = document.getElementById('summaryItems');

    if (cart.length === 0) {
        summaryContainer.style.display = 'none';
        return;
    }

    summaryContainer.style.display = 'block';

    // Update items list
    summaryItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="summary-item-left">
                <div class="summary-item-qty">${item.quantity}</div>
                <span>${item.name}</span>
            </div>
            <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // Calculate and update totals
    const totals = calculateTotals();
    document.getElementById('subtotal').textContent = formatPrice(totals.subtotal);
    document.getElementById('deliveryFee').textContent = formatPrice(totals.deliveryFee);
    document.getElementById('gst').textContent = formatPrice(totals.gst);
    document.getElementById('total').textContent = formatPrice(totals.total);
}

// ============ PAGE INITIALIZATION ============
// Initialize restaurant detail page on load
document.addEventListener('DOMContentLoaded', () => {
    displayRestaurantDetails();

    // Update quantity controls for items already in cart
    cart.forEach(item => {
        const addBtn = document.getElementById(`add-btn-${item.id}`);
        const qtyControl = document.getElementById(`qty-${item.id}`);
        if (addBtn) {
            addBtn.style.display = 'none';
            qtyControl.style.display = 'flex';
            document.getElementById(`qty-value-${item.id}`).textContent = item.quantity;
        }
    });

    updateOrderSummary();
});
