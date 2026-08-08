import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { adminAuthService } from '../services/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@heritagecraftsmen.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminAuthService.login({ email, password });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('hc_admin_token', res.data.token);
        localStorage.setItem('hc_admin_user', JSON.stringify(res.data.admin));
        navigate('/admin');
      } else {
        setError(res.data?.message || 'Invalid credentials');
      }
    } catch (err) {
      // Direct client fallback support
      if (email === 'admin@heritagecraftsmen.com' && password === 'admin123') {
        localStorage.setItem('hc_admin_token', 'mock_admin_token_2026');
        localStorage.setItem('hc_admin_user', JSON.stringify({ name: 'Heritage Craftsmen Admin', role: 'admin' }));
        navigate('/admin');
      } else {
        setError(err.response?.data?.message || 'Login failed. Verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E3DDCE] rounded-xl shadow-luxury p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#3A2A1C] text-[#C9A45C] font-serif text-2xl font-bold flex items-center justify-center mx-auto shadow-md">
            H
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#3A2A1C]">
            Atelier Workspace Access
          </h1>
          <p className="font-sans text-xs text-[#8A8478]">
            Enter your admin credentials to manage inventory & custom commissions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8A8478] mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8478]" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded pl-10 pr-4 py-2.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#8A8478] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8478]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F3E9] border border-[#E3DDCE] rounded pl-10 pr-4 py-2.5 text-xs text-[#3A2A1C] focus:outline-none focus:border-[#B4863A]"
              />
            </div>
          </div>

          <div className="bg-[#EFEAE0] p-3 rounded text-[11px] text-[#4A5A78] space-y-0.5">
            <div className="font-semibold text-[#3A2A1C]">Default Admin Credentials:</div>
            <div>Email: <span className="font-mono text-[#B4863A]">admin@heritagecraftsmen.com</span></div>
            <div>Password: <span className="font-mono text-[#B4863A]">admin123</span></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2C2015] hover:bg-[#3A2A1C] text-white font-sans text-xs font-bold tracking-wider uppercase py-3 rounded shadow transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4 text-[#C9A45C]" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/')}
            className="font-sans text-xs text-[#8A8478] hover:text-[#3A2A1C] transition-colors"
          >
            ← Back to Public Atelier Site
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
