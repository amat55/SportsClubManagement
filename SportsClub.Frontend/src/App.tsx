import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import api from './services/api';

function App() {
  const { checkAuth, isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const res = await api.post('/auth/login', {
          email: 'admin@sportsclub.com',
          password: 'Admin123!'
        });
        if (res.data.isSuccess) {
          useAuthStore.getState().login(res.data.token);
        } else {
          useAuthStore.setState({ isAuthenticating: false });
        }
      } catch (error) {
        console.error('Otomatik giriş başarısız oldu:', error);
        useAuthStore.setState({ isAuthenticating: false });
      }
    };

    if (!localStorage.getItem('token')) {
      autoLogin();
    } else {
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-primary-600 font-bold text-xl cursor-pointer" onClick={() => window.location.href = '/'}>SportsClub Plus</h1>
              <div className="hidden md:flex space-x-4">
                <a href="/" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Gösterge Paneli</a>
                <a href="/athletes" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Sporcular</a>
                <a href="/teams" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Takımlar & Branşlar</a>
                <a href="/attendance" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Yoklama</a>
                <a href="/medical" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Gelişim Takibi</a>
                <a href="/shuttles" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Servisler</a>
                <a href="/messaging" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Mesajlar</a>
                <a href="/payments" className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors">Muhasebe</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-primary-500 font-medium capitalize">{(user?.roles || [])[0]}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'S'}
              </div>
              <button onClick={logout} className="text-sm bg-gray-50 px-3 py-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-200">Çıkış Yap</button>
            </div>
          </div>
        </nav>
      )}

      <main className="min-h-screen bg-background">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
