import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Users, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Candidate {
  id: string;
  name: string;
  position: string;
  votes: number;
  avatar: string;
}

interface ElectionResult {
  id: string;
  title: string;
  description: string;
  totalVoters: number;
  votesCast: number;
  positions: string[];
  candidates: Candidate[];
}

// Mock data - replace with API call
const electionResults: ElectionResult = {
  id: '1',
  title: 'NITP Executive Committee Election 2024',
  description: 'Results of the Annual NITP Executive Committee Election',
  totalVoters: 500,
  votesCast: 450,
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
      votes: 250,
      avatar: ''
    },
    {
      id: '2',
      name: 'Prof. Sarah Okonkwo',
      position: 'President',
      votes: 200,
      avatar: ''
    },
    {
      id: '3',
      name: 'Mr. Chukwu Emeka',
      position: 'Vice President',
      votes: 280,
      avatar: ''
    },
    {
      id: '4',
      name: 'Dr. Fatima Ahmed',
      position: 'Vice President',
      votes: 170,
      avatar: ''
    }
  ]
};

const COLORS = ['#1E5631', '#2D7A46', '#3D8361', '#4CAF50', '#81C784'];

export default function ElectionResults() {
  const getPositionResults = (position: string) => {
    return electionResults.candidates.filter(c => c.position === position);
  };

  const getChartData = (position: string) => {
    return getPositionResults(position).map(candidate => ({
      name: candidate.name,
      votes: candidate.votes
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{electionResults.title}</h1>
        <p className="text-gray-600 mb-4">{electionResults.description}</p>
        <div className="flex items-center gap-4">
          <Badge className="bg-green-500">Completed</Badge>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{electionResults.votesCast} / {electionResults.totalVoters} votes cast</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Voter Turnout</CardTitle>
            <CardDescription>Percentage of eligible voters who participated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress
                value={(electionResults.votesCast / electionResults.totalVoters) * 100}
                className="h-2"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{electionResults.votesCast} votes cast</span>
                <span>{electionResults.totalVoters - electionResults.votesCast} votes remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
            <CardDescription>Key metrics from the election</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Voters</span>
                <span className="font-semibold">{electionResults.totalVoters}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Votes Cast</span>
                <span className="font-semibold">{electionResults.votesCast}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Turnout Rate</span>
                <span className="font-semibold">
                  {((electionResults.votesCast / electionResults.totalVoters) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {electionResults.positions.map((position) => (
        <Card key={position} className="mb-8">
          <CardHeader>
            <CardTitle>{position}</CardTitle>
            <CardDescription>Results for {position} position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData(position)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votes" fill="#1E5631" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData(position)}
                      dataKey="votes"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {getChartData(position).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {getPositionResults(position).map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback>
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{candidate.votes} votes</p>
                      <p className="text-sm text-gray-600">
                        {((candidate.votes / electionResults.votesCast) * 100).toFixed(1)}%
                      </p>
                    </div>
                    {candidate.votes === Math.max(...getPositionResults(position).map(c => c.votes)) && (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Winner
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 