
// // src/App.jsx
// import React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";

// import AppLayout from "./components/layout/AppLayout";
// import StudentLayout from "./layouts/StudentLayout";
// import TeacherLayout from "./layouts/TeacherLayout";
// import PrivateRoute from "./components/ui/PrivateRoute";

// // Public pages
// import Index from "./pages/index";
// import SkillsPage from "./pages/SkillsPage";
// import SkillDetailPage from "./pages/SkillDetailPage";
// import MentorsPage from "./pages/MentorsPage";
// import AboutPage from "./pages/AboutPage";
// import OnboardingPage from "./pages/onboarding/OnboardingPage";

// // Student pages
// import StudentOverview from "./pages/student/StudentOverview";
// import FindTeacher from "./pages/student/FindTeacher";
// import TeacherProfile from "./pages/student/TeacherProfile";
// import BookSession from "./pages/student/BookSession";
// import Favorites from "./pages/student/Favorites";
// import StudentSettings from "./pages/student/StudentSettings";
// import ChatPage from "./pages/student/ChatPage";

// // Teacher pages
// import TeacherOverview from "./pages/teacher/TeacherOverview";
// import TeacherRatings from "./pages/teacher/TeacherRatings";
// import TeacherAvailability from "./pages/teacher/TeacherAvailability";
// import TeacherProfileEdit from "./pages/teacher/TeacherProfileEdit";
// import TeacherSettings from "./pages/teacher/TeacherSettings";

// // Authorization feedback
// import NotAuthorized from "./pages/NotAuthorized";

// // 404
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <Toaster />
//     <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//       <Routes>
//         {/* Public Routes */}
//         <Route element={<AppLayout />}>
//           <Route path="/" element={<Index />} />
//           <Route path="/skills" element={<SkillsPage />} />
//           <Route path="/skills/:id" element={<SkillDetailPage />} />
//           <Route path="/teachers" element={<MentorsPage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/onboarding" element={<OnboardingPage />} />
//         </Route>

//         {/* Protected Student Routes */}
//         <Route element={<PrivateRoute roles={["student"]} />}>
//           <Route path="/student" element={<StudentLayout />}>
//             <Route index element={<StudentOverview />} />
//             <Route path="overview" element={<StudentOverview />} />
//             <Route path="find-teacher" element={<FindTeacher />} />

//             {/* keep the existing route */}
//             <Route path="teacher-profile/:id" element={<TeacherProfile />} />
//             {/* add this alias so /student/teacher/:id also works */}
//             <Route path="teacher/:id" element={<TeacherProfile />} />

//             <Route path="book-session/:teacherId" element={<BookSession />} />
//             <Route path="favorites" element={<Favorites />} />
//             <Route path="settings" element={<StudentSettings />} />
//             <Route path="chat/:teacherId" element={<ChatPage />} />
//           </Route>
//         </Route>

//         {/* Protected Teacher Routes */}
//         <Route element={<PrivateRoute roles={["teacher"]} />}>
//           <Route path="/teacher" element={<TeacherLayout />}>
//             <Route index element={<TeacherOverview />} />
//             <Route path="overview" element={<TeacherOverview />} />
//             <Route path="ratings" element={<TeacherRatings />} />
//             <Route path="availability" element={<TeacherAvailability />} />
//             <Route path="profile" element={<TeacherProfileEdit />} />
//             <Route path="profile/edit" element={<TeacherProfileEdit />} />
//             <Route path="settings" element={<TeacherSettings />} />
//           </Route>
//         </Route>

//         <Route path="/not-authorized" element={<NotAuthorized />} />

//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   </QueryClientProvider>
// );

// export default App;




// src/App.jsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

import AppLayout from "./components/layout/AppLayout";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import PrivateRoute from "./components/ui/PrivateRoute";

// Contexts
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // Import your AuthProvider
import { TeacherProfileProvider } from "./contexts/TeacherProfileContext"; // Import your TeacherProfileProvider

// Public pages
import Index from "./pages/index";
import SkillsPage from "./pages/SkillsPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import MentorsPage from "./pages/MentorsPage";
import AboutPage from "./pages/AboutPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Student pages
import StudentOverview from "./pages/student/StudentOverview";
import FindTeacher from "./pages/student/FindTeacher";
import TeacherProfile from "./pages/student/TeacherProfile";
import BookSession from "./pages/student/BookSession";
import Favorites from "./pages/student/Favorites";
import StudentSettings from "./pages/student/StudentSettings";
import ChatPage from "./pages/student/ChatPage";

// Teacher pages
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherRatings from "./pages/teacher/TeacherRatings";
import TeacherAvailability from "./pages/teacher/TeacherAvailability";
import TeacherProfileEdit from "./pages/teacher/TeacherProfileEdit";
import TeacherSettings from "./pages/teacher/TeacherSettings";

// Authorization feedback
import NotAuthorized from "./pages/NotAuthorized";

// 404
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (

   const { user, loading } = useAuth();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // This useEffect will run when user or loading state changes
  useEffect(() => {
    if (!loading && user) {
      // If user is loaded and logged in, redirect them from the root if they land there
      if (location.pathname === '/') { // Check if they are on the root path
        if (user.role === 'student') {
          navigate('/student/overview', { replace: true });
        } else if (user.role === 'teacher') {
          navigate('/teacher/overview', { replace: true });
        }
      }
    }
  }, [user, loading, navigate, location.pathname]);


  
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* AuthProvider should wrap everything that needs authentication state */}
      <AuthProvider>
        {/* TeacherProfileProvider should wrap the parts of the app that need teacher profile data */}
        {/* Typically, this would be the protected teacher routes, but wrapping the whole app works too */}
        <TeacherProfileProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/skills/:id" element={<SkillDetailPage />} />
              <Route path="/teachers" element={<MentorsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Protected Student Routes */}
            <Route element={<PrivateRoute roles={["student"]} />}>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<StudentOverview />} />
                <Route path="overview" element={<StudentOverview />} />
                <Route path="find-teacher" element={<FindTeacher />} />

                {/* keep the existing route */}
                <Route path="teacher-profile/:id" element={<TeacherProfile />} />
                {/* add this alias so /student/teacher/:id also works */}
                <Route path="teacher/:id" element={<TeacherProfile />} />

                <Route path="book-session/:teacherId" element={<BookSession />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="settings" element={<StudentSettings />} />
                <Route path="chat/:teacherId" element={<ChatPage />} />
              </Route>
            </Route>

            {/* Protected Teacher Routes */}
            <Route element={<PrivateRoute roles={["teacher"]} />}>
              <Route path="/teacher" element={<TeacherLayout />}>
                <Route index element={<TeacherOverview />} />
                <Route path="overview" element={<TeacherOverview />} />
                <Route path="ratings" element={<TeacherRatings />} />
                <Route path="availability" element={<TeacherAvailability />} />
                <Route path="profile" element={<TeacherProfileEdit />} />
                <Route path="profile/edit" element={<TeacherProfileEdit />} />
                <Route path="settings" element={<TeacherSettings />} />
              </Route>
            </Route>

            <Route path="/not-authorized" element={<NotAuthorized />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TeacherProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
