import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Academics } from './pages/Academics';
import { Admissions } from './pages/Admissions';
import { Faculty } from './pages/Faculty';
import { Facilities } from './pages/Facilities';
import { Gallery } from './pages/Gallery';
import { StudentLife } from './pages/StudentLife';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { Accessibility } from './pages/Accessibility';
import { NotFound } from './pages/NotFound';

// Existing Admin Pages
import { Login } from './admin/Login';
import { Dashboard } from './admin/Dashboard';
import { Enquiries } from './admin/Enquiries';
import { ContactEnquiries } from './admin/ContactEnquiries';
import { Courses } from './admin/Courses';
import { Faculty as AdminFaculty } from './admin/Faculty';
import { Facilities as AdminFacilities } from './admin/Facilities';
import { News as AdminNews } from './admin/News';
import { Events as AdminEvents } from './admin/Events';
import { Notices as AdminNotices } from './admin/Notices';
import { Calendar as AdminCalendar } from './admin/Calendar';
import { Settings as AdminSettings } from './admin/Settings';

// New Extended Admin CMS Modules
import { Pages as AdminPages } from './admin/Pages';
import { Banners as AdminBanners } from './admin/Banners';
import { PrincipalDesk as AdminPrincipalDesk } from './admin/PrincipalDesk';
import { Achievements as AdminAchievements } from './admin/Achievements';
import { StudentApplications as AdminStudentApplications } from './admin/StudentApplications';
import { Scholarships as AdminScholarships } from './admin/Scholarships';
import { Departments as AdminDepartments } from './admin/Departments';
import { Testimonials as AdminTestimonials } from './admin/Testimonials';
import { SeoSettings as AdminSeoSettings } from './admin/SeoSettings';
import { Notifications as AdminNotifications } from './admin/Notifications';
import { CommunicationHistory as AdminCommunicationHistory } from './admin/CommunicationHistory';
import { RolesPermissions as AdminRolesPermissions } from './admin/RolesPermissions';
import { AuditLogs as AdminAuditLogs } from './admin/AuditLogs';
import { Reports as AdminReports } from './admin/Reports';
import { BackupMaintenance as AdminBackupMaintenance } from './admin/BackupMaintenance';
import { AccountSettings as AdminAccountSettings } from './admin/AccountSettings';
import { ChatbotManagement as AdminChatbotManagement } from './admin/ChatbotManagement';
import { GalleryManagement as AdminGallery } from './admin/GalleryManagement';
import { NavbarMenu as AdminNavbarMenu } from './admin/NavbarMenu';
import { WhatsAppManagement } from './admin/WhatsAppManagement';

export function App() {
  return (
    <Routes>
      {/* Public Pages wrapped in PublicLayout */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="academics" element={<Academics />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="student-life" element={<StudentLife />} />
        <Route path="news" element={<News />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_CONTENT_EDITOR', 'ROLE_ADMISSION_STAFF', 'ROLE_STAFF']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Existing 11 Modules */}
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="contact-enquiries" element={<ContactEnquiries />} />
        <Route path="courses" element={<Courses />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="navbar-menu" element={<AdminNavbarMenu />} />

        {/* 15 New Extended Modules */}
        <Route path="pages" element={<AdminPages />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="principal-desk" element={<AdminPrincipalDesk />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="students" element={<AdminStudentApplications />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="seo" element={<AdminSeoSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="communication-history" element={<AdminCommunicationHistory />} />
        <Route path="roles" element={<AdminRolesPermissions />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="backup" element={<AdminBackupMaintenance />} />
        <Route path="account" element={<AdminAccountSettings />} />
        <Route path="chatbot" element={<AdminChatbotManagement />} />
        <Route path="whatsapp" element={<WhatsAppManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
