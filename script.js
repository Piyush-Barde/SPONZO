// Mobile Menu Toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        const navActions = document.getElementById('navActions');

        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            navActions.classList.toggle('mobile-open');
        });

        // Modal Functions
        function openModal(type) {
            const modalId = type === 'organizer' ? 'organizerModal' : 'sponsorModal';
            document.getElementById(modalId).classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Close mobile menu if open
            navMenu.classList.remove('mobile-open');
            navActions.classList.remove('mobile-open');
        }

        function closeModal(type) {
            const modalId = type === 'organizer' ? 'organizerModal' : 'sponsorModal';
            document.getElementById(modalId).classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Success Message
        function showSuccessMessage() {
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        }

        // Event Organizer Form Submission
        const organizerForm = document.getElementById('organizerForm');
        organizerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = organizerForm.querySelector('button[type="submit"]');
            btn.classList.add('loading-state');

            // Get form data
            const formData = new FormData(organizerForm);
            const data = Object.fromEntries(formData);
            
            // 🔥 REPLACE WITH YOUR API ENDPOINT
            const API_ENDPOINT = 'YOUR_API_ENDPOINT_FOR_ORGANIZERS'; // e.g., 'https://api.yoursite.com/organizers'
            
            // API Call
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                console.log('Event Organizer Registration Success:', result);
                btn.classList.remove('loading-state');
                closeModal('organizer');
                organizerForm.reset();
                showSuccessMessage();
            })
            .catch(error => {
                console.error('Registration Error:', error);
                btn.classList.remove('loading-state');
                alert('Registration failed. Please try again or contact support.');
            });
        });

        // Sponsor Form Submission
        const sponsorForm = document.getElementById('sponsorForm');
        sponsorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = sponsorForm.querySelector('button[type="submit"]');
            btn.classList.add('loading-state');

            // Get form data
            const formData = new FormData(sponsorForm);
            const data = Object.fromEntries(formData);
            
            // 🔥 REPLACE WITH YOUR API ENDPOINT
            const API_ENDPOINT = 'YOUR_API_ENDPOINT_FOR_SPONSORS'; // e.g., 'https://api.yoursite.com/sponsors'
            
            // API Call
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                console.log('Sponsor Registration Success:', result);
                btn.classList.remove('loading-state');
                closeModal('sponsor');
                sponsorForm.reset();
                showSuccessMessage();
            })
            .catch(error => {
                console.error('Registration Error:', error);
                btn.classList.remove('loading-state');
                alert('Registration failed. Please try again or contact support.');
            });
        });

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu
                    navMenu.classList.remove('mobile-open');
                    navActions.classList.remove('mobile-open');
                }
            });
        });

        // Keyboard Accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
                navMenu.classList.remove('mobile-open');
                navActions.classList.remove('mobile-open');
            }
        });

        // Auto-hide navbar on scroll
        let lastScrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });

        /* // Events Data
        const eventsData = [
            {
                id: 1,
                name: "TechFest 2025",
                category: "tech",
                type: "college",
                date: "March 15-17, 2025",
                location: "IIT Bombay, Mumbai",
                attendees: "15,000+",
                sponsorAmount: "₹10,00,000",
                description: "India's largest science and technology festival with workshops, competitions, exhibitions, and guest lectures.",
                icon: "💻"
            },
            {
                id: 2,
                name: "StartupCon India",
                category: "corporate",
                type: "corporate",
                date: "April 22-23, 2025",
                location: "Bangalore International Exhibition Centre",
                attendees: "5,000+",
                sponsorAmount: "₹25,00,000",
                description: "Premier startup conference connecting entrepreneurs, investors, and industry leaders across India.",
                icon: "🚀"
            },
            {
                id: 3,
                name: "Marathon Mumbai 2025",
                category: "sports",
                type: "sports",
                date: "February 10, 2025",
                location: "Mumbai, Maharashtra",
                attendees: "50,000+",
                sponsorAmount: "₹50,00,000",
                description: "Annual marathon event promoting fitness and health awareness with participants from across the country.",
                icon: "🏃"
            },
            {
                id: 4,
                name: "Cultural Carnival",
                category: "cultural",
                type: "college",
                date: "March 5-7, 2025",
                location: "Delhi University, Delhi",
                attendees: "20,000+",
                sponsorAmount: "₹8,00,000",
                description: "Three-day cultural extravaganza featuring music, dance, theater, fashion shows, and celebrity performances.",
                icon: "🎭"
            },
            {
                id: 5,
                name: "HackInnovate 2025",
                category: "tech",
                type: "tech",
                date: "May 1-2, 2025",
                location: "BITS Pilani, Goa",
                attendees: "1,000+",
                sponsorAmount: "₹5,00,000",
                description: "36-hour hackathon bringing together developers, designers, and innovators to build impactful solutions.",
                icon: "⚡"
            },
            {
                id: 6,
                name: "Business Summit 2025",
                category: "corporate",
                type: "corporate",
                date: "June 15, 2025",
                location: "Taj Palace, New Delhi",
                attendees: "2,000+",
                sponsorAmount: "₹30,00,000",
                description: "Executive summit featuring keynote speakers, panel discussions, and networking opportunities for business leaders.",
                icon: "💼"
            },
            {
                id: 7,
                name: "Sports Fest Championship",
                category: "sports",
                type: "college",
                date: "April 10-12, 2025",
                location: "Pune Sports Complex",
                attendees: "10,000+",
                sponsorAmount: "₹12,00,000",
                description: "Inter-college sports championship with multiple sporting events including cricket, football, basketball, and athletics.",
                icon: "⚽"
            },
            {
                id: 8,
                name: "Music & Arts Festival",
                category: "cultural",
                type: "cultural",
                date: "March 20-21, 2025",
                location: "Jawaharlal Nehru Stadium, Chennai",
                attendees: "30,000+",
                sponsorAmount: "₹20,00,000",
                description: "Multi-genre music festival featuring renowned artists, art installations, food stalls, and interactive experiences.",
                icon: "🎵"
            }
        ];
*/

        // Current filter
        let currentEventFilter = 'all';

        // Initialize events on page load
        window.addEventListener('DOMContentLoaded', () => {
            renderEvents(eventsData);
        });

        // Filter Events Function
        function filterEvents(category) {
            currentEventFilter = category;
            
            // Update active tab
            document.querySelectorAll('.event-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
            
            // Filter and render events
            if (category === 'all') {
                renderEvents(eventsData);
            } else {
                const filteredEvents = eventsData.filter(event => event.category === category);
                renderEvents(filteredEvents);
            }
        }

        // Render Events Function
        function renderEvents(events) {
            const eventsGrid = document.getElementById('eventsGrid');
            
            if (events.length === 0) {
                eventsGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📭</div>
                        <h3>No Events Found</h3>
                        <p>No events available in this category at the moment. Check back soon!</p>
                    </div>
                `;
                return;
            }
            
            eventsGrid.innerHTML = events.map(event => `
                <div class="event-card">
                    <div class="event-image">
                        <span style="font-size: 5rem;">${event.icon}</span>
                        <span class="event-badge">Featured</span>
                    </div>
                    <div class="event-body">
                        <span class="event-category">${formatCategory(event.category)}</span>
                        <h3>${event.name}</h3>
                        <div class="event-meta">
                            <div class="event-meta-item">
                                <span>📅</span>
                                <span>${event.date}</span>
                            </div>
                            <div class="event-meta-item">
                                <span>📍</span>
                                <span>${event.location}</span>
                            </div>
                            <div class="event-meta-item">
                                <span>👥</span>
                                <span>${event.attendees} Expected Attendees</span>
                            </div>
                        </div>
                        <p class="event-description">${event.description}</p>
                        <div class="event-footer">
                            <div>
                                <div class="event-sponsor-amount">${event.sponsorAmount}</div>
                                <div class="event-sponsor-label">Sponsorship Value</div>
                            </div>
                            <button class="btn btn-primary" onclick="openModal('sponsor')">
                                Sponsor Now
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Format Category Helper
        function formatCategory(category) {
            const categories = {
                college: 'College Event',
                corporate: 'Corporate',
                sports: 'Sports',
                tech: 'Technology',
                cultural: 'Cultural'
            };
            return categories[category] || category;
        }

        // Gallery Data
        const galleryData = [
            {
                id: 1,
                eventName: "TechFest 2024",
                location: "IIT Bombay",
                date: "March 2024",
                category: "tech",
                icon: "💻",
                attendees: "15,000+"
            },
            {
                id: 2,
                eventName: "Cultural Extravaganza",
                location: "Delhi University",
                date: "February 2024",
                category: "cultural",
                icon: "🎭",
                attendees: "20,000+"
            },
            {
                id: 3,
                eventName: "Marathon 2024",
                location: "Mumbai",
                date: "January 2024",
                category: "sports",
                icon: "🏃",
                attendees: "50,000+"
            },
            {
                id: 4,
                eventName: "Startup Summit",
                location: "Bangalore",
                date: "December 2023",
                category: "corporate",
                icon: "🚀",
                attendees: "5,000+"
            },
            {
                id: 5,
                eventName: "Hackathon 2024",
                location: "BITS Pilani",
                date: "March 2024",
                category: "tech",
                icon: "⚡",
                attendees: "1,000+"
            },
            {
                id: 6,
                eventName: "Music Festival",
                location: "Chennai",
                date: "February 2024",
                category: "cultural",
                icon: "🎵",
                attendees: "30,000+"
            },
            {
                id: 7,
                eventName: "Sports Championship",
                location: "Pune",
                date: "April 2024",
                category: "sports",
                icon: "⚽",
                attendees: "10,000+"
            },
            {
                id: 8,
                eventName: "Business Conference",
                location: "New Delhi",
                date: "May 2024",
                category: "corporate",
                icon: "💼",
                attendees: "2,000+"
            },
            {
                id: 9,
                eventName: "Art Exhibition",
                location: "Kolkata",
                date: "March 2024",
                category: "cultural",
                icon: "🎨",
                attendees: "8,000+"
            }
        ];

        // Render Gallery
        function renderGallery() {
            const galleryGrid = document.getElementById('galleryGrid');
            
            galleryGrid.innerHTML = galleryData.map(item => `
                <div class="gallery-item" onclick="openLightbox(${item.id})">
                    <div class="gallery-placeholder ${item.category}">
                        <span style="font-size: 6rem; filter: brightness(1.2);">${item.icon}</span>
                    </div>
                    <div class="gallery-overlay">
                        <div class="gallery-event-name">${item.eventName}</div>
                        <div class="gallery-event-details">
                            <span>📍 ${item.location}</span>
                            <span>📅 ${item.date}</span>
                            <span>👥 ${item.attendees}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Initialize gallery on page load
        window.addEventListener('DOMContentLoaded', () => {
            renderGallery();
        });

        // Lightbox Functions
        function openLightbox(itemId) {
            const item = galleryData.find(g => g.id === itemId);
            if (!item) return;

            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            const lightboxTitle = document.getElementById('lightboxTitle');
            const lightboxDetails = document.getElementById('lightboxDetails');

            // Create placeholder image for lightbox
            const placeholderDiv = document.createElement('div');
            placeholderDiv.className = `gallery-placeholder ${item.category}`;
            placeholderDiv.style.width = '800px';
            placeholderDiv.style.height = '600px';
            placeholderDiv.style.borderRadius = 'var(--radius-lg)';
            placeholderDiv.innerHTML = `<span style="font-size: 10rem; filter: brightness(1.2);">${item.icon}</span>`;
            
            // Convert to data URL and set as image
            lightboxImage.style.display = 'none';
            if (lightboxImage.previousElementSibling && lightboxImage.previousElementSibling.classList.contains('gallery-placeholder')) {
                lightboxImage.previousElementSibling.remove();
            }
            lightboxImage.parentElement.insertBefore(placeholderDiv, lightboxImage);

            lightboxTitle.textContent = item.eventName;
            lightboxDetails.textContent = `${item.location} • ${item.date} • ${item.attendees} Attendees`;

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            const lightbox = document.getElementById('lightbox');
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close lightbox on backdrop click
        document.getElementById('lightbox').addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });

        // Close lightbox on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('lightbox').classList.contains('active')) {
                closeLightbox();
            }
        });