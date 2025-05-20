import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CommitteeMember {
  name: string;
  title: string;
  designation: string;
}

const committeeMembers: CommitteeMember[] = [
  {
    name: "Tpl. Queen Imalue Phillips FNITP",
    title: "Chairman",
    designation: "FNITP"
  },
  {
    name: "Tpl. Gabriel Ameh FNITP",
    title: "1st Vice Chairman",
    designation: "FNITP"
  },
  {
    name: "Tpl. Dr. Kanu Kingsley MNITP",
    title: "2nd Vice Chairman",
    designation: "MNITP"
  },
  {
    name: "Tpl. Grace Bitrus MNITP",
    title: "General Secretary",
    designation: "MNITP"
  },
  {
    name: "Tpl. Aisha Abubakar Aliyu FNITP",
    title: "Assistant General Secretary",
    designation: "FNITP"
  },
  {
    name: "Tpl. Mansurah Akintayo MNITP",
    title: "Financial Secretary",
    designation: "MNITP"
  },
  {
    name: "Tpl. Alabi Opeyemi MNITP",
    title: "Treasurer",
    designation: "MNITP"
  },
  {
    name: "Tpl. Nzelu Evelyn Ebubedike MNITP",
    title: "Auditor",
    designation: "MNITP"
  },
  {
    name: "Tpl. Emmanuel Gaji Mutah MNITP",
    title: "Public Relations Secretary",
    designation: "MNITP"
  },
  {
    name: "Tpl. Halimatu Sadiya Muhammad MNITP",
    title: "Assistant Public Relations Secretary",
    designation: "MNITP"
  },
  {
    name: "Tpl. Abolaji Shittu Mutiu MNITP",
    title: "Chairman Practice & Ethics Committee",
    designation: "MNITP"
  },
  {
    name: "Tpl. Lami P. K. Ayuba FNITP",
    title: "Ex-officio I",
    designation: "FNITP"
  },
  {
    name: "Tpl. Dairo Ayorinde Rasaki MNITP",
    title: "Ex-officio II",
    designation: "MNITP"
  }
];

export function ExecutiveCommittee() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Executive Committee</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {committeeMembers.map((member, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1E5631]">
                {member.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-600">
                  Designation: {member.designation}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 