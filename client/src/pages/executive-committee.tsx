import { useQuery } from "@tanstack/react-query";
import { User, Profile } from "@shared/schema";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInitials } from "@/lib/utils";
import { Mail, Phone, MapPin, Linkedin, Twitter, Loader2 } from "lucide-react";

type ExecutiveMember = {
  user: User;
  profile: Profile;
};

export default function ExecutiveCommittee() {
  const { data: executives, isLoading, isError } = useQuery<ExecutiveMember[]>({
    queryKey: ["/api/executives"],
    enabled: true,
  });

  // Group executives by role category for tab organization
  const groupedExecutives = {
    leadership: [] as ExecutiveMember[],
    secretariat: [] as ExecutiveMember[],
    committees: [] as ExecutiveMember[],
  };

  if (executives) {
    executives.forEach((exec) => {
      const position = exec.profile.executivePosition?.toLowerCase() || '';
      
      if (position.includes('president') || position.includes('chairman') || position.includes('director')) {
        groupedExecutives.leadership.push(exec);
      } else if (position.includes('secretary') || position.includes('treasurer')) {
        groupedExecutives.secretariat.push(exec);
      } else {
        groupedExecutives.committees.push(exec);
      }
    });
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Executive Committee"
        description="Meet the leaders and officials of NITP Abuja Chapter."
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5631]" />
        </div>
      ) : isError ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">
              There was an error loading the executive committee data. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : executives && executives.length > 0 ? (
        <>
          <Tabs defaultValue="leadership" className="mb-8">
            <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="secretariat">Secretariat</TabsTrigger>
              <TabsTrigger value="committees">Committees</TabsTrigger>
            </TabsList>
            <TabsContent value="leadership">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedExecutives.leadership.map((exec) => (
                  <ExecutiveCard key={exec.user.id} executive={exec} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="secretariat">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedExecutives.secretariat.map((exec) => (
                  <ExecutiveCard key={exec.user.id} executive={exec} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="committees">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedExecutives.committees.map((exec) => (
                  <ExecutiveCard key={exec.user.id} executive={exec} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border border-neutral-200 shadow-sm">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-neutral-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.479m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <p className="text-neutral-600">No executive committee members found</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

function ExecutiveCard({ executive }: { executive: ExecutiveMember }) {
  return (
    <Card className="border border-neutral-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-[#1E5631] to-[#3D8361] h-24"></div>
      <CardContent className="-mt-12 relative">
        <Avatar className="h-24 w-24 ring-4 ring-white absolute -top-12 left-1/2 transform -translate-x-1/2 shadow-md">
          <AvatarImage src={executive.profile.profilePicture || ""} />
          <AvatarFallback className="bg-[#3D8361] text-white text-xl">
            {getInitials(`${executive.user.firstName} ${executive.user.lastName}`)}
          </AvatarFallback>
        </Avatar>
        <div className="pt-14 text-center">
          <h3 className="font-heading font-semibold text-lg">{`${executive.user.firstName} ${executive.user.lastName}`}</h3>
          <p className="text-[#3D8361] font-medium">{executive.profile.executivePosition}</p>
          <p className="text-sm text-neutral-600 mt-2">{executive.profile.executiveBio || executive.profile.bio || ""}</p>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" className="text-xs">
              <Mail className="h-3 w-3 mr-1" />
              Contact
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
          </div>
          
          <div className="flex justify-center space-x-2 mt-4">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Linkedin className="h-4 w-4 text-[#0077B5]" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <Twitter className="h-4 w-4 text-[#1DA1F2]" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
