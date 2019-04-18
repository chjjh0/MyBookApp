// alert reset
var alertTimeId;


// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn, readState) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
      this.readState = readState;
    }
  }
  
  // UI Class: Handle UI Tasks
  class UI {

    static countBooks(books) {
      return Number(books.length);
    }

    static displayBooks(bookState) {
      const books = Store.getBooks(bookState);
      
      UI.addCountBooks('모든 책은', UI.countBooks(books));
      books.forEach((book) => UI.addBookToList(book));
    }

    static displayReadBooks(bookState) {
      const books = Store.getBooks(bookState);
      var readBooks = [];

      books.forEach((book) => {
        if (book.readState === true) {
          readBooks.push(book);
        }
      });

      UI.addCountBooks('읽은 책은', UI.countBooks(readBooks));
      readBooks.forEach((book) => UI.addBookToList(book));
    }

    static displayUnReadBooks(bookState) {
      const books = Store.getBooks(bookState);
      var unreadBooks = [];

      books.forEach((book) => {
        if (book.readState === false) {
          unreadBooks.push(book);
        }
      });

      UI.addCountBooks('읽지 않은 책은', UI.countBooks(unreadBooks));
      unreadBooks.forEach((book) => UI.addBookToList(book));
    }

    static addCountBooks(readState, countBooks) {
      var $countBooks = countBooks;
      var countBooksArea = document.querySelector('.table thead .countBooks');
      countBooksArea.textContent = `${readState} 총 ${$countBooks} 권입니다`;
    }
  
    static addBookToList(book) {
      const list = document.querySelector('#book-list');
  
      const row = document.createElement('tr');
      var checkbox = '<input class="toggle" type="checkbox">';

      if (book.readState === true) checkbox = '<input class="toggle" type="checkbox" checked="checked">';
      
      row.innerHTML = `
        <td>${checkbox}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="javascript:;" class="btn btn-secondary update">Update</a></td>
        <td><a href="javascript:;" class="btn btn-danger btn-sm delete">Del</a></td>
      `;
  
      list.prepend(row);
    }

    static updateBook(el) {
      var titleBefore = el.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
      var authorBefore = el.parentElement.previousElementSibling.previousElementSibling.textContent;
      var isbnBefore = el.parentElement.previousElementSibling.textContent;
      var submit = document.querySelector('input[type="submit"].btn');
      var bookIndex;
      var books = Store.getBooks('books');
      
      // getBookIndex
      books.forEach((book, index) => {
        if (book.isbn === isbnBefore) {
          bookIndex = index;
          return;
        }
      });

      // Change theme for submit button
      submit.classList.remove('add');
      submit.classList.add('update', 'btn-info');
      submit.value = 'Update book';
      submit.setAttribute('data-update', bookIndex);
      submit.setAttribute('data-currentIsbn', isbnBefore);

      // Insert current book to input box
      document.querySelector('#title').value = titleBefore;
      document.querySelector('#author').value = authorBefore;
      document.querySelector('#isbn').value = isbnBefore;
    }
  
    static deleteBook(el) {
      el.parentElement.parentElement.remove();
    }

    static deleteBookAllList() {
      let trArr = document.querySelector('#book-list').querySelectorAll('tr');

      // Remove booklist from UI
      for (var i = 0; i < trArr.length; i++) {
        trArr[i].remove();
      }
    }
  
    static showAlert(message, className) {
      const alert = document.querySelector('.alert');
      alert.className = `alert alert-${className}`;
      alert.innerHTML = '';
      alert.appendChild(document.createTextNode(message));
  
      // Vanish in 3 seconds
      alertTimeId = setTimeout(function() {
        alert.classList.remove(`alert-${className}`);
        alert.innerHTML = '';
      }, 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }

    static changeClass(target, action, className) {
      if (target.length > 1) {
        // more than one tag
        for (var i = 0; i < target.length; i++) {
          if (action === 'add') {
            target[i].classList.add(className);
          } else if (action === 'remove') {
            target[i].classList.remove(className);
          }
        }
      } else {
        // just one tag
        if (action === 'add') {
          target.classList.add(className);
        } else if (action === 'remove') {
          target.classList.remove(className);
        }
      }
    }
  }
  
  // Store Class: Handles Storage
  class Store {
    static getBooks(bookState) {
      let books;
      if(localStorage.getItem(bookState) === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem(bookState));
      }
  
      return books;
    }
  
    static addBook(book, bookState) {
      const books = Store.getBooks(bookState);
      books.push(book);
      localStorage.setItem(bookState, JSON.stringify(books));
    }

    static updateBookStore(books) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks('books');
  
      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }


  }

  // validate: ISBN
  function validateIsbn(books, isbn, isbnBefore) {
    if (isbnBefore && isbnBefore === isbn) {
      return 0;
    } else {
      for (var i = 0; i < books.length; i++) {
        if (books[i].isbn === isbn) {
          return 1;
        } 
      }
    }
  }
  
  // Event: Display allbooks when reload
  window.onbeforeunload = () => {
    UI.deleteBookAllList();
    UI.displayBooks('books');
  }
  // Event: Display allBooks
  document.addEventListener('DOMContentLoaded', UI.displayBooks('books'));
  
  // Event: Display allBooks
  document.querySelector('button.all-books').addEventListener('click', () => {
    // Remove books from UI
    UI.deleteBookAllList();

    UI.displayBooks('books');
  });

  // Event: Display readBooks
  document.querySelector('button.read-books').addEventListener('click', () => {

    // Remove books from UI
    UI.deleteBookAllList();

    // Event: Display readBooks
    UI.displayReadBooks('books');
  });

  // Event: Display unReadBooks
  document.querySelector('button.unread-books').addEventListener('click', () => {
    UI.deleteBookAllList();

    UI.displayUnReadBooks('books');
  });

  // Event: Submit
  document.querySelector('#book-form').addEventListener('submit', (e) => {

    // Prevent default action
    e.preventDefault();
    
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const readState = false;
  
    // Validate: Blank
    if(title === '' || author === '' || isbn === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // clear setTimeout
      clearTimeout(alertTimeId);

      const books = Store.getBooks('books');

      // Event: Update a book
      if (document.querySelector('input.update')) {

        var bookIndex = document.querySelector('input.update').getAttribute('data-update');
        var isbnBefore = document.querySelector('input.update').getAttribute('data-currentisbn');


        if (validateIsbn(books, isbn, isbnBefore)) {
          // Validate: ISBN
          alert('ISBN already exists');
        } else {
          // Remove current books from UI
          UI.deleteBookAllList();

          // Update book's value
          books[bookIndex].title = title;
          books[bookIndex].author = author;
          books[bookIndex].isbn = isbn;
          books[bookIndex].readState = books[bookIndex].readState;
  
          // Update localStorage
          localStorage.removeItem('books');
          Store.updateBookStore(books);

          // input.btn init
          UI.changeClass(document.querySelector('input.update'), 'add', 'add');
          UI.changeClass(document.querySelector('input.update'), 'remove', 'update')

          // Reload UI
          location.reload();
        }
      // Event: Add a Book
      } else if (document.querySelector('input.add')) {
          // Validate: ISBN
          if (validateIsbn(books, isbn)) {
            alert('ISBN already exists');
          } else {
            // Instatiate book
            const book = new Book(title, author, isbn, readState);
        
            // Add Book to UI
            UI.addBookToList(book);
        
            // Add book to store
            Store.addBook(book, 'books');
        
            // Show success message
            UI.showAlert('Book Added', 'success');
        
            // Clear fields
            UI.clearFields();
        }
      }
    }
  });
  
  document.querySelector('#book-list').addEventListener('click', (e) => {
    // Clear setTimeout
    clearTimeout(alertTimeId);

    // CheckBox: Read or Unread
    if (e.target.classList.contains('toggle')) {
      var tdArr = e.target.parentElement.parentElement.querySelectorAll('td');
      var books = Store.getBooks('books');
      var readIsbn = tdArr[3].textContent;

      if (e.target.checked === true) {
        // Setting readBooks
        books.forEach((book) => {
          if (book.isbn === readIsbn) {
            book.readState = true;
            return;
          }
        });
      } else {
        // Setting unreadBooks
        books.forEach((book) => {
          if (book.isbn === readIsbn) {
            book.readState = false;
            return;
          }
        });
      }

      // Udate books.readState
      localStorage.removeItem('books');
      localStorage.setItem('books', JSON.stringify(books));
    }

    // Event: Update a Book
    if (e.target.classList.contains('update')) {

      // Setting input value for Update
      UI.updateBook(e.target);
    }

    // Event: Remove a Book
    if (e.target.classList.contains('delete')) {
      // Clear fields
      UI.clearFields();

      // Remove book from UI
      UI.deleteBook(e.target);
    
      // Remove book from store
      Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    
      // Show success message
      UI.showAlert('Book Removed', 'success');
    }
  });  
