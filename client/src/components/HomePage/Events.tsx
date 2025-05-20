import { useState } from 'react';
import { motion } from 'framer-motion';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  registrationLink: string;
  image: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Urban Planning Conference 2024',
    date: '2024-04-15',
    location: 'International Conference Centre, Abuja',
    description: 'Join us for the annual urban planning conference featuring keynote speakers and workshops.',
    category: 'Conference',
    registrationLink: '/register/conference-2024',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Sustainable Development Workshop',
    date: '2024-04-20',
    location: 'Abuja Business Hub',
    description: 'Learn about sustainable urban development practices and implementation strategies.',
    category: 'Workshop',
    registrationLink: '/register/workshop-2024',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Community Planning Forum',
    date: '2024-04-25',
    location: 'Abuja City Hall',
    description: 'A forum for discussing community-based urban planning initiatives.',
    category: 'Forum',
    registrationLink: '/register/forum-2024',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  }
];

export const Events = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(mockEvents.map(event => event.category)))];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.category === selectedCategory);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50">
      <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white hover:bg-gray-100'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-blue-600 font-semibold">
                  {event.category}
                </span>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {event.location}
              </div>
              <a
                href={event.registrationLink}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}; 