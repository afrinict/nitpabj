import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/ui/file-upload";

export function SiteAnalysisReport() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    // Page 1
    applicationType: "",
    projectTitle: "",
    siteAddress: "",
    coordinates: "",
    plotNumber: "",
    projectType: "",
    projectSize: "",
    projectScope: "",
    projectJustification: "",
    applicantName: "",
    applicantAddress: "",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",

    // Page 2
    currentLandUse: "",
    vegetationCover: "",
    soilType: "",
    hydrology: "",
    topography: "",
    habitats: "",
    speciesOfConcern: "",
    migratoryPathways: "",
    protectedAreas: "",
    population: "",
    landUseByCommunities: "",
    culturalResources: "",

    // Page 3
    constructionImpacts: "",
    operationImpacts: "",
    decommissioningImpacts: "",
    cumulativeImpacts: "",

    // Page 4
    mitigationMeasures: "",

    // Page 5
    attachments: [] as File[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const renderPage1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">1.1 Application Type</h3>
        <Select onValueChange={(value) => handleInputChange("applicationType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select application type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="corporation">Corporation/Organization</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">1.2 Project Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Project Title</Label>
            <Input
              id="projectTitle"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange("projectTitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteAddress">Site Address</Label>
            <Input
              id="siteAddress"
              value={formData.siteAddress}
              onChange={(e) => handleInputChange("siteAddress", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coordinates">Geographic Coordinates</Label>
              <Input
                id="coordinates"
                placeholder="Latitude, Longitude"
                value={formData.coordinates}
                onChange={(e) => handleInputChange("coordinates", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plotNumber">Plot Number</Label>
              <Input
                id="plotNumber"
                value={formData.plotNumber}
                onChange={(e) => handleInputChange("plotNumber", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">1.3 Project Description</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Select onValueChange={(value) => handleInputChange("projectType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectSize">Project Size</Label>
            <Input
              id="projectSize"
              placeholder="Area in hectares or length in kilometers"
              value={formData.projectSize}
              onChange={(e) => handleInputChange("projectSize", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectScope">Project Scope</Label>
            <Textarea
              id="projectScope"
              placeholder="Describe all project activities"
              value={formData.projectScope}
              onChange={(e) => handleInputChange("projectScope", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectJustification">Project Justification</Label>
            <Textarea
              id="projectJustification"
              placeholder="Explain the rationale and objectives"
              value={formData.projectJustification}
              onChange={(e) => handleInputChange("projectJustification", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">1.4 Proponent Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Name of Applicant/Organization</Label>
            <Input
              id="applicantName"
              value={formData.applicantName}
              onChange={(e) => handleInputChange("applicantName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicantAddress">Address</Label>
            <Input
              id="applicantAddress"
              value={formData.applicantAddress}
              onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange("contactPerson", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">2.1 Site Characteristics</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentLandUse">Current Land Use</Label>
            <Input
              id="currentLandUse"
              value={formData.currentLandUse}
              onChange={(e) => handleInputChange("currentLandUse", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vegetationCover">Vegetation Cover</Label>
            <Textarea
              id="vegetationCover"
              value={formData.vegetationCover}
              onChange={(e) => handleInputChange("vegetationCover", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Input
              id="soilType"
              value={formData.soilType}
              onChange={(e) => handleInputChange("soilType", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hydrology">Hydrology</Label>
            <Textarea
              id="hydrology"
              value={formData.hydrology}
              onChange={(e) => handleInputChange("hydrology", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topography">Topography</Label>
            <Textarea
              id="topography"
              value={formData.topography}
              onChange={(e) => handleInputChange("topography", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">2.2 Ecological Resources</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="habitats">Habitats</Label>
            <Textarea
              id="habitats"
              value={formData.habitats}
              onChange={(e) => handleInputChange("habitats", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speciesOfConcern">Species of Conservation Concern</Label>
            <Textarea
              id="speciesOfConcern"
              value={formData.speciesOfConcern}
              onChange={(e) => handleInputChange("speciesOfConcern", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="migratoryPathways">Migratory Pathways</Label>
            <Textarea
              id="migratoryPathways"
              value={formData.migratoryPathways}
              onChange={(e) => handleInputChange("migratoryPathways", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protectedAreas">Protected Areas</Label>
            <Textarea
              id="protectedAreas"
              value={formData.protectedAreas}
              onChange={(e) => handleInputChange("protectedAreas", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">2.3 Socio-economic Environment</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="population">Population</Label>
            <Textarea
              id="population"
              value={formData.population}
              onChange={(e) => handleInputChange("population", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="landUseByCommunities">Land Use by Local Communities</Label>
            <Textarea
              id="landUseByCommunities"
              value={formData.landUseByCommunities}
              onChange={(e) => handleInputChange("landUseByCommunities", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="culturalResources">Cultural and Heritage Resources</Label>
            <Textarea
              id="culturalResources"
              value={formData.culturalResources}
              onChange={(e) => handleInputChange("culturalResources", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">3. Potential Ecological Impacts</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="constructionImpacts">Construction Phase Impacts</Label>
            <Textarea
              id="constructionImpacts"
              value={formData.constructionImpacts}
              onChange={(e) => handleInputChange("constructionImpacts", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="operationImpacts">Operation Phase Impacts</Label>
            <Textarea
              id="operationImpacts"
              value={formData.operationImpacts}
              onChange={(e) => handleInputChange("operationImpacts", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="decommissioningImpacts">Decommissioning Phase Impacts</Label>
            <Textarea
              id="decommissioningImpacts"
              value={formData.decommissioningImpacts}
              onChange={(e) => handleInputChange("decommissioningImpacts", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cumulativeImpacts">Cumulative Impacts</Label>
            <Textarea
              id="cumulativeImpacts"
              value={formData.cumulativeImpacts}
              onChange={(e) => handleInputChange("cumulativeImpacts", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage4 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">4. Mitigation Measures</h3>
        <div className="space-y-2">
          <Label htmlFor="mitigationMeasures">Proposed Mitigation Measures</Label>
          <Textarea
            id="mitigationMeasures"
            className="min-h-[300px]"
            value={formData.mitigationMeasures}
            onChange={(e) => handleInputChange("mitigationMeasures", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">5. Attachments</h3>
        <div className="space-y-4">
          <FileUpload
            onUpload={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
          />
          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Uploaded Files:</h4>
              <ul className="list-disc pl-4">
                {formData.attachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPage6 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">6. Declaration</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            I hereby declare that the information provided in this application and its attachments is true and accurate to the best of my knowledge.
          </p>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="declarationName">Name</Label>
              <Input
                id="declarationName"
                value={formData.applicantName}
                onChange={(e) => handleInputChange("applicantName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="declarationTitle">Title</Label>
              <Input
                id="declarationTitle"
                placeholder="Your position in the organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="declarationOrganization">Organization</Label>
              <Input
                id="declarationOrganization"
                value={formData.applicantName}
                onChange={(e) => handleInputChange("applicantName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="declarationDate">Date</Label>
              <Input
                id="declarationDate"
                type="date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderPage1();
      case 2:
        return renderPage2();
      case 3:
        return renderPage3();
      case 4:
        return renderPage4();
      case 5:
        return renderPage5();
      case 6:
        return renderPage6();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Analysis Report / Ecological Impact Assessment Report</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            {renderCurrentPage()}
          </ScrollArea>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(6, prev + 1))}
              disabled={currentPage === 6}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 