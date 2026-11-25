import java.util.ArrayList;

public class LibraryUser {
    // Fields to store the user's name, userID, and borrowedBooks
	// List of books currently being borrowed
    private String name;
    private String userID;
    protected ArrayList<Book> borrowedBooks;  

    // Constructor to initialize the LibraryUser with a name and userID
    // Initializes an empty list for borrowed books to be stored in 
    public LibraryUser(String name, String userID) {
        this.name = name;
        this.userID = userID;
        this.borrowedBooks = new ArrayList<>();  
    }

    // Getter for the user's name
    public String getName() {
        return name;
    }

    // Getter for the user's userID
    public String getUserID() {
        return userID;
    }

    // Getter for the list of books that the user is currently borrowing
    public ArrayList<Book> getBorrowedBooks() {
        return borrowedBooks;
    }

    // Method for borrowing a book
    // Checks if the user has already borrowed the maximum number of allowed books
    // Stops if the max limit has been reached
    // Checks if the book is available to be borrowed by a user
    // Adds the book to the list of borrowed books
    // Sets the book as unavailable (false)
    public void borrowBook(Book book) {
        if (borrowedBooks.size() >= 10) {
            System.out.println("Error: Maximum amount of books has been borrowed. Cannot borrow more than 10 books.");
            return;  
        }
        if (book.isAvailable()) {
            borrowedBooks.add(book);         
            book.setAvailable(false);        
            System.out.println("Book: -" + book.getTitle() + "- has been successfully borrowed by " + this.getName());
        } else {
            System.out.println("Error: Book " + book.getTitle() + " is not currently available for borrowing.");
        }
    }

    // Method for returning a borrowed book
    // Checks if the book is in the user's list of currently borrowed books
    // Removes the book from the borrowed list
    // Sets the book as available once again
    public void returnBook(Book book) {
        if (borrowedBooks.contains(book)) {
            borrowedBooks.remove(book);      
            book.setAvailable(true);         
            System.out.println("Book: " + book.getTitle() + " has been returned successfully!");
        } else {
            System.out.println("Error: This book cannot be found in the user's borrowed book list.");
        }
    }
}


