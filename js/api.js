const API_BASE_URL = "http://localhost:8000/api";

class API {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("authToken");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  getToken() {
    return this.token || localStorage.getItem("authToken");
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  removeCurrentUser() {
    localStorage.removeItem("currentUser");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      mode: "cors",
      cache: "default", 
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  async register(userData) {
    const response = await this.post("/auth/register", userData);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      this.setCurrentUser(response.data.user);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post("/auth/login", credentials);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      this.setCurrentUser(response.data.user);
    }
    return response;
  }

  async logout() {
    this.removeToken();
    this.removeCurrentUser();
    window.location.href = "/index.html";
  }

  async getProfile() {
    return this.get("/auth/me");
  }

  async updateProfile(userData) {
    return this.put("/auth/update", userData);
  }

  async changePassword(passwordData) {
    return this.put("/auth/change-password", passwordData);
  }

  async getRestaurants(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/restaurants${queryString ? "?" + queryString : ""}`);
  }

  async getRestaurant(id) {
    return this.get(`/restaurants/${id}`);
  }

  async getRestaurantMenu(id, category = "") {
    return this.get(
      `/restaurants/${id}/menu${category ? "?category=" + category : ""}`,
    );
  }

  async createRestaurant(restaurantData) {
    return this.post("/restaurants", restaurantData);
  }

  async updateRestaurant(id, restaurantData) {
    return this.put(`/restaurants/${id}`, restaurantData);
  }

  async deleteRestaurant(id) {
    return this.delete(`/restaurants/${id}`);
  }

  async getCities() {
    return this.get("/restaurants/cities");
  }

  async searchByLocation(query) {
    return this.get(
      `/restaurants/search/location?query=${encodeURIComponent(query)}`,
    );
  }

  async getRestaurantsByLocation(location) {
    return this.getRestaurants({ location });
  }

  async getMenuItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/menu-items${queryString ? "?" + queryString : ""}`);
  }

  async getMenuItem(id) {
    return this.get(`/menu-items/${id}`);
  }

  async createMenuItem(menuItemData) {
    return this.post("/menu-items", menuItemData);
  }

  async updateMenuItem(id, menuItemData) {
    return this.put(`/menu-items/${id}`, menuItemData);
  }

  async deleteMenuItem(id) {
    return this.delete(`/menu-items/${id}`);
  }

  async getCart() {
    return this.get("/cart");
  }

  async addToCart(itemData) {
    return this.post("/cart/add", itemData);
  }

  async updateCartItem(id, quantity) {
    return this.put(`/cart/item/${id}`, { quantity });
  }

  async removeFromCart(id) {
    return this.delete(`/cart/item/${id}`);
  }

  async clearCart() {
    return this.delete("/cart");
  }

  async createOrder(orderData) {
    return this.post("/orders", orderData);
  }

  async getOrders(status = "") {
    return this.get(`/orders${status ? "?status=" + status : ""}`);
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.put(`/orders/${id}/status`, { status });
  }

  async cancelOrder(id) {
    return this.put(`/orders/${id}/cancel`);
  }

  async addOrderReview(id, reviewData) {
    return this.put(`/orders/${id}/review`, reviewData);
  }

  async getOffers() {
    return this.get("/offers");
  }

  async validateCoupon(couponData) {
    return this.post("/offers/validate", couponData);
  }

  async createOffer(offerData) {
    return this.post("/offers", offerData);
  }

  async updateOffer(id, offerData) {
    return this.put(`/offers/${id}`, offerData);
  }

  async deleteOffer(id) {
    return this.delete(`/offers/${id}`);
  }

  async getFAQs(category = "") {
    return this.get(`/faq${category ? "?category=" + category : ""}`);
  }

  async submitContact(contactData) {
    return this.post("/contact", contactData);
  }

  async submitFeedback(feedbackData) {
    return this.post("/feedback", feedbackData);
  }

  async getHelpTopics() {
    return this.get("/help");
  }

  async getAbout() {
    return this.get("/about");
  }

  async checkHealth() {
    return this.get("/health");
  }

  
  getLocalCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  saveLocalCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    
    window.dispatchEvent(new Event("cartUpdated"));
  }

  async getUnifiedCart() {
    if (this.isAuthenticated()) {
      const response = await this.getCart();
      return response.success ? response.data.cart : { items: [] };
    } else {
      const items = this.getLocalCart();
      return { items };
    }
  }
}

const api = new API();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { API, api };
}
