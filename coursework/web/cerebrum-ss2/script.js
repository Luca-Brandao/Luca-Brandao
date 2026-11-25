document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Navigation Bar
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Form Validation on Contact Us Page
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            // Clear previous errors
            document.querySelectorAll('.error').forEach(el => {
                el.textContent = '';
                el.style.display = 'none';
            });
            // Name validation
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim() === '') {
                const nameError = nameInput.nextElementSibling;
                nameError.textContent = 'Error: Name is required';
                nameError.style.display = 'inline';
                isValid = false;
            }
            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                const emailError = emailInput.nextElementSibling;
                emailError.textContent = 'Error: Email is required';
                emailError.style.display = 'inline';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                const emailError = emailInput.nextElementSibling;
                emailError.textContent = 'Error: Invalid email format';
                emailError.style.display = 'inline';
                isValid = false;
            }       
            if (isValid) {
                alert('Form submitted successfully!');
                contactForm.reset(); // Clear the form after successful submission
            }
        });
    }

    // Interactive Course Details on Courses Page
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const learnMoreButton = card.querySelector('.learn-more');
        const details = card.querySelector('.course-details');
        if (learnMoreButton && details) {
            learnMoreButton.addEventListener('click', () => {
                details.classList.toggle('open');
            });
        }
    });

    // Dynamic Content: Rotating Testimonials on Home Page
    const testimonials = [
        { name: "Demo Learner 1", text: "I enrolled in the data science course and I am impressed with the content and instructors.", rating: 5 },
        { name: "Demo Learner 2", text: "All courses are informative and well put together.", rating: 4 },
        { name: "Demo Learner 3", text: "Best free online IT courses around!", rating: 5 },
        { name: "Demo Learner 4", text: "Very Informative!", rating: 4 },
        { name: "Demo Learner 5", text: "Recommended for those looking to upskill.", rating: 5 },
        { name: "Demo Learner 6", text: "The course for cyber-security helped me land my dream job!", rating: 5 },
        { name: "Demo Learner 7", text: "Friendly and experienced course instructors.", rating: 5 },
        { name: "Demo Learner 8", text: "Highly recommended.", rating: 4 }
    ];
    let currentTestimonial = 0;
    const testimonialContent = document.getElementById('testimonial-content');
    if (testimonialContent) {
        function displayTestimonial() {
            const testimonial = testimonials[currentTestimonial];
            const stars = testimonial.rating === 5 ? '★★★★★' : '★★★★☆';
            testimonialContent.innerHTML = `
                <p>"${testimonial.text}"</p>
                <p>- ${testimonial.name}</p>
                <p>Rating: <span class="stars">${stars}</span> <span class="rating-text">(${testimonial.rating}/5)</span></p>
            `;
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        }
        displayTestimonial();
        setInterval(displayTestimonial, 5000);
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Fade-in Effects
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});