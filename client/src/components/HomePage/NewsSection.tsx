import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: 'achievement' | 'project' | 'policy' | 'news';
}

interface NewsSectionProps {
  newsItems: NewsItem[];
}

export default function NewsSection({ newsItems }: NewsSectionProps) {
  const getCategoryColor = (category: NewsItem['category']) => {
    switch (category) {
      case 'achievement':
        return 'bg-green-100 text-green-800';
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'policy':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsItems.map((item) => (
        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <Badge className={`absolute top-4 right-4 ${getCategoryColor(item.category)}`}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2">{item.title}</CardTitle>
            <CardDescription>
              {format(new Date(item.date), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-3">{item.summary}</p>
            <Button variant="outline" className="w-full border-[#1E5631] text-[#1E5631] hover:bg-[#1E5631] hover:text-white">
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 