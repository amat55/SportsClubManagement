import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Athletes } from '../pages/Athletes';
import { Payments } from '../pages/Payments';
import { Teams } from '../pages/Teams';
import { Attendance } from '../pages/Attendance';
import { Medical } from '../pages/Medical';
import { Shuttles } from '../pages/Shuttles';
import { Messaging } from '../pages/Messaging';

// PROTECTED ROUTE COMPONENT
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isAuthenticating } = useAuthStore();
    
    // Otomatik giriş arkaplanda deneniyorsa (isAuthenticating true ise) Login'e yönlendirme yapma, boş veya yükleniyor ekranı göster
    if (isAuthenticating) return <div className="h-screen w-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

export const AppRoutes = () => {
    return (
        <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ROUTES */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/athletes" element={<ProtectedRoute><Athletes /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/medical" element={<ProtectedRoute><Medical /></ProtectedRoute>} />
            <Route path="/shuttles" element={<ProtectedRoute><Shuttles /></ProtectedRoute>} />
            <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />

            {/* NOT FOUND */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
