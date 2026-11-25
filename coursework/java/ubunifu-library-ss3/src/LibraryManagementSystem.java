import java.util.ArrayList;

public class LibraryManagementSystem {
	
    // List to store all registered and documented users and books in the library
    private ArrayList<LibraryUser> users = new ArrayList<>();
    private ArrayList<Book> books = new ArrayList<>();

    // Method to add/register a new user in the library system
    // Adds the user to the list of users
    public void addUser(LibraryUser user) {
        users.add(user);  
        System.out.println(user.getName() + " has been successfully added as a user.");
    }

    // Method to add/document a new book in the library system
    // Adds the book to the list of books
    public void addBook(Book book) {
        books.add(book);  
        System.out.println("Book has been added successfully: " + book.getTitle());
    }

    // Method to remove a book from the library system
    // Removes the book from the list of books
    public void removeBook(Book book) {
        books.remove(book);  
        System.out.println("Book has been removed: " + book.getTitle());
    }

    // Method to search for a user by their unique userID
    // Iterates through the users list to find the user with the specified userID
    // Returns the user if found in the list of users
    // Displays error if user is not found/does not exist
    public LibraryUser searchUser(String userID) {
        for (LibraryUser user : users) {
            if (user.getUserID().equals(userID)) {
                return user;  
            }
        }
        System.out.println("Error: User not found / Does not exist.");  
        return null;
    }

    // Method to search for a book by its title
    // Iterates through the books list to find the book with the specified title
    // Returns the book if found in the list of books
    // Displays error if book is not found/does not exist
    public Book searchBook(String title) {
        for (Book book : books) {
            if (book.getTitle().equalsIgnoreCase(title)) {
                return book;  
            }
        }
        System.out.println("Error: Book not found / Does not exist.");  
        return null;
    }

    // Getter method to retrieve the list of all users
    public ArrayList<LibraryUser> getUsers() {
        return users;
    }

    // Getter method to retrieve the list of all books
    public ArrayList<Book> getBooks() {
        return books;
    }
}


