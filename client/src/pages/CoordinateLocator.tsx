import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Save, History } from 'lucide-react';

interface Coordinate {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  createdAt: string;
}

interface SearchResult {
  latitude: number;
  longitude: number;
  displayName: string;
  address: {
    road?: string;
    houseNumber?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export default function CoordinateLocator() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [savedCoordinates, setSavedCoordinates] = useState<Coordinate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');

  useEffect(() => {
    fetchSavedCoordinates();
  }, []);

  const fetchSavedCoordinates = async () => {
    try {
      const response = await fetch('/api/coordinates');
      const data = await response.json();
      setSavedCoordinates(data);
    } catch (error) {
      toast.error('Failed to fetch saved coordinates');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(`/api/coordinates/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      toast.error('Failed to search coordinates');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async () => {
    if (!selectedResult) return;
    if (!saveName.trim()) {
      toast.error('Please enter a name for the coordinate');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/coordinates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: selectedResult.latitude,
          longitude: selectedResult.longitude,
          name: saveName,
          description: saveDescription
        })
      });

      if (!response.ok) throw new Error('Failed to save coordinate');

      toast.success('Coordinate saved successfully');
      setSelectedResult(null);
      setSaveName('');
      setSaveDescription('');
      fetchSavedCoordinates();
    } catch (error) {
      toast.error('Failed to save coordinate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/coordinates/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete coordinate');

      toast.success('Coordinate deleted successfully');
      fetchSavedCoordinates();
    } catch (error) {
      toast.error('Failed to delete coordinate');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Coordinate Locator</h1>
          <p className="text-gray-600">Find and save coordinates for your projects</p>
        </div>
        <Button
          onClick={() => navigate('/tools')}
          variant="outline"
        >
          Back to Tools
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Coordinates</CardTitle>
              <CardDescription>Enter an address or location to find coordinates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search">Search Location</Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter address or location"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Search
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all ${
                        selectedResult === result
                          ? 'border-[#1E5631] ring-2 ring-[#1E5631]'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedResult(result)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <MapPin className="w-5 h-5 text-[#1E5631] mt-1" />
                          <div>
                            <p className="font-medium">{result.displayName}</p>
                            <p className="text-sm text-gray-500">
                              {result.address.road && `${result.address.road}, `}
                              {result.address.houseNumber && `${result.address.houseNumber}, `}
                              {result.address.city && `${result.address.city}, `}
                              {result.address.state && `${result.address.state}, `}
                              {result.address.country}
                            </p>
                            <p className="text-sm font-mono mt-2">
                              {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedResult && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Save Coordinate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          placeholder="Enter a name for this coordinate"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Input
                          id="description"
                          value={saveDescription}
                          onChange={(e) => setSaveDescription(e.target.value)}
                          placeholder="Enter a description"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-[#1E5631] hover:bg-[#154525]"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Save Coordinate
                        </div>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" />
                <CardTitle>Saved Coordinates</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedCoordinates.map((coord) => (
                  <Card key={coord.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{coord.name}</p>
                          <p className="text-sm text-gray-500">{coord.description}</p>
                          <p className="text-sm font-mono mt-2">
                            {coord.latitude.toFixed(6)}, {coord.longitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Saved {new Date(coord.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(coord.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 