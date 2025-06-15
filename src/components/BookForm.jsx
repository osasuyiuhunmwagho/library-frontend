import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookForm = () => {
  // -------------------- Hooks and State --------------------
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: ''
  });

  // -------------------- Fetch Book Data if Editing --------------------
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/books/${id}`)
        .then((response) => {
          setBook(response.data);
        })
        .catch((error) => {
          console.error('Error fetching book:', error);
        });
    }
  }, [id]);

  // -------------------- Handle Input Change --------------------
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // -------------------- Handle Form Submit --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/books/${id}`, book);
      } else {
        await axios.post('http://localhost:8080/api/books', book);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  // -------------------- Render UI --------------------
  return (
    <div className="max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border border-gray-200 backdrop-blur-md">
      {/* Form Heading */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center tracking-tight flex items-center justify-center gap-2">
        <span role="img" aria-label="book">📚</span>
        {id ? 'Edit Book' : 'Add Book'}
      </h2>
      {/* Book Form */}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
            required
            placeholder="e.g. The Great Gatsby"
          />
        </div>
        {/* Author Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
            required
            placeholder="e.g. F. Scott Fitzgerald"
          />
        </div>
        {/* ISBN Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">ISBN</label>
          <input
            type="text"
            name="isbn"
            value={book.isbn}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
            required
            placeholder="e.g. 978-3-16-148410-0"
          />
        </div>
        {/* Publication Year Field */}
        <div>
          <label className="block text-base font-semibold mb-2 text-gray-700">Publication Year</label>
          <input
            type="number"
            name="publicationYear"
            value={book.publicationYear}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white placeholder:text-gray-400 transition"
            placeholder="e.g. 1925"
          />
        </div>
        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
          >
            <span role="img" aria-label="save">💾</span>
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold border border-indigo-200 shadow hover:bg-indigo-50 transition-all duration-200 flex items-center gap-2"
          >
            <span role="img" aria-label="cancel">❌</span>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
