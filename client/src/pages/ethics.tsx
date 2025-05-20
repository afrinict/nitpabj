import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Complaint {
  id: string;
  subject: string;
  status: 'pending' | 'under_review' | 'resolved' | 'appealed';
  date: string;
  handler: string;
}

export function Ethics() {
  const [activeTab, setActiveTab] = useState("code");
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      subject: "Professional Misconduct Complaint",
      status: "under_review",
      date: "2024-03-15",
      handler: "Ethics Committee Chair"
    }
  ]);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle complaint submission
    console.log("Complaint submitted");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ethics Module</h1>
      
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="code">Code of Ethics</TabsTrigger>
          <TabsTrigger value="complaint">Submit Complaint</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="status">Complaint Status</TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Code of Ethics</CardTitle>
              <CardDescription>
                The official Code of Ethics for the Nigerian Institute of Town Planners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">1. Professional Conduct</h2>
                  <p>Members shall maintain the highest standards of professional conduct and integrity.</p>
                  
                  <h2 className="text-xl font-semibold">2. Public Interest</h2>
                  <p>Members shall prioritize the public interest in all professional activities.</p>
                  
                  <h2 className="text-xl font-semibold">3. Professional Competence</h2>
                  <p>Members shall maintain and enhance their professional competence.</p>
                  
                  {/* Add more sections as needed */}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaint">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Complaint</CardTitle>
              <CardDescription>
                Submit a confidential complaint regarding potential ethical violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject of Complaint</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Against a Member</SelectItem>
                      <SelectItem value="organization">Against the Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Details of Complaint</Label>
                  <Textarea
                    id="details"
                    placeholder="Please provide a detailed description of the issue..."
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Supporting Documents</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" type="text" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information</Label>
                  <Input id="contact" type="email" placeholder="email@example.com" />
                </div>

                <Button type="submit" className="w-full">Submit Complaint</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures">
          <Card>
            <CardHeader>
              <CardTitle>Ethics Procedures</CardTitle>
              <CardDescription>
                Information about the complaint process and procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Filing a Complaint</h3>
                  <p>Learn about the process of filing an ethical complaint and what information is required.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Investigation Process</h3>
                  <p>Understand how complaints are investigated and the timeline for resolution.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Resolution Process</h3>
                  <p>Information about how complaints are resolved and potential outcomes.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Appeals Process</h3>
                  <p>Details about the appeals process and how to submit an appeal.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Status</CardTitle>
              <CardDescription>
                Track the status of your submitted complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <Card key={complaint.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{complaint.subject}</h3>
                          <p className="text-sm text-gray-500">Submitted: {complaint.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Status: {complaint.status}</p>
                          <p className="text-sm text-gray-500">Handler: {complaint.handler}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
