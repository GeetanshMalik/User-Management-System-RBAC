import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Search, User, HelpCircle, X } from 'lucide-react';
import api from '../../utils/api';

const SmartSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], faqs: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const faqs = [
    { id: 1, question: 'How do I reset my password?', path: '/help' },
    { id: 2, question: 'How can I update my profile information?', path: '/profile' },
    { id: 3, question: 'What are the different user roles?', path: '/roles' },
    { id: 4, question: 'How do I create a new user account?', path: '/users' },
    { id: 5, question: 'Can I export activity logs?', path: '/activity' },
    { id: 6, question: 'How do I disable or delete my account?', path: '/settings' },
    { id: 7, question: 'What notifications will I receive?', path: '/notifications' },
    { id: 8, question: 'How do I change the theme?', path: '/settings' },
  ];

  const performSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    try {
      // Search users
      const userResponse = await api.get(`/users?search=${encodeURIComponent(searchQuery)}&limit=5`);
      const users = userResponse.data.data.users || [];

      // Search FAQs
      const matchedFaqs = faqs.filter(
        faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

      setResults({ users, faqs: matchedFaqs });
      setIsOpen(users.length > 0 || matchedFaqs.length > 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ users: [], faqs: [] });
    } finally {
      setLoading(false);
    }
  }, [faqs]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim());
      } else {
        setResults({ users: [], faqs: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, performSearch]);

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleFaqClick = (path) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults({ users: [], faqs: [] });
    setIsOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search users or FAQs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Popup */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Searching...
              </div>
            ) : (
              <>
                {/* Users Section */}
                {results.users.length > 0 && (
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Users
                    </div>
                    {results.users.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* FAQs Section */}
                {results.faqs.length > 0 && (
                  <div className={`p-2 ${results.users.length > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Help & FAQs
                    </div>
                    {results.faqs.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => handleFaqClick(faq.path)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-4 h-4 text-indigo-600" />
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{faq.question}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {results.users.length === 0 && results.faqs.length === 0 && !loading && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
