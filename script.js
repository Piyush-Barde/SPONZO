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
            const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbysgiyhLNkRqL8QTUjSzaNiNRaIWjidsMWAfWIVtdr2SSHawuuWvPG4sQGh4cyY8PPK4Q/exec'; // e.g., 'https://api.yoursite.com/organizers'
            
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
            const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyWaT-qZhC2O1nqSnMpX4I7xghOMbMHPXQjhvsue3vrBoCJ3qwotlaLDAgDl9fG6qnJGQ/exec'; // e.g., 'https://api.yoursite.com/sponsors'
            
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
