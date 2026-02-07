async function displayRestaurants(restaurants = null) {
  const grid = document.getElementById("restaurantsGrid");
  if (!grid) return;

  try {
    if (!restaurants) {
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get("location");

      const response = await api.getRestaurants(location ? { location } : {});
      if (response.success && response.data && response.data.restaurants) {
        restaurants = response.data.restaurants;
      } else {
        restaurants = response.data || [];
      }
    }

    if (restaurants.length === 0) {
      grid.innerHTML =
        '<p style="text-align:center; padding: 20px;">No restaurants found.</p>';
      return;
    }

    
    const fragment = document.createDocumentFragment();
    restaurants.forEach((restaurant) => {
      const resId = restaurant.restaurantId || restaurant.id;
      const card = document.createElement("div");
      card.className = "restaurant-card";
      card.onclick = () => goToRestaurant(resId);
      card.innerHTML = `
        <div class="restaurant-image">
            <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy" onerror="this.src='images/restaurant-placeholder.jpg'">
            <div class="image-overlay">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-meta-overlay">
                    <span class="rating">
                        <i class="fas fa-star"></i> ${restaurant.rating}
                    </span>
                    <span class="dot">•</span>
                    <span class="delivery-time">${restaurant.deliveryTime} min</span>
                    <span class="dot">•</span>
                    <span class="price">${restaurant.price}</span>
                </div>
            </div>
            ${restaurant.isOpen !== false ? '<span class="status-badge open">Open</span>' : '<span class="status-badge closed">Closed</span>'}
        </div>
        <div class="restaurant-info">
            <div class="info-row">
                <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                ${restaurant.deliveryFee === 0 ? '<span class="free-delivery">Free Delivery</span>' : ""}
            </div>
        </div>
      `;
      fragment.appendChild(card);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  } catch (error) {
    console.error("Error loading restaurants:", error);
    grid.innerHTML = `
      <div style="text-align:center; padding: 40px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #ff7a3d; margin-bottom: 15px;"></i>
        <h3 style="margin-bottom: 10px;">Error Loading Restaurants</h3>
        <p style="color: #666; margin-bottom: 20px;">
          ${error.message || "Unable to connect to the server. Please make sure the backend is running."}
        </p>
        <button onclick="location.reload()" class="btn btn-primary" style="padding: 10px 25px; background: #ff7a3d; color: white; border: none; border-radius: 8px; cursor: pointer;">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

function goToRestaurant(restaurantId) {
  localStorage.setItem("selectedRestaurant", restaurantId);
  
  window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}

function filterByCategory(category) {
  const restaurants = restaurantsData.filter((r) => {
    const items = Object.values(r.menu).flat();
    return items.some((item) =>
      item.name.toLowerCase().includes(category.toLowerCase()),
    );
  });
  displayRestaurants(restaurants);
}

function applyFilters() {
  const sortFilter = document.getElementById("sortFilter");
  const cuisineFilter = document.getElementById("cuisineFilter");
  const ratingFilter = document.getElementById("ratingFilter");
  const dietFilter = document.getElementById("dietFilter");
  const searchInput = document.getElementById("searchInput");

  let filtered = [...restaurantsData];

  if (searchInput && searchInput.value) {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.cuisine.toLowerCase().includes(term),
    );
  }

  if (cuisineFilter && cuisineFilter.value) {
    filtered = filtered.filter((r) => r.cuisine.includes(cuisineFilter.value));
  }

  if (dietFilter && dietFilter.value !== "all") {
    if (dietFilter.value === "veg") {
      filtered = filtered.filter((r) => r.isVeg === true);
    } else if (dietFilter.value === "non-veg") {
      filtered = filtered.filter((r) => !r.isVeg);
    }
  }

  if (ratingFilter && ratingFilter.value) {
    const minRating = parseFloat(ratingFilter.value);
    if (!isNaN(minRating)) {
      filtered = filtered.filter((r) => r.rating >= minRating);
    }
  }

  if (sortFilter && sortFilter.value) {
    if (typeof sortRestaurants === "function") {
      filtered = sortRestaurants(filtered, sortFilter.value);
    } else {
      console.error("sortRestaurants function is missing!");
    }
  }

  displayRestaurants(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value;
      if (query.trim()) {
        const results = searchRestaurants(query);
        displayRestaurants(results);
      } else {
        displayRestaurants();
      }
    });
  }

  displayRestaurants();

  const urlParams = new URLSearchParams(window.location.search);
  const cuisineParam = urlParams.get("cuisine");
  const sortParam = urlParams.get("sort");

  if (cuisineParam) {
    const cuisineDropdown = document.getElementById("cuisineFilter");
    if (cuisineDropdown) {
      cuisineDropdown.value = cuisineParam;
    }
  }

  if (sortParam) {
    const sortDropdown = document.getElementById("sortFilter");
    if (sortDropdown) sortDropdown.value = sortParam;
  }

  if (
    document.getElementById("sortFilter") ||
    document.getElementById("cuisineFilter")
  ) {
    applyFilters();
  }
});
