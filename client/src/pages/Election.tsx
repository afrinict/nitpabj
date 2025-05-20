import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users, Award, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  qualifications: string[];
  avatar: string;
  votes: number;
}

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  positions: string[];
  candidates: Candidate[];
  totalVoters: number;
  votesCast: number;
}

// Mock data - replace with API call
const electionData: Election = {
  id: '1',
  title: 'NITP Executive Committee Election 2024',
  description: 'Annual election for the NITP Executive Committee positions.',
  startDate: '2024-03-01',
  endDate: '2024-03-15',
  status: 'active',
  positions: [
    'President',
    'Vice President',
    'General Secretary',
    'Treasurer',
    'Public Relations Officer'
  ],
  candidates: [
    {
      id: '1',
      name: 'Dr. Adebayo Johnson',
      position: 'President',
      bio: 'Dr. Johnson has over 15 years of experience in urban planning and has worked on numerous major projects across Nigeria.',
      qualifications: [
        'PhD in Urban Planning',
        '15+ years of experience',
        'Former Chapter President'
      ],
      avatar: '',
      votes: 150
    },
    {
      id: '2',
      name: 'Prof. Sarah Okonkwo',
      position: 'President',
      bio: 'Prof. Okonkwo is a distinguished academic with extensive experience in urban development and policy making.',
      qualifications: [
        'PhD in Urban Development',
        '20+ years of experience',
        'Published Author'
      ],
      avatar: '',
      votes: 120
    }
  ],
  totalVoters: 500,
  votesCast: 270
};

export default function Election() {
  const navigate = useNavigate();
  const [election, setElection] = useState<Election>(electionData);
  const [selectedPosition, setSelectedPosition] = useState<string>(election.positions[0]);

  const handleVote = (candidateId: string) => {
    // Mock vote casting - replace with API call
    setElection(prev => ({
      ...prev,
      candidates: prev.candidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      ),
      votesCast: prev.votesCast + 1
    }));
    toast.success('Vote cast successfully!');
  };

  const getElectionStatus = () => {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{election.title}</h1>
            <p className="text-gray-600 mb-4">{election.description}</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/election/nominate')}
              className="bg-[#1E5631] hover:bg-[#154525]"
            >
              Nominate Candidate
            </Button>
            <Button
              onClick={() => navigate('/election/results')}
              variant="outline"
            >
              View Results
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(getElectionStatus())}>
            {getElectionStatus().charAt(0).toUpperCase() + getElectionStatus().slice(1)}
          </Badge>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{election.votesCast} / {election.totalVoters} votes cast</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue={election.positions[0]} className="mb-8">
        <TabsList className="mb-4">
          {election.positions.map((position) => (
            <TabsTrigger
              key={position}
              value={position}
              onClick={() => setSelectedPosition(position)}
            >
              {position}
            </TabsTrigger>
          ))}
        </TabsList>

        {election.positions.map((position) => (
          <TabsContent key={position} value={position}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {election.candidates
                .filter(candidate => candidate.position === position)
                .map((candidate) => (
                  <Card key={candidate.id}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{candidate.name}</CardTitle>
                          <CardDescription>{candidate.position}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Bio</h4>
                          <p className="text-gray-600">{candidate.bio}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Qualifications</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {candidate.qualifications.map((qual, index) => (
                              <li key={index}>{qual}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>{candidate.votes} votes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {getElectionStatus() === 'active' ? (
                        <Button
                          className="w-full bg-[#1E5631] hover:bg-[#154525]"
                          onClick={() => handleVote(candidate.id)}
                        >
                          Vote
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled
                        >
                          {getElectionStatus() === 'upcoming' ? 'Coming Soon' : 'Election Ended'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {getElectionStatus() === 'active' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Election Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={(election.votesCast / election.totalVoters) * 100} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{election.votesCast} votes cast</span>
                <span>{election.totalVoters - election.votesCast} votes remaining</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  {Math.ceil((new Date(election.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 