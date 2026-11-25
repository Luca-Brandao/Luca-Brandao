# African History Quiz

A terminal quiz about African history, culture and notable figures. It was built to practise functions, dictionaries, lists, random selection, loops and input validation.

**Author:** Luca Brandao  
**Coursework:** CTIP152 SS2 · Bachelor of Business Information Systems, STADIO Higher Education  
**Stack:** Python

## Features

- A question bank split into three categories.
- Random question selection without repeating a question during a game.
- Shuffled answer choices, with numbered terminal input.
- Immediate answer feedback and a final score.
- A Jupyter notebook and an equivalent standalone Python script.

## Requirements and setup

Python 3.10 or newer is sufficient. The command-line version uses only the standard library.

```sh
python quiz.py
```

For the notebook version, install Jupyter in your own environment, open `quiz.ipynb`, and run the cells in order.

## Using the project

Choose an answer by entering its displayed number, from 1 to 4. The default game has ten rounds. Invalid menu input is rejected and prompted again. At the end, the program prints a score such as `FINAL SCORE - (7/10)`. Questions and option order vary between runs.

## How it works

`quiz_questions` stores the options and answer for each question. `generate_question` selects an unused question, `Shuffle` randomises its options, and `validate_answer` checks the chosen text. `play_quiz` coordinates the rounds and score. The notebook retains the step-by-step coursework explanation.

## Project files

- `quiz.py`: runnable quiz and helper functions.
- `quiz.ipynb`: annotated notebook version.
- `PROJECT.md`: academic context and portfolio preparation notes.

## Portfolio preparation

The thumb-piano question now uses `Mbira`, matching the displayed option. The script can be imported without starting an interactive game, and its loop checks for an exhausted category.

Notebook outputs, personal submissions, IDE settings, compiled classes, dependency folders and assignment/presentation files are not included. See [PROJECT.md](PROJECT.md) for the academic context.

## Limitations and troubleshooting

This is a small local quiz, with no saved scores, accounts or database. It is designed around the default ten-round game; substantially longer games should expand the question bank or category-selection logic. Historical names remain as question content.

## Portfolio

[My GitHub profile](https://github.com/Luca-Brandao) · [LinkedIn](https://www.linkedin.com/in/luca-brandao-a90961352/)
