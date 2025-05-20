import { motion } from 'framer-motion';
import { ImageSlider } from '../components/HomePage/ImageSlider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Login from '../components/HomePage/Login';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">NITP</h1>
          <Login />
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative">
          <ImageSlider />
        </section>

        {/* Welcome Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the Nigerian Institute of Town Planners
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The Nigerian Institute of Town Planners (NITP) is the professional body for town planners in Nigeria. 
                We are dedicated to promoting sustainable urban development and professional excellence in town planning.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="executives">Executives</TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Applications</h2>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Application cards will go here */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Title</CardTitle>
                      <CardDescription>Application description goes here</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Application details and status</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Events</h2>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Event
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Event cards will go here */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Title</CardTitle>
                      <CardDescription>Event date and location</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Event details and registration status</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="executives" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Executives</h2>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Executive
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Executive cards will go here */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Executive Name</CardTitle>
                      <CardDescription>Position and Department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Executive details and contact information</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Submit Complaint Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Have a Complaint?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                We are here to help. Submit your complaint and we will address it promptly.
              </p>
              <motion.a
                href="/submit-complaint"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Submit Complaint
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage; 