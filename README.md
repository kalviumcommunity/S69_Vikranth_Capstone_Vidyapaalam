# S69_Vikranth_Capstone_Vidyapaalam 

## Project Idea Brief  
The Teach & Learn Platform is a web application designed to connect educators with learners, facilitating seamless interaction, scheduling, and knowledge sharing. The platform features two primary user roles: Teachers and Learners. Teachers can create profiles showcasing their expertise, while learners can search for educators based on skills, location, or availability. Key features include calendar integration, real-time messaging, reviews and ratings, and payment integration for paid sessions.  

## Key Features  
- **User Roles**: Teachers and Learners.  
- **Profile Creation**: Users create profiles with skills, interests, and availability.  
- **Search and Match**: Learners search for teachers by skills, location, or availability.  
- **Scheduling**: Integrated calendar for booking sessions.  
- **Communication**: In-app messaging and video calls (WebRTC).  
- **Reviews and Ratings**: Learners rate and review teachers.  
- **Payment Integration**: Stripe or Razorpay for paid sessions.  
- **Admin Panel**: Manage users, sessions, and disputes.  

## Technology Stack  
| Category               | Tools                                                                 |  
|------------------------|-----------------------------------------------------------------------|  
| **Frontend**           | React.js, Vite, Tailwind CSS                                          |  
| **Backend**            | Node.js, Express.js                                                   |  
| **Database**           | MongoDB                                                               |  
| **Authentication**     | JWT, OAuth (Google)                                                   |  
| **Real-Time Communication** | Socket.IO, WebRTC                                             |  
| **Payment Integration**| Stripe or Razorpay                                                    |  
| **Calendar Integration** | Google Calendar API or React Big Calendar                           |  
| **Deployment**         | Heroku/Render (Backend), Vercel/Netlify (Frontend)                    |  

## 20-Day Roadmap  
| Day | Tasks                                                                 | Submissions                                  |  
|-----|-----------------------------------------------------------------------|---------------------------------------------|  
| 1   | Project Idea + Plan, GitHub Setup, Low-Fidelity Design                | Project Idea + Plan, Low-Fidelity Design    |  
| 2   | High-Fidelity Design                                                  | High-Fidelity Design                        |  
| 3   | Backend Setup, GET API                                                | Database Schema Created, GET API Used       |  
| 4   | POST API, PUT API                                                     | POST API Used, PUT API Used                  |  
| 5   | Database Read/Write, Relationships                                   | Database Read/Write, Relationships Implemented |  
| 6   | Initialize React App, Basic Components                               | React App Initialized, Frontend Components  |  
| 7   | Hero Section, Authentication Pages                                   | Matching Design and End State               |  
| 8   | Teacher and Learner Dashboards                                       | Frontend Components in React                |  
| 9   | Teacher and Learner Profile Pages                                    | Frontend Components in React                |  
| 10  | Search and Filter Page                                               | Frontend Components in React                |  
| 11  | Session Booking and Calendar Pages                                   | Frontend Components in React                |  
| 12  | Messaging and Reviews Pages                                          | Frontend Components in React                |  
| 13  | File Upload, Authentication                                          | File Upload, Username/Password Auth         |  
| 14  | Third-Party Authentication, Update/Delete Functionality              | Google Auth, CRUD Operations                |  
| 15  | Video Call Interface Integration                                     | WebRTC Implementation                       |  
| 16  | Testing: UI/UX, API Endpoints                                        | Bug Fixes, Test Reports                     |  
| 17  | Payment Gateway Testing                                              | Stripe/Razorpay Integration Verified        |  
| 18  | Admin Panel Development                                              | Admin Dashboard Implemented                 |  
| 19  | Deployment Preparation                                               | Backend/API Deployed on Render/Heroku       |  
| 20  | Final Deployment, Documentation                                      | Frontend Deployed, Final README.md          |  

## GitHub Project Management  
- Track tasks using GitHub Projects with columns: **To Do**, **In Progress**, **Done**.  
- Use milestones for phases: Design, Backend, Frontend, Testing, Deployment.  

## Detailed Page Descriptions  
### 1. Hero Section  
**Purpose**: Introduce the platform and encourage user engagement.  
**Design**:  
- Background: High-quality video of teachers/learners interacting online.  
- Tagline: "Learn from the best, anytime, anywhere" (bold white text).  
- CTA Buttons: Orange buttons for "Sign Up as Teacher" and "Sign Up as a Learner."  
- Brief Description: "A platform to connect passionate teachers with eager learners" (light grey text).  

### 2. Authentication (Login & Signup)  
**Purpose**: User registration/login.  
**Design**:  
- Tabs: "Login" (blue) and "Signup" (orange when active).  
- Social Login: Google button (light grey with blue icon).  
- Role Selection: Onboarding page for teachers and learners.
- Form: White fields with light grey placeholders, orange submit button.  

### 3. Teacher Dashboard  
**Purpose**: Manage sessions, earnings, and availability.  
**Design**:  
- Sidebar: Light grey with icons (Dashboard, Sessions, Calendar, Profile, Reviews).  
- Main Section: Upcoming Sessions, Availability Calendar, Earnings Summary, Reviews.  

### 4. Learner Dashboard  
**Purpose**: Track bookings and discover teachers.  
**Design**:  
- Sidebar: Light grey with icons (Dashboard, Bookings, Find Teachers, Reviews).  
- Main Section: Booked Sessions, Recommended Teachers, Search Bar.  

### 5. Teacher Profile Page  
**Purpose**: Showcase teacher details and allow bookings.  
**Design**:  
- Profile Picture: Large blue circular image.  
- Skills: Blue tags.  
- Availability Calendar: Light grey with color-coded slots.  

### 6. Learner Profile Page  
**Purpose**: Display learner’s interests and history.  
**Design**:  
- Interests: Blue tags.  
- Session History: White cards with blue text.  
- Favorite Teachers: Orange cards with blue text.  

### 7. Search & Filter Page  
**Purpose**: Find teachers by skill/location.  
**Design**:  
- Search Bar: White with light grey placeholder.  
- Filters: Light grey sidebar with blue checkboxes.  
- Results: Grid of orange teacher cards.  

### 8. Session Booking Page  
**Purpose**: Book sessions with teachers.  
**Design**:  
- Teacher Summary: Blue card with profile picture and rating.  
- Calendar: Light grey with blue/orange slots.  
- Session Type Toggle: "Video Call" (blue) or "Offline Meetup" (orange).  

### 9. Calendar Page  
**Purpose**: Manage schedules and sessions.  
**Design**:  
- Full-Screen Calendar: Light grey with color-coded slots.  
- Sync Button: Blue button to sync with Google Calendar.  

### 10. Messaging Page  
**Purpose**: Real-time communication.  
**Design**:  
- Chat Window: Blue/orange message bubbles.  
- File Attachments: Blue icons for PDFs/images.  

### 11. Reviews & Ratings Page  
**Purpose**: Rate and review teachers.  
**Design**:  
- Reviews: White cards with orange stars.  
- Star Rating: Orange interactive stars.  

### 12. Payment Page  
**Purpose**: Handle session payments.  
**Design**:  
- Session Summary: Blue card with details.  
- Payment Options: White cards with blue icons.  

### 13. Admin Panel  
**Purpose**: Manage users and content.  
**Design**:  
- Stats: Blue cards (users, sessions, earnings).  
- Moderation Tools: White cards with blue buttons.  

### 14. Video Call Interface Page  
**Purpose**: Host live skill-sharing sessions.  
**Design**:  
- Video Grid: Teacher/learner in large window, participants in thumbnails.  
- Controls: Orange "End Call" button, blue icons for screen share/mute.  

## Conclusion  
The Teach & Learn Platform is a comprehensive solution designed to streamline knowledge-sharing between educators and learners. By integrating essential features such as scheduling, communication, authentication, and payment, the platform ensures a seamless experience for both teachers and students. Following the structured 20-day roadmap, this project will be efficiently executed from design to deployment, ensuring a robust and scalable application.