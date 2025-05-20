import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/stats-card";
import { ActivityItem } from "@/components/activity-item";
import { ProjectCard } from "@/components/project-card";
import { QuickLinkCard } from "@/components/quick-link-card";

import { Users, FileText, Gavel, BarChart4, Calendar, UserCircle, TriangleAlert, FileSignature } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back, ${user?.firstName}. Here's what's happening with NITP today.`} 
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Members"
          value="1,254"
          icon={Users}
          iconColor="text-blue-800"
          iconBgColor="bg-blue-100"
          change={{
            value: "4.7% from last month",
            trend: "up"
          }}
        />
        <StatsCard
          title="Pending Applications"
          value="42"
          icon={FileText}
          iconColor="text-yellow-800"
          iconBgColor="bg-yellow-100"
          change={{
            value: "12.3% from last month",
            trend: "up"
          }}
        />
        <StatsCard
          title="Ethics Cases"
          value="7"
          icon={Gavel}
          iconColor="text-red-800"
          iconBgColor="bg-red-100"
          change={{
            value: "3.6% from last month",
            trend: "down"
          }}
        />
        <StatsCard
          title="Monthly Revenue"
          value="₦3.2M"
          icon={BarChart4}
          iconColor="text-green-800"
          iconBgColor="bg-green-100"
          change={{
            value: "8.2% from last month",
            trend: "up"
          }}
        />
      </div>
      
      {/* Recent Activities and Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-xl font-semibold text-[#1E5631]">Recent Activities</h2>
            <a href="#" className="text-sm text-[#3D8361] hover:text-[#2F6649]">View All</a>
          </div>
          <div className="space-y-4">
            <ActivityItem
              icon={UserCircle}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              title="New member registration"
              description="Oluwaseun Johnson completed registration"
              time="2 hours ago"
            />
            <ActivityItem
              icon={FileSignature}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              title="SAR Application Approved"
              description="Lagos Central district project approved"
              time="Yesterday at 3:45 PM"
            />
            <ActivityItem
              icon={Calendar}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              title="Upcoming Event"
              description="Annual Urban Planning Conference"
              time="Starts on July 15, 2023"
            />
            <ActivityItem
              icon={TriangleAlert}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              title="Ethics Complaint Filed"
              description="New complaint against member #3421"
              time="3 days ago"
              className="border-b-0"
            />
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading text-xl font-semibold text-[#1E5631]">Upcoming Events</h2>
            <a href="#" className="text-sm text-[#3D8361] hover:text-[#2F6649]">View Calendar</a>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-medium">Annual Urban Planning Conference</h3>
              <p className="text-sm text-neutral-600">July 15-18, 2023</p>
              <p className="text-xs text-neutral-500">Sheraton Hotel, Abuja</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium">Professional Development Workshop</h3>
              <p className="text-sm text-neutral-600">August 5, 2023</p>
              <p className="text-xs text-neutral-500">NITP Headquarters</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <h3 className="font-medium">Executive Committee Meeting</h3>
              <p className="text-sm text-neutral-600">August 12, 2023</p>
              <p className="text-xs text-neutral-500">Virtual Meeting</p>
            </div>
            <div className="mt-4">
              <button className="w-full bg-[#1E5631] hover:bg-[#154525] text-white rounded-md py-2 text-sm font-medium transition">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Projects */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-semibold text-[#1E5631] mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            image="https://images.unsplash.com/photo-1551286923-c82d6a8ae079?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
            title="Abuja Smart City Initiative"
            category="Urban Development"
            categoryColor="bg-[#D8E9A8] text-[#1E5631]"
            description="A comprehensive urban renewal project focusing on sustainable infrastructure and smart technology integration."
            status="Completed: Mar 2023"
          />
          <ProjectCard
            image="https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
            title="Abuja Green Spaces Project"
            category="Public Space"
            categoryColor="bg-blue-100 text-blue-800"
            description="Revitalizing urban parks and creating interconnected green corridors throughout the capital city."
            status="In Progress"
          />
          <ProjectCard
            image="https://images.unsplash.com/photo-1530870110042-98b2cb110834?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500"
            title="Abuja Affordable Housing"
            category="Housing"
            categoryColor="bg-purple-100 text-purple-800"
            description="A mixed-use development with 500 affordable housing units and integrated commercial spaces."
            status="Proposed"
          />
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-semibold text-[#1E5631] mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLinkCard
            title="Submit Application"
            description="SAR or EIAR"
            icon={FileText}
            href="/applications"
            iconBgColor="bg-[#3D8361]"
          />
          <QuickLinkCard
            title="Report Ethics Issue"
            description="File a complaint"
            icon={Gavel}
            href="/ethics"
            iconBgColor="bg-red-500"
          />
          <QuickLinkCard
            title="Member Directory"
            description="Find colleagues"
            icon={Users}
            href="/members"
            iconBgColor="bg-blue-500"
          />
          <QuickLinkCard
            title="Update Profile"
            description="Edit your information"
            icon={UserCircle}
            href="/profile"
            iconBgColor="bg-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
