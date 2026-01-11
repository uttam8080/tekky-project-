
function displayRestaurants(restaurants = restaurantsData) {
    const grid = document.getElementById('restaurantsGrid');
    if (!grid) return;

    grid.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" onclick="goToRestaurant(${restaurant.id})">
            <div class="restaurant-image">
                ${restaurant.image}
                <div class="restaurant-badge">${restaurant.rating} ⭐</div>
            </div>
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                <div class="restaurant-meta">
                    <span><i class="fas fa-motorcycle"></i> ${restaurant.deliveryTime} min</span>
                    <span><i class="fas fa-rupee-sign"></i> ${restaurant.deliveryFee === 0 ? 'Free' : restaurant.deliveryFee}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${restaurant.distance} km</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============ NAVIGATION ============
// Navigate to restaurant detail page
function goToRestaurant(restaurantId) {
    localStorage.setItem('selectedRestaurant', restaurantId);
    window.location.href = 'restaurant-detail.html';
}

// ============ FILTER FUNCTIONS ============
// Filter restaurants by food category
function filterByCategory(category) {
    const restaurants = restaurantsData.filter(r => {
        const items = Object.values(r.menu).flat();
        return items.some(item => item.name.toLowerCase().includes(category.toLowerCase()));
    });
    displayRestaurants(restaurants);
}

// ============ RESTAURANT PAGE FILTERS ============
// Apply multiple filters (cuisine, rating, sort) on restaurants page
function applyFilters() {
    const sortFilter = document.getElementById('sortFilter');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const ratingFilter = document.getElementById('ratingFilter');

    if (!sortFilter) return;

    let filtered = [...restaurantsData];

    // Filter by cuisine
    if (cuisineFilter && cuisineFilter.value) {
        filtered = filtered.filter(r => r.cuisine.includes(cuisineFilter.value));
    }

    // Filter by rating
    if (ratingFilter && ratingFilter.value) {
        filtered = filtered.filter(r => r.rating >= parseFloat(ratingFilter.value));
    }

    // Sort
    if (sortFilter && sortFilter.value) {
        filtered = sortRestaurants(filtered, sortFilter.value);
    }

    displayRestaurants(filtered);
}

// ============ SEARCH INITIALIZATION ============
// Initialize search functionality on page load
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim()) {
                const results = searchRestaurants(query);
                displayRestaurants(results);
            } else {
                displayRestaurants();
            }
        });
    }

    // Display initial restaurants
    displayRestaurants();

    // Apply filters if on restaurants page
    if (document.getElementById('sortFilter')) {
        applyFilters();
    }
});
