import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: string;
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: 'New Urban Development Project Announced',
    summary: 'The government has announced a major urban development project focusing on sustainable housing in Abuja.',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80',
    category: 'Development'
  },
  {
    id: 2,
    title: 'NITP Annual Conference 2024',
    summary: 'Join us for the biggest gathering of urban planners in Nigeria at the International Conference Centre, Abuja.',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80',
    category: 'Events'
  },
  {
    id: 3,
    title: 'Sustainable City Planning Workshop',
    summary: 'Learn about the latest trends in sustainable urban development at the Abuja Business Hub.',
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80',
    category: 'Workshops'
  }
];

export const NewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(mockNews.map(item => item.category)))];

  const filteredNews = selectedCategory === 'all'
    ? news
    : news.filter(item => item.category === selectedCategory);

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Latest News</h2>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <span className="text-sm text-blue-600 font-semibold">
                {item.category}
              </span>
              <h3 className="text-xl font-bold mt-2 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{item.date}</span>
                <button className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read More →
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}; 