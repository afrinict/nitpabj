import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Trash2, Edit2, Users, Award, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  positions: string[];
  totalVoters: number;
  votesCast: number;
}

interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  qualifications: string[];
  avatar: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface Position {
  id: string;
  title: string;
  description: string;
  electionId: string;
}

export default function AdminElectionDashboard() {
  const [activeTab, setActiveTab] = useState('elections');
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);

  const [newElection, setNewElection] = useState<Partial<Election>>({
    title: '',
    description: '',
    positions: []
  });

  const [newPosition, setNewPosition] = useState<Partial<Position>>({
    title: '',
    description: ''
  });

  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: '',
    position: '',
    bio: '',
    qualifications: []
  });

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('/api/elections');
      const data = await response.json();
      setElections(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to fetch elections');
      setIsLoading(false);
    }
  };

  const handleCreateElection = async () => {
    try {
      const response = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newElection)
      });

      if (!response.ok) throw new Error('Failed to create election');

      const election = await response.json();
      setElections([...elections, election]);
      setIsCreateDialogOpen(false);
      setNewElection({ title: '', description: '', positions: [] });
      toast.success('Election created successfully');
    } catch (error) {
      toast.error('Failed to create election');
    }
  };

  const handleUpdateElection = async (id: string) => {
    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newElection)
      });

      if (!response.ok) throw new Error('Failed to update election');

      const updatedElection = await response.json();
      setElections(elections.map(e => e.id === id ? updatedElection : e));
      setIsEditDialogOpen(false);
      toast.success('Election updated successfully');
    } catch (error) {
      toast.error('Failed to update election');
    }
  };

  const handleDeleteElection = async (id: string) => {
    try {
      const response = await fetch(`/api/elections/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete election');

      setElections(elections.filter(e => e.id !== id));
      toast.success('Election deleted successfully');
    } catch (error) {
      toast.error('Failed to delete election');
    }
  };

  const handleUpdateElectionStatus = async (id: string, status: 'upcoming' | 'active' | 'completed') => {
    try {
      const action = status === 'active' ? 'activate' : 'end';
      const response = await fetch(`/api/elections/${id}/${action}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error(`Failed to ${action} election`);

      const updatedElection = await response.json();
      setElections(elections.map(e => e.id === id ? updatedElection : e));
      toast.success(`Election ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} election`);
    }
  };

  const handleCreatePosition = async () => {
    if (!selectedElection) return;

    try {
      const response = await fetch(`/api/elections/${selectedElection.id}/positions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPosition,
          electionId: selectedElection.id
        })
      });

      if (!response.ok) throw new Error('Failed to create position');

      const position = await response.json();
      setPositions([...positions, position]);
      setIsPositionDialogOpen(false);
      setNewPosition({ title: '', description: '' });
      toast.success('Position created successfully');
    } catch (error) {
      toast.error('Failed to create position');
    }
  };

  const handleApproveCandidate = async (id: string) => {
    try {
      const response = await fetch(`/api/candidates/${id}/approve`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to approve candidate');

      const updatedCandidate = await response.json();
      setCandidates(candidates.map(c => c.id === id ? updatedCandidate : c));
      toast.success('Candidate approved successfully');
    } catch (error) {
      toast.error('Failed to approve candidate');
    }
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

  const getCandidateStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E5631]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Election Management</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-[#1E5631] hover:bg-[#154525]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Election
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="elections">Active Elections</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="elections">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <CardDescription className="mt-2">{election.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(election.status)}>
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {format(new Date(election.startDate), 'MMM dd, yyyy')} - {format(new Date(election.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Voter Turnout</span>
                        <span>{Math.round((election.votesCast / election.totalVoters) * 100)}%</span>
                      </div>
                      <Progress value={(election.votesCast / election.totalVoters) * 100} className="h-2" />
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{election.votesCast} / {election.totalVoters} votes cast</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{election.positions.length} positions</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedElection(election);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateElectionStatus(election.id, 'active')}
                        disabled={election.status === 'active'}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateElectionStatus(election.id, 'completed')}
                        disabled={election.status === 'completed'}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        End
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteElection(election.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Candidates</CardTitle>
                  <CardDescription>View and manage election candidates</CardDescription>
                </div>
                <Button
                  onClick={() => setIsCandidateDialogOpen(true)}
                  className="bg-[#1E5631] hover:bg-[#154525]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {candidate.avatar ? (
                          <img src={candidate.avatar} alt={candidate.name} className="w-full h-full rounded-full" />
                        ) : (
                          <Users className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCandidateStatusColor(candidate.status)}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {candidate.votes} votes
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {candidate.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveCandidate(candidate.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Election Results</CardTitle>
              <CardDescription>View detailed election results and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {elections.map((election) => (
                  <div key={election.id} className="space-y-4">
                    <h3 className="text-xl font-semibold">{election.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {election.positions.map((position) => (
                        <Card key={position} className="bg-gray-50">
                          <CardHeader>
                            <CardTitle className="text-lg">{position}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {candidates
                                .filter(c => c.position === position)
                                .map((candidate) => (
                                  <div key={candidate.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{candidate.name}</span>
                                      <span className="text-sm text-gray-500">
                                        {candidate.votes} votes
                                      </span>
                                    </div>
                                    <Progress
                                      value={(candidate.votes / election.totalVoters) * 100}
                                      className="h-2"
                                    />
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Election Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Election</DialogTitle>
            <DialogDescription>Set up a new election event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Election Title</Label>
              <Input
                id="title"
                value={newElection.title}
                onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                placeholder="Enter election title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newElection.description}
                onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                placeholder="Enter election description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newElection.startDate ? format(newElection.startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newElection.startDate}
                      onSelect={(date) => setNewElection({ ...newElection, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newElection.endDate ? format(newElection.endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newElection.endDate}
                      onSelect={(date) => setNewElection({ ...newElection, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateElection} className="bg-[#1E5631] hover:bg-[#154525]">
              Create Election
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Election Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Election</DialogTitle>
            <DialogDescription>Modify election details</DialogDescription>
          </DialogHeader>
          {selectedElection && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Election Title</Label>
                <Input
                  id="edit-title"
                  value={newElection.title || selectedElection.title}
                  onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                  placeholder="Enter election title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newElection.description || selectedElection.description}
                  onChange={(e) => setNewElection({ ...newElection, description: e.target.value })}
                  placeholder="Enter election description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newElection.startDate ? format(newElection.startDate, 'PPP') : format(selectedElection.startDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newElection.startDate || selectedElection.startDate}
                        onSelect={(date) => setNewElection({ ...newElection, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newElection.endDate ? format(newElection.endDate, 'PPP') : format(selectedElection.endDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newElection.endDate || selectedElection.endDate}
                        onSelect={(date) => setNewElection({ ...newElection, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedElection && handleUpdateElection(selectedElection.id)}
              className="bg-[#1E5631] hover:bg-[#154525]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Position Dialog */}
      <Dialog open={isPositionDialogOpen} onOpenChange={setIsPositionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Position</DialogTitle>
            <DialogDescription>Create a new position for the election</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="position-title">Position Title</Label>
              <Input
                id="position-title"
                value={newPosition.title}
                onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                placeholder="Enter position title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-description">Description</Label>
              <Textarea
                id="position-description"
                value={newPosition.description}
                onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                placeholder="Enter position description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPositionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePosition} className="bg-[#1E5631] hover:bg-[#154525]">
              Add Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Candidate Dialog */}
      <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>Register a new candidate for the election</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>
              <Input
                id="candidate-name"
                value={newCandidate.name}
                onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                placeholder="Enter candidate name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-position">Position</Label>
              <Select
                value={newCandidate.position}
                onValueChange={(value) => setNewCandidate({ ...newCandidate, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
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
              <Label htmlFor="candidate-bio">Bio</Label>
              <Textarea
                id="candidate-bio"
                value={newCandidate.bio}
                onChange={(e) => setNewCandidate({ ...newCandidate, bio: e.target.value })}
                placeholder="Enter candidate bio"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCandidateDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1E5631] hover:bg-[#154525]">
              Add Candidate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 