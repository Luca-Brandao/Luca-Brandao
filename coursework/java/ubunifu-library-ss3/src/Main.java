import java.util.Scanner;

// Main class containing main method
public class Main {
    // LibraryManagementSystem instance to manage books and users
    private static LibraryManagementSystem system = new LibraryManagementSystem();
    // Scanner instance for reading user input
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {

        System.out.println("<== Testing Procedures ==>");
        
        // Initial setup to add books and users for testing
        System.out.println();
        System.out.println("-- Test case: adding 10 books to the system --");

        // Array of book objects to populate the array for the library
        Book[] booksInLibrary = {
            new Book("So Long a Letter", "Mariama Bâ", "978-2-7071-1023-9", true),
            new Book("Season of Migration to the North", "Tayeb Salih", "978-1-8476-7144-4", true),
            new Book("Things Fall Apart", "Chinua Achebe", "978-0-3163-0739-4", true),
            new Book("Nervous Conditions", "Tsitsi Dangarembga", "978-0-9547-0565-2", true),
            new Book("Graceland", "Chris Abani", "978-0-3745-3060-1", true),
            new Book("Stay with Me", "Ayọ̀bámi Adébáyọ̀", "978-1-1019-9015-0", true),
            new Book("The Shadow of Imana", "Veronique Tadjo", "978-0-8573-5463-4", true),
            new Book("An Orchestra of Minorities", "Chigozie Obioma", "978-0-3165-5843-8", true),
            new Book("The Old Drift", "Namwali Serpell", "978-1-1019-4783-1", true),
            new Book("Homegoing", "Yaa Gyasi", "978-1-1019-4892-0", true)
        };

        // Adding each book to the library management system
        for (Book book : booksInLibrary) {
            system.addBook(book);
        }

        System.out.println();
        System.out.println("-- Test case: adding 10 users to the system --");

        // Array of library user objects to populate the user list for the library
        LibraryUser[] libraryUsers = {
            new LibraryUser("Luca Brandao", "UID001"),
            new LibraryUser("Demo User Two", "UID002"),
            new LibraryUser("Demo User Three", "UID003"),
            new LibraryUser("Demo User Four", "UID004"),
            new LibraryUser("Demo User Five", "UID005"),
            new LibraryUser("Demo User Six", "UID006"),
            new LibraryUser("Demo User Seven", "UID007"),
            new LibraryUser("Demo User Eight", "UID008"),
            new LibraryUser("Demo User Nine", "UID009"),
            new LibraryUser("Demo User Ten", "UID010")
        };

        // Adding each user to the library management system
        for (LibraryUser user : libraryUsers) {
            system.addUser(user);
        }

        System.out.println();
        System.out.println("-- Test case: borrowing and returning a book --");

        // Test case of a user borrowing and returning book action
        LibraryUser user = system.searchUser("UID001");
        user.borrowBook(booksInLibrary[0]);
        user.returnBook(booksInLibrary[0]);

        // Calling method to displaying all books and users in the library
        displayAllBooks();   
        displayAllUsers();

        System.out.println("\n<== Testing Procedures Complete ==>\n");

        // LMS controls menu for user interaction with a list of various options 
        boolean exit = false;
        while (!exit) {
            System.out.println("\n--- Ubunifu Library Management System ---");
            System.out.println("-- LMS Controls --");
            System.out.println("1. Add a new book");
            System.out.println("2. Display all books");
            System.out.println("3. Add a new user");
            System.out.println("4. Display all users");
            System.out.println("5. Borrow a book");
            System.out.println("6. Return a book");
            System.out.println("7. Search for a book");
            System.out.println("8. Search for a user");
            System.out.println("9. Exit");
            System.out.print("Select an option (1-9): ");
            int choice = scanner.nextInt();
            scanner.nextLine();  // Consumes newline character

            // Menu selection with switch cases to assign a method to the appropriate option
            switch (choice) {
                case 1 -> addBook();
                case 2 -> displayAllBooks();
                case 3 -> addUser();
                case 4 -> displayAllUsers();
                case 5 -> borrowBook();
                case 6 -> returnBook();
                case 7 -> searchForBook();
                case 8 -> searchForUser();
                case 9 -> {
                    exit = true;
                    System.out.println("--- Closing the Ubunifu Library Management System ---");
                }
                default -> System.out.println("Error: Invalid option, Select an option between 1-9.");
            }
        }
    }

    // Method to add a new book to the system Including the ability to enter all the details of the book
    private static void addBook() {
        System.out.print("Enter book title: ");
        String title = scanner.nextLine();
        System.out.print("Enter book author: ");
        String author = scanner.nextLine();
        System.out.print("Enter ISBN: ");
        String isbn = scanner.nextLine();
        Book book = new Book(title, author, isbn, true);
        system.addBook(book);
        System.out.println("Book has been added successfully!");
    }

    // Method to display all books as well as their details to the system
    private static void displayAllBooks() {
        System.out.println("\n--- List of all books ---");
        for (Book book : system.getBooks()) {
            System.out.println("Title: " + book.getTitle() + ", Author: " + book.getAuthor() + 
                               ", ISBN: " + book.getISBN() + ", Available: " + (book.isAvailable() ? "Yes" : "No"));
        }
    }

    // Method to add a new user and their details to the system
    private static void addUser() {
        System.out.print("Enter the new user name: ");
        String name = scanner.nextLine();
        System.out.print("Enter new user ID: ");
        String userID = scanner.nextLine();
        LibraryUser user = new LibraryUser(name, userID);
        system.addUser(user);
        System.out.println("User has been added successfully!");
    }

    // Method to display a list of all the users in the system as well as their details and a list of books they are currently borrowing
    private static void displayAllUsers() {
        System.out.println("\n--- List of all current users ---");
        for (LibraryUser user : system.getUsers()) {
            System.out.println("Name: " + user.getName() + ", User ID: " + user.getUserID());
        }
    }

    // Method to handle the processes of borrowing library resources with exception handling 
    private static void borrowBook() {
        System.out.print("Enter the user ID: ");
        String userID = scanner.nextLine();
        LibraryUser user = system.searchUser(userID);
        if (user == null) {
            System.out.println("Error: User not found / Does not exist.");
            return;
        }

        System.out.print("Enter book title to be borrowed: ");
        String title = scanner.nextLine();
        Book book = system.searchBook(title);
        if (book == null) {
            System.out.println("Error: Book not found / Does not exist.");
        } else {
            user.borrowBook(book);
        }
    }

    // Method to handle book return process with null/error exception handling 
    private static void returnBook() {
        System.out.print("Enter the user's ID: ");
        String userID = scanner.nextLine();
        LibraryUser user = system.searchUser(userID);
        if (user == null) {
            System.out.println("Error: User not found / Does not exist.");
            return;
        }

        System.out.print("Enter the book's title to be returned: ");
        String title = scanner.nextLine();
        Book book = system.searchBook(title);
        if (book == null) {
            System.out.println("Error: Book not found / Does not exist.");
        } else {
            user.returnBook(book);
        }
    }

    // Method to search for a book by title with null/error exception handling 
    private static void searchForBook() {
        System.out.print("Enter book title to be searched for: ");
        String title = scanner.nextLine();
        Book book = system.searchBook(title);
        if (book == null) {
            System.out.println("Error: Book not found / Does not exist.");
        } else {
            System.out.println("Found Book - Title: " + book.getTitle() + ", Author: " + book.getAuthor() +
                               ", ISBN: " + book.getISBN() + ", Available: " + (book.isAvailable() ? "Yes" : "No"));
        }
    }

    // Method to search for a user by ID with null/error exception handling 
    private static void searchForUser() {
        System.out.print("Enter user ID to be searched for: ");
        String userID = scanner.nextLine();
        LibraryUser user = system.searchUser(userID);
        if (user == null) {
            System.out.println("Error: User not found / Does not exist.");
        } else {
            System.out.println("Found User - Name: " + user.getName() + ", User ID: " + user.getUserID());
            System.out.println("Borrowed Books:");
            for (Book borrowedBook : user.getBorrowedBooks()) {
                System.out.println(" - " + borrowedBook.getTitle() + " by " + borrowedBook.getAuthor());
            }
        }
    }
}


