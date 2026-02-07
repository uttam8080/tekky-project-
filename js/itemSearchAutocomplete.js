

class ItemSearchAutocomplete {
    constructor(inputElement, suggestionsElement) {
        this.input = inputElement;
        this.suggestions = suggestionsElement;
        this.timeout = null;
        this.minCharacters = 2;
        this.debounceDelay = 300;

        this.initialize();
    }

    initialize() {

        const wrapper = this.suggestions.parentElement;
        if (wrapper) {
            wrapper.style.position = 'relative';
        }


        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('focus', () => {
            if (this.input.value.length >= this.minCharacters) {
                this.showSuggestions();
            }
        });


        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    handleInput(e) {
        const query = e.target.value.trim();


        clearTimeout(this.timeout);


        if (query.length < this.minCharacters) {
            this.hideSuggestions();
            return;
        }


        this.showLoading();


        this.timeout = setTimeout(() => {
            this.searchItems(query);
        }, this.debounceDelay);
    }

    searchItems(query) {

        if (typeof searchMenuItems !== 'function') {
            console.error('searchMenuItems function not found!');
            this.hideSuggestions();
            return;
        }

        const items = searchMenuItems(query);
        this.displaySuggestions(items);
    }

    displaySuggestions(items) {

        this.suggestions.innerHTML = '';

        if (items.length === 0) {
            this.suggestions.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>No items found</p>
                </div>
            `;
            this.showSuggestions();
            return;
        }


        const limitedItems = items.slice(0, 8);


        limitedItems.forEach(item => {
            const div = this.createSuggestionItem(item);
            this.suggestions.appendChild(div);
        });


        if (items.length > 8) {
            const viewAll = document.createElement('div');
            viewAll.className = 'search-view-all';
            viewAll.innerHTML = `
                <span>View all ${items.length} results</span>
                <i class="fas fa-arrow-right"></i>
            `;
            viewAll.addEventListener('click', () => {
                window.location.href = `search-results.html?q=${encodeURIComponent(this.input.value)}`;
            });
            this.suggestions.appendChild(viewAll);
        }

        this.showSuggestions();
    }

    createSuggestionItem(item) {
        const div = document.createElement('div');
        div.className = 'search-suggestion-item';


        const imageUrl = item.restaurantImage || 'images/default-food.png';

        div.innerHTML = `
            <div class="search-item-image">
                <img src="${imageUrl}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="search-item-emoji" style="display: none;">🍕</div>
            </div>
            <div class="search-item-info">
                <div class="search-item-name">${this.highlightMatch(item.name, this.input.value)}</div>
                <div class="search-item-restaurant">${item.restaurantName}</div>
                <div class="search-item-price">₹${item.price}</div>
            </div>
            ${item.isVeg !== undefined ? `
                <div class="search-veg-badge ${item.isVeg ? 'veg' : 'non-veg'}">
                    <div class="badge-dot"></div>
                </div>
            ` : ''}
        `;


        div.addEventListener('click', () => {
            localStorage.setItem('selectedRestaurant', item.restaurantId);
            window.location.href = `restaurant-detail.html?id=${item.restaurantId}`;
        });

        return div;
    }

    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    showLoading() {
        this.suggestions.innerHTML = `
            <div class="search-loading">
                <div class="spinner"></div>
                <p>Searching...</p>
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
}


window.ItemSearchAutocomplete = ItemSearchAutocomplete;
