import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";

export function Ethics() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Ethics Committee</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ethics Guidelines</CardTitle>
            <CardDescription>
              Professional standards and ethical guidelines for NITP members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Code of Professional Conduct</h2>
                <p>
                  Members of the Nigerian Institute of Town Planners are expected to maintain the highest standards of professional conduct and integrity in their practice.
                </p>
                <h2 className="text-xl font-semibold">Ethical Principles</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Professional Competence</li>
                  <li>Integrity and Objectivity</li>
                  <li>Confidentiality</li>
                  <li>Professional Behavior</li>
                  <li>Public Interest</li>
                </ul>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File a Complaint</CardTitle>
            <CardDescription>
              Report ethical violations or concerns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Complaint Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complaint type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional Misconduct</SelectItem>
                    <SelectItem value="ethical">Ethical Violation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Supporting Documents</label>
                <FileUpload />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 