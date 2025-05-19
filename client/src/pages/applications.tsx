import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationForm } from "@/components/application-form";
import { getStatusColor, formatDate } from "@/lib/utils";
import { FileText, PlusCircle, FileCheck, FileX, Clock, Loader2 } from "lucide-react";

export default function Applications() {
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false);
  
  const { data: applications, isLoading, isError } = useQuery<Application[]>({
    queryKey: ["/api/applications/user"],
    enabled: true,
  });

  // Filter applications by status
  const groupedApplications = {
    draft: applications?.filter(app => app.status === 'draft') || [],
    submitted: applications?.filter(app => app.status === 'submitted') || [],
    under_review: applications?.filter(app => app.status === 'under_review') || [],
    approved: applications?.filter(app => app.status === 'approved') || [],
    rejected: applications?.filter(app => app.status === 'rejected') || [],
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeader
          title="Applications"
          description="Submit and manage your Site Analysis Reports (SAR) and Ecological Impact Assessment Reports (EIAR)."
          className="mb-0"
        />
        <Dialog open={applicationDialogOpen} onOpenChange={setApplicationDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1E5631] hover:bg-[#154525] mt-4 sm:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Submit Application</DialogTitle>
              <DialogDescription>
                Choose the type of application you want to submit and fill out the required information.
              </DialogDescription>
            </DialogHeader>
            <ApplicationForm onSuccess={() => setApplicationDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6 bg-[#f8fdf9] border-[#d1e7dd]">
        <CardContent className="pt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-[#3D8361] p-2 rounded-full text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-[#1E5631]">Application Process</h3>
              <p className="text-sm mt-1">
                Applications for Site Analysis Reports (SAR) and Ecological Impact Assessment Reports (EIAR)
                go through a review process before being approved. Once approved, you will receive your
                certificate via email and WhatsApp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5631]" />
        </div>
      ) : isError ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">
              There was an error loading your applications. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="w-full max-w-md grid grid-cols-3 mb-6">
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="sar">SAR</TabsTrigger>
              <TabsTrigger value="eiar">EIAR</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ApplicationList applications={applications || []} />
            </TabsContent>
            <TabsContent value="sar">
              <ApplicationList applications={(applications || []).filter(app => app.type === 'sar')} />
            </TabsContent>
            <TabsContent value="eiar">
              <ApplicationList applications={(applications || []).filter(app => app.type === 'eiar')} />
            </TabsContent>
          </Tabs>

          {/* Application Status Breakdown */}
          <h3 className="font-heading text-lg font-semibold text-[#1E5631] mb-4">Application Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatusCard
              title="Draft"
              count={groupedApplications.draft.length}
              icon={FileText}
              color="bg-gray-100 text-gray-800"
            />
            <StatusCard
              title="Submitted"
              count={groupedApplications.submitted.length}
              icon={Clock}
              color="bg-blue-100 text-blue-800"
            />
            <StatusCard
              title="Under Review"
              count={groupedApplications.under_review.length}
              icon={Clock}
              color="bg-yellow-100 text-yellow-800"
            />
            <StatusCard
              title="Approved"
              count={groupedApplications.approved.length}
              icon={FileCheck}
              color="bg-green-100 text-green-800"
            />
            <StatusCard
              title="Rejected"
              count={groupedApplications.rejected.length}
              icon={FileX}
              color="bg-red-100 text-red-800"
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

function StatusCard({ title, count, icon: Icon, color }: StatusCardProps) {
  return (
    <Card className="border border-neutral-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge className={color}>
              {title}
            </Badge>
            <p className="text-3xl font-bold mt-2">{count}</p>
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('bg-', 'text-')}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ApplicationList({ applications }: { applications: Application[] }) {
  const getApplicationTypeLabel = (type: string) => {
    if (type === 'sar') return 'Site Analysis Report';
    if (type === 'eiar') return 'Ecological Impact Assessment';
    return type.toUpperCase();
  };

  if (applications.length === 0) {
    return (
      <Card className="border border-neutral-200">
        <CardContent className="pt-6 text-center">
          <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-neutral-600">You don't have any applications yet</p>
          <Button
            variant="link"
            onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-trigger="true"]')?.click()}
            className="mt-2 text-[#3D8361]"
          >
            Submit your first application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="border border-neutral-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
              <div className="w-full md:w-3/4">
                <div className="flex items-center mb-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className="ml-2 bg-[#3D8361]">
                    {application.type.toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-medium text-lg">{application.projectName}</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {getApplicationTypeLabel(application.type)} • {application.projectType}
                </p>
                <p className="text-sm text-neutral-600 mt-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {application.state}, {application.lga}
                </p>
                <div className="flex items-center mt-3 text-xs text-neutral-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Submitted on {formatDate(application.createdAt)}</span>
                  {application.updatedAt !== application.createdAt && (
                    <span className="ml-4">Last updated: {formatDate(application.updatedAt)}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <Button className="mb-2 bg-[#3D8361] hover:bg-[#2F6649]">
                  View Details
                </Button>
                {application.status === 'draft' && (
                  <Button variant="outline">
                    Continue Editing
                  </Button>
                )}
                {application.status === 'approved' && application.certificateUrl && (
                  <Button variant="outline">
                    Download Certificate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
