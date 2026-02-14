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
                // Update active nav link if clicked link has nav-link class
                if (this.classList.contains('nav-link')) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
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
    const modalFooter = document.querySelector('.modal-footer');
    const modalBody = document.querySelector('.modal-body');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const emptyCartMsg = document.querySelector('.empty-cart');

    let cart = [];
    const prices = {
        '1': 89500,
        '2': 325000,
        '3': 64800,
        '4': 215000,
        '5': 24900,
        '6': 38500
    };

    // Parallax for hero section
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const catalogSection = document.getElementById('catalog');
            if (catalogSection) {
                window.scrollTo({
                    top: catalogSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Also observe product cards with delay
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.classList.add('reveal');
        revealObserver.observe(card);
        // Add delay for staggered animation
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Open cart modal
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        resetCartModalView();
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
            // Fly animation
            flyToCartAnimation(btn.closest('.product-card'), cartBtn);
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

    function resetCartModalView() {
        cartItemsContainer.style.display = 'block';
        totalPriceEl.parentElement.style.display = 'flex';
        modalFooter.style.display = 'flex';
        const confirmation = document.querySelector('.order-confirmation');
        if (confirmation) confirmation.remove();
    }

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста');
            return;
        }
        const totalPrice = totalPriceEl.textContent;
        // Hide cart items and footer
        cartItemsContainer.style.display = 'none';
        totalPriceEl.parentElement.style.display = 'none';
        modalFooter.style.display = 'none';
        // Create confirmation message
        const confirmationHTML = `
            <div class="order-confirmation" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--color-gold); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--color-gold); margin-bottom: 1rem;">Заказ успешно оформлен!</h3>
                <p style="margin-bottom: 1.5rem;">Спасибо за покупку на сумму <strong>${totalPrice}</strong>.</p>
                <p style="margin-bottom: 2rem; color: var(--color-gray);">Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.</p>
                <button id="return-to-home" class="btn btn-primary">Вернуться на главную</button>
            </div>
        `;
        const confirmationEl = document.createElement('div');
        confirmationEl.innerHTML = confirmationHTML;
        modalBody.appendChild(confirmationEl);
        // Add event listener to return button
        document.getElementById('return-to-home').addEventListener('click', () => {
            closeCartModal();
            cart = [];
            updateCart();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Restore cart modal content
            setTimeout(() => {
                resetCartModalView();
            }, 300);
        });
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

    function flyToCartAnimation(productCard, cartBtn) {
        const img = productCard.querySelector('img');
        if (!img) return;

        const flyImg = img.cloneNode(true);
        flyImg.style.cssText = `
            position: fixed;
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
            z-index: 4000;
            pointer-events: none;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.6s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(flyImg);

        const imgRect = img.getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();

        const startX = imgRect.left + imgRect.width / 2;
        const startY = imgRect.top + imgRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;

        flyImg.style.left = `${startX - 25}px`;
        flyImg.style.top = `${startY - 25}px`;
        flyImg.style.transform = `translate(0, 0) scale(1)`;

        requestAnimationFrame(() => {
            flyImg.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.3)`;
            flyImg.style.opacity = '0.5';
        });

        setTimeout(() => {
            flyImg.remove();
        }, 600);
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