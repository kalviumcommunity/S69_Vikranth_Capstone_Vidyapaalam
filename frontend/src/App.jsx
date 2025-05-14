


// import React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";

// import AppLayout from "./components/layout/AppLayout";
// import StudentLayout from "./layouts/StudentLayout";
// import TeacherLayout from "./layouts/TeacherLayout";
// import PrivateRoute from "./components/ui/PrivateRoute";

// // Public pages
// import Index from "./pages/Index";
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
//             <Route path="teacher-profile/:id" element={<TeacherProfile />} />
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

//         {/* Not Authorized */}
//         <Route path="/not-authorized" element={<NotAuthorized />} />

//         {/* No Match Route */}
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

// Public pages
import Index from "./pages/Index";
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
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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

        {/* Not Authorized */}
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* No Match Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
