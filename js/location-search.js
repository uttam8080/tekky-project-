
document.addEventListener('DOMContentLoaded', function () {
    setupLocationSearch();
});


function setupLocationSearch() {
    const locationInput = document.querySelector('input[placeholder*="delivery location"]');
    const locationSearchInput = document.getElementById('locationSearch');

    
    const inputs = [locationInput, locationSearchInput].filter(Boolean);

    inputs.forEach(input => {
        if (input) {
            
            const dropdown = createLocationDropdown(input);

            
            let searchTimeout;
            input.addEventListener('input', function () {
                clearTimeout(searchTimeout);
                const query = this.value.trim();

                if (query.length < 2) {
                    hideDropdown(dropdown);
                    return;
                }

                searchTimeout = setTimeout(async () => {
                    await searchLocations(query, dropdown, input);
                }, 300);
            });

            
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = this.value.trim();
                    if (query) {
                        applyLocationFilter(query);
                    }
                }
            });

            
            document.addEventListener('click', function (e) {
                if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                    hideDropdown(dropdown);
                }
            });
        }
    });

    
    loadAvailableCities();
}


function createLocationDropdown(input) {
    const dropdown = document.createElement('div');
    dropdown.className = 'location-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        margin-top: 5px;
    `;

    
    const parent = input.parentElement;
    if (parent) {
        parent.style.position = 'relative';
        parent.appendChild(dropdown);
    }

    return dropdown;
}


async function searchLocations(query, dropdown, input) {
    try {
        showDropdownLoading(dropdown);

        const response = await api.searchByLocation(query);

        if (response.success && response.data) {
            const { locations, restaurants } = response.data;

            if (locations && locations.length > 0) {
                displayLocationSuggestions(locations, restaurants, dropdown, input);
            } else {
                showNoResults(dropdown);
            }
        } else {
            hideDropdown(dropdown);
        }
    } catch (error) {
        console.error('Location search error:', error);
        showDropdownError(dropdown);
    }
}


function displayLocationSuggestions(locations, restaurants, dropdown, input) {
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <strong>Locations (${locations.length})</strong>
        </div>
        ${locations.map(location => `
            <div class="location-item" data-location="${location}">
                <i class="fas fa-map-marker-alt"></i>
                <div class="location-info">
                    <div class="location-name">${location}</div>
                    <div class="location-count">${getRestaurantCount(location, restaurants)} restaurants</div>
                </div>
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

    
    addLocationDropdownStyles();

    showDropdown(dropdown);
}


function getRestaurantCount(location, restaurants) {
    if (!restaurants) return 0;
    return restaurants.filter(r => r.city === location).length;
}


async function loadAvailableCities() {
    try {
        const response = await api.getCities();

        if (response.success && response.data.cities) {
            
            localStorage.setItem('availableCities', JSON.stringify(response.data.cities));
        }
    } catch (error) {
        console.error('Error loading cities:', error);
    }
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
        showNotification(`Showing restaurants in ${location}`, 'success');
    }

    
    updateLocationDisplay(location);
}


function updateLocationDisplay(location) {
    const locationDisplays = document.querySelectorAll('.current-location, [data-location-display]');
    locationDisplays.forEach(el => {
        el.textContent = location;
    });
}


function showDropdown(dropdown) {
    dropdown.style.display = 'block';
}


function hideDropdown(dropdown) {
    dropdown.style.display = 'none';
}


function showDropdownLoading(dropdown) {
    dropdown.innerHTML = `
        <div class="dropdown-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Searching locations...</span>
        </div>
    `;
    showDropdown(dropdown);
}


function showNoResults(dropdown) {
    dropdown.innerHTML = `
        <div class="dropdown-no-results">
            <i class="fas fa-map-marker-alt"></i>
            <span>No locations found</span>
        </div>
    `;
    showDropdown(dropdown);
}


function showDropdownError(dropdown) {
    dropdown.innerHTML = `
        <div class="dropdown-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>Error searching locations</span>
        </div>
    `;
    showDropdown(dropdown);
}


function addLocationDropdownStyles() {
    if (document.getElementById('location-dropdown-styles')) return;

    const style = document.createElement('style');
    style.id = 'location-dropdown-styles';
    style.textContent = `
        .dropdown-header {
            padding: 12px 16px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
            color: #666;
        }
        
        .location-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .location-item:hover {
            background: #f5f5f5;
        }
        
        .location-item i {
            color: #ff6b6b;
            font-size: 18px;
        }
        
        .location-info {
            flex: 1;
        }
        
        .location-name {
            font-weight: 500;
            color: #333;
            margin-bottom: 2px;
        }
        
        .location-count {
            font-size: 12px;
            color: #999;
        }
        
        .dropdown-loading,
        .dropdown-no-results,
        .dropdown-error {
            padding: 20px;
            text-align: center;
            color: #666;
        }
        
        .dropdown-loading i,
        .dropdown-no-results i,
        .dropdown-error i {
            display: block;
            margin-bottom: 8px;
            font-size: 24px;
        }
        
        .dropdown-loading i {
            color: #3b82f6;
        }
        
        .dropdown-no-results i {
            color: #999;
        }
        
        .dropdown-error i {
            color: #ef4444;
        }
        
        .location-dropdown::-webkit-scrollbar {
            width: 6px;
        }
        
        .location-dropdown::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        .location-dropdown::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
        }
        
        .location-dropdown::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;

    document.head.appendChild(style);
}


function getCurrentLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                
                
                console.log('Current position:', latitude, longitude);

                if (typeof showNotification === 'function') {
                    showNotification('Location detected! Search for your city.', 'info');
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
            }
        );
    }
}


function checkSelectedLocation() {
    
    

    
}



