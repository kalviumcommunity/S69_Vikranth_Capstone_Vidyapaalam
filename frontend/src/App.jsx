
// import React, { useEffect } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";

// import AppLayout from "./components/layout/AppLayout";
// import StudentLayout from "./layouts/StudentLayout";
// import TeacherLayout from "./layouts/TeacherLayout";
// import PrivateRoute from "./components/ui/PrivateRoute";

// import { AuthProvider, useAuth } from "./contexts/AuthContext";
// import { TeacherProfileProvider } from "./contexts/TeacherProfileContext";
// import { SessionProvider } from "./contexts/SessionContext";
// import { StreamChatProvider } from "./contexts/StreamChatContext";
// import { StreamVideoProvider } from "./contexts/StreamVideoContext"; // <-- NEW IMPORT

// import Index from "./pages/index";
// import SkillsPage from "./pages/SkillsPage";
// import SkillDetailPage from "./pages/SkillDetailPage";
// import MentorsPage from "./pages/MentorsPage";
// import AboutPage from "./pages/AboutPage";
// import OnboardingPage from "./pages/onboarding/OnboardingPage";

// import StudentOverview from "./pages/student/StudentOverview";
// import FindTeacher from "./pages/student/FindTeacher";
// import TeacherProfile from "./pages/student/TeacherProfile";
// import BookSession from "./pages/student/BookSession";
// import Favorites from "./pages/student/Favorites";
// import StudentSettings from "./pages/student/StudentSettings";

// import TeacherOverview from "./pages/teacher/TeacherOverview";
// import TeacherRatings from "./pages/teacher/TeacherRatings";
// import TeacherAvailability from "./pages/teacher/TeacherAvailability";
// import TeacherProfileEdit from "./pages/teacher/TeacherProfileEdit";
// import TeacherSettings from "./pages/teacher/TeacherSettings";

// import ChatPage from "./pages/ChatPage";
// import VideoCallPage from "./pages/VideoCallPage"; // <-- NEW IMPORT

// import NotAuthorized from "./pages/NotAuthorized";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const AppContent = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (!loading && user) {
//       if (location.pathname === '/') {
//         if (user.role === 'student') {
//           navigate('/student/overview', { replace: true });
//         } else if (user.role === 'teacher') {
//           navigate('/teacher/overview', { replace: true });
//         }
//       }
//     }
//   }, [user, loading, navigate, location.pathname]);

//   return (
//     <Routes>
//       <Route element={<AppLayout />}>
//         <Route path="/" element={<Index />} />
//         <Route path="/skills" element={<SkillsPage />} />
//         <Route path="/skills/:id" element={<SkillDetailPage />} />
//         <Route path="/teachers" element={<MentorsPage />} />
//         <Route path="/about" element={<AboutPage />} />
//         <Route path="/onboarding" element={<OnboardingPage />} />
//       </Route>

//       <Route element={<PrivateRoute roles={["student"]} />}>
//         <Route path="/student" element={<StudentLayout />}>
//           <Route index element={<StudentOverview />} />
//           <Route path="overview" element={<StudentOverview />} />
//           <Route path="find-teacher" element={<FindTeacher />} />
//           <Route path="teacher-profile/:id" element={<TeacherProfile />} />
//           <Route path="teacher/:id" element={<TeacherProfile />} />
//           <Route path="book-session/:teacherId" element={<BookSession />} />
//           <Route path="favorites" element={<Favorites />} />
//           <Route path="settings" element={<StudentSettings />} />
//           <Route path="chat/:recipientId" element={<ChatPage />} />
//         </Route>
//       </Route>

//       <Route element={<PrivateRoute roles={["teacher"]} />}>
//         <Route path="/teacher" element={<TeacherLayout />}>
//           <Route index element={<TeacherOverview />} />
//           <Route path="overview" element={<TeacherOverview />} />
//           <Route path="ratings" element={<TeacherRatings />} />
//           <Route path="availability" element={<TeacherAvailability />} />
//           <Route path="profile" element={<TeacherProfileEdit />} />
//           <Route path="profile/edit" element={<TeacherProfileEdit />} />
//           <Route path="settings" element={<TeacherSettings />} />
//           <Route path="chat/:recipientId" element={<ChatPage />} />
//         </Route>
//       </Route>

//       {/* NEW: Video call route */}
//       <Route element={<PrivateRoute roles={["student", "teacher"]} />}>
//         <Route path="/call/:callId" element={<VideoCallPage />} />
//       </Route>

//       <Route path="/not-authorized" element={<NotAuthorized />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Toaster />
//       <BrowserRouter>
//         <AuthProvider>
//           <SessionProvider>
//             <StreamChatProvider>
//               <StreamVideoProvider> {/* <-- NEW PROVIDER */}
//                 <TeacherProfileProvider>
//                   <AppContent />
//                 </TeacherProfileProvider>
//               </StreamVideoProvider>
//             </StreamChatProvider>
//           </SessionProvider>
//         </AuthProvider>
//       </BrowserRouter>
//     </QueryClientProvider>
//   );
// };

// export default App;




import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./components/layout/AppLayout";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import PrivateRoute from "./components/ui/PrivateRoute";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TeacherProfileProvider } from "./contexts/TeacherProfileContext";
import { SessionProvider } from "./contexts/SessionContext";
import { StreamChatProvider } from "./contexts/StreamChatContext";
import { StreamVideoProvider } from "./contexts/StreamVideoContext"; // <-- NEW IMPORT

import Index from "./pages/index";
import SkillsPage from "./pages/SkillsPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import MentorsPage from "./pages/MentorsPage";
import AboutPage from "./pages/AboutPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

import StudentOverview from "./pages/student/StudentOverview";
import FindTeacher from "./pages/student/FindTeacher";
import TeacherProfile from "./pages/student/TeacherProfile";
import BookSession from "./pages/student/BookSession";
import Favorites from "./pages/student/Favorites";
import StudentSettings from "./pages/student/StudentSettings";

import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherRatings from "./pages/teacher/TeacherRatings";
import TeacherAvailability from "./pages/teacher/TeacherAvailability";
import TeacherProfileEdit from "./pages/teacher/TeacherProfileEdit";
import TeacherSettings from "./pages/teacher/TeacherSettings";

import ChatPage from "./pages/ChatPage";
import VideoCallPage from "./pages/VideoCallPage"; // <-- NEW IMPORT

import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === '/') {
        if (user.role === 'student') {
          navigate('/student/overview', { replace: true });
        } else if (user.role === 'teacher') {
          navigate('/teacher/overview', { replace: true });
        }
      }
    }
  }, [user, loading, navigate, location.pathname]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:id" element={<SkillDetailPage />} />
        <Route path="/teachers" element={<MentorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>

      <Route element={<PrivateRoute roles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentOverview />} />
          <Route path="overview" element={<StudentOverview />} />
          <Route path="find-teacher" element={<FindTeacher />} />
          <Route path="teacher-profile/:id" element={<TeacherProfile />} />
          <Route path="teacher/:id" element={<TeacherProfile />} />
          <Route path="book-session/:teacherId" element={<BookSession />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="chat/:recipientId" element={<ChatPage />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherOverview />} />
          <Route path="overview" element={<TeacherOverview />} />
          <Route path="ratings" element={<TeacherRatings />} />
          <Route path="availability" element={<TeacherAvailability />} />
          <Route path="profile" element={<TeacherProfileEdit />} />
          <Route path="profile/edit" element={<TeacherProfileEdit />} />
          <Route path="settings" element={<TeacherSettings />} />
          <Route path="chat/:recipientId" element={<ChatPage />} />
        </Route>
      </Route>

      {/* NEW: Video call route */}
      <Route element={<PrivateRoute roles={["student", "teacher"]} />}>
        <Route path="/call/:callId" element={<VideoCallPage />} />
      </Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <SessionProvider>
            <StreamChatProvider>
              <StreamVideoProvider>
                <TeacherProfileProvider>
                  <AppContent />
                </TeacherProfileProvider>
              </StreamVideoProvider>
            </StreamChatProvider>
          </SessionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
