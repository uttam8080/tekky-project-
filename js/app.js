
const restaurantsData = [
    {
        id: 1,
        name: 'Pizza Paradise',
        cuisine: 'Italian, Pizza',
        rating: 4.5,
        deliveryTime: 30,
        deliveryFee: 0,
        distance: 2,
        price: '₹200-500',
        image: '🍕',
        menu: {
            'Pizzas': [
                { id: 1, name: 'Margherita', price: 299, description: 'Classic cheese pizza' },
                { id: 2, name: 'Pepperoni', price: 399, description: 'Loaded with pepperoni' },
                { id: 3, name: 'Veggie Supreme', price: 349, description: 'Fresh vegetables' },
                { id: 100, name: 'BBQ Chicken', price: 449, description: 'Smoky BBQ chicken pizza' },
                { id: 101, name: 'Four Cheese', price: 429, description: 'Mozzarella, parmesan, feta, cheddar' },
                { id: 102, name: 'Meat Lovers', price: 499, description: 'Pepperoni, sausage, bacon' }
            ],
            'Sides': [
                { id: 4, name: 'Garlic Bread', price: 149, description: 'Crispy garlic bread' },
                { id: 5, name: 'Cheesy Fries', price: 199, description: 'Loaded with cheese' },
                { id: 103, name: 'Mozzarella Sticks', price: 249, description: '6 pieces of crispy mozzarella' },
                { id: 104, name: 'Buffalo Wings', price: 299, description: '8 spicy buffalo wings' }
            ],
            'Drinks': [
                { id: 105, name: 'Coca Cola', price: 99, description: 'Chilled cola (250ml)' },
                { id: 106, name: 'Sprite', price: 99, description: 'Lemon-lime soda (250ml)' },
                { id: 107, name: 'Iced Tea', price: 119, description: 'Refreshing iced tea (300ml)' },
                { id: 108, name: 'Fresh Juice', price: 149, description: 'Mixed fruit juice (200ml)' }
            ]
        }
    },
    {
        id: 2,
        name: 'Burger Barn',
        cuisine: 'American, Burgers',
        rating: 4.3,
        deliveryTime: 25,
        deliveryFee: 0,
        distance: 1.5,
        price: '₹150-400',
        image: '🍔',
        menu: {
            'Burgers': [
                { id: 6, name: 'Classic Burger', price: 249, description: 'Juicy beef patty' },
                { id: 7, name: 'Cheese Burger', price: 299, description: 'With melted cheese' },
                { id: 8, name: 'Double Stack', price: 399, description: 'Two patties' },
                { id: 109, name: 'Bacon Burger', price: 349, description: 'Crispy bacon with cheese' },
                { id: 110, name: 'Mushroom Swiss', price: 349, description: 'Sautéed mushrooms & Swiss cheese' },
                { id: 111, name: 'Spicy Jalapeño', price: 329, description: 'Hot jalapeños & pepper jack cheese' }
            ],
            'Sides': [
                { id: 9, name: 'Fries', price: 99, description: 'Golden crispy fries' },
                { id: 10, name: 'Onion Rings', price: 149, description: 'Crispy rings' },
                { id: 112, name: 'Coleslaw', price: 129, description: 'Fresh vegetable coleslaw' },
                { id: 113, name: 'Mac & Cheese', price: 199, description: 'Creamy mac and cheese' }
            ],
            'Drinks': [
                { id: 114, name: 'Milkshake', price: 149, description: 'Vanilla, chocolate or strawberry' },
                { id: 115, name: 'Iced Coffee', price: 129, description: 'Chilled coffee (300ml)' },
                { id: 116, name: 'Root Beer Float', price: 179, description: 'Root beer with vanilla ice cream' },
                { id: 117, name: 'Lemonade', price: 99, description: 'Homemade fresh lemonade' }
            ]
        }
    },
    {
        id: 3,
        name: 'Sushi Sensation',
        cuisine: 'Japanese, Sushi',
        rating: 4.7,
        deliveryTime: 40,
        deliveryFee: 50,
        distance: 3,
        price: '₹400-800',
        image: '🍣',
        menu: {
            'Rolls': [
                { id: 11, name: 'California Roll', price: 349, description: 'Crab, avocado' },
                { id: 12, name: 'Spicy Tuna', price: 399, description: 'Tuna with spices' },
                { id: 13, name: 'Dragon Roll', price: 449, description: 'Eel, avocado' },
                { id: 118, name: 'Philadelphia Roll', price: 399, description: 'Salmon, cream cheese, avocado' },
                { id: 119, name: 'Rainbow Roll', price: 499, description: 'Assorted fish over inside-out roll' }
            ],
            'Appetizers': [
                { id: 14, name: 'Edamame', price: 149, description: 'Steamed soybeans' },
                { id: 15, name: 'Gyoza', price: 249, description: 'Fried dumplings' },
                { id: 120, name: 'Tempura', price: 299, description: 'Fried vegetables & shrimp' },
                { id: 121, name: 'Seaweed Salad', price: 199, description: 'Fresh seaweed with sesame' }
            ],
            'Drinks': [
                { id: 122, name: 'Sake', price: 299, description: 'Traditional Japanese rice wine' },
                { id: 123, name: 'Mango Juice', price: 139, description: 'Fresh mango juice (250ml)' },
                { id: 124, name: 'Green Tea', price: 99, description: 'Hot Japanese green tea' },
                { id: 125, name: 'Yuzu Lemonade', price: 149, description: 'Citrus Japanese lemonade' }
            ]
        }
    },
    {
        id: 4,
        name: 'Biryani Palace',
        cuisine: 'Indian, Biryani',
        rating: 4.6,
        deliveryTime: 35,
        deliveryFee: 20,
        distance: 2.5,
        price: '₹250-500',
        image: '🍚',
        menu: {
            'Biryani': [
                { id: 16, name: 'Chicken Biryani', price: 299, description: 'Fragrant rice & chicken' },
                { id: 17, name: 'Mutton Biryani', price: 399, description: 'Tender mutton' },
                { id: 18, name: 'Vegetable Biryani', price: 249, description: 'Mixed vegetables' },
                { id: 126, name: 'Fish Biryani', price: 349, description: 'Fresh fish with aromatic rice' },
                { id: 127, name: 'Shrimp Biryani', price: 379, description: 'Juicy prawns in biryani' }
            ],
            'Breads': [
                { id: 19, name: 'Naan', price: 49, description: 'Soft naan bread' },
                { id: 20, name: 'Butter Naan', price: 69, description: 'With butter' },
                { id: 128, name: 'Paratha', price: 59, description: 'Layered Indian flatbread' },
                { id: 129, name: 'Tandoori Roti', price: 39, description: 'Whole wheat roti' }
            ],
            'Curries': [
                { id: 130, name: 'Butter Chicken', price: 349, description: 'Creamy tomato-based curry' },
                { id: 131, name: 'Paneer Tikka Masala', price: 299, description: 'Cottage cheese in spiced gravy' }
            ],
            'Drinks': [
                { id: 132, name: 'Mango Lassi', price: 129, description: 'Sweet yogurt drink (300ml)' },
                { id: 133, name: 'Masala Chai', price: 49, description: 'Spiced Indian tea' },
                { id: 134, name: 'Jaljeera', price: 79, description: 'Spiced cumin water' },
                { id: 135, name: 'Thandai', price: 159, description: 'Sweet milk preparation' }
            ]
        }
    },
    {
        id: 5,
        name: 'Dragon Wok',
        cuisine: 'Chinese, Asian',
        rating: 4.4,
        deliveryTime: 30,
        deliveryFee: 30,
        distance: 1.8,
        price: '₹200-450',
        image: '🥢',
        menu: {
            'Noodles': [
                { id: 21, name: 'Chow Mein', price: 229, description: 'Stir-fried noodles' },
                { id: 22, name: 'Hakka Noodles', price: 249, description: 'Hakka style' },
                { id: 23, name: 'Singapore Noodles', price: 279, description: 'Spicy noodles' },
                { id: 136, name: 'Pad Thai Noodles', price: 269, description: 'Sweet & spicy Thai noodles' },
                { id: 137, name: 'Chili Garlic Noodles', price: 239, description: 'With extra chili & garlic' }
            ],
            'Rice': [
                { id: 24, name: 'Fried Rice', price: 249, description: 'Egg fried rice' },
                { id: 25, name: 'Vegetable Fried Rice', price: 229, description: 'With veggies' },
                { id: 138, name: 'Chicken Fried Rice', price: 279, description: 'With shredded chicken' },
                { id: 139, name: 'Shrimp Fried Rice', price: 299, description: 'With succulent shrimp' }
            ],
            'Curries': [
                { id: 140, name: 'Kung Pao', price: 289, description: 'Spicy chicken with peanuts' },
                { id: 141, name: 'Mongolian Beef', price: 329, description: 'Tender beef in savory sauce' }
            ],
            'Drinks': [
                { id: 142, name: 'Thai Iced Tea', price: 129, description: 'Sweet Thai orange tea (300ml)' },
                { id: 143, name: 'Lychee Juice', price: 139, description: 'Sweet lychee juice (250ml)' },
                { id: 144, name: 'Ginger Ale', price: 99, description: 'Spiced ginger ale (250ml)' },
                { id: 145, name: 'Tamarind Drink', price: 119, description: 'Tangy tamarind beverage' }
            ]
        }
    },
    {
        id: 6,
        name: 'Sweet Dreams',
        cuisine: 'Desserts, Bakery',
        rating: 4.8,
        deliveryTime: 20,
        deliveryFee: 0,
        distance: 1,
        price: '₹100-300',
        image: '🍰',
        menu: {
            'Cakes': [
                { id: 26, name: 'Chocolate Cake', price: 299, description: 'Rich chocolate' },
                { id: 27, name: 'Cheesecake', price: 349, description: 'Creamy cheesecake' },
                { id: 28, name: 'Carrot Cake', price: 279, description: 'Moist carrot cake' },
                { id: 146, name: 'Black Forest Cake', price: 399, description: 'Chocolate with cherries' },
                { id: 147, name: 'Vanilla Sponge', price: 249, description: 'Light vanilla sponge cake' }
            ],
            'Pastries': [
                { id: 29, name: 'Croissant', price: 149, description: 'Buttery croissant' },
                { id: 30, name: 'Eclair', price: 179, description: 'Chocolate eclair' },
                { id: 148, name: 'Donut', price: 99, description: 'Glazed or chocolate donut' },
                { id: 149, name: 'Danish Pastry', price: 159, description: 'Flaky pastry with filling' }
            ],
            'Ice Cream': [
                { id: 150, name: 'Vanilla', price: 129, description: 'Classic vanilla ice cream' },
                { id: 151, name: 'Strawberry', price: 129, description: 'Fresh strawberry ice cream' },
                { id: 152, name: 'Cookie Crumble', price: 159, description: 'Vanilla with cookie pieces' }
            ],
            'Drinks': [
                { id: 153, name: 'Hot Chocolate', price: 129, description: 'Rich hot chocolate (300ml)' },
                { id: 154, name: 'Coffee', price: 99, description: 'Fresh brewed coffee (250ml)' },
                { id: 155, name: 'Espresso', price: 119, description: 'Strong espresso shot (60ml)' },
                { id: 156, name: 'Cappuccino', price: 149, description: 'Coffee with milk foam (300ml)' }
            ]
        }
    },
    {
        id: 7,
        name: 'Taco Fiesta',
        cuisine: 'Mexican, Fast Food',
        rating: 4.4,
        deliveryTime: 22,
        deliveryFee: 0,
        distance: 1.2,
        price: '₹150-350',
        image: '🌮',
        menu: {
            'Tacos': [
                { id: 200, name: 'Beef Tacos', price: 249, description: 'Seasoned beef with lettuce & cheese' },
                { id: 201, name: 'Chicken Tacos', price: 229, description: 'Grilled chicken tacos' },
                { id: 202, name: 'Fish Tacos', price: 279, description: 'Crispy fish with pico de gallo' },
                { id: 203, name: 'Veggie Tacos', price: 199, description: 'Mixed vegetables & beans' }
            ],
            'Burritos': [
                { id: 204, name: 'Beef Burrito', price: 299, description: 'Wrapped with beans & rice' },
                { id: 205, name: 'Chicken Burrito', price: 279, description: 'Grilled chicken burrito' },
                { id: 206, name: 'Supreme Burrito', price: 349, description: 'Extra cheese, guac & sour cream' }
            ],
            'Sides': [
                { id: 207, name: 'Nachos', price: 199, description: 'Crispy nachos with cheese dip' },
                { id: 208, name: 'Churros', price: 149, description: 'Fried dough with cinnamon' },
                { id: 209, name: 'Quesadilla', price: 229, description: 'Cheese & meat quesadilla' }
            ],
            'Drinks': [
                { id: 210, name: 'Horchata', price: 119, description: 'Sweet rice milk drink' },
                { id: 211, name: 'Agua Fresca', price: 99, description: 'Refreshing fruit water' },
                { id: 212, name: 'Margarita Mix', price: 149, description: 'Non-alcoholic margarita' }
            ]
        }
    },
    {
        id: 8,
        name: 'Subway Express',
        cuisine: 'Sandwiches, Fast Food',
        rating: 4.5,
        deliveryTime: 18,
        deliveryFee: 0,
        distance: 0.8,
        price: '₹150-300',
        image: '🥪',
        menu: {
            'Sandwiches': [
                { id: 300, name: 'Italian BMT', price: 249, description: 'Ham, turkey, pepperoni' },
                { id: 301, name: 'Tuna', price: 229, description: 'Fresh tuna salad' },
                { id: 302, name: 'Meatball Marinara', price: 269, description: 'Meatballs with marinara' },
                { id: 303, name: 'Veggie Delite', price: 199, description: 'Fresh vegetables' }
            ],
            'Six Inch': [
                { id: 304, name: 'Chicken Teriyaki', price: 219, description: '6 inch chicken teriyaki' },
                { id: 305, name: 'Turkey Breast', price: 209, description: '6 inch turkey breast' },
                { id: 306, name: 'Roast Beef', price: 229, description: '6 inch roast beef' }
            ],
            'Salads': [
                { id: 307, name: 'Italian Salad', price: 199, description: 'Classic Italian salad' },
                { id: 308, name: 'Asian Salad', price: 189, description: 'Asian vegetables & dressing' }
            ],
            'Drinks': [
                { id: 309, name: 'Bottled Water', price: 49, description: 'Purified bottled water' },
                { id: 310, name: 'Soft Drink', price: 79, description: 'Various sodas available' },
                { id: 311, name: 'Smoothie', price: 129, description: 'Fresh fruit smoothies' }
            ]
        }
    },
    {
        id: 9,
        name: 'Pasta Palace',
        cuisine: 'Italian, Pasta',
        rating: 4.6,
        deliveryTime: 35,
        deliveryFee: 20,
        distance: 2.8,
        price: '₹300-600',
        image: '🍝',
        menu: {
            'Pasta': [
                { id: 400, name: 'Spaghetti Carbonara', price: 349, description: 'Creamy bacon pasta' },
                { id: 401, name: 'Penne Arrabbiata', price: 329, description: 'Spicy red sauce' },
                { id: 402, name: 'Fettuccine Alfredo', price: 379, description: 'Creamy parmesan sauce' },
                { id: 403, name: 'Lasagna', price: 399, description: 'Layered meat sauce & cheese' }
            ],
            'Risotto': [
                { id: 404, name: 'Mushroom Risotto', price: 349, description: 'Creamy mushroom risotto' },
                { id: 405, name: 'Seafood Risotto', price: 429, description: 'Shrimp & fish risotto' }
            ],
            'Appetizers': [
                { id: 406, name: 'Bruschetta', price: 199, description: 'Toasted bread with toppings' },
                { id: 407, name: 'Calamari Fritti', price: 299, description: 'Fried squid rings' },
                { id: 408, name: 'Garlic Knots', price: 149, description: 'Garlic flavored knots' }
            ],
            'Drinks': [
                { id: 409, name: 'Red Wine', price: 299, description: 'Italian red wine' },
                { id: 410, name: 'Sparkling Water', price: 79, description: 'San Pellegrino water' },
                { id: 411, name: 'Italian Soda', price: 119, description: 'Flavored Italian soda' }
            ]
        }
    },
    {
        id: 10,
        name: 'Salad Station',
        cuisine: 'Healthy, Salads',
        rating: 4.7,
        deliveryTime: 20,
        deliveryFee: 0,
        distance: 1.3,
        price: '₹250-450',
        image: '🥗',
        menu: {
            'Salads': [
                { id: 500, name: 'Caesar Salad', price: 299, description: 'Romaine, croutons, parmesan' },
                { id: 501, name: 'Greek Salad', price: 329, description: 'Feta, olives, tomatoes' },
                { id: 502, name: 'Asian Fusion', price: 349, description: 'Mixed greens with sesame' },
                { id: 503, name: 'Garden Fresh', price: 279, description: 'Mixed vegetables & herbs' }
            ],
            'Bowls': [
                { id: 504, name: 'Buddha Bowl', price: 349, description: 'Quinoa, chickpeas, veggies' },
                { id: 505, name: 'Poke Bowl', price: 399, description: 'Tuna, rice, vegetables' },
                { id: 506, name: 'Grain Bowl', price: 319, description: 'Brown rice, beans, greens' }
            ],
            'Wraps': [
                { id: 507, name: 'Chicken Wrap', price: 289, description: 'Grilled chicken & veggies' },
                { id: 508, name: 'Falafel Wrap', price: 269, description: 'Crispy falafel wrap' }
            ],
            'Drinks': [
                { id: 509, name: 'Green Juice', price: 149, description: 'Organic green juice' },
                { id: 510, name: 'Protein Shake', price: 179, description: 'Protein powder shake' },
                { id: 511, name: 'Detox Water', price: 99, description: 'Infused water' }
            ]
        }
    }
];

// ============ CART STATE MANAGEMENT ============
// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentRestaurant = localStorage.getItem('currentRestaurant');

// ============ CART FUNCTIONS ============
// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Helper function to add item to cart after restaurant confirmation
function addItemToRestaurant(item, restaurantId, restaurantName) {
    const existingItem = cart.find(i => i.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            restaurantId,
            restaurantName,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Added to cart!');
}

// Add item to cart
function addToCart(item, restaurantId, restaurantName) {
    // If user switches restaurant, use modal confirmation instead of browser confirm
    if (currentRestaurant && currentRestaurant !== restaurantId.toString()) {
        confirmAction(
            'Switch Restaurant',
            'Your cart contains items from another restaurant. Clear it to add items from this restaurant?',
            function() {
                // User confirmed - clear cart and add new item
                cart = [];
                currentRestaurant = restaurantId;
                localStorage.setItem('currentRestaurant', restaurantId);
                addItemToRestaurant(item, restaurantId, restaurantName);
            },
            function() {
                // User cancelled - do nothing
                return;
            }
        );
        return;
    }

    currentRestaurant = restaurantId;
    localStorage.setItem('currentRestaurant', restaurantId);
    addItemToRestaurant(item, restaurantId, restaurantName);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    if (cart.length === 0) {
        currentRestaurant = null;
        localStorage.removeItem('currentRestaurant');
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update item quantity
function updateQuantity(itemId, quantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
}

// ============ UI UTILITIES ============
// Show temporary notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============ SEARCH FUNCTIONS ============
// Search restaurants by name or cuisine
function searchRestaurants(query) {
    return restaurantsData.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
    );
}

// Search menu items across all restaurants
function searchMenuItems(query) {
    const results = [];
    restaurantsData.forEach(restaurant => {
        Object.values(restaurant.menu).forEach(category => {
            category.forEach(item => {
                if (item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.description.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        ...item,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.name,
                        restaurantImage: restaurant.image
                    });
                }
            });
        });
    });
    return results;
}

// ============ RESTAURANT LOOKUP ============
// Get restaurant by ID
function getRestaurantById(restaurantId) {
    return restaurantsData.find(r => r.id == restaurantId);
}

// ============ FILTER FUNCTIONS ============
// Filter by cuisine
function filterByCuisine(cuisine) {
    return restaurantsData.filter(r => r.cuisine.includes(cuisine));
}

// Filter by price range
function filterByPrice(minPrice, maxPrice) {
    return restaurantsData.filter(r => {
        const range = r.price.replace(/[₹\s]/g, '').split('-');
        return parseInt(range[0]) >= minPrice && parseInt(range[1]) <= maxPrice;
    });
}

// Filter by rating
function filterByRating(minRating) {
    return restaurantsData.filter(r => r.rating >= minRating);
}

// Sort restaurants
function sortRestaurants(restaurants, sortBy) {
    const sorted = [...restaurants];
    
    switch(sortBy) {
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'delivery-time':
            return sorted.sort((a, b) => a.deliveryTime - b.deliveryTime);
        case 'distance':
            return sorted.sort((a, b) => a.distance - b.distance);
        case 'price-low':
            return sorted.sort((a, b) => {
                const priceA = parseInt(a.price.split('-')[0].replace(/[₹\s]/g, ''));
                const priceB = parseInt(b.price.split('-')[0].replace(/[₹\s]/g, ''));
                return priceA - priceB;
            });
        default:
            return sorted;
    }
}

// ============ CALCULATION UTILITIES ============
// Calculate order totals (subtotal, tax, delivery fee)
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const gst = Math.ceil(subtotal * 0.05);
    const total = subtotal + deliveryFee + gst;

    return {
        subtotal,
        deliveryFee,
        gst,
        total,
        discount: 0
    };
}

// Format price with Indian Rupee symbol
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

// ============ ANIMATIONS & STYLES ============
// Inject CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============ HOME PAGE INITIALIZATION ============
// Display food categories on home page
function displayCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;

    const categories = [
        { icon: '🍕', name: 'Pizza' },
        { icon: '🍔', name: 'Burgers' },
        { icon: '🍜', name: 'Noodles' },
        { icon: '🍚', name: 'Biryani' },
        { icon: '🍱', name: 'Sushi' },
        { icon: '🍰', name: 'Desserts' },
        { icon: '☕', name: 'Beverages' },
        { icon: '🥗', name: 'Salads' },
        { icon: '🌮', name: 'Mexican' },
        { icon: '🥪', name: 'Sandwiches' },
        { icon: '🍝', name: 'Pasta' },
        { icon: '🏪', name: 'Healthy' }
    ];

    categoriesContainer.innerHTML = categories.map(cat => `
        <div class="category-card" onclick="filterByCategory('${cat.name.toLowerCase()}')">
            <div class="category-icon">${cat.icon}</div>
            <h3>${cat.name}</h3>
        </div>
    `).join('');
}

// Filter restaurants by category
function filterByCategory(category) {
    const filtered = restaurantsData.filter(r => 
        r.cuisine.toLowerCase().includes(category) ||
        r.name.toLowerCase().includes(category)
    );
    
    // This function will be used by the restaurants page to display filtered results
    if (window.displayRestaurants) {
        window.displayRestaurants(filtered);
    }
}

// ============ PAGE LOAD INITIALIZATION ============
// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCategories();
});
