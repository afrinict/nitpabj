import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.pathname.includes('registration') ? 'registration' : 'complaint';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900">
          {type === 'registration' ? 'Registration Successful!' : 'Complaint Submitted!'}
        </h2>

        <p className="text-lg text-gray-600">
          {type === 'registration'
            ? 'Thank you for registering with NITP. We will review your application and get back to you soon.'
            : 'Thank you for your complaint. We will review it and take appropriate action.'}
        </p>

        <p className="text-sm text-gray-500">
          You will be redirected to the homepage in 5 seconds...
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Return to Homepage
        </button>
      </motion.div>
    </div>
  );
}; 