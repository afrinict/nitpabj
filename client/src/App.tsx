import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import ComplaintPage from './pages/ComplaintPage';
import { SuccessPage } from './pages/SuccessPage';
import { AuthProvider } from './hooks/useAuth';
import { DashboardLayout } from './components/dashboard-layout';
import Dashboard from './pages/dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MembersDirectory } from './pages/MembersDirectory';
import { ExecutiveCommittee } from './pages/ExecutiveCommittee';
import { Ethics } from './pages/Ethics';
import Applications from './pages/applications';
import { Toaster } from 'sonner';
import MyProfile from './pages/MyProfile';
import Elearning from './pages/Elearning';
import CourseDetails from './pages/CourseDetails';
import Election from './pages/Election';
import CandidateNomination from './pages/CandidateNomination';
import ElectionResults from './pages/ElectionResults';
import AdminElectionDashboard from './pages/AdminElectionDashboard';
import Tools from './pages/Tools';
import Subscription from './pages/Subscription';
import Chat from './pages/Chat';
import Social from './pages/Social';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/:type" element={<RegisterPage />} />
            <Route path="/complaints/submit" element={<ComplaintPage />} />
            <Route path="/registration-success" element={<SuccessPage />} />
            <Route path="/complaint-submitted" element={<SuccessPage />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/members" element={
              <DashboardLayout>
                <MembersDirectory />
              </DashboardLayout>
            } />
            <Route path="/executive-committee" element={
              <DashboardLayout>
                <ExecutiveCommittee />
              </DashboardLayout>
            } />
            <Route path="/ethics" element={
              <DashboardLayout>
                <Ethics />
              </DashboardLayout>
            } />
            <Route path="/applications" element={
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            } />
            <Route path="/profile" element={
              <DashboardLayout>
                <MyProfile />
              </DashboardLayout>
            } />
            <Route path="/elearning" element={
              <DashboardLayout>
                <Elearning />
              </DashboardLayout>
            } />
            <Route path="/elearning/course/:courseId" element={
              <DashboardLayout>
                <CourseDetails />
              </DashboardLayout>
            } />
            <Route path="/election" element={
              <DashboardLayout>
                <Election />
              </DashboardLayout>
            } />
            <Route path="/election/nominate" element={
              <DashboardLayout>
                <CandidateNomination />
              </DashboardLayout>
            } />
            <Route path="/election/results" element={
              <DashboardLayout>
                <ElectionResults />
              </DashboardLayout>
            } />
            <Route path="/admin/election" element={
              <DashboardLayout>
                <AdminElectionDashboard />
              </DashboardLayout>
            } />
            <Route path="/tools" element={
              <DashboardLayout>
                <Tools />
              </DashboardLayout>
            } />
            <Route path="/subscription" element={
              <DashboardLayout>
                <Subscription />
              </DashboardLayout>
            } />
            <Route path="/chat" element={<Chat />} />
            <Route path="/social" element={
              <DashboardLayout>
                <Social />
              </DashboardLayout>
            } />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
