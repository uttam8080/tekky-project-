

class LocationAutocomplete {
    constructor(inputElement, suggestionsElement, options = {}) {
        this.input = inputElement;
        this.suggestions = suggestionsElement;
        this.selectedLocation = null;
        this.timeout = null;

        
        this.config = {
            debounceDelay: 500, 
            minCharacters: 3,   
            countryCode: 'IN',  
            ...options
        };

        this.initialize();
    }

    initialize() {
        
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('focus', () => this.showSuggestions());

        
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });

        
        this.addStyles();
    }

    handleInput(e) {
        const query = e.target.value.trim();

        
        clearTimeout(this.timeout);

        
        if (query.length < this.config.minCharacters) {
            this.hideSuggestions();
            return;
        }

        
        this.showLoading();

        
        this.timeout = setTimeout(() => {
            this.searchLocation(query);
        }, this.config.debounceDelay);
    }

    async searchLocation(query) {
        try {
            
            const baseUrl = 'https://nominatim.openstreetmap.org/search';
            const params = new URLSearchParams({
                q: query,
                format: 'json',
                addressdetails: 1,
                limit: 10,
                countrycodes: this.config.countryCode
            });

            const url = `${baseUrl}?${params}`;

            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'FoodHub-LocationSearch/1.0' 
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch locations');
            }

            const results = await response.json();
            this.displaySuggestions(results);

        } catch (error) {
            console.error('Location search error:', error);
            this.showError('Unable to fetch locations. Please try again.');
        }
    }

    displaySuggestions(results) {
        
        this.suggestions.innerHTML = '';

        if (results.length === 0) {
            this.suggestions.innerHTML = `
                <div class="location-no-results">
                    <i class="fas fa-search"></i>
                    <p>No locations found</p>
                </div>
            `;
            this.showSuggestions();
            return;
        }

        
        results.forEach(result => {
            const item = this.createSuggestionItem(result);
            this.suggestions.appendChild(item);
        });

        this.showSuggestions();
    }

    createSuggestionItem(result) {
        const div = document.createElement('div');
        div.className = 'location-suggestion-item';

        
        const displayName = this.formatDisplayName(result);
        const icon = this.getLocationIcon(result.type);

        div.innerHTML = `
            <i class="${icon}"></i>
            <div class="location-details">
                <div class="location-name">${displayName.main}</div>
                <div class="location-address">${displayName.sub}</div>
            </div>
        `;

        
        div.addEventListener('click', () => {
            this.selectLocation(result, displayName.main);
        });

        return div;
    }

    formatDisplayName(result) {
        const address = result.address || {};

        
        const parts = {
            name: address.road || address.neighbourhood || address.suburb,
            locality: address.city || address.town || address.village || address.state_district,
            city: address.state || address.county,
            pincode: address.postcode
        };

        
        let main = [];
        if (parts.name) main.push(parts.name);
        if (parts.locality && parts.locality !== parts.name) main.push(parts.locality);

        
        let sub = [];
        if (parts.city) sub.push(parts.city);
        if (parts.pincode) sub.push(parts.pincode);

        return {
            main: main.join(', ') || result.display_name.split(',')[0],
            sub: sub.join(', ') || result.display_name,
            full: result.display_name
        };
    }

    getLocationIcon(type) {
        const icons = {
            'house': 'fas fa-home',
            'building': 'fas fa-building',
            'residential': 'fas fa-home',
            'commercial': 'fas fa-store',
            'city': 'fas fa-city',
            'town': 'fas fa-map-marker-alt',
            'village': 'fas fa-map-marker-alt',
            'default': 'fas fa-map-marker-alt'
        };

        return icons[type] || icons.default;
    }

    selectLocation(result, displayName) {
        
        this.input.value = displayName;

        
        this.selectedLocation = {
            displayName: displayName,
            fullAddress: result.display_name,
            latitude: result.lat,
            longitude: result.lon,
            address: result.address,
            type: result.type
        };

        
        this.hideSuggestions();

        
        const event = new CustomEvent('locationSelected', {
            detail: this.selectedLocation
        });
        this.input.dispatchEvent(event);

        
        if (this.config.onLocationSelect) {
            this.config.onLocationSelect(this.selectedLocation);
        }
    }

    showLoading() {
        this.suggestions.innerHTML = `
            <div class="location-loading">
                <div class="spinner"></div>
                <p>Searching locations...</p>
            </div>
        `;
        this.showSuggestions();
    }

    showError(message) {
        this.suggestions.innerHTML = `
            <div class="location-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
        this.showSuggestions();
    }

    showSuggestions() {
        this.suggestions.style.display = 'block';
    }

    hideSuggestions() {
        this.suggestions.style.display = 'none';
    }

    getSelectedLocation() {
        return this.selectedLocation;
    }

    clear() {
        this.input.value = '';
        this.selectedLocation = null;
        this.hideSuggestions();
    }

    addStyles() {
        
        if (document.getElementById('location-autocomplete-styles')) return;

        const style = document.createElement('style');
        style.id = 'location-autocomplete-styles';
        style.textContent = `
            .location-suggestions {
                position: absolute;
                top: calc(100% + 8px);
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 15px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                max-height: 400px;
                overflow-y: auto;
                z-index: 10000;
                display: none;
            }
            
            .location-suggestion-item {
                display: flex;
                align-items: flex-start;
                padding: 12px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .location-suggestion-item:last-child {
                border-bottom: none;
            }
            
            .location-suggestion-item:hover {
                background-color: #f8f8f8;
            }
            
            .location-suggestion-item i {
                color: #ff6b35;
                margin-right: 12px;
                margin-top: 3px;
                font-size: 16px;
            }
            
            .location-details {
                flex: 1;
            }
            
            .location-name {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 4px;
                font-size: 14px;
            }
            
            .location-address {
                font-size: 12px;
                color: #7f8c8d;
                line-height: 1.4;
            }
            
            .location-loading,
            .location-error,
            .location-no-results {
                padding: 20px;
                text-align: center;
                color: #7f8c8d;
            }
            
            .location-loading p,
            .location-error p,
            .location-no-results p {
                margin: 10px 0 0 0;
                font-size: 14px;
            }
            
            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #ff6b35;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .location-error i,
            .location-no-results i {
                font-size: 24px;
                color: #ff6b35;
            }
        `;

        document.head.appendChild(style);
    }
}


window.LocationAutocomplete = LocationAutocomplete;
