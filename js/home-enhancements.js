
function enhanceHomePage() {
    
    const pizzaEaterContainer = document.querySelector('.pizza-eater-container');
    const head = document.querySelector('.head');
    const pizzaSlice = document.querySelector('.pizza-slice');

    if (pizzaEaterContainer && head) {
        document.addEventListener('mousemove', (e) => {
            const rect = pizzaEaterContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const tilt = (angle * 180) / Math.PI - 90;

            
            head.style.transform = `rotate(${tilt / 30}deg)`;
        });
    }


    
    enhanceRestaurantCards();


    
    animateRestaurantsOnLoad();

    
    enhanceSearchBoxes();

    
    enhanceServiceCards();
}


function enhanceCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryColors = [
        '#ff6b35', '#ff8a50', '#ffa366', '#ffb366',
        '#ffc266', '#ffd280', '#0066ff', '#3399ff'
    ];

    categoryCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function () {
            this.style.borderColor = categoryColors[index % categoryColors.length];
            this.style.background = `linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(255, 255, 255, 0.5))`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.borderColor = 'transparent';
            this.style.background = 'linear-gradient(135deg, #ffffff, #fff5f0)';
        });

        card.addEventListener('click', function () {
            const category = this.querySelector('h3').textContent;
            
        });
    });
}


function enhanceRestaurantCards() {
    const restaurantCards = document.querySelectorAll('.restaurant-card');

    restaurantCards.forEach((card, index) => {
        
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeIn 0.6s ease forwards';

        
        card.addEventListener('mouseenter', function () {
            const rating = this.querySelector('.restaurant-meta i');
            if (rating) {
                rating.style.animation = 'bounce 0.6s ease';
            }
        });

        
        card.addEventListener('click', function () {
            const name = this.querySelector('.restaurant-name').textContent;
            
        });
    });
}


function animateRestaurantsOnLoad() {
    const restaurantsSection = document.querySelector('.restaurants');
    if (!restaurantsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.restaurant-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'slideInBottom 0.6s ease forwards';
                    }, index * 100);
                });
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(restaurantsSection);
}


function enhanceSearchBoxes() {
    const searchBoxes = document.querySelectorAll('.search-box');

    searchBoxes.forEach((box, index) => {
        const input = box.querySelector('input');

        if (input) {
            input.addEventListener('focus', function () {
                box.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.3)';
                box.style.transform = 'scale(1.05)';
            });

            input.addEventListener('blur', function () {
                box.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                box.style.transform = 'scale(1)';
            });

            input.addEventListener('input', function () {
                if (this.value.length > 0) {
                    box.style.borderRight = '4px solid #27ae60';
                } else {
                    box.style.borderRight = 'none';
                }
            });
        }
    });
}


function enhanceServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
        const btn = card.querySelector('.explore-btn');
        if (btn) {
            btn.addEventListener('click', function (e) {
                toast.success('Explore your favorite restaurants! 🎉', 2000);
            });
        }
    });
}


function setupHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    });
}


function pulseCategoryIcons() {
    const icons = document.querySelectorAll('.category-icon');
    const colors = ['#ff6b35', '#ff8a50', '#ffa366', '#0066ff', '#3399ff', '#00cc88'];

    let colorIndex = 0;
    setInterval(() => {
        icons.forEach((icon, index) => {
            const color = colors[(colorIndex + index) % colors.length];
            icon.style.filter = `drop-shadow(0 4px 8px ${color}44)`;
        });
        colorIndex++;
    }, 3000);
}


function animateHeroHeading() {
    const titleWords = document.querySelectorAll('.title-word');

    titleWords.forEach((word, index) => {
        word.style.opacity = '0';
        word.style.animation = `fadeInUp 0.6s ease forwards`;
        word.style.animationDelay = `${0.1 + index * 0.15}s`;
    });
}


function initPizzaEater() {
    const mouthCircle = document.querySelector('.mouth-circle');
    if (!mouthCircle) return;

    
    const eatingSounds = ['😋', '😋', '😋', '😋', '😋', '😋', '😋', '😋'];
    let soundIndex = 0;

    setInterval(() => {
        if (mouthCircle) {
            mouthCircle.style.opacity = (0.5 + Math.sin(soundIndex) * 0.3).toString();
            soundIndex += 0.15;
        }
    }, 100);
}


function setupHeroAnimations() {
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bubbleFloat {
            0%, 100% {
                transform: translateY(0px) translateX(0px);
            }
            25% {
                transform: translateY(-20px) translateX(15px);
            }
            50% {
                transform: translateY(-40px) translateX(0px);
            }
            75% {
                transform: translateY(-20px) translateX(-15px);
            }
        }
    `;
    document.head.appendChild(style);
}


function setupEmojiEffects() {
    document.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const emojis = ['🍕', '🍔', '🍜', '🍱', '😋', '⭐', '🎉'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.position = 'fixed';
        span.style.left = x + 'px';
        span.style.top = y + 'px';
        span.style.fontSize = '30px';
        span.style.pointerEvents = 'none';
        span.style.animation = 'float 3s ease-out forwards';
        span.style.opacity = '0';

        document.body.appendChild(span);

        setTimeout(() => span.remove(), 3000);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    
    setTimeout(() => {
        enhanceHomePage();
        setupHeroParallax();
        pulseCategoryIcons();
        animateHeroHeading();
        initPizzaEater();
        setupHeroAnimations();
        setupEmojiEffects();
    }, 500);
});


const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.id === 'restaurantsGrid' && mutation.addedNodes.length > 0) {
            enhanceRestaurantCards();
            animateRestaurantsOnLoad();
        }
        if (mutation.target.id === 'categoriesContainer' && mutation.addedNodes.length > 0) {
            enhanceCategoryCards();
        }
    });
});

observer.observe(document.body, {
    subtree: true,
    childList: true
});
