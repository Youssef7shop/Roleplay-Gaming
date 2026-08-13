import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { WhitelistApply } from './pages/WhitelistApply';
import { WhitelistView } from './pages/WhitelistView';

import { Booking } from './pages/Booking';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminApplicationDossier } from './pages/admin/AdminApplicationDossier';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminControl } from './pages/admin/AdminControl';
import { AdminLogs } from './pages/admin/AdminLogs';
import { ADMIN_ROUTE, ADMIN_ROUTES } from './config/constants';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
            <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />

            {/* Authenticated Player Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
            <Route path="/whitelist/apply" element={<ProtectedRoute><MainLayout><WhitelistApply /></MainLayout></ProtectedRoute>} />
            <Route path="/whitelist/application" element={<ProtectedRoute><MainLayout><WhitelistView /></MainLayout></ProtectedRoute>} />

            {/* Private Admin Routes (/admin-panel) */}
            <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.APPLICATIONS} element={<AdminRoute><AdminLayout><AdminApplications /></AdminLayout></AdminRoute>} />
            <Route path={`${ADMIN_ROUTES.APPLICATIONS}/:id`} element={<AdminRoute><AdminLayout><AdminApplicationDossier /></AdminLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.USERS} element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.CONTROL} element={<AdminRoute><AdminLayout><AdminControl /></AdminLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.LOGS} element={<AdminRoute><AdminLayout><AdminLogs /></AdminLayout></AdminRoute>} />
            <Route path={ADMIN_ROUTES.SETTINGS} element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />

            {/* Old /admin route redirects to /admin-panel */}
            <Route path="/admin/*" element={<Navigate to={ADMIN_ROUTE} replace />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
