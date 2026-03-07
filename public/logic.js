const whatsappNumber = '254724937338';
let cart = [];

// Initialize cart from localStorage
function initializeCart() {
	const savedCart = localStorage.getItem('halal-cart');
	console.log('Initializing cart from localStorage:', savedCart);
	
	if (savedCart) {
		try {
			cart = JSON.parse(savedCart);
			console.log('Cart loaded from storage:', cart);
		} catch (e) {
			console.error('Error parsing saved cart:', e);
			cart = [];
		}
		updateCartCount();
	} else {
		console.log('No saved cart found, starting with empty cart');
		cart = [];
	}
}

// Update cart count badge
function updateCartCount() {
	const count = cart.reduce((total, item) => total + item.quantity, 0);
	document.getElementById('cartCount').textContent = count;
}

// Save cart to localStorage
function saveCart() {
	localStorage.setItem('halal-cart', JSON.stringify(cart));
	updateCartCount();
}

// Add item to cart
function addToCart(product, price, quantity = 1, notes = '') {
	console.log(`addToCart called with:`, {product, price, quantity, notes});
	
	const existingItem = cart.find(item => item.product === product && item.notes === notes);
	
	if (existingItem) {
		existingItem.quantity += quantity;
		console.log('Item already in cart, updating quantity to:', existingItem.quantity);
	} else {
		const newItem = {
			product: product,
			price: parseFloat(price),
			quantity: quantity,
			notes: notes,
			id: Date.now()
		};
		cart.push(newItem);
		console.log('Added new item to cart:', newItem);
		console.log('Cart now contains:', cart);
	}
	
	saveCart();
	showNotification(`${product} added to cart!`);
	updateCartDisplay();
}

// Remove item from cart
function removeFromCart(itemId) {
	cart = cart.filter(item => item.id !== itemId);
	saveCart();
	updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
	const cartItemsDiv = document.getElementById('cartItems');
	
	if (cart.length === 0) {
		cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
		document.getElementById('cartTotal').textContent = 'KES 0';
		return;
	}
	
	let total = 0;
	let html = '<div class="cart-item-list">';
	
	cart.forEach(item => {
		const itemTotal = item.price * item.quantity;
		total += itemTotal;
		
		html += `
			<div class="cart-item">
				<div class="cart-item-details">
					<h4>${item.product}</h4>
					<p>KES ${item.price.toLocaleString()} × ${item.quantity} kg = KES ${itemTotal.toLocaleString()}</p>
					${item.notes ? `<p class="cart-notes">Notes: ${item.notes}</p>` : ''}
				</div>
				<button class="btn-remove-cart" data-id="${item.id}">Remove</button>
			</div>
		`;
	});
	
	html += '</div>';
	cartItemsDiv.innerHTML = html;
	document.getElementById('cartTotal').textContent = `KES ${total.toLocaleString()}`;
	
	// Add event listeners for remove buttons
	document.querySelectorAll('.btn-remove-cart').forEach(btn => {
		btn.addEventListener('click', function() {
			removeFromCart(parseInt(this.getAttribute('data-id')));
		});
	});
}

// Show notification
function showNotification(message) {
	const notification = document.createElement('div');
	notification.className = 'notification';
	notification.textContent = message;
	document.body.appendChild(notification);
	
	setTimeout(() => {
		notification.style.animation = 'slideOut 0.3s ease-in-out';
		setTimeout(() => notification.remove(), 300);
	}, 2000);
}

// Cart modal functions
function openCartModal() {
	document.getElementById('cartModal').style.display = 'block';
	updateCartDisplay();
}

function closeCartModal() {
	document.getElementById('cartModal').style.display = 'none';
}

// Customize modal functions
function openCustomizeModal(product, price) {
	document.getElementById('customProduct').value = product;
	document.getElementById('customPrice').value = `KES ${price}`;
	document.getElementById('customQuantity').value = '1';
	document.getElementById('customNotes').value = '';
	document.getElementById('customizeModal').style.display = 'block';
}

function closeCustomizeModal() {
	document.getElementById('customizeModal').style.display = 'none';
}

// Handle order form submission
function handleOrderFormSubmit(e) {
	e.preventDefault();
	e.stopPropagation();
	console.log('Order form submitted');
	
	const nameInput = document.getElementById('name');
	const phoneInput = document.getElementById('phone');
	const detailsInput = document.getElementById('orderDetails');
	
	if (!nameInput || !phoneInput || !detailsInput) {
		console.log('Form inputs not found');
		return false;
	}
	
	console.log('Form values:', {
		name: nameInput.value,
		phone: phoneInput.value,
		details: detailsInput.value
	});
	
	const name = encodeURIComponent(nameInput.value);
	const phone = encodeURIComponent(phoneInput.value);
	const details = encodeURIComponent(detailsInput.value);
	const message = `Order from Quality Halal Meat Suppliers%0AName: ${name}%0APhone: ${phone}%0ADetails: ${details}`;
	const url = `https://wa.me/${whatsappNumber}?text=${message}`;
	
	console.log('WhatsApp URL:', url);
	console.log('Opening WhatsApp...');
	
	window.open(url, '_blank');
	return false;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
	console.log('Page loaded, initializing cart...');
	initializeCart();
	
	// Send order button (on order.html page)
	const sendOrderBtn = document.getElementById('sendOrderBtn');
	if (sendOrderBtn) {
		console.log('Found send order button, attaching click listener');
		sendOrderBtn.addEventListener('click', function() {
			console.log('Send order button clicked');
			
			const nameInput = document.getElementById('name');
			const phoneInput = document.getElementById('phone');
			const detailsInput = document.getElementById('orderDetails');
			
			if (!nameInput || !phoneInput || !detailsInput) {
				console.log('Form inputs not found');
				return;
			}
			
			if (!nameInput.value || !phoneInput.value || !detailsInput.value) {
				showNotification('Please fill in all fields!');
				return;
			}
			
			const name = encodeURIComponent(nameInput.value);
			const phone = encodeURIComponent(phoneInput.value);
			const details = encodeURIComponent(detailsInput.value);
			const message = `Order from Quality Halal Meat Suppliers%0AName: ${name}%0APhone: ${phone}%0ADetails: ${details}`;
			const url = `https://wa.me/${whatsappNumber}?text=${message}`;
			
			console.log('Opening WhatsApp:', url);
			window.open(url, '_blank');
		});
	} else {
		console.log('Send order button NOT found on this page');
	}
	
	// Cart icon click
	const cartIcon = document.getElementById('cartIcon');
	if (cartIcon) {
		cartIcon.addEventListener('click', openCartModal);
	}
	
	// Cart modal close
	const closeCartModalBtn = document.getElementById('closeCartModal');
	if (closeCartModalBtn) {
		closeCartModalBtn.addEventListener('click', closeCartModal);
	}
	
	// Customize modal close
	const closeCustomizeModalBtn = document.getElementById('closeCustomizeModal');
	if (closeCustomizeModalBtn) {
		closeCustomizeModalBtn.addEventListener('click', closeCustomizeModal);
	}
	
	// Customize cancel button
	const cancelCustomize = document.getElementById('cancelCustomize');
	if (cancelCustomize) {
		cancelCustomize.addEventListener('click', closeCustomizeModal);
	}
	
	// Customize form submission
	const customizeForm = document.getElementById('customizeForm');
	if (customizeForm) {
		customizeForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const product = document.getElementById('customProduct').value;
			const price = document.getElementById('customPrice').value.replace('KES ', '');
			const quantity = parseFloat(document.getElementById('customQuantity').value);
			const notes = document.getElementById('customNotes').value;
			
			addToCart(product, price, quantity, notes);
			closeCustomizeModal();
		});
	}
	
	// Add to cart buttons
	const addCartButtons = document.querySelectorAll('.btn-add-cart');
	console.log(`Found ${addCartButtons.length} 'Add to Cart' buttons`);
	addCartButtons.forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			const product = this.getAttribute('data-product');
			const price = this.getAttribute('data-price');
			console.log(`Adding to cart: ${product} - ${price}`);
			addToCart(product, price, 1);
		});
	});
	
	// Customize buttons
	document.querySelectorAll('.btn-customize').forEach(btn => {
		btn.addEventListener('click', function() {
			const product = this.getAttribute('data-product');
			const price = this.getAttribute('data-price');
			openCustomizeModal(product, price);
		});
	});
	
	// Checkout button
	const checkoutBtn = document.getElementById('checkoutBtn');
	if (checkoutBtn) {
		checkoutBtn.addEventListener('click', function() {
			console.log(`Checkout clicked. Cart contents:`, cart);
			console.log(`Cart length: ${cart.length}`);
			
			if (cart.length === 0) {
				showNotification('Your cart is empty!');
				console.log('Cart is empty, showing notification');
				return;
			}
			
			let orderDetails = 'My Custom Order:\n\n';
			let total = 0;
			
			cart.forEach(item => {
				const itemTotal = item.price * item.quantity;
				total += itemTotal;
				orderDetails += `• ${item.product}: ${item.quantity} kg @ KES ${item.price}/kg = KES ${itemTotal.toLocaleString()}\n`;
				if (item.notes) orderDetails += `  Notes: ${item.notes}\n`;
			});
			
			orderDetails += `\nTotal: KES ${total.toLocaleString()}`;
			
			const encodedDetails = encodeURIComponent(orderDetails);
			const message = `Order from Quality Halal Meat Suppliers%0A${encodedDetails}`;
			const url = `https://wa.me/${whatsappNumber}?text=${message}`;
			
			console.log('Sending to WhatsApp:', url);
			
			// Clear cart after checkout
			cart = [];
			saveCart();
			closeCartModal();
			showNotification('Proceeding to WhatsApp...');
			
			window.open(url, '_blank');
		});
	}
	
	// Close modals when clicking outside
	window.addEventListener('click', function(e) {
		const cartModal = document.getElementById('cartModal');
		const customizeModal = document.getElementById('customizeModal');
		
		if (e.target === cartModal) {
			cartModal.style.display = 'none';
		}
		if (e.target === customizeModal) {
			customizeModal.style.display = 'none';
		}
	});
	
	// Product click for quick WhatsApp (kept for backward compatibility)
	const pricingItems = document.querySelectorAll('.pricing-item');
	pricingItems.forEach(item => {
		item.addEventListener('click', function(e) {
			// Don't trigger if clicking on buttons
			if (e.target.closest('button')) return;
			
			const productName = this.querySelector('.product-name').textContent;
			const productPrice = this.querySelector('.price').textContent;
			
			const message = encodeURIComponent(
				`Hi Quality Halal Meat Suppliers!\n\nI'm interested in ordering:\n\nProduct: ${productName}\nPrice: ${productPrice}\n\nPlease provide more details and availability. Thank you!`
			);
			const url = `https://wa.me/${whatsappNumber}?text=${message}`;
			window.open(url, '_blank');
		});
	});
});
