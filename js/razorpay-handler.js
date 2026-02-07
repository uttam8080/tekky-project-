

class RazorpayPaymentHandler {
  constructor() {
    this.apiBaseUrl = "http://localhost:8000/api";
    this.razorpayKey = null;
    this.currentOrder = null;
  }


  async initialize() {
    try {

      const keyResponse = await fetch(
        `${this.apiBaseUrl}/payment/razorpay/key`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (keyResponse.ok) {
        const data = await keyResponse.json();
        this.razorpayKey = data.key;
      }
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    }
  }


  async createOrder(orderData) {
    try {
      if (!this.razorpayKey) {
        await this.initialize();
      }

      console.log("Initiating Razorpay order...", orderData);

      const response = await fetch(
        `${this.apiBaseUrl}/payment/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
            description: orderData.description || "FoodHub Order Payment",
            customerEmail: orderData.customerEmail,
            customerPhone: orderData.customerPhone,
            customerName: orderData.customerName,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Razorpay Order Creation Failed:", data);
        const stepInfo = data.step ? ` [Step: ${data.step}]` : "";
        throw new Error((data.message || "Failed to create Razorpay order") + stepInfo);
      }

      console.log("Razorpay Order Created:", data);
      this.currentOrder = data.data;
      return data.data;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  }


  async openCheckout(orderData, callbacks = {}) {
    try {

      const razorpayOrder = await this.createOrder(orderData);


      if (!window.Razorpay) {
        await this.loadRazorpayScript();
      }


      const options = {
        key: razorpayOrder.key || this.razorpayKey || process.env.REACT_APP_RAZORPAY_KEY_ID || localStorage.getItem("razorpayKeyId"),
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "FoodHub",
        description: orderData.description || "FoodHub Order",
        image: "https://example.com/logo.png",
        order_id: razorpayOrder.orderId,
        handler: (response) =>
          this.handlePaymentSuccess(response, orderData, callbacks.onSuccess),
        prefill: {
          name: orderData.customerName || "",
          email: orderData.customerEmail || "",
          contact: orderData.customerPhone || "",
        },
        notes: {
          orderId: orderData.orderId,
          customerEmail: orderData.customerEmail,
        },
        modal: {
          ondismiss: () => {
            if (callbacks.onDismiss) {
              callbacks.onDismiss();
            }
          },
        },
        theme: {
          color: "#FF5200",
        },
      };


      const rzp = new window.Razorpay(options);


      rzp.on("payment.failed", (response) => {
        this.handlePaymentFailure(response, orderData, callbacks.onFailure);
      });

      rzp.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
      throw error;
    }
  }


  async handlePaymentSuccess(response, orderData, callback) {
    try {

      const verifyResponse = await fetch(
        `${this.apiBaseUrl}/payment/razorpay/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          }),
        },
      );

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const result = await verifyResponse.json();

      console.log("✅ Payment successful:", result);


      if (callback) {
        callback(result);
      }

      return result;
    } catch (error) {
      console.error("Error verifying payment:", error);


      throw error;
    }
  }


  async handlePaymentFailure(response, orderData, callback) {
    try {
      console.error("❌ Payment failed:", response.error);


      const failureResponse = await fetch(
        `${this.apiBaseUrl}/orders/${orderData.orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            status: "payment_failed",
            paymentError: response.error.description,
          }),
        },
      ).catch(() => null);

      if (callback) {
        callback({
          error: response.error,
          message: response.error.description,
        });
      }
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }


  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Razorpay script"));
      };

      document.body.appendChild(script);
    });
  }


  async getPaymentDetails(paymentId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/payment/razorpay/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payment details");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching payment details:", error);
      throw error;
    }
  }


  async refundPayment(paymentId, amount = null, reason = "Refund requested") {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/payment/razorpay/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            paymentId: paymentId,
            amount: amount,
            reason: reason,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Refund failed");
      }

      const data = await response.json();
      console.log("✅ Refund successful:", data);
      return data.data;
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  }
}


const razorpayHandler = new RazorpayPaymentHandler();
