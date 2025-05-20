import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";

const EcologicalImpactReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ecological Impact Assessment Report</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Page {currentPage} of {totalPages}</CardTitle>
          <CardDescription>
            {currentPage === 1 && "Project Information"}
            {currentPage === 2 && "Ecological Setting"}
            {currentPage === 3 && "Potential Impacts"}
            {currentPage === 4 && "Mitigation Measures"}
            {currentPage === 5 && "Monitoring and Management"}
            {currentPage === 6 && "Attachments"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentPage === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <Input placeholder="Enter project name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Location</label>
                <Input placeholder="Enter project location" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project Description</label>
                <Textarea placeholder="Describe the project and its objectives" />
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Existing Flora</label>
                <Textarea placeholder="Describe existing plant species and vegetation" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Existing Fauna</label>
                <Textarea placeholder="Describe existing animal species and habitats" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ecosystem Services</label>
                <Textarea placeholder="Describe ecosystem services provided by the area" />
              </div>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Direct Impacts</label>
                <Textarea placeholder="Describe direct impacts on flora and fauna" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Indirect Impacts</label>
                <Textarea placeholder="Describe indirect impacts on the ecosystem" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cumulative Impacts</label>
                <Textarea placeholder="Describe cumulative impacts over time" />
              </div>
            </div>
          )}

          {currentPage === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Avoidance Measures</label>
                <Textarea placeholder="Describe measures to avoid impacts" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Minimization Measures</label>
                <Textarea placeholder="Describe measures to minimize impacts" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Compensation Measures</label>
                <Textarea placeholder="Describe measures to compensate for impacts" />
              </div>
            </div>
          )}

          {currentPage === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monitoring Plan</label>
                <Textarea placeholder="Describe the monitoring plan" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Management Measures</label>
                <Textarea placeholder="Describe management measures" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contingency Plans</label>
                <Textarea placeholder="Describe contingency plans" />
              </div>
            </div>
          )}

          {currentPage === 6 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supporting Documents</label>
                <FileUpload />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maps and Plans</label>
                <FileUpload />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Attachments</label>
                <FileUpload />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              {currentPage === totalPages ? "Submit" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcologicalImpactReport; 