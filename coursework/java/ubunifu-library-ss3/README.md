# Ubunifu Library: Management

An extended Java console library application using collections, inheritance and separate classes for books, members and librarians.

**Author:** Luca Brandao  
**Coursework:** OOP152 SS3 · Bachelor of Business Information Systems, STADIO Higher Education  
**Stack:** Java

## Features

- Add and list books and members.
- Search for books by title and members by ID.
- Borrow and return books while updating availability.
- Use a Librarian subclass for management-related operations.
- Run seeded demonstration cases before the interactive menu.

## Requirements and setup

Install a JDK 17 or newer and make `java` and `javac` available on your PATH. From this folder:

```sh
mkdir out
javac -encoding UTF-8 -d out src/*.java
java -cp out Main
```

On PowerShell, if wildcard expansion is unavailable, compile with:

```powershell
javac -encoding UTF-8 -d out (Get-ChildItem src/*.java).FullName
```

Compiled classes go into `out`, which is ignored by Git. No external Java libraries or IDE are required.

## Using the project

After the demonstration cases, enter a number from 1 to 9. The menu offers adding/listing books, adding/listing members, borrowing, returning, searching for a book, searching for a member and exiting. For example, list books with `2`, list members with `4`, and exit with `9`.

## How it works

`Book` holds bibliographic details and availability. `LibraryUser` maintains a collection of borrowed books and implements borrowing/returns. `Librarian` extends `LibraryUser`, while `LibraryManagementSystem` holds searchable `ArrayList` collections. `Main` provides the console flow.

## Project files

- `src/Book.java`: book model.
- `src/LibraryUser.java`: member and borrowing model.
- `src/LibraryManagementSystem.java`: catalogue operations.
- `src/Main.java`: interactive entry point and seeded checks.
- `src/Librarian.java`: librarian subclass.

## Portfolio preparation

Seeded member names and associated comments use fictional demo labels. The main menu handles a non-numeric selection without crashing and exits cleanly when standard input closes. Bibliographic titles and published authors are retained as reference data.

Notebook outputs, personal submissions, IDE settings, compiled classes, dependency folders and assignment/presentation files are not included. See [PROJECT.md](PROJECT.md) for the academic context.

## Limitations and troubleshooting

All data is held in memory and resets at exit. Search is based on the implemented title/ID matching, and the application has no authentication or persistent database.

## Portfolio

[My GitHub profile](https://github.com/Luca-Brandao) · [LinkedIn](https://www.linkedin.com/in/luca-brandao-a90961352/)
