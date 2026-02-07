
document.addEventListener('DOMContentLoaded', async function () {

    await loadRestaurants();


    setupSearchAndFilters();
});


async function loadRestaurants(filters = {}) {
    const restaurantsContainer = document.getElementById('restaurantsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (!restaurantsContainer) return;

    try {

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
        if (restaurantsContainer) {
            restaurantsContainer.innerHTML = '<p class="loading-text">Loading restaurants...</p>';
        }


        const response = await api.getRestaurants(filters);

        if (response.success && response.data.restaurants) {
            const restaurants = response.data.restaurants;

            if (restaurants.length === 0) {
                restaurantsContainer.innerHTML = `
                    <div class="no-results">
                        <h3>No restaurants found</h3>
                        <p>Try adjusting your filters or search criteria</p>
                    </div>
                `;
                return;
            }


            displayRestaurants(restaurants);
        } else {
            throw new Error('Failed to load restaurants');
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);


        if (restaurantsContainer) {
            restaurantsContainer.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load restaurants</h3>
                    <p>${error.message}</p>
                    <button onclick="loadRestaurants()" class="retry-btn">Retry</button>
                </div>
            `;
        }


        loadSampleRestaurants();
    } finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}


function displayRestaurants(restaurants) {
    const restaurantsContainer = document.getElementById('restaurantsContainer');
    if (!restaurantsContainer) return;

    restaurantsContainer.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card" data-id="${restaurant.restaurantId}">
            <div class="restaurant-image">
                <img src="${restaurant.image || 'images/restaurant-placeholder.jpg'}" 
                     alt="${restaurant.name}"
                     onerror="this.src='images/restaurant-placeholder.jpg'">
                
                <div class="image-overlay">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-meta-overlay">
                        <span class="rating">
                            <i class="fas fa-star"></i> ${restaurant.rating || '4.0'}
                        </span>
                        <span class="dot">•</span>
                        <span class="delivery-time">${restaurant.deliveryTime || '30'} mins</span>
                        <span class="dot">•</span>
                        <span class="price">${restaurant.price || '₹200-500'}</span>
                    </div>
                </div>

                ${restaurant.isOpen ?
            '<span class="status-badge open">Open</span>' :
            '<span class="status-badge closed">Closed</span>'
        }
            </div>
            <div class="restaurant-info">
                <div class="info-row">
                    <p class="cuisine">${restaurant.cuisine || 'Multi-Cuisine'}</p>
                    ${restaurant.deliveryFee === 0 ? '<span class="free-delivery">Free Delivery</span>' : ''}
                </div>
                <div class="location-row" style="color: #666; font-size: 0.85rem; margin-bottom: 12px; display: flex; align-items: center; gap: 5px;">
                    <i class="fas fa-map-marker-alt" style="color: #ff7a3d;"></i>
                    <span class="location-text">${restaurant.address || '2.5 km away'}</span>
                </div>
                <button class="view-menu-btn" onclick="viewRestaurant('${restaurant.restaurantId}')">
                    View Menu <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}


function viewRestaurant(restaurantId) {
    localStorage.setItem('selectedRestaurant', restaurantId);
    window.location.href = `restaurant-detail.html?id=${restaurantId}`;
}


function setupSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const sortFilter = document.getElementById('sortFilter');
    const ratingFilter = document.getElementById('ratingFilter');


    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 500);
        });
    }


    [cuisineFilter, sortFilter, ratingFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}


function applyFilters() {
    const filters = {};

    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        filters.search = searchInput.value;
    }

    const cuisineFilter = document.getElementById('cuisineFilter');
    if (cuisineFilter && cuisineFilter.value) {
        filters.cuisine = cuisineFilter.value;
    }

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter && sortFilter.value) {
        filters.sort = sortFilter.value;
    }

    const ratingFilter = document.getElementById('ratingFilter');
    if (ratingFilter && ratingFilter.value) {
        filters.minRating = ratingFilter.value;
    }

    loadRestaurants(filters);
}


function loadSampleRestaurants() {
    const sampleRestaurants = [
        {
            id: 1,
            name: "Pizza Paradise",
            cuisine: "Italian, Pizza",
            rating: 4.5,
            deliveryTime: 30,
            deliveryFee: 30,
            minOrder: 200,
            image: "images/pizza-restaurant.jpg",
            isOpen: true
        },
        {
            id: 2,
            name: "Burger Barn",
            cuisine: "American, Burgers",
            rating: 4.3,
            deliveryTime: 25,
            deliveryFee: 25,
            minOrder: 150,
            image: "images/burger-restaurant.jpg",
            isOpen: true
        },
        {
            id: 3,
            name: "Sushi Station",
            cuisine: "Japanese, Sushi",
            rating: 4.7,
            deliveryTime: 40,
            deliveryFee: 40,
            minOrder: 300,
            image: "images/sushi-restaurant.jpg",
            isOpen: true
        },
        {
            id: 4,
            name: "Spice Garden",
            cuisine: "Indian, North Indian",
            rating: 4.4,
            deliveryTime: 35,
            deliveryFee: 30,
            minOrder: 200,
            image: "images/indian-restaurant.jpg",
            isOpen: true
        },
        {
            id: 5,
            name: "Taco Fiesta",
            cuisine: "Mexican, Tacos",
            rating: 4.2,
            deliveryTime: 30,
            deliveryFee: 25,
            minOrder: 180,
            image: "images/mexican-restaurant.jpg",
            isOpen: true
        },
        {
            id: 6,
            name: "Noodle House",
            cuisine: "Chinese, Asian",
            rating: 4.6,
            deliveryTime: 35,
            deliveryFee: 30,
            minOrder: 200,
            image: "images/chinese-restaurant.jpg",
            isOpen: true
        }
    ];

    displayRestaurants(sampleRestaurants);
}


async function loadRestaurantDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        window.location.href = '/restaurants.html';
        return;
    }

    try {

        const detailContainer = document.getElementById('restaurantDetail');
        if (detailContainer) {
            detailContainer.innerHTML = '<p class="loading-text">Loading restaurant details...</p>';
        }


        const response = await api.getRestaurant(restaurantId);

        if (response.success && response.data.restaurant) {
            displayRestaurantDetail(response.data.restaurant);


            await loadRestaurantMenu(restaurantId);
        } else {
            throw new Error('Restaurant not found');
        }
    } catch (error) {
        console.error('Error loading restaurant:', error);
        showNotification(error.message || 'Failed to load restaurant details', 'error');
    }
}


function displayRestaurantDetail(restaurant) {
    const detailContainer = document.getElementById('restaurantDetail');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
        <div class="restaurant-header">
            <img src="${restaurant.coverImage || restaurant.image || 'images/restaurant-placeholder.jpg'}" 
                 alt="${restaurant.name}"
                 class="restaurant-cover">
            <div class="restaurant-header-info">
                <h1>${restaurant.name}</h1>
                <p class="cuisine">${restaurant.cuisine || 'Multi-Cuisine'}</p>
                <div class="restaurant-stats">
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${restaurant.rating || '4.0'}
                        (${restaurant.totalReviews || 0} reviews)
                    </span>
                    <span class="delivery-time">
                        <i class="fas fa-clock"></i>
                        ${restaurant.deliveryTime || '30'} mins
                    </span>
                    <span class="delivery-fee">
                        <i class="fas fa-rupee-sign"></i>
                        ${restaurant.deliveryFee || '0'} delivery fee
                    </span>
                </div>
                ${restaurant.description ? `<p class="description">${restaurant.description}</p>` : ''}
            </div>
        </div>
    `;
}


async function loadRestaurantMenu(restaurantId) {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;

    try {
        const response = await api.getRestaurantMenu(restaurantId);

        if (response.success && response.data.menuItems) {
            displayMenu(response.data.menuItems, restaurantId);
        } else {
            throw new Error('Failed to load menu');
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        menuContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load menu. Please try again later.</p>
            </div>
        `;
    }
}


function displayMenu(menuItems, restaurantId) {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;


    const categories = {};
    menuItems.forEach(item => {
        const category = item.category || 'Other';
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(item);
    });


    menuContainer.innerHTML = Object.keys(categories).map(category => `
        <div class="menu-category">
            <h2 class="category-title">${category}</h2>
            <div class="menu-items">
                ${categories[category].map(item => `
                    <div class="menu-item" data-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image || 'images/food-placeholder.jpg'}" 
                                 alt="${item.name}"
                                 onerror="this.src='images/food-placeholder.jpg'">
                            ${item.isVegetarian ? '<span class="veg-badge">🟢</span>' : '<span class="non-veg-badge">🔴</span>'}
                        </div>
                        <div class="item-info">
                            <h3>${item.name}</h3>
                            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                            <div class="item-meta">
                                <span class="price">₹${item.price}</span>
                                ${item.rating ? `
                                    <span class="rating">
                                        <i class="fas fa-star"></i>
                                        ${item.rating}
                                    </span>
                                ` : ''}
                            </div>
                            <button class="add-to-cart-btn" onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}', ${item.price}, '${restaurantId}', '${item.restaurantName || 'Restaurant'}', '${item.image || ''}')"
                                    ${!item.isAvailable ? 'disabled' : ''}>
                                 ${item.isAvailable ? 'Add to Cart' : 'Not Available'}
                             </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}





if (api.isAuthenticated()) {
    if (typeof updateCartCount === 'function') updateCartCount();
}


if (window.location.pathname.includes('restaurant-detail.html')) {
    loadRestaurantDetail();
}
