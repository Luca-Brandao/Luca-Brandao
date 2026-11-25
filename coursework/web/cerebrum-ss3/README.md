# Cerebrum Online IT Courses

A course platform with a Bootstrap frontend, Flask course and contact APIs, an Express testimonial API and JSON file storage.

**Module:** WST262 SS3 · STADIO Higher Education

## Run locally

From this folder, install dependencies:

```sh
npm ci
python -m pip install -r requirements.txt
```

Run both servers in separate terminals:

```sh
node server.js
```

```sh
python app.py
```

Open http://127.0.0.1:5000. Flask serves the website, courses and contacts; Express serves testimonials on port 3000. The JSON stores start empty. Run locally as a coursework demonstration.

## About this version

This is a portfolio copy of my academic submission. The coursework logic is retained; notebook outputs and local IDE/build files have been removed, and demo contact details and sample names have been standardised. Assignment PDFs and presentation video are kept outside this source repository.
