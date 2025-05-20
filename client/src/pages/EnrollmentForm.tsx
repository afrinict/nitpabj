import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EnrollmentForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

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
      <h1 className="text-2xl font-bold mb-6">Course Enrollment</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Step {currentPage} of {totalPages}</CardTitle>
          <CardDescription>
            {currentPage === 1 && "Personal Information"}
            {currentPage === 2 && "Course Selection"}
            {currentPage === 3 && "Payment Details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentPage === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Textarea placeholder="Enter your address" />
              </div>
            </div>
          )}

          {currentPage === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Course</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban-planning">Urban Planning Fundamentals</SelectItem>
                    <SelectItem value="environmental">Environmental Impact Assessment</SelectItem>
                    <SelectItem value="sustainable">Sustainable Development</SelectItem>
                    <SelectItem value="gis">GIS and Spatial Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Start Date</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Requirements</label>
                <Textarea placeholder="Any special requirements or accommodations needed" />
              </div>
            </div>
          )}

          {currentPage === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card Number</label>
                <Input placeholder="Enter card number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CVV</label>
                  <Input placeholder="Enter CVV" />
                </div>
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
              {currentPage === totalPages ? "Submit Enrollment" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnrollmentForm; 