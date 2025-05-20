import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch, FileText } from "lucide-react";

const Applications = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Analysis Report (SAR) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Site Analysis Report (SAR)
            </CardTitle>
            <CardDescription>
              Document the physical and environmental characteristics of a proposed development site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This form is used to document the physical and environmental characteristics of a proposed development site, 
              including topography, soil conditions, drainage patterns, and existing infrastructure.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/applications/site-analysis">Start Application</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Ecological Impact Assessment Report (EIAR) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ecological Impact Assessment Report (EIAR)
            </CardTitle>
            <CardDescription>
              Assess and document the potential ecological impacts of a proposed development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This form is used to assess and document the potential ecological impacts of a proposed development, 
              including impacts on flora, fauna, habitats, and ecosystem services.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/applications/ecological-impact">Start Application</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Applications;
