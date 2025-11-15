// Modern Tourist Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Tourist Attraction Gallery Functionality
    const attractionCards = document.querySelectorAll('.attraction-card');
    
    attractionCards.forEach(card => {
        initializeAttractionCard(card);
    });

    function initializeAttractionCard(card) {
        const galleryTrack = card.querySelector('.gallery-track');
        const images = card.querySelectorAll('.gallery-image');
        const prevBtn = card.querySelector('.prev-btn');
        const nextBtn = card.querySelector('.next-btn');
        const dots = card.querySelectorAll('.dot');
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        let currentSlide = 1;
        const totalSlides = images.length;

        // Navigation functions
        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        }

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Touch/swipe functionality for mobile
        let startX = 0;
        let endX = 0;
        let isDragging = false;

        galleryTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        galleryTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        galleryTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            endX = e.changedTouches[0].clientX;
            isDragging = false;
            
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Mouse drag functionality for desktop
        let mouseStartX = 0;
        let mouseEndX = 0;
        let isMouseDragging = false;

        galleryTrack.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            e.preventDefault();
        });

        galleryTrack.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            e.preventDefault();
        });

        galleryTrack.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            mouseEndX = e.clientX;
            isMouseDragging = false;
            
            const diffX = mouseStartX - mouseEndX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Auto-play functionality (optional)
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        // Start auto-play when card is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        });
        
        observer.observe(card);
        
        // Pause auto-play on hover
        card.addEventListener('mouseenter', stopAutoPlay);
        card.addEventListener('mouseleave', startAutoPlay);

        // Favorite functionality
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('favorited');
                
                const isFavorited = this.classList.contains('favorited');
                const attractionName = card.querySelector('.attraction-title').textContent;
                
                if (isFavorited) {
                    console.log(`Added ${attractionName} to favorites`);
                    // Here you would typically save to localStorage or send to server
                    localStorage.setItem(`favorite_${card.dataset.attraction}`, 'true');
                } else {
                    console.log(`Removed ${attractionName} from favorites`);
                    localStorage.removeItem(`favorite_${card.dataset.attraction}`);
                }
            });
            
            // Load saved favorite state
            const isFavorited = localStorage.getItem(`favorite_${card.dataset.attraction}`) === 'true';
            if (isFavorited) {
                favoriteBtn.classList.add('favorited');
            }
        }

        // Image click to open lightbox
        images.forEach(img => {
            img.addEventListener('click', function() {
                openLightbox(this.src, this.alt);
            });
        });
    }

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });


    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.destination-card, .gallery-img, .contact-item, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });

    // Parallax effect for hero section
    const hero = document.getElementById('hero');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });

    // Mobile menu toggle (for future implementation)
    function createMobileMenu() {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '☰';
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-dark);
        `;
        
        // Add hamburger to nav
        nav.appendChild(hamburger);
        
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
        
        // Show hamburger on mobile (but keep nav visible on desktop)
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            // Don't hide nav on initial load, let CSS handle it
        } else {
            navLinks.style.display = 'flex';
        }
    }

    // Initialize mobile menu
    createMobileMenu();

    // Handle window resize
    window.addEventListener('resize', function() {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth <= 768) {
            if (hamburger) hamburger.style.display = 'block';
            // Keep nav visible, just toggle with hamburger
        } else {
            if (hamburger) hamburger.style.display = 'none';
            navLinks.style.display = 'flex';
            navLinks.classList.remove('mobile-open');
        }
    });

    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Card hover effects
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Learn More Button - Choice Modal Functionality
    const learnMoreButtons = document.querySelectorAll('.card-btn');
    const choiceModal = document.getElementById('choice-modal');
    const choiceModalClose = document.querySelector('.choice-modal-close');
    const choiceButtons = document.querySelectorAll('.choice-btn');
    let currentDestinationId = null;
    let currentDestinationName = null;

    // Location data for each destination with proper Google Maps links
    const destinationData = {
        'hinulugang-taktak': {
            name: 'Hinulugang Taktak Falls',
            location: 'https://www.google.com/maps?q=Hinulugang+Taktak+Falls,+Antipolo,+Rizal,+Philippines&hl=en',
            coordinates: '14.5864,121.1753',
            story: 'Hinulugang Taktak Falls is a historic waterfall in Antipolo City, Rizal, Philippines. The name "Hinulugang Taktak" means "the place where the bell was dropped" in Tagalog. According to local legend, during the Spanish colonial period, a priest ordered the removal of a bell from the church because its ringing disturbed his sleep. The bell was thrown into the waterfall, giving it its name. Today, it is a popular tourist destination and has been rehabilitated as a national park.'
        },
        'pinto-art-museum': {
            name: 'Pinto Art Museum',
            location: 'https://www.google.com/maps?q=Pinto+Art+Museum,+Sierra+Madre+St,+Antipolo,+Rizal,+Philippines&hl=en',
            coordinates: '14.5924,121.1756',
            story: 'Pinto Art Museum is a contemporary art museum located in Antipolo City, Rizal. Founded by Dr. Joven Cuanang, it houses a collection of Filipino contemporary art in a beautiful Mediterranean-inspired building surrounded by lush gardens. The museum aims to promote Filipino art and culture, featuring works from both established and emerging artists. The name "Pinto" means "door" in Filipino, symbolizing the gateway to Filipino art and culture.'
        },
        'antipolo-cathedral': {
            name: 'Antipolo Cathedral',
            location: 'https://www.google.com/maps?q=Antipolo+Cathedral,+P.+Oliveros+St,+Antipolo,+Rizal,+Philippines&hl=en',
            coordinates: '14.5842,121.1762',
            story: 'The Antipolo Cathedral, officially known as the International Shrine of Our Lady of Peace and Good Voyage, is one of the most important pilgrimage sites in the Philippines. The cathedral houses the image of Our Lady of Peace and Good Voyage (Nuestra Señora de la Paz y Buen Viaje), which was brought from Mexico in 1626. Every year, thousands of devotees visit the cathedral, especially during the Maytime pilgrimage. The current structure was completed in 1954 and has become an iconic landmark of Antipolo City.'
        },
        'cloud-9': {
            name: 'Cloud 9',
            location: 'https://www.google.com/maps?q=Cloud+9+Antipolo,+Sumulong+Highway,+Antipolo,+Rizal,+Philippines&hl=en',
            coordinates: '14.6238,121.1767',
            story: 'Cloud 9 is a popular mountain resort and viewpoint in Antipolo City, known for its breathtaking panoramic views of Metro Manila. The resort features a thrilling hanging bridge and elevated platforms that allow visitors to experience the sensation of being "above the clouds." It is a favorite destination for sunrise watching, photography, and relaxation. The name "Cloud 9" reflects the feeling of euphoria and peace that visitors experience when viewing the stunning landscape from this elevated location.'
        },
        'mount-purro': {
            name: 'Mount Purro Nature Reserve',
            location: 'https://www.google.com/maps?q=Mount+Purro+Nature+Reserve,+Antipolo,+Rizal,+Philippines&hl=en',
            coordinates: '14.6500,121.2000',
            story: 'Mount Purro Nature Reserve is an eco-tourism destination dedicated to conservation and sustainable tourism. The reserve offers visitors a chance to reconnect with nature through hiking trails, wildlife viewing, and various eco-friendly activities. It was established to preserve the natural environment while providing educational experiences about biodiversity and environmental conservation. The reserve promotes responsible tourism and serves as a sanctuary for local flora and fauna.'
        }
    };

    // Function to open choice modal
    function openChoiceModal(destinationId, destinationName) {
        currentDestinationId = destinationId;
        currentDestinationName = destinationName;
        choiceModal.classList.add('show');
        choiceModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Function to close choice modal
    function closeChoiceModal() {
        choiceModal.classList.remove('show');
        choiceModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        currentDestinationId = null;
        currentDestinationName = null;
    }

    // Handle Learn More button clicks
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const destinationId = this.getAttribute('data-id');
            const destinationCard = this.closest('.destination-card');
            const destinationName = destinationCard ? destinationCard.querySelector('h3').textContent : 'Destination';
            
            openChoiceModal(destinationId, destinationName);
        });
    });

    // Handle choice button clicks
    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const data = destinationData[currentDestinationId];
            
            if (!data) {
                alert('Destination information not available.');
                closeChoiceModal();
                return;
            }

            if (action === 'location') {
                // Open location using coordinates for better accuracy
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.coordinates}`;
                window.open(mapsUrl, '_blank');
                closeChoiceModal();
            } else if (action === 'story') {
                // Show story in an alert or create a story modal
                const storyModal = document.createElement('div');
                storyModal.className = 'story-modal-overlay';
                storyModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 4000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                `;
                
                storyModal.innerHTML = `
                    <div style="background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 2rem; max-width: 600px; width: 100%; position: relative;">
                        <button class="story-close-btn" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.1); border: none; color: white; font-size: 1.5rem; width: 2.5rem; height: 2.5rem; border-radius: 50%; cursor: pointer;">&times;</button>
                        <h2 style="font-family: 'Playfair Display', serif; color: #ffffff; margin-bottom: 1.5rem; font-size: 2rem;">${data.name}</h2>
                        <p style="color: #d1d5db; line-height: 1.8; font-size: 1.1rem;">${data.story}</p>
                    </div>
                `;
                
                document.body.appendChild(storyModal);
                
                // Close story modal
                const closeBtn = storyModal.querySelector('.story-close-btn');
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(storyModal);
                    document.body.style.overflow = 'auto';
                });
                
                storyModal.addEventListener('click', function(e) {
                    if (e.target === storyModal) {
                        document.body.removeChild(storyModal);
                        document.body.style.overflow = 'auto';
                    }
                });
                
                closeChoiceModal();
            }
        });
    });

    // Close choice modal
    choiceModalClose.addEventListener('click', closeChoiceModal);
    
    // Close modal when clicking outside
    choiceModal.addEventListener('click', function(e) {
        if (e.target === choiceModal) {
            closeChoiceModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && choiceModal.classList.contains('show')) {
            closeChoiceModal();
        }
    });

    console.log('Antipolo Tourism Website - JavaScript loaded successfully!');
});
