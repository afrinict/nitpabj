import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Complaint } from "@shared/schema";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { ComplaintForm } from "@/components/complaint-form";
import { getStatusColor, formatDate } from "@/lib/utils";
import { FileText, AlertTriangle, Clock, CheckCircle, Loader2 } from "lucide-react";

export default function Ethics() {
  const { user } = useAuth();
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  
  // Fetch user's complaints if logged in
  const { data: userComplaints, isLoading: userComplaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints/user"],
    enabled: !!user,
  });
  
  // Fetch all complaints if user is admin or ethics officer
  const isEthicsAdmin = user && (user.role === "admin" || user.role === "ethics_officer");
  const { data: allComplaints, isLoading: allComplaintsLoading } = useQuery<Complaint[]>({
    queryKey: ["/api/complaints"],
    enabled: !!isEthicsAdmin,
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeader
          title="Ethics"
          description="Report and manage ethics issues within the organization."
          className="mb-0"
        />
        <Dialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E5631] hover:bg-[#154525] mt-4 sm:mt-0">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Ethics Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Ethics Complaint</DialogTitle>
              <DialogDescription>
                File a complaint against a member, executive, or the organization.
                All complaints are kept confidential.
              </DialogDescription>
            </DialogHeader>
            <ComplaintForm onSuccess={() => setComplaintDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isEthicsAdmin ? (
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full max-w-md grid grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="investigating">Investigating</TabsTrigger>
            <TabsTrigger value="closed">Closed/Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AdminComplaintsList complaints={allComplaints} isLoading={allComplaintsLoading} />
          </TabsContent>
          <TabsContent value="received">
            <AdminComplaintsList 
              complaints={allComplaints?.filter(c => c.status === "received")} 
              isLoading={allComplaintsLoading} 
            />
          </TabsContent>
          <TabsContent value="investigating">
            <AdminComplaintsList 
              complaints={allComplaints?.filter(c => c.status === "under_investigation")} 
              isLoading={allComplaintsLoading} 
            />
          </TabsContent>
          <TabsContent value="closed">
            <AdminComplaintsList 
              complaints={allComplaints?.filter(c => c.status === "resolved" || c.status === "closed")} 
              isLoading={allComplaintsLoading} 
            />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Card className="mb-6 bg-[#f8fdf9] border-[#d1e7dd]">
            <CardContent className="pt-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#3D8361] p-2 rounded-full text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-[#1E5631]">Reporting Ethics Issues</h3>
                  <p className="text-sm mt-1">
                    The Nigeria Institute of Town Planners is committed to maintaining the highest ethical standards.
                    If you've witnessed or experienced unethical behavior, please submit a confidential report.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-heading text-xl font-semibold text-[#1E5631] mb-4">Your Complaints</h3>
          
          {userComplaintsLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-[#1E5631]" />
            </div>
          ) : !userComplaints || userComplaints.length === 0 ? (
            <Card className="border border-neutral-200">
              <CardContent className="pt-6 text-center">
                <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-600">You haven't submitted any ethics complaints</p>
                <Button
                  variant="link"
                  onClick={() => setComplaintDialogOpen(true)}
                  className="mt-2 text-[#3D8361]"
                >
                  Submit a complaint
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userComplaints.map((complaint) => (
                <UserComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

function UserComplaintCard({ complaint }: { complaint: Complaint }) {
  const statusColors = {
    received: "bg-blue-100 text-blue-800",
    under_investigation: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };
  
  const statusLabels = {
    received: "Received",
    under_investigation: "Under Investigation",
    resolved: "Resolved",
    closed: "Closed"
  };

  return (
    <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{complaint.subject}</CardTitle>
          <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
            {statusLabels[complaint.status as keyof typeof statusLabels]}
          </Badge>
        </div>
        <CardDescription>
          Submitted on {formatDate(complaint.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3">{complaint.details}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-neutral-500">
          {complaint.status === "received" ? (
            <>
              <Clock className="h-3 w-3 inline mr-1" />
              Waiting for review
            </>
          ) : complaint.status === "under_investigation" ? (
            <>
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Under investigation
            </>
          ) : (
            <>
              <CheckCircle className="h-3 w-3 inline mr-1" />
              Case {complaint.status}
            </>
          )}
        </p>
        <Button variant="ghost" size="sm" className="text-[#3D8361]">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

function AdminComplaintsList({ 
  complaints, 
  isLoading 
}: { 
  complaints?: Complaint[], 
  isLoading: boolean 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5631]" />
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <Card className="border border-neutral-200">
        <CardContent className="pt-6 text-center">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-neutral-600">No complaints found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
              <div className="w-full md:w-3/4">
                <div className="flex items-center mb-2">
                  <Badge className={getStatusColor(complaint.status, 'complaint')}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-neutral-500 ml-2">
                    ID: {complaint.id}
                  </span>
                </div>
                <h3 className="font-medium text-lg">{complaint.subject}</h3>
                <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                  {complaint.details}
                </p>
                <div className="flex items-center mt-3 text-xs text-neutral-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Submitted on {formatDate(complaint.createdAt)}</span>
                  {complaint.assignedOfficerId && (
                    <span className="ml-4">Assigned to Officer #{complaint.assignedOfficerId}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <Button className="mb-2 bg-[#3D8361] hover:bg-[#2F6649]">
                  Assign Officer
                </Button>
                <Button variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
