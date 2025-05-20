import { useState } from 'react';
import { motion } from 'framer-motion';
import { NewsFeed } from './NewsFeed';
import { Events } from './Events';
import { Membership } from './Membership';

const tabs = [
  { id: 'news', label: 'Latest News' },
  { id: 'events', label: 'Upcoming Events' },
  { id: 'membership', label: 'Membership' }
];

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div className="w-full">
      <div className="flex space-x-4 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-lg font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'news' && <NewsFeed />}
        {activeTab === 'events' && <Events />}
        {activeTab === 'membership' && <Membership />}
      </motion.div>
    </div>
  );
}; 