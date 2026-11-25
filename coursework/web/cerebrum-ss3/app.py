from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=os.path.join(BASE_DIR, 'frontend'), static_folder=os.path.join(BASE_DIR, 'frontend'), static_url_path='/frontend')
CORS(app)  

# Ensure contact_submissions.json exists
CONTACT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'contact_submissions.json')
if not os.path.exists(CONTACT_FILE):
    with open(CONTACT_FILE, 'w') as f:
        json.dump([], f)

# Serves HTML page templates
@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        return jsonify({'error': 'Failed to load home page'}), 500

@app.route('/courses')
def courses():
    try:
        return render_template('courses.html')
    except Exception as e:
        return jsonify({'error': 'Failed to load courses page'}), 500

@app.route('/contact')
def contact():
    try:
        return render_template('contact.html')
    except Exception as e:
        return jsonify({'error': 'Failed to load contact page'}), 500

@app.route('/about')
def about():
    try:
        return render_template('about.html')
    except Exception as e:
        return jsonify({'error': 'Failed to load about page'}), 500

# API route for courses
@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        courses = [
            {
                'id': 1,
                'title': 'Web Development',
                'description': 'Learn to build modern, responsive websites and web applications.',
                'details': (
                    'Duration: 10 Weeks | Mode: Self-paced\n\n'
                    'Who Should Enroll: Beginners eager to start a web development career or professionals looking to enhance their web development skills.\n\n'
                    'Key Topics:\n- HTML, CSS, and JavaScript\n- Responsive Design and Accessibility\n- Frontend Frameworks (e.g., React, Angular)\n- Backend Development (Node.js, Express)\n- Databases and APIs\n\n'
                    'Course Outline:\n- Week 1-2: Introduction to HTML and CSS\n- Week 3-4: JavaScript Basics\n- Week 5-6: Responsive Design\n- Week 7-8: Frontend Frameworks\n- Week 9-10: Web Application Architecture\n\n'
                    'Prerequisites: Basic understanding of computers and the internet.\n\n'
                    'Course Objectives: Design and develop responsive websites using modern web technologies.\n\n'
                    'Academic Manager: Alex Morgan, a seasoned IT curriculum builder with over 7 years of experience.\n\n'
                    'Outcome: Build and deploy fully functional, responsive websites and web applications.'
                ),
                'image': '/frontend/images/WebDevelopment.png'
            },
            {
                'id': 2,
                'title': 'Cybersecurity',
                'description': 'Understand security fundamentals and protect systems from cyber threats.',
                'details': (
                    'Duration: 12 Weeks | Mode: Instructor-led\n\n'
                    'Who Should Enroll: IT professionals seeking to advance their security knowledge, or anyone interested in safeguarding digital assets.\n\n'
                    'Key Topics:\n- Network Security Basics\n- Threat Detection and Incident Response\n- Encryption and Cryptography\n- Penetration Testing\n- Security Compliance and Best Practices\n\n'
                    'Course Outline:\n- Week 1-2: Network Security Basics\n- Week 3-4: Threat Detection\n- Week 5-8: Encryption Techniques\n- Week 9-12: Penetration Testing\n\n'
                    'Prerequisites: Basic IT knowledge.\n\n'
                    'Course Objectives: Provide a comprehensive understanding of cybersecurity principles and practices.\n\n'
                    'Instructor: Jamie Reed, a certified cybersecurity expert with extensive experience.\n\n'
                    'Outcome: Gain hands-on experience in identifying vulnerabilities and implementing robust security measures.'
                ),
                'image': '/frontend/images/Cybersecurity.jpg'
            },
            {
                'id': 3,
                'title': 'Data Science',
                'description': 'Dive into data analysis, machine learning, and AI concepts.',
                'details': (
                    'Duration: 15 Weeks | Mode: Self-paced\n\n'
                    'Who Should Enroll: Individuals looking to enter the data science field or professionals aiming to boost their analytical skills.\n\n'
                    'Key Topics:\n- Data Cleaning and Preprocessing\n- Statistical Analysis\n- Machine Learning Algorithms\n- Data Visualization with Python\n- Real-world Project Implementation\n\n'
                    'Course Outline:\n- Week 1-3: Data Cleaning\n- Week 4-6: Statistical Analysis\n- Week 7-10: Machine Learning Basics\n- Week 11-15: Data Visualization\n\n'
                    'Prerequisites: Basic programming knowledge.\n\n'
                    'Course Objectives: Analyze data, build predictive models, and visualize insights using industry-standard tools.\n\n'
                    'Instructor: Taylor Brooks, a data science expert passionate about actionable insights.\n\n'
                    'Outcome: Acquire skills to analyze complex datasets and build predictive models.'
                ),
                'image': '/frontend/images/DataScience.webp'
            }
        ]
        return jsonify(courses)
    except Exception as e:
        return jsonify({'error': 'Failed to fetch courses'}), 500

# Handle contact form submission
@app.route('/api/contact', methods=['POST'])
def contact_form():
    try:
        data = request.json
        if not all(key in data for key in ['name', 'email', 'subject', 'message']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Load existing submissions
        with open(CONTACT_FILE, 'r') as f:
            submissions = json.load(f)
        
        # Appending of a new submission
        submissions.append({
            'name': data['name'],
            'email': data['email'],
            'subject': data['subject'],
            'message': data['message'],
        })
        
        # Save updated submissions
        with open(CONTACT_FILE, 'w') as f:
            json.dump(submissions, f, indent=2)
        
        return jsonify({'message': 'Form submitted successfully'}), 200
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({'error': 'Failed to process form submission'}), 500

if __name__ == '__main__':
    app.run(debug=os.environ.get('FLASK_DEBUG') == '1', port=int(os.environ.get('PORT', '5000')))