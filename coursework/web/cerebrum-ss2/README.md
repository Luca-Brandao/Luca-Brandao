# Cerebrum: Interactive Website

A JavaScript-enhanced four-page website advertising fictional online IT courses. This coursework stage focuses on client-side interaction and form validation.

**Author:** Luca Brandao  
**Coursework:** WST262 SS2 · Bachelor of Business Information Systems, STADIO Higher Education  
**Stack:** HTML, CSS and JavaScript

## Features

- Home, about, courses and contact pages.
- Course information for web development, cybersecurity and data science.
- Responsive layout and reusable navigation.
- Fictional staff profiles with example.com contact addresses.
- JavaScript navigation highlighting and browser-side form checks.

## Requirements and setup

Keep the repository folders together and open `Html/home.html` in a browser. For a local HTTP server, from the repository root run:

```sh
python -m http.server 8000
```

Then visit **http://localhost:8000/Html/home.html**. The HTTP server is optional; Python is not required when opening the HTML file directly.

## Using the project

Use the navigation bar to visit each page and inspect the course listings. The contact form is a client-side validation exercise and does not send messages to a real organisation. Staff identities and displayed contacts are demo data.

## How it works

This stage is a standalone frontend. Each page reuses the same visual structure and stylesheet. The JavaScript updates navigation states and validates fields before allowing the demonstration form workflow.

## Project files

- `Html/`: home, about, courses and contact pages.
- `Css/styles.css`: shared styling.
- `Images/`: course and demo staff images.
- `script.js`: client-side interaction and validation.

## Portfolio preparation

Staff names, biographies, email aliases and matching image filenames have been changed together. Resource links use forward slashes so the same files work across operating systems.

Notebook outputs, personal submissions, IDE settings, compiled classes, dependency folders and assignment/presentation files are not included. See [PROJECT.md](PROJECT.md) for the academic context.

## Limitations and troubleshooting

There are no accounts, enrolments, payments or server-side message delivery in this stage. Images are coursework assets. The fuller Flask/Express version is in the separate Cerebrum-Course-Platform repository.

## Portfolio

[My GitHub profile](https://github.com/Luca-Brandao) · [LinkedIn](https://www.linkedin.com/in/luca-brandao-a90961352/)
