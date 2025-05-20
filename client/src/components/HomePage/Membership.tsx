import { motion } from 'framer-motion';

interface MembershipType {
  id: number;
  title: string;
  description: string;
  benefits: string[];
  price: string;
  link: string;
  image: string;
}

const membershipTypes: MembershipType[] = [
  {
    id: 1,
    title: 'Student Member',
    description: 'For students pursuing studies in urban planning and related fields.',
    benefits: [
      'Access to educational resources',
      'Discounted conference rates',
      'Networking opportunities',
      'Mentorship programs'
    ],
    price: '₦5,000/year',
    link: '/register/student',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Associate Member',
    description: 'For professionals in related fields with interest in urban planning.',
    benefits: [
      'Professional development resources',
      'Industry networking events',
      'Access to research publications',
      'Workshop participation'
    ],
    price: '₦25,000/year',
    link: '/register/associate',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Professional Member',
    description: 'For qualified urban planning professionals.',
    benefits: [
      'Full professional recognition',
      'Leadership opportunities',
      'Advanced training programs',
      'International networking'
    ],
    price: '₦50,000/year',
    link: '/register/professional',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Fellow',
    description: 'For distinguished professionals with significant contributions.',
    benefits: [
      'Highest level of recognition',
      'Exclusive events access',
      'Research funding opportunities',
      'International representation'
    ],
    price: '₦100,000/year',
    link: '/register/fellow',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop&q=80'
  }
];

export const Membership = () => {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Membership Categories</h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Join our community of urban planning professionals and contribute to the development of sustainable cities in Nigeria.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {membershipTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={type.image}
              alt={type.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{type.title}</h3>
              <p className="text-gray-600 mb-4">{type.description}</p>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-1"
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
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600 mb-4">{type.price}</p>
                <a
                  href={type.link}
                  className="block w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join Now
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}; 