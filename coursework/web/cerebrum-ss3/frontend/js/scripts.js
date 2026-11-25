document.addEventListener('DOMContentLoaded', () => {
    // Navigation highlighting
    const currentPath = window.location.pathname || '/';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (href === '/' && currentPath === '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Fetch and render courses on courses.html
    if (document.getElementById('courses-container')) {
        fetch('/api/courses', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch courses');
                return response.json();
            })
            .then(courses => {
                renderCourses(courses);
                // Initialize carousel after rendering courses
                const carousel = new bootstrap.Carousel(document.getElementById('courses-carousel'), {
                    interval: 5000,
                    ride: 'carousel'
                });
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                document.getElementById('courses-container').innerHTML = '<p class="text-danger">Failed to load courses. Please try again later.</p>';
            });
    }

    // Fetch and render testimonials on index.html
    if (document.getElementById('testimonial-content')) {
        fetchTestimonials();
    }

    // Handle contact form submission with Bootstrap validation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to submit form');
                    return response.json();
                })
                .then(data => {
                    alert(data.message);
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    alert('Failed to submit form. Please try again.');
                });
        });
    }

    // Handle testimonial form submission with Bootstrap validation
    const testimonialForm = document.getElementById('testimonial-form');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!testimonialForm.checkValidity()) {
                e.stopPropagation();
                testimonialForm.classList.add('was-validated');
                return;
            }
            const formData = {
                name: document.getElementById('testimonial-name').value,
                text: document.getElementById('testimonial-text').value,
                rating: parseInt(document.getElementById('testimonial-rating').value)
            };
            fetch('http://localhost:3000/api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to submit testimonial');
                    return response.json();
                })
                .then(data => {
                    alert(data.message);
                    testimonialForm.reset();
                    testimonialForm.classList.remove('was-validated');
                    // Refresh testimonials on index.html if present
                    if (document.getElementById('testimonial-content')) {
                        fetchTestimonials();
                    }
                })
                .catch(error => {
                    console.error('Error submitting testimonial:', error);
                    alert('Failed to submit testimonial. Please try again.');
                });
        });
    }

    // Fade-in effects
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => observer.observe(el));

    // Function to fetch and render testimonials
    function fetchTestimonials() {
        fetch('http://localhost:3000/api/testimonials', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch testimonials');
                return response.json();
            })
            .then(testimonials => {
                renderTestimonials(testimonials);
                // Initialize the carousel after rendering testimonials
                const carousel = new bootstrap.Carousel(document.getElementById('testimonials-carousel'), {
                    interval: 5000,
                    ride: 'carousel'
                });
            })
            .catch(error => {
                console.error('Error fetching testimonials:', error);
                const container = document.getElementById('testimonial-content');
                if (container) {
                    container.innerHTML = '<p class="text-danger">Failed to load testimonials. Please try again later.</p>';
                }
            });
    }
});

// Render courses as Bootstrap carousel items
function renderCourses(courses) {
    const container = document.getElementById('courses-container');
    container.innerHTML = '';
    courses.forEach((course, index) => {
        const isActive = index === 0 ? 'active' : '';
        const item = document.createElement('div');
        item.className = `carousel-item ${isActive}`;
        item.innerHTML = `
            <div class="container">
                <div class="card h-100 course-card">
                    <img src="${course.image}" alt="${course.title}" class="card-img-top course-card-img">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.description}</p>
                        <p><strong>Duration:</strong> ${course.details.split('\n')[0].split('|')[0].trim()} | <strong>Mode:</strong> ${course.details.split('\n')[0].split('|')[1].trim()}</p>
                        <button class="btn btn-primary learn-more" data-bs-toggle="modal" data-bs-target="#courseModal${course.id}">
                            Learn More
                        </button>
                    </div>
                </div>
                <div class="modal fade" id="courseModal${course.id}" tabindex="-1" aria-labelledby="courseModalLabel${course.id}" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="courseModalLabel${course.id}">${course.title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                ${course.details.replace(/\n/g, '<br>')}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Render testimonials as Bootstrap carousel items
function renderTestimonials(testimonials) {
    const container = document.getElementById('testimonial-content');
    if (!container) return;
    container.innerHTML = '';
    if (testimonials.length === 0) {
        container.innerHTML = '<p>No testimonials available.</p>';
        return;
    }
    testimonials.forEach((testimonial, index) => {
        const isActive = index === 0 ? 'active' : '';
        const stars = '★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating);
        const item = document.createElement('div');
        item.className = `carousel-item ${isActive}`;
        item.innerHTML = `
            <div class="container text-center">
                <p>"${testimonial.text}"</p>
                <p>- ${testimonial.name}</p>
                <p>Rating: <span class="stars">${stars}</span> <span class="rating-text">(${testimonial.rating}/5)</span></p>
            </div>
        `;
        container.appendChild(item);
    });
}