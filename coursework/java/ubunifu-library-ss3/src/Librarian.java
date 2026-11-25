public class Librarian extends LibraryUser {
	
    // LibraryManagementSystem instance for managing library books and users
    private LibraryManagementSystem librarySystem;

    // Constructor for Librarian, initializing with name, userID, and library system reference
    // Calls to it's parent class LibraryUser constructor
    public Librarian(String name, String userID, LibraryManagementSystem librarySystem) {
        super(name, userID);  
        this.librarySystem = librarySystem;
    }

    // Method for managing books
    // Adds/removes a book from the library system
    // Adds the book to the library system
    // Checks if the book exists in the library before attempting to remove it
    public void manageBooks(Book book, boolean add) {
        if (add) {
            librarySystem.addBook(book);
            System.out.println("Librarian added the book: " + book.getTitle());
        } else {
            if (librarySystem.getBooks().contains(book)) {
                librarySystem.removeBook(book);
                System.out.println("Librarian removed the book: " + book.getTitle());
            } else {
                System.out.println("Error: Book not found in the library, cannot remove.");
            }
        }
    }

    // Method for managing users
    // Adds/removes a user from the library system
    // Adds the user to the library system
    // Checks if the user exists in the library before attempting to remove them
    public void manageUsers(LibraryUser user, boolean add) {
        if (add) {
            librarySystem.addUser(user);
            System.out.println("Librarian added the user: " + user.getName());
        } else {
            if (librarySystem.getUsers().contains(user)) {
                librarySystem.getUsers().remove(user);
                System.out.println("Librarian removed the user: " + user.getName());
            } else {
                System.out.println("Error: User not found in the library, cannot remove.");
            }
        }
    }
}

