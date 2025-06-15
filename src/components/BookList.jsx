import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import UserList from './UserList'; // <-- Import the new UserList component

const BookList = () => {
  // -------------------- State --------------------
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('books'); // <-- Add tab state

  // -------------------- Fetch Books on Mount --------------------
  useEffect(() => {
    fetchBooks();
  }, []);

  // -------------------- Fetch All Books --------------------
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // -------------------- Handle Search --------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (search.trim()) {
        const response = await axios.get(
          `http://localhost:8080/api/books/search?title=${search}`
        );
        setBooks(response.data);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  // -------------------- Delete Book (with Modal) --------------------
  const confirmDelete = (id) => {
    setBookToDelete(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${bookToDelete}`);
      setShowModal(false);
      setBookToDelete(null);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setShowModal(false);
      setBookToDelete(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setBookToDelete(null);
  };

  // -------------------- Render UI --------------------
  return (
    <div className="max-w-4xl mx-auto mt-14 bg-white/90 shadow-2xl rounded-2xl p-8 border border-gray-200 backdrop-blur-md">
      {/* Tab Heading */}
      <div className="flex justify-center mb-8 gap-4">
        <button
          className={`px-6 py-2 rounded-t-lg font-bold transition-all ${
            activeTab === 'books'
              ? 'bg-indigo-500 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('books')}
        >
          Book List
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-500 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('users')}
        >
          User List
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'books' ? (
        <>
          {/* Book List Heading */}
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center tracking-tight flex items-center justify-center gap-2">
            <span role="img" aria-label="books">📚</span>
            Book List
          </h2>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
                placeholder="Search by title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-indigo-600 hover:to-blue-700 transition-all"
              >
                Search
              </button>
            </div>
          </form>
          {/* Add Book Button */}
          <Link
            to="/add"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold mb-6 shadow hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            + Add Book
          </Link>
          {/* Book Table */}
          <div className="overflow-x-auto rounded-xl shadow mt-2">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b p-3 text-left font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="border-b p-3 text-left font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="border-b p-3 text-left font-semibold text-gray-700">
                    ISBN
                  </th>
                  <th className="border-b p-3 text-left font-semibold text-gray-700">
                    Year
                  </th>
                  <th className="border-b p-3 text-left font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Show message if no books */}
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-400">
                      No books found
                    </td>
                  </tr>
                ) : (
                  // Render each book row
                  books.map((book) => (
                    <tr key={book.bookId} className="hover:bg-indigo-50 transition">
                      <td className="p-3 border-b">{book.title}</td>
                      <td className="p-3 border-b">{book.author}</td>
                      <td className="p-3 border-b">{book.isbn}</td>
                      <td className="p-3 border-b">{book.publicationYear || '-'}</td>
                      <td className="p-3 border-b flex gap-2">
                        {/* Edit Button */}
                        <Link
                          to={`/edit/${book.bookId}`}
                          className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-1 rounded-lg font-medium shadow hover:from-indigo-600 hover:to-blue-700 transition-all"
                        >
                          Edit
                        </Link>
                        {/* Delete Button */}
                        <button
                          onClick={() => confirmDelete(book.bookId)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 rounded-lg font-medium shadow hover:from-red-600 hover:to-pink-600 transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Delete Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">Confirm Delete</h3>
                <p className="mb-6 text-gray-600 text-center">Are you sure you want to delete this book?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDelete}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold border border-gray-300 shadow hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <UserList />
      )}
    </div>
  );
};

export default BookList;

