import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { PageHeader } from "@/components/page-header";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Mail, Phone, MapPin, ExternalLink, Loader2 } from "lucide-react";

export default function MembersDirectory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: members, isLoading, isError } = useQuery<User[]>({
    queryKey: [`/api/members?search=${search}&limit=${limit}&offset=${(page - 1) * limit}`],
    enabled: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already reactive through the queryKey
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Members Directory"
        description="Connect with other town planning professionals in NITP."
      />

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="bg-[#1E5631] hover:bg-[#154525]">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5631]" />
        </div>
      ) : isError ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-800">
              There was an error loading the members directory. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Members List */}
          <Card className="shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Membership No.</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Role</TableHead>
                  <TableHead className="text-right">View Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-[#3D8361] text-white">
                              {getInitials(`${member.firstName} ${member.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${member.firstName} ${member.lastName}`}</p>
                            <p className="text-xs text-neutral-500 hidden sm:block">
                              {`Joined ${new Date(member.createdAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.membershipNumber || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="capitalize">{member.role}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      {search ? (
                        <div className="flex flex-col items-center">
                          <Search className="h-12 w-12 text-neutral-300 mb-2" />
                          <p className="text-neutral-600">No members found matching '{search}'</p>
                          <Button 
                            variant="link" 
                            onClick={() => setSearch("")}
                            className="mt-2"
                          >
                            Clear search
                          </Button>
                        </div>
                      ) : (
                        <p className="text-neutral-600">No members found</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setPage(p => Math.max(1, p - 1))} 
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setPage(p => p + 1)} 
                    className={(members?.length || 0) < limit ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
