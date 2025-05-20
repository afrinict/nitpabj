import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
  category: 'general' | 'urgent' | 'update';
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export default function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const getCategoryColor = (category: Announcement['category']) => {
    switch (category) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {announcement.isImportant && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                </div>
                <CardDescription className="mt-2">
                  {format(new Date(announcement.date), 'MMMM d, yyyy')}
                </CardDescription>
              </div>
              <Badge className={getCategoryColor(announcement.category)}>
                {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{announcement.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 