import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from './Toast';
import { CardSkeleton } from './Skeleton';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      showToast('Access denied.', 'error');
    }
  }, [loading, user, isAdmin, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // IF user is not logged in → redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // IF user is logged in AND role != "admin" → redirect to /dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // IF user is logged in AND role == "admin" → allow access
  return <>{children}</>;
};
