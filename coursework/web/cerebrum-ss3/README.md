# Cerebrum: Course Platform

A local full-stack course website with a Bootstrap frontend, Flask course/contact APIs and a separate Express testimonials API.

**Author:** Luca Brandao  
**Coursework:** WST262 SS3 · Bachelor of Business Information Systems, STADIO Higher Education  
**Stack:** Flask, Express and Bootstrap

## Features

- Home, about, courses and contact pages.
- Course information for web development, cybersecurity and data science.
- Responsive layout and reusable navigation.
- Fictional staff profiles with example.com contact addresses.
- Courses loaded from a Flask JSON API.
- Contact form submissions stored locally as JSON.
- Testimonial submission/retrieval through Express.
- Bootstrap cards, modals, validation and carousels.

## Requirements and setup

Use Python 3.10+ and a Node.js installation that supports Express 5. From the repository folder:

```sh
python -m venv .venv
```

Activate `.venv` (`.venv\Scripts\activate` on Windows, or `source .venv/bin/activate` on macOS/Linux), then install the dependencies:

```sh
python -m pip install -r requirements.txt
npm ci
```

Start Flask in one terminal:

```sh
python app.py
```

Start Express in another terminal:

```sh
npm start
```

Open **http://127.0.0.1:5000**. Keep both terminals running. Express listens on port 3000 by default.

## Using the project

Browse the courses page to load the course catalogue and open a course modal. Submit a demo contact message on Contact, then add a demo testimonial on About and return to Home to see it. Both JSON stores are created empty on first use. Use fictional test details; this is a local coursework demonstration.

## How it works

Flask serves `/`, `/about`, `/courses`, `/contact`, `GET /api/courses` and `POST /api/contact`. Express serves `GET /api/testimonials` and `POST /api/testimonials`. Frontend Fetch calls update the course and testimonial displays. Local JSON files provide simple persistence; there is no database.

## Project files

Playground source layout:

- `app.py`: Flask pages, course data and contact endpoint.
- `server.js`: Express testimonial endpoints.
- `frontend/`: HTML pages, CSS, JavaScript and images.
- `requirements.txt`: Python dependencies.
- `package.json` / `package-lock.json`: Node dependencies and start command.
- `contact_submissions.json` / `testimonials.json`: generated local data; ignored by Git.

## Portfolio preparation

Staff names, biographies, email aliases and matching image filenames have been changed together. Resource links use forward slashes so the same files work across operating systems. The Express server waits for its JSON store before listening. Flask uses a project-relative contact-store path and debug mode is off by default. Course/contact requests use the page origin.

Notebook outputs, personal submissions, IDE settings, compiled classes, dependency folders and assignment/presentation files are not included. See [PROJECT.md](PROJECT.md) for the academic context.

## Limitations and troubleshooting

Both servers are required. If testimonials fail, confirm the Express process is running on port 3000. Flask defaults to 5000. Existing port conflicts must be resolved before starting. Bootstrap assets are loaded from jsDelivr, so their styling/components require an internet connection. JSON file storage and permissive development CORS are intended for local demonstration, not a production service. Optional environment settings are `PORT` for Flask, `TESTIMONIALS_PORT` for Express, and `FLASK_DEBUG=1` for local debugging. The frontend expects the testimonial server on port 3000 unless its URL is updated too.

## Portfolio

[My GitHub profile](https://github.com/Luca-Brandao) · [LinkedIn](https://www.linkedin.com/in/luca-brandao-a90961352/)
