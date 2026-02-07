document.addEventListener("DOMContentLoaded", () => {
  
  initRestaurantDetail();
});

async function initRestaurantDetail() {
  try {
    await displayRestaurantDetails();
    
    if (typeof updateCartCount === "function") {
      updateCartCount();
    }
    updateOrderSummary();
    initializeCartControls();
  } catch (error) {
    console.error("Critical error initializing page:", error);
  }
}

async function displayRestaurantDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  let restaurantId =
    urlParams.get("id") ||
    urlParams.get("restaurantId") ||
    localStorage.getItem("selectedRestaurant");
  
  restaurantId = String(restaurantId);

  if (!restaurantId) {
    console.warn("No restaurant ID found in URL or localStorage");
    window.location.href = "restaurants.html";
    return;
  }

  
  localStorage.setItem("selectedRestaurant", String(restaurantId));

  console.log("Fetching restaurant detail for ID:", restaurantId);
  try {
    const response = await api.getRestaurant(restaurantId);
    console.log("Restaurant API response:", response);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch restaurant data");
    }

    const restaurant = response.data.restaurant || response.data;
    console.log("Restaurant data:", restaurant);

    if (!restaurant) {
      throw new Error("Restaurant data is empty");
    }

    
    window.currentRestaurantDetail = restaurant;

    document.title = `${restaurant.name || "Restaurant"} - FoodHub`;
    renderHeader(restaurant);
    renderInfoStats(restaurant);

    
    if (!restaurant.menu || Object.keys(restaurant.menu).length === 0) {
      console.warn("No menu data returned from API");
      restaurant.menu = {};
    }

    renderMenuCategories(restaurant);
  } catch (error) {
    console.error("Error loading restaurant details:", error);
    let restaurant = null;

    
    if (
      typeof restaurantsData !== "undefined" &&
      Array.isArray(restaurantsData)
    ) {
      const numId = parseInt(restaurantId, 10);
      restaurant = restaurantsData.find(
        (r) =>
          (r.id && parseInt(r.id, 10) === numId) ||
          (r.restaurantId && parseInt(r.restaurantId, 10) === numId),
      );
      if (restaurant) {
        console.log(
          "[FALLBACK] Found restaurant in mock data:",
          restaurant.name,
        );
        window.currentRestaurantDetail = restaurant;
        document.title = `${restaurant.name || "Restaurant"} - FoodHub`;
        renderHeader(restaurant);
        renderInfoStats(restaurant);
        renderMenuCategories(restaurant);
        return;
      }
    }

    const header = document.getElementById("restaurantHeader");
    if (header) {
      header.innerHTML = `
                <div class="container" style="padding: 40px 20px; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff7a3d; margin-bottom: 15px;"></i>
                    <h2 style="margin-bottom: 10px;">Restaurant not found</h2>
                    <p style="color: #666; margin-bottom: 20px;">${error.message || "The restaurant you're looking for might have been moved or deleted."}</p>
                    <p style="font-size: 12px; color: #999;">ID: ${restaurantId}</p>
                    <a href="restaurants.html" class="btn btn-primary" style="display: inline-block; padding: 10px 25px; background: #ff7a3d; color: white; border-radius: 8px; text-decoration: none;">Back to Restaurants</a>
                </div>
            `;
    }
  }
}

function renderHeader(restaurant) {
  const headerContainer = document.getElementById("restaurantHeader");
  if (headerContainer) {
    const safeImage = restaurant.image || "images/authentic_pizza.png";
    headerContainer.innerHTML = `
            <div class="container">
                <div class="restaurant-banner">
                    <img src="${safeImage}" alt="${restaurant.name}" class="banner-img" onerror="this.onerror=null; this.src='images/authentic_pizza.png';">
                    <div class="banner-content">
                        <div>
                            <h1>${restaurant.name}</h1>
                            <p>${restaurant.cuisine || "Food"}</p>
                        </div>
                        <div class="restaurant-meta">
                            <span title="Rating">⭐ ${parseFloat(restaurant.rating || "4.5").toFixed(1)}</span>
                            <span title="Delivery Time">🕒 ${restaurant.deliveryTime || "30-40"} min</span>
                            <span title="Distance">📍 ${parseFloat(restaurant.distance || "2").toFixed(1)} km</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
}

function renderInfoStats(restaurant) {
  try {
    if (document.getElementById("restaurantRating"))
      document.getElementById("restaurantRating").textContent =
        restaurant.rating;
    if (document.getElementById("deliveryTime"))
      document.getElementById("deliveryTime").textContent =
        restaurant.deliveryTime;
    if (document.getElementById("deliveryCharge"))
      document.getElementById("deliveryCharge").textContent =
        restaurant.deliveryFee === 0 ? "Free" : "₹" + restaurant.deliveryFee;
    if (document.getElementById("cuisineType"))
      document.getElementById("cuisineType").textContent = restaurant.cuisine
        ? restaurant.cuisine.split(",")[0]
        : "Food";
  } catch (e) {
    console.warn("Error updating stats:", e);
  }
}

function renderMenuCategories(restaurant) {
  const categoriesList = document.getElementById("categoriesList");
  const menuContainer = document.getElementById("menuItemsContainer");

  if (!categoriesList || !menuContainer) return;

  if (!restaurant.menu || Object.keys(restaurant.menu).length === 0) {
    categoriesList.innerHTML = "<p>No menu available.</p>";
    menuContainer.innerHTML =
      '<p style="padding:20px;">Menu items not found for this restaurant.</p>';
    return;
  }

  const categories = Object.keys(restaurant.menu);

  
  const fragment = document.createDocumentFragment();
  categories.forEach((category, index) => {
    const safeCategory = category.replace(/'/g, "\\'");
    const btn = document.createElement("button");
    btn.className = `category-btn ${index === 0 ? "active" : ""}`;
    btn.textContent = category;
    btn.onclick = () => displayCategory(category);
    fragment.appendChild(btn);
  });

  categoriesList.innerHTML = "";
  categoriesList.appendChild(fragment);

  if (categories.length > 0) {
    displayCategory(categories[0]);
  }
}

function displayCategory(category) {
  const restaurant = window.currentRestaurantDetail;
  if (!restaurant) return;

  const btns = document.querySelectorAll(".category-btn");
  btns.forEach((btn) => {
    btn.classList.remove("active");
    if (btn.textContent.trim() === category) btn.classList.add("active");
  });

  const menuContainer = document.getElementById("menuItemsContainer");
  if (!menuContainer) return;

  if (!restaurant.menu || !restaurant.menu[category]) {
    menuContainer.innerHTML = "<p>No items in this category.</p>";
    return;
  }

  const items = restaurant.menu[category];

  const getPrice = (price) => {
    if (typeof formatPrice === "function") return formatPrice(price);
    return "₹" + price;
  };

  
  const fragment = document.createDocumentFragment();
  const section = document.createElement("div");
  section.className = "menu-category-section";

  const heading = document.createElement("h2");
  heading.textContent = category;
  heading.style.cssText =
    "color: var(--primary-color); margin-bottom: 20px; font-size: 20px;";
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "menu-items-grid";

  items.forEach((item) => {
    const safeName = item.name.replace(/'/g, "\\'");
    const safeImage = (item.image || "images/food-placeholder.jpg").replace(
      /'/g,
      "\\'",
    );
    const itemId = String(item.id);
    const itemPrice = parseFloat(item.price) || 0; 

    const card = document.createElement("div");
    card.className = "menu-item-card horizontal";
    card.innerHTML = `
      <div class="menu-item-image">
          <img src="${safeImage}" alt="${item.name}" onerror="this.src='images/food-placeholder.jpg'">
      </div>
      <div class="menu-item-details">
          <div class="menu-item-name">${item.name}</div>
          <div class="menu-item-description">${item.description || ""}</div>
          <div class="menu-item-price">${getPrice(itemPrice)}</div>
      </div>
      <div class="menu-item-actions">
          <button class="add-btn" id="add-btn-${itemId}" onclick="handleAddToCart('${itemId}', '${safeName}', ${itemPrice}, '${safeImage}')">
              Add +
          </button>
          <div class="quantity-control" id="qty-${itemId}" style="display: none;">
              <button class="qty-btn minus" onclick="handleDecreaseQuantity('${itemId}')">-</button>
              <span class="qty-value" id="qty-value-${itemId}">1</span>
              <button class="qty-btn plus" onclick="handleIncreaseQuantity('${itemId}')">+</button>
          </div>
      </div>
    `;
    grid.appendChild(card);
  });

  section.appendChild(grid);
  fragment.appendChild(section);

  menuContainer.innerHTML = "";
  menuContainer.appendChild(fragment);

  updateButtonStates();
}


window.handleAddToCart = async function (id, name, price, image) {
  const restaurant = window.currentRestaurantDetail;
  const restaurantId = restaurant
    ? String(restaurant.restaurantId || restaurant.id)
    : localStorage.getItem("selectedRestaurant");
  const restaurantName = restaurant ? restaurant.name : "Restaurant";

  if (typeof addToCart === "function") {
    try {
      console.log("Adding to cart:", {
        id,
        name,
        price,
        restaurantId,
        restaurantName,
      });
      const numPrice = parseFloat(price);
      await addToCart(id, name, numPrice, restaurantId, restaurantName, image);

      
      updateButtonStates();
      updateOrderSummary();

      
      setTimeout(() => {
        updateButtonStates();
        updateOrderSummary();
      }, 100);
    } catch (error) {
      console.error("Error in addToCart:", error);
      alert("Error adding to cart: " + error.message);
    }
  } else {
    console.error("addToCart function missing");
    alert("Cart functionality is currently unavailable.");
  }
};

window.handleIncreaseQuantity = async function (itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(
    (i) =>
      String(i.id) === String(itemId) ||
      String(i.menuItemId) === String(itemId),
  );
  if (item && typeof updateQuantity === "function") {
    await updateQuantity(itemId, item.quantity + 1);

    
    setTimeout(() => {
      updateButtonStates();
      updateOrderSummary();
    }, 100);
  }
};

window.handleDecreaseQuantity = async function (itemId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(
    (i) =>
      String(i.id) === String(itemId) ||
      String(i.menuItemId) === String(itemId),
  );
  if (item && typeof updateQuantity === "function") {
    await updateQuantity(itemId, item.quantity - 1);

    
    setTimeout(() => {
      updateButtonStates();
      updateOrderSummary();
    }, 100);
  }
};


window.addEventListener(
  "cartUpdated",
  () => {
    
    if (typeof updateButtonStates === "function") {
      updateButtonStates();
    }
    if (typeof updateOrderSummary === "function") {
      updateOrderSummary();
    }
    
  },
  { once: false },
);

function updateButtonStates() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    cart = [];
  }

  const allAddBtns = document.querySelectorAll(".add-btn");
  const allQtyControls = document.querySelectorAll(".quantity-control");

  
  allAddBtns.forEach((btn) => (btn.style.display = "flex"));
  allQtyControls.forEach((ctrl) => (ctrl.style.display = "none"));

  
  cart.forEach((cartItem) => {
    const itemId = cartItem.id || cartItem.menuItemId;
    const addBtn = document.getElementById(`add-btn-${itemId}`);
    const qtyControl = document.getElementById(`qty-${itemId}`);
    const qtyValue = document.getElementById(`qty-value-${itemId}`);

    if (addBtn && qtyControl) {
      addBtn.style.display = "none";
      qtyControl.style.display = "flex";
      if (qtyValue) qtyValue.textContent = cartItem.quantity;
    }
  });
}

function initializeCartControls() {
  updateButtonStates();
}

function updateOrderSummary() {
  const summaryContainer = document.querySelector(".order-summary");
  const summaryItems = document.getElementById("orderItems");

  console.log("updateOrderSummary called");
  console.log("summaryContainer:", summaryContainer);
  console.log("summaryItems:", summaryItems);

  if (!summaryContainer || !summaryItems) {
    console.error("Order summary elements not found!");
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart from localStorage:", cart);
  } catch (e) {
    console.error("Error parsing cart:", e);
    cart = [];
  }

  const urlParams = new URLSearchParams(window.location.search);
  let currentRestaurantId =
    urlParams.get("id") || urlParams.get("restaurantId");

  if (!currentRestaurantId || currentRestaurantId === "null") {
    currentRestaurantId =
      localStorage.getItem("selectedRestaurant") ||
      localStorage.getItem("currentRestaurant");
  }

  currentRestaurantId = String(currentRestaurantId || "");

  console.log("updateOrderSummary for restaurant:", currentRestaurantId);

  
  
  const currentItems = cart.filter((item) => {
    const itemRestId = String(item.restaurantId || "");

    
    if (itemRestId === currentRestaurantId && currentRestaurantId !== "")
      return true;

    
    if (window.currentRestaurantDetail) {
      const detailId = String(
        window.currentRestaurantDetail.restaurantId ||
        window.currentRestaurantDetail.id ||
        "",
      );
      if (itemRestId === detailId && detailId !== "") return true;
    }

    
    
    if (
      itemRestId === "" &&
      window.currentRestaurantDetail &&
      window.currentRestaurantDetail.menu
    ) {
      return Object.values(window.currentRestaurantDetail.menu)
        .flat()
        .some(
          (menuItem) =>
            String(menuItem.id) === String(item.id || item.menuItemId) ||
            String(menuItem.menuItemId) === String(item.id || item.menuItemId),
        );
    }

    return false;
  });

  console.log("Filtered items for this restaurant:", currentItems);

  if (currentItems.length === 0) {
    summaryItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';

    if (document.getElementById("subtotal"))
      document.getElementById("subtotal").textContent = "₹0";
    if (document.getElementById("finalTotal"))
      document.getElementById("finalTotal").textContent = "₹0";
    return;
  }

  const getPrice = (p) =>
    typeof formatPrice === "function"
      ? formatPrice(p)
      : "₹" + parseFloat(p).toFixed(0);

  summaryItems.innerHTML = currentItems
    .map((item) => {
      const itemPrice = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      const totalPrice = itemPrice * quantity;
      const itemId = String(item.id || item.menuItemId);

      return `
        <div class="summary-item">
            <div class="summary-item-left">
                <div class="summary-qty-controls">
                    <button class="qty-mini-btn" onclick="handleDecreaseQuantity('${itemId}')">−</button>
                    <span class="qty-mini-value">${quantity}x</span>
                    <button class="qty-mini-btn" onclick="handleIncreaseQuantity('${itemId}')">+</button>
                </div>
                <span class="summary-item-name">${item.name}</span>
            </div>
            <span class="summary-item-price">${getPrice(totalPrice)}</span>
        </div>
    `;
    })
    .join("");

  
  const subtotal = currentItems.reduce((sum, i) => {
    const price = parseFloat(i.price) || 0;
    const qty = parseInt(i.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const deliveryFee = subtotal > 0 ? 50 : 0;
  const gst = Math.ceil(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  
  if (document.getElementById("subtotal"))
    document.getElementById("subtotal").textContent = getPrice(subtotal);
  if (document.getElementById("deliveryFee"))
    document.getElementById("deliveryFee").textContent = getPrice(deliveryFee);
  if (document.getElementById("gst"))
    document.getElementById("gst").textContent = getPrice(gst);
  if (document.getElementById("finalTotal"))
    document.getElementById("finalTotal").textContent = getPrice(total);
}

window.handleClearCartAndReload = async function () {
  if (typeof clearCart === "function") {
    await clearCart();
  } else {
    localStorage.removeItem("cart");
    localStorage.removeItem("currentRestaurant");
    if (api.isAuthenticated()) {
      await api.clearCart();
    }
    window.location.reload();
  }
};
