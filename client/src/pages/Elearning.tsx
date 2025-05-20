import { useState } from 'react';
import { Search, BookOpen, Clock, Users, Star, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  category: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Urban Planning Fundamentals',
    description: 'Learn the basic principles and practices of urban planning in Nigeria.',
    instructor: 'Dr. Adebayo Johnson',
    duration: '8 weeks',
    students: 245,
    rating: 4.8,
    category: 'Urban Planning',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
    level: 'Beginner'
  },
  {
    id: '2',
    title: 'Sustainable Development Practices',
    description: 'Explore sustainable development strategies for Nigerian cities.',
    instructor: 'Prof. Sarah Okonkwo',
    duration: '10 weeks',
    students: 189,
    rating: 4.9,
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1530870110042-98b2cb110834?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
    level: 'Intermediate'
  },
  {
    id: '3',
    title: 'Advanced GIS for Urban Planners',
    description: 'Master GIS tools and techniques for urban planning projects.',
    instructor: 'Engr. Michael Okafor',
    duration: '12 weeks',
    students: 156,
    rating: 4.7,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1551286923-c82d6a8ae079?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
    level: 'Advanced'
  }
];

export default function Elearning() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E5631] mb-2">E-Learning Center</h1>
        <p className="text-gray-600">Expand your knowledge with our professional development courses</p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      {/* Course Categories */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="urban-planning">Urban Planning</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-[#1E5631] text-white">
                    {course.level}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#1E5631] hover:bg-[#154525]">
                    Enroll Now
                    <ChevronRight size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Featured Categories */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#1E5631] mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#D8E9A8] border-none">
            <CardHeader>
              <BookOpen className="text-[#1E5631] mb-2" size={32} />
              <CardTitle>Urban Planning</CardTitle>
              <CardDescription>Master the fundamentals of urban development</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-blue-50 border-none">
            <CardHeader>
              <BookOpen className="text-blue-800 mb-2" size={32} />
              <CardTitle>Sustainability</CardTitle>
              <CardDescription>Learn sustainable development practices</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-purple-50 border-none">
            <CardHeader>
              <BookOpen className="text-purple-800 mb-2" size={32} />
              <CardTitle>Technology</CardTitle>
              <CardDescription>Explore modern planning technologies</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
} 