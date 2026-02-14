// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                }
            }
        });
    });

    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const modalClose = document.querySelector('.modal-close');
    const checkoutBtn = document.getElementById('checkout');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceEl = document.querySelector('.total-price');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const emptyCartMsg = document.querySelector('.empty-cart');

    let cart = [];
    const prices = {
        '1': 4990,
        '2': 8500,
        '3': 3200,
        '4': 2800
    };

    // Open cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close cart modal
    const closeCartModal = () => {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    closeCartBtn.addEventListener('click', closeCartModal);
    modalClose.addEventListener('click', closeCartModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });

    // Add to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product');
            const productName = btn.closest('.product-card').querySelector('.product-name').textContent;
            const price = prices[productId];

            const existing = cart.find(item => item.id === productId);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
            showNotification(`Товар "${productName}" добавлен в корзину`);
        });
    });

    // Update cart UI
    function updateCart() {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items list
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
            totalPriceEl.textContent = '0 ₽';
            return;
        }

        let itemsHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₽ × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="cart-item-decrease">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-item-increase">+</button>
                        <button class="cart-item-remove">&times;</button>
                    </div>
                    <div class="cart-item-total">${itemTotal} ₽</div>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = itemsHTML;
        totalPriceEl.textContent = `${totalPrice} ₽`;

        // Attach event listeners to new buttons
        attachCartItemListeners();
    }

    function attachCartItemListeners() {
        document.querySelectorAll('.cart-item-decrease').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== itemId);
                }
                updateCart();
            });
        });

        document.querySelectorAll('.cart-item-increase').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                const item = cart.find(item => item.id === itemId);
                if (item) item.quantity += 1;
                updateCart();
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                cart = cart.filter(item => item.id !== itemId);
                updateCart();
            });
        });
    }

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        alert(`Заказ оформлен на сумму ${totalPriceEl.textContent}. Спасибо за покупку!`);
        cart = [];
        updateCart();
        closeCartModal();
    });

    // Newsletter form
    const subscribeForm = document.getElementById('subscribe-form');
    const subscribeMessage = document.getElementById('subscribe-message');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (!email) {
                showMessage('Пожалуйста, введите email', 'error');
                return;
            }

            // Simulate subscription
            showMessage('Спасибо за подписку! Проверьте вашу почту.', 'success');
            emailInput.value = '';
        });
    }

    // Helper functions
    function showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--color-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showMessage(text, type) {
        subscribeMessage.textContent = text;
        subscribeMessage.className = `message ${type}`;
        setTimeout(() => {
            subscribeMessage.textContent = '';
            subscribeMessage.className = 'message';
        }, 5000);
    }

    // Set active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = ['home', 'catalog', 'about', 'contact'];
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const element = document.getElementById(section);
            if (!element) return;

            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;

            const link = document.querySelector(`.nav-link[href="#${section}"]`);
            if (!link) return;

            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });
});