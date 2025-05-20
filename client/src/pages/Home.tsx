import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, FileUp, AlertCircle, Users, Award, BookOpen, GraduationCap, Briefcase, Star, CheckCircle2, Menu, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Lazy load components
const NewsSection = lazy(() => import('@/components/HomePage/NewsSection'));
const EventsSection = lazy(() => import('@/components/HomePage/EventsSection'));
const AnnouncementsSection = lazy(() => import('@/components/HomePage/AnnouncementsSection'));

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: 'achievement' | 'project' | 'policy' | 'news';
}

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  type: 'conference' | 'workshop' | 'seminar' | 'meeting';
  registrationRequired: boolean;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
  category: 'general' | 'urgent' | 'update';
}

interface MembershipCategory {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
}

export default function Home() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('news');
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] = useState(false);
  const [selectedMembershipType, setSelectedMembershipType] = useState<string>('');
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const autoplayInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    // Start autoplay
    const startAutoplay = () => {
      autoplayInterval.current = setInterval(() => {
        if (api) {
          api.scrollNext();
        }
      }, 5000); // Change slide every 5 seconds
    };

    // Stop autoplay when component unmounts or when user interacts
    const stopAutoplay = () => {
      if (autoplayInterval.current) {
        clearInterval(autoplayInterval.current);
      }
    };

    startAutoplay();

    // Pause autoplay when user hovers over the carousel
    const carouselElement = document.querySelector('.carousel-container');
    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', stopAutoplay);
      carouselElement.addEventListener('mouseleave', startAutoplay);
    }

    return () => {
      stopAutoplay();
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', stopAutoplay);
        carouselElement.removeEventListener('mouseleave', startAutoplay);
      }
    };
  }, [api]);

  // Sample data - replace with actual data from your backend
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "NITP Abuja Chapter Hosts Annual Conference",
      summary: "The Abuja Chapter of NITP successfully hosted its annual conference with over 500 participants...",
      date: "2024-03-15",
      image: "/images/news/conference.jpg",
      category: 'achievement'
    },
    {
      id: 2,
      title: "New Urban Planning Guidelines Released",
      summary: "The Federal Ministry of Urban Development has released new guidelines for sustainable urban planning...",
      date: "2024-03-10",
      image: "/images/news/guidelines.jpg",
      category: 'policy'
    },
    // Add more news items
  ];

  const events: Event[] = [
    {
      id: 1,
      title: "Urban Planning Workshop",
      date: new Date("2024-04-15"),
      location: "NITP Abuja Office",
      description: "A comprehensive workshop on modern urban planning techniques...",
      type: 'workshop',
      registrationRequired: true
    },
    {
      id: 2,
      title: "Annual General Meeting",
      date: new Date("2024-05-20"),
      location: "Virtual Meeting",
      description: "Join us for our annual general meeting to discuss the future of urban planning in Nigeria...",
      type: 'meeting',
      registrationRequired: false
    },
    // Add more events
  ];

  const announcements: Announcement[] = [
    {
      id: 1,
      title: "New Urban Development Initiative",
      content: "We are launching a new initiative to promote sustainable urban development across Nigeria...",
      date: "2024-03-10",
      isImportant: true,
      category: 'update'
    },
    {
      id: 2,
      title: "Emergency Meeting on Urban Development",
      content: "All stakeholders are invited to attend an emergency meeting regarding recent urban development issues...",
      date: "2024-03-12",
      isImportant: true,
      category: 'urgent'
    },
    // Add more announcements
  ];

  const membershipCategories: MembershipCategory[] = [
    {
      id: 'student',
      title: 'Student Member',
      description: 'For students pursuing urban planning education',
      benefits: [
        'Access to educational resources',
        'Networking opportunities',
        'Mentorship programs',
        'Discounted event rates'
      ],
      icon: <GraduationCap className="w-8 h-8" />
    },
    {
      id: 'associate',
      title: 'Associate Member',
      description: 'For professionals in related fields',
      benefits: [
        'Professional development opportunities',
        'Industry networking',
        'Access to research materials',
        'Event participation'
      ],
      icon: <Users className="w-8 h-8" />
    },
    {
      id: 'professional',
      title: 'Professional Member',
      description: 'For practicing urban planners',
      benefits: [
        'Full professional recognition',
        'Leadership opportunities',
        'Advanced training programs',
        'Policy influence'
      ],
      icon: <Briefcase className="w-8 h-8" />
    },
    {
      id: 'fellow',
      title: 'Fellow',
      description: 'For distinguished members with significant contributions',
      benefits: [
        'Highest professional recognition',
        'Advisory roles',
        'Research funding opportunities',
        'International collaboration'
      ],
      icon: <Star className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="NITP Logo" className="h-12 w-auto" />
              <div className="ml-3">
                <span className="text-xl font-bold text-[#1E5631]">NITP Abuja</span>
                <p className="text-sm text-gray-600">Nigerian Institute of Town Planners</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-[#1E5631] ${
                  location.pathname === '/' ? 'text-[#1E5631] border-b-2 border-[#1E5631]' : 'text-gray-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-[#1E5631] ${
                  location.pathname === '/about' ? 'text-[#1E5631] border-b-2 border-[#1E5631]' : 'text-gray-600'
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/events" 
                className={`text-sm font-medium transition-colors hover:text-[#1E5631] ${
                  location.pathname === '/events' ? 'text-[#1E5631] border-b-2 border-[#1E5631]' : 'text-gray-600'
                }`}
              >
                Events
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm font-medium transition-colors hover:text-[#1E5631] ${
                  location.pathname === '/contact' ? 'text-[#1E5631] border-b-2 border-[#1E5631]' : 'text-gray-600'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#1E5631] hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#1E5631] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#1E5631] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/events" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#1E5631] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#1E5631] hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[80vh]">
          <Carousel 
            className="w-full h-full carousel-container" 
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="h-[80vh] bg-[url('/images/slider/urban1.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center">
                    <div className="container mx-auto px-4">
                      <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                          Shaping Nigeria's Urban Future
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                          Join us in building sustainable and inclusive cities for tomorrow
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button size="lg" className="bg-[#1E5631] hover:bg-[#154525] text-lg px-8">
                            Learn More
                          </Button>
                          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-8">
                            Contact Us
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-[80vh] bg-[url('/images/slider/urban2.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h1 className="text-4xl font-bold mb-4">Shaping Nigeria's Future</h1>
                      <p className="text-xl">Professional Excellence in Urban Planning</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-[80vh] bg-[url('/images/slider/urban3.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h1 className="text-4xl font-bold mb-4">Building Sustainable Communities</h1>
                      <p className="text-xl">Innovative Solutions for Urban Development</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    current === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
          </Carousel>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the various services and opportunities available through NITP Abuja Chapter
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300 border-none">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#1E5631]/10 rounded-xl">
                      <CalendarIcon className="w-8 h-8 text-[#1E5631]" />
                    </div>
                    <CardTitle className="text-xl">Upcoming Events</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">Stay updated with our latest events, workshops, and professional development opportunities</p>
                  <Button variant="outline" className="w-full border-[#1E5631] text-[#1E5631] hover:bg-[#1E5631] hover:text-white">
                    View Events
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-none">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#1E5631]/10 rounded-xl">
                      <Users className="w-8 h-8 text-[#1E5631]" />
                    </div>
                    <CardTitle className="text-xl">About Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">Learn about our mission, vision, and the impact we're making in urban planning across Nigeria</p>
                  <Button className="w-full bg-[#1E5631] hover:bg-[#154525]">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-none">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#1E5631]/10 rounded-xl">
                      <AlertCircle className="w-8 h-8 text-[#1E5631]" />
                    </div>
                    <CardTitle className="text-xl">Contact Us</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">Get in touch with us for inquiries, partnerships, or to learn more about our initiatives</p>
                  <Button variant="outline" className="w-full border-[#1E5631] text-[#1E5631] hover:bg-[#1E5631] hover:text-white">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* News and Events Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay informed about the latest news, events, and announcements from NITP Abuja Chapter
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
              <TabsList className="mb-8 bg-white p-1 rounded-lg">
                <TabsTrigger value="news" className="data-[state=active]:bg-[#1E5631] data-[state=active]:text-white">
                  Latest News
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-[#1E5631] data-[state=active]:text-white">
                  Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="announcements" className="data-[state=active]:bg-[#1E5631] data-[state=active]:text-white">
                  Announcements
                </TabsTrigger>
              </TabsList>

              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <TabsContent value="news">
                  <NewsSection newsItems={newsItems} />
                </TabsContent>

                <TabsContent value="events">
                  <EventsSection events={events} />
                </TabsContent>

                <TabsContent value="announcements">
                  <AnnouncementsSection announcements={announcements} />
                </TabsContent>
              </Suspense>
            </Tabs>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">NITP Abuja Chapter</h3>
                <p className="text-gray-400 leading-relaxed">
                  Advancing urban planning excellence in Nigeria through professional development, advocacy, and sustainable practices.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="text-gray-400 hover:text-white transition-colors">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                <ul className="space-y-4 text-gray-400">
                  <li className="flex items-center gap-3">
                    <MapPin size={20} className="text-[#1E5631]" />
                    <span>123 Planning Street, Abuja, Nigeria</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={20} className="text-[#1E5631]" />
                    <span>+234 123 456 7890</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={20} className="text-[#1E5631]" />
                    <span>info@nitpabuja.org</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Nigerian Institute of Town Planners, Abuja Chapter. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
} 