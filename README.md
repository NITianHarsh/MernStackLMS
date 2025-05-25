# 🧠 Full-Stack Course Platform

A full-featured web application built for managing and consuming online courses. This platform supports both **Instructor** and **Student** roles, with secure authentication, course creation, video streaming, and Razorpay-based payments.


## 🔧 Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT
- **Payments:** Razorpay SDK
- **Styling:** Tailwind CSS / CSS Modules , shadcn ui
- **Proctoring + Timer:** Custom logic for fullscreen/tab tracking, Pomodoro-based exam flow
- **Doubt Sessions:** Zoom API integration for live sessions, in-app notifications, and real-time scheduling with future-session filtering

## 🚀 Features

### 🔐 Authentication System
- Secure login and signup pages built with reusable form components.
- Backend logic includes models, controllers, and routes for user auth.
- Full integration between frontend and backend auth system.


### 🔒 Protected Routes (Route Guard)
- Ensures only authenticated users can access certain pages like dashboards.


### 👨‍🏫 Instructor Functionality ********************

#### Instructor Dashboard UI
- Sidebar navigation and dashboard layout for instructors.

#### Course Management
- Instructors can create new courses using dedicated forms.
- Courses can include multiple video lectures.

#### Video Upload & Playback
- Supports video upload with lecture-wise management.
- Embedded video player for course lectures.

#### Course Editing and Lecture Management
- Edit course content and delete specific lectures.
- Bulk upload feature for adding multiple lectures at once.

#### Dashboard Overview
- Final polished instructor dashboard with analytics and course views.

 #### Exam Creation & Management 
-Create two types of exams:

-Discount Exam: Students get a course discount upon passing.

-Practice Exam: Timed 30-minute mock test for preparation.

-Set questions, time duration, pass criteria, and exam rules.

-Mark exam as active/inactive (for scheduling).

-Update exams anytime.

#### Doubt Clearing Sessions
-Instructors can schedule live doubt-clearing sessions using the Zoom API.

-Only sessions scheduled after the current time are visible in the instructor dashboard.

-Manage session details like topic, timing, and Zoom link within the course panel.

-Sessions are automatically hidden once the scheduled time has passed.


### 🎓 Student Functionality *************************

#### Student Homepage and Navigation
- Clean header with intuitive navigation.
- Engaging homepage with featured content.

#### Course Listings and Details
- Browse available courses and view course detail pages.

#### Payment and Enrollment
-Purchase course via Razorpay (discounts applied if exam passed).
-Access purchased courses in "My Courses" section.

#### My Courses and Progress Tracking
- View enrolled courses and track progress through completed lectures.

#### Exam Types
Discount Exam: Unlocks course discounts upon passing.
Practice Exam: 30-minute test to simulate real exam.

#### Anti-Cheating Mechanisms
Tab switch detection: Instant warning or auto-submission.
Fullscreen enforcement: Exam starts only in fullscreen mode.
Keyboard lock: Disables common keys (Alt, F12, Ctrl+C/V).
Context menu disabled: Right-click blocked.
Copy/paste disabled.

#### Results and Feedback
Instant scorecard on submission.
View correct answers (if allowed by instructor).
Leaderboard showing top performers for the course exam.

#### Doubt Clearing Sessions
-Students receive in-app notifications when an instructor schedules a new doubt-clearing session.

-Each purchased course includes an "Ask Doubt" button, allowing students to submit queries directly to instructors.

-Students can view upcoming doubt sessions with topic, time, and Zoom join link inside the course.

-Join sessions securely via integrated Zoom, only if enrolled in the respective course.

####  Pomodoro Timer Integration
Boosts student focus and productivity.

 Key Features:
Built-in Pomodoro Timer with customizable durations.
Default cycle: 25 minutes focus + 5 minutes break.
Auto-switching between focus and break intervals.
Clear visual countdown.

