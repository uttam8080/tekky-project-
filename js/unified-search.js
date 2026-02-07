
document.addEventListener('DOMContentLoaded', function () {
    initializeUnifiedSearch();
});


function initializeUnifiedSearch() {
    const locationInput = document.getElementById('locationInput');
    const searchInput = document.getElementById('searchInput');

    if (locationInput) {
        setupLocationSearch(locationInput);
    }

    if (searchInput) {
        setupRestaurantSearch(searchInput);
    }

    
    loadInitialData();
}


function setupLocationSearch(input) {
    const dropdown = createSearchDropdown(input, 'location');
    let searchTimeout;

    input.addEventListener('input', function () {
        
        clearTimeout(searchTimeout);
        hideDropdown(dropdown);
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                applyLocationFilter(query);
                hideDropdown(dropdown);
            }
        }
    });

    
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown(dropdown);
        }
    });
}


function setupRestaurantSearch(input) {
    const dropdown = createSearchDropdown(input, 'search');
    let searchTimeout;

    input.addEventListener('input', function () {
        
        clearTimeout(searchTimeout);
        hideDropdown(dropdown);
    });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                performSearch(query);
                hideDropdown(dropdown);
            }
        }
    });

    
    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown(dropdown);
        }
    });
}


function createSearchDropdown(input, type) {
    const dropdown = document.createElement('div');
    dropdown.className = `search-dropdown ${type}-dropdown`;

    
    dropdown.style.cssText = `
        position: absolute;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        max-height: 400px;
        overflow-y: auto;
        z-index: 9999;
        display: none;
        margin-top: 8px;
    `;

    dropdown.inputElement = input;
    document.body.appendChild(dropdown);

    
    window.addEventListener('resize', () => {
        if (dropdown.style.display !== 'none') {
            updateDropdownPosition(dropdown, input);
        }
    });

    window.addEventListener('scroll', () => {
        if (dropdown.style.display !== 'none') {
            updateDropdownPosition(dropdown, input);
        }
    }, true);

    return dropdown;
}


function updateDropdownPosition(dropdown, input) {
    const searchBox = input.closest('.search-box');
    if (searchBox) {
        const rect = searchBox.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        dropdown.style.top = (rect.bottom + scrollTop) + 'px';
        dropdown.style.left = (rect.left + scrollLeft) + 'px';
        dropdown.style.width = rect.width + 'px';
    }
}


async function searchLocations(query, dropdown, input) {
    try {
        showDropdownLoading(dropdown, 'Searching locations...');

        const response = await api.searchByLocation(query);

        if (response.success && response.data) {
            const { locations, restaurants } = response.data;

            if (locations && locations.length > 0) {
                displayLocationResults(locations, restaurants, dropdown, input);
            } else {
                showNoResults(dropdown, 'No locations found');
            }
        } else {
            hideDropdown(dropdown);
        }
    } catch (error) {
        console.error('Location search error:', error);
        
        showSampleLocations(dropdown, input);
    }
}


async function searchRestaurantsAndItems(query, dropdown, input) {
    try {
        showDropdownLoading(dropdown, 'Searching...');

        
        const locationInput = document.getElementById('locationInput');
        const location = locationInput ? locationInput.value.trim() : '';

        
        const params = { search: query };
        if (location) {
            params.location = location;
        }

        const response = await api.getRestaurants(params);

        if (response.success && response.data) {
            const { restaurants } = response.data;

            if (restaurants && restaurants.length > 0) {
                displaySearchResults(restaurants, query, dropdown, input);
            } else {
                showNoResults(dropdown, 'No restaurants or items found');
            }
        } else {
            hideDropdown(dropdown);
        }
    } catch (error) {
        console.error('Search error:', error);
        showDropdownError(dropdown, 'Error searching. Please try again.');
    }
}


function displayLocationResults(locations, restaurants, dropdown, input) {
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <i class="fas fa-map-marker-alt"></i>
            <strong>Locations</strong>
        </div>
        ${locations.slice(0, 8).map(location => {
        const count = restaurants ? restaurants.filter(r => r.city === location).length : 0;
        return `
                <div class="dropdown-item location-item" data-location="${location}">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="item-info">
                        <div class="item-name">${location}</div>
                        <div class="item-meta">${count} restaurant${count !== 1 ? 's' : ''} available</div>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
    }).join('')}
    `;

    
    dropdown.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', function () {
            const location = this.dataset.location;
            input.value = location;
            hideDropdown(dropdown);
            applyLocationFilter(location);
        });
    });

    addDropdownStyles();
    showDropdown(dropdown);
}


function displaySearchResults(restaurants, query, dropdown, input) {
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <i class="fas fa-search"></i>
            <strong>Search Results</strong>
        </div>
        ${restaurants.slice(0, 6).map(restaurant => `
            <div class="dropdown-item restaurant-item" data-id="${restaurant.id}">
                <div class="item-icon">
                    <i class="fas fa-store"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${highlightMatch(restaurant.name, query)}</div>
                    <div class="item-meta">
                        ${restaurant.cuisine || 'Restaurant'} • 
                        <i class="fas fa-star"></i> ${restaurant.rating || '4.0'} • 
                        ${restaurant.deliveryTime || '30'} mins
                    </div>
                </div>
                <i class="fas fa-arrow-right"></i>
            </div>
        `).join('')}
        ${restaurants.length > 6 ? `
            <div class="dropdown-footer" data-query="${query}">
                <span>View all ${restaurants.length} results</span>
                <i class="fas fa-arrow-right"></i>
            </div>
        ` : ''}
    `;

    
    dropdown.querySelectorAll('.restaurant-item').forEach(item => {
        item.addEventListener('click', function () {
            const restaurantId = this.dataset.id;
            window.location.href = `/restaurant-detail.html?id=${restaurantId}`;
        });
    });

    
    const footer = dropdown.querySelector('.dropdown-footer');
    if (footer) {
        footer.addEventListener('click', function () {
            const query = this.dataset.query;
            performSearch(query);
        });
    }

    addDropdownStyles();
    showDropdown(dropdown);
}


function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}


function applyLocationFilter(location) {
    localStorage.setItem('selectedLocation', location);

    const url = new URL(window.location.href);
    url.searchParams.set('location', location);
    window.history.pushState({}, '', url);

    if (typeof loadRestaurants === 'function') {
        loadRestaurants({ location });
    }

    if (typeof showNotification === 'function') {
        showNotification(`📍 Showing restaurants in ${location}`, 'success');
    }
}


function performSearch(query) {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput ? locationInput.value.trim() : '';

    const params = { search: query };
    if (location) {
        params.location = location;
    }

    
    const url = new URL(window.location.href);
    url.searchParams.set('search', query);
    if (location) {
        url.searchParams.set('location', location);
    }
    window.history.pushState({}, '', url);

    
    if (typeof loadRestaurants === 'function') {
        loadRestaurants(params);
    }

    if (typeof showNotification === 'function') {
        showNotification(`🔍 Searching for "${query}"`, 'info');
    }
}


function showSampleLocations(dropdown, input) {
    const sampleLocations = [
        { name: 'Mumbai', count: 150 },
        { name: 'Delhi', count: 200 },
        { name: 'Bangalore', count: 180 },
        { name: 'Pune', count: 120 },
        { name: 'Chennai', count: 140 },
        { name: 'Hyderabad', count: 130 }
    ];

    dropdown.innerHTML = `
        <div class="dropdown-header">
            <i class="fas fa-map-marker-alt"></i>
            <strong>Popular Locations</strong>
        </div>
        ${sampleLocations.map(location => `
            <div class="dropdown-item location-item" data-location="${location.name}">
                <i class="fas fa-map-marker-alt"></i>
                <div class="item-info">
                    <div class="item-name">${location.name}</div>
                    <div class="item-meta">${location.count} restaurants available</div>
                </div>
                <i class="fas fa-arrow-right"></i>
            </div>
        `).join('')}
    `;

    dropdown.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', function () {
            const location = this.dataset.location;
            input.value = location;
            hideDropdown(dropdown);
            applyLocationFilter(location);
        });
    });

    addDropdownStyles();
    showDropdown(dropdown);
}


async function loadInitialData() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const search = urlParams.get('search');

    
    

    
}


function showDropdown(dropdown) {
    dropdown.style.display = 'block';
    if (dropdown.inputElement) {
        updateDropdownPosition(dropdown, dropdown.inputElement);
    }
}


function hideDropdown(dropdown) {
    dropdown.style.display = 'none';
}


function showDropdownLoading(dropdown, message = 'Loading...') {
    dropdown.innerHTML = `
        <div class="dropdown-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>${message}</span>
        </div>
    `;
    showDropdown(dropdown);
}


function showNoResults(dropdown, message = 'No results found') {
    dropdown.innerHTML = `
        <div class="dropdown-no-results">
            <i class="fas fa-search"></i>
            <span>${message}</span>
        </div>
    `;
    showDropdown(dropdown);
}


function showDropdownError(dropdown, message = 'Error occurred') {
    dropdown.innerHTML = `
        <div class="dropdown-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    showDropdown(dropdown);
}


function addDropdownStyles() {
    if (document.getElementById('unified-search-styles')) return;

    const style = document.createElement('style');
    style.id = 'unified-search-styles';
    style.textContent = `
        .dropdown-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px 12px 0 0;
            font-size: 14px;
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .dropdown-item:last-child {
            border-bottom: none;
        }
        
        .dropdown-item:hover {
            background: linear-gradient(90deg, #f8f9ff 0%, #f0f2ff 100%);
            transform: translateX(4px);
        }
        
        .dropdown-item i:first-child {
            color: #667eea;
            font-size: 18px;
            width: 24px;
            text-align: center;
        }
        
        .dropdown-item i:last-child {
            color: #999;
            font-size: 14px;
            margin-left: auto;
        }
        
        .item-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            font-size: 15px;
        }
        
        .item-name strong {
            color: #667eea;
        }
        
        .item-meta {
            font-size: 13px;
            color: #666;
        }
        
        .item-meta i {
            color: #fbbf24;
            font-size: 12px;
        }
        
        .dropdown-footer {
            padding: 14px 16px;
            background: #f8f9ff;
            color: #667eea;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 0 0 12px 12px;
            transition: all 0.2s;
        }
        
        .dropdown-footer:hover {
            background: #667eea;
            color: white;
        }
        
        .dropdown-loading,
        .dropdown-no-results,
        .dropdown-error {
            padding: 32px 20px;
            text-align: center;
            color: #666;
        }
        
        .dropdown-loading i,
        .dropdown-no-results i,
        .dropdown-error i {
            display: block;
            margin-bottom: 12px;
            font-size: 32px;
        }
        
        .dropdown-loading i {
            color: #667eea;
        }
        
        .dropdown-no-results i {
            color: #999;
        }
        
        .dropdown-error i {
            color: #ef4444;
        }
        
        .search-dropdown::-webkit-scrollbar {
            width: 6px;
        }
        
        .search-dropdown::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 0 12px 12px 0;
        }
        
        .search-dropdown::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 3px;
        }
        
        .search-dropdown::-webkit-scrollbar-thumb:hover {
            background: #764ba2;
        }
    `;

    document.head.appendChild(style);
}
