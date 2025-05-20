import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, BookOpen, Video, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CourseModule {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: string;
  completed: boolean;
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  modules: CourseModule[];
  enrolled: boolean;
  progress: number;
  startDate: string;
  endDate: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  image: string;
}

// Mock data - replace with API call
const courseData: CourseDetails = {
  id: '1',
  title: 'Urban Planning Fundamentals',
  description: 'Learn the basic principles and practices of urban planning in Nigeria. This comprehensive course covers everything from basic concepts to advanced techniques used in modern urban development.',
  instructor: {
    name: 'Dr. Adebayo Johnson',
    avatar: '',
    bio: 'Dr. Johnson has over 15 years of experience in urban planning and has worked on numerous major projects across Nigeria.'
  },
  modules: [
    {
      id: '1',
      title: 'Introduction to Urban Planning',
      type: 'video',
      duration: '45 mins',
      completed: true
    },
    {
      id: '2',
      title: 'Urban Development Principles',
      type: 'text',
      duration: '30 mins',
      completed: true
    },
    {
      id: '3',
      title: 'Planning Regulations Quiz',
      type: 'quiz',
      duration: '20 mins',
      completed: false
    },
    {
      id: '4',
      title: 'Case Study Assignment',
      type: 'assignment',
      duration: '2 hours',
      completed: false
    }
  ],
  enrolled: false,
  progress: 50,
  startDate: '2024-03-01',
  endDate: '2024-04-30',
  level: 'Beginner',
  category: 'Urban Planning',
  image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500'
};

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails>(courseData);

  const handleEnroll = () => {
    setCourse(prev => ({ ...prev, enrolled: true }));
    toast.success('Successfully enrolled in the course!');
  };

  const handleUnenroll = () => {
    setCourse(prev => ({ ...prev, enrolled: false }));
    toast.success('Successfully unenrolled from the course.');
  };

  const getModuleIcon = (type: CourseModule['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      case 'quiz':
        return <MessageSquare className="w-5 h-5" />;
      case 'assignment':
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="relative h-64 rounded-lg overflow-hidden mb-8">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <Badge className="mb-2 bg-[#1E5631] text-white">
              {course.level}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-200">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About This Course</h3>
                      <p className="text-gray-600">{course.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">What You'll Learn</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Understanding urban planning principles</li>
                        <li>Analyzing urban development patterns</li>
                        <li>Implementing sustainable planning practices</li>
                        <li>Working with planning regulations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                  <CardDescription>Track your progress through the course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          {getModuleIcon(module.type)}
                          <div>
                            <h4 className="font-medium">{module.title}</h4>
                            <p className="text-sm text-gray-500">{module.duration}</p>
                          </div>
                        </div>
                        {module.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussion" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Forum</CardTitle>
                  <CardDescription>Join the conversation with other students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Discussion forum coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={course.progress} className="h-2" />
                <p className="text-sm text-gray-500">{course.progress}% Complete</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback>
                      {course.instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructor.name}</p>
                    <p className="text-sm text-gray-500">Instructor</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {course.enrolled ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleUnenroll}
                >
                  Unenroll
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#1E5631] hover:bg-[#154525]"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p>{new Date(course.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p>{new Date(course.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p>{course.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Level</p>
                  <p>{course.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 