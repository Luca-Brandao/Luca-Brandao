# Cerebrum: Static Website

A static four-page website advertising fictional online IT courses. This coursework stage focuses on HTML structure, CSS styling, navigation and responsive layouts.

**Author:** Luca Brandao  
**Coursework:** WST262 SS1 · Bachelor of Business Information Systems, STADIO Higher Education  
**Stack:** HTML and CSS

## Features

- Home, about, courses and contact pages.
- Course information for web development, cybersecurity and data science.
- Responsive layout and reusable navigation.
- Fictional staff profiles with example.com contact addresses.

## Requirements and setup

Keep the repository folders together and open `Html/home.html` in a browser. For a local HTTP server, from the repository root run:

```sh
python -m http.server 8000
```

Then visit **http://localhost:8000/Html/home.html**. The HTTP server is optional; Python is not required when opening the HTML file directly.

## Using the project

Use the navigation bar to visit each page and inspect the course listings. The contact form is a frontend layout/input exercise and does not send messages to a real organisation. Staff identities and displayed contacts are demo data.

## How it works

This stage is a standalone frontend. Each page reuses the same visual structure and stylesheet. CSS handles layout and responsive presentation without a framework or build pipeline.

## Project files

- `Html/`: home, about, courses and contact pages.
- `Css/styles.css`: shared styling.
- `Images/`: course and demo staff images.

## Portfolio preparation

Staff names, biographies, email aliases and matching image filenames have been changed together. Resource links use forward slashes so the same files work across operating systems.

Notebook outputs, personal submissions, IDE settings, compiled classes, dependency folders and assignment/presentation files are not included. See [PROJECT.md](PROJECT.md) for the academic context.

## Limitations and troubleshooting

There are no accounts, enrolments, payments or server-side message delivery in this stage. Images are coursework assets. Later stages are published separately as Cerebrum-Interactive-Website and Cerebrum-Course-Platform.

## Portfolio

[My GitHub profile](https://github.com/Luca-Brandao) · [LinkedIn](https://www.linkedin.com/in/luca-brandao-a90961352/)
