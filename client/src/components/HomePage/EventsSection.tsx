import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: Date;
  location: string;
  description: string;
  type: 'conference' | 'workshop' | 'seminar' | 'meeting';
  registrationRequired: boolean;
}

interface EventsSectionProps {
  events: Event[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'conference':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'seminar':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{format(event.date, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>
              <Badge className={getEventTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
            {event.registrationRequired ? (
              <Button className="w-full bg-[#1E5631] hover:bg-[#154525]">
                Register Now
              </Button>
            ) : (
              <Button variant="outline" className="w-full border-[#1E5631] text-[#1E5631] hover:bg-[#1E5631] hover:text-white">
                Learn More
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 