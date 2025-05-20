import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Position {
  id: string;
  title: string;
  description: string;
}

export default function CandidateNomination() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    bio: '',
    qualifications: '',
    achievements: '',
    vision: ''
  });

  // Mock positions - replace with API call
  const positions: Position[] = [
    { id: '1', title: 'President', description: 'Lead the organization' },
    { id: '2', title: 'Vice President', description: 'Support the president' },
    { id: '3', title: 'General Secretary', description: 'Handle administrative duties' },
    { id: '4', title: 'Treasurer', description: 'Manage finances' },
    { id: '5', title: 'Public Relations Officer', description: 'Handle communications' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Nomination submitted successfully!');
      navigate('/election');
    } catch (error) {
      toast.error('Failed to submit nomination');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nominate Yourself</CardTitle>
          <CardDescription>
            Submit your nomination for the upcoming election. Please provide detailed information about your qualifications and vision.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.title}>
                      {position.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="List your qualifications and experience"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                placeholder="List your notable achievements"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Vision Statement</Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                placeholder="Share your vision for the position"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/election')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#1E5631] hover:bg-[#154525]"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 