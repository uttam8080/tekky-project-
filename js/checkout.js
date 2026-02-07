
let tempOrder = null;

async function displayCheckoutItems() {
    const itemsContainer = document.getElementById('checkoutItems');
    if (!itemsContainer) return;

    try {
        const cartData = await api.getUnifiedCart();
        const items = cartData.items || [];

        if (items.length === 0) {
            
            itemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty. Please add items to checkout.</p>';
            return;
        }

        const format = (p) => typeof formatPrice === 'function' ? formatPrice(p) : '₹' + p;

        itemsContainer.innerHTML = items.map(item => `
            <div style="padding: 12px 0; border-bottom: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: #333;">${item.name || (item.menuItem ? item.menuItem.name : 'Unknown')}</span>
                        <span style="font-size: 12px; color: #666;">Qty: ${item.quantity}</span>
                    </div>
                    <span style="font-weight: bold; color: #ff7a3d;">${format(item.price * item.quantity)}</span>
                </div>
            </div>
        `).join('');

        await updateCheckoutSummary();
    } catch (error) {
        console.error('Error loading checkout items:', error);
    }
}

async function updateCheckoutSummary() {
    try {
        const cartData = await api.getUnifiedCart();
        const items = cartData.items || [];

        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 50;
        const gst = Math.ceil(subtotal * 0.05);
        const finalTotal = subtotal + deliveryFee + gst;

        const format = (p) => typeof formatPrice === 'function' ? formatPrice(p) : '₹' + p;

        if (document.getElementById('checkoutSubtotal')) document.getElementById('checkoutSubtotal').textContent = format(subtotal);
        if (document.getElementById('checkoutDeliveryFee')) document.getElementById('checkoutDeliveryFee').textContent = format(deliveryFee);
        if (document.getElementById('checkoutGST')) document.getElementById('checkoutGST').textContent = format(gst);
        if (document.getElementById('checkoutDiscount')) document.getElementById('checkoutDiscount').textContent = '-₹0';
        if (document.getElementById('checkoutTotal')) document.getElementById('checkoutTotal').textContent = format(finalTotal);
    } catch (e) {
        console.warn('Could not update summary:', e);
    }
}



async function placeOrder() {

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const postal = document.getElementById('postal').value.trim();

    if (!fullName || !phone || !email || !street || !city || !postal) {
        showNotification('Please fill all required fields');
        return;
    }


    if (phone.length !== 10 || isNaN(phone)) {
        showNotification('Please enter a valid 10-digit phone number');
        return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email');
        return;
    }


    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;


    const totals = await updateCheckoutSummary();
    const cartData = await api.getUnifiedCart();
    const items = cartData.items || [];

    if (items.length === 0) {
        showNotification('Your cart is empty');
        return;
    }

    const deliveryFee = 50;
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = Math.ceil(subtotal * 0.05);
    const finalTotal = subtotal + deliveryFee + gst;

    const order = {
        orderId: 'ORD' + Date.now(),
        restaurant: cartData.restaurantName || (items[0] ? items[0].restaurantName : 'Restaurant'),
        items: items,
        deliveryAddress: {
            name: fullName,
            phone: phone,
            email: email,
            street: street,
            city: city,
            postal: postal,
            instructions: document.getElementById('instructions').value
        },
        paymentMethod: paymentMethod,
        totals: {
            subtotal,
            gst,
            deliveryFee
        },
        finalTotal: finalTotal,
        orderDate: new Date().toLocaleString(),
        estimatedDelivery: '30-40 mins',
        status: 'pending'
    };


    
    if (!api.isAuthenticated()) {
        showNotification('Please sign in to place an order', 'error');
        setTimeout(() => {
            window.location.href = `login.html?redirect=checkout.html`;
        }, 1500);
        return;
    }

    if (paymentMethod === 'cod') {
        completeOrder(order);
        return;
    }

    
    try {
        if (typeof razorpayHandler === 'undefined') {
            throw new Error('Payment system is loading, please try again in a moment.');
        }

        await razorpayHandler.openCheckout({
            orderId: order.orderId,
            amount: order.finalTotal,
            customerName: fullName,
            customerEmail: email,
            customerPhone: phone,
            description: `Order from ${order.restaurant}`
        }, {
            onSuccess: (result) => {
                order.transactionId = result.razorpay_payment_id;
                order.paymentStatus = 'completed';
                completeOrder(order);
            },
            onFailure: (err) => {
                showNotification(err.message || 'Payment failed', 'error');
            },
            onDismiss: () => {
                showNotification('Payment cancelled', 'info');
            }
        });
    } catch (err) {
        console.error('Razorpay Error:', err);
        showNotification(err.message, 'error');
    }
}



function closeQRModal() {
    document.getElementById('paymentQRModal').style.display = 'none';
    tempOrder = null;
    showNotification('Payment cancelled', 'info');
}

function confirmQRPayment() {
    if (!tempOrder) return;


    const btn = document.querySelector('#paymentQRModal button:last-child');
    const originalText = btn.textContent;
    btn.textContent = 'Verifying...';
    btn.disabled = true;

    setTimeout(() => {

        tempOrder.paymentStatus = 'completed';
        tempOrder.transactionId = "txn_" + Date.now();
        tempOrder.status = 'confirmed';

        document.getElementById('paymentQRModal').style.display = 'none';
        completeOrder(tempOrder);
        tempOrder = null;


        btn.textContent = originalText;
        btn.disabled = false;
    }, 1500);
}


async function completeOrder(order) {
    try {
        
        const cartData = await api.getUnifiedCart();
        const items = cartData.items || [];

        if (items.length === 0) {
            throw new Error('Your cart is empty. Please add items before checking out.');
        }

        const restaurantId = cartData.restaurantId || items[0].restaurantId;
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = 50;
        const gst = Math.ceil(subtotal * 0.05);
        const total = subtotal + deliveryFee + gst;

        const orderData = {
            deliveryAddress: order.deliveryAddress.street,
            deliveryCity: order.deliveryAddress.city,
            deliveryState: order.deliveryAddress.state || 'Odisha',
            deliveryZipCode: order.deliveryAddress.postal,
            paymentMethod: order.paymentMethod,
            specialRequests: order.deliveryAddress.instructions,
            restaurantId: restaurantId,
            cartItems: items,
            subtotal: subtotal,
            tax: gst,
            deliveryFee: deliveryFee,
            total: total,
            transactionId: order.transactionId
        };

        const response = await api.createOrder(orderData);

        if (response.success) {
            
            localStorage.removeItem('cart');
            localStorage.removeItem('currentRestaurant');

            showNotification('Order placed successfully!', 'success');

            setTimeout(() => {
                window.location.href = 'order-confirmation.html?orderId=' + response.data.order.id;
            }, 1500);
        } else {
            throw new Error(response.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Order Error:', error);
        showNotification('Error placing order: ' + error.message, 'error');
    }
}


function loadRazorpayHandler() {
    return new Promise((resolve, reject) => {
        if (window.razorpayHandler) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'js/razorpay-handler.js';
        script.async = true;

        script.onload = () => {

            window.razorpayHandler = new RazorpayPaymentHandler();
            resolve();
        };

        script.onerror = () => {
            reject(new Error('Failed to load Razorpay handler'));
        };

        document.head.appendChild(script);
    });
}



function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}



document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();


    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    const postalInput = document.getElementById('postal');
    if (postalInput) {
        postalInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });
    }
});
