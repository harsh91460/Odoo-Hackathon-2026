import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // During the hackathon, bypass real auth until your backend is ready.
    // This instantly routes us to the dashboard.
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden">
      
      
      <div className="hidden md:flex w-1/2 bg-[#D9DDF0] text-gray-900 flex-col justify-center px-16 lg:px-32 relative">
        <div className="mb-12">
          
          <div className="w-12 h-12 bg-primary rounded-md mb-4 grid grid-cols-3 gap-1 p-1">
             {[...Array(9)].map((_, i) => <div key={i} className="bg-white rounded-sm opacity-80"></div>)}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">TransitOps</h1>
          <p className="text-sm text-gray-600 font-medium">Smart Transport Operations Platform</p>
        </div>

        <h3 className="font-semibold text-lg mb-4 mt-8">One login, four roles:</h3>
        <ul className="space-y-3 text-sm font-medium text-gray-700">
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Fleet Manager</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Dispatcher</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Safety Officer</li>
          <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Financial Analyst</li>
        </ul>
        
        <p className="absolute bottom-8 text-xs text-gray-500 font-medium tracking-wider">
          TRANSITOPS © 2026 • RBAC ENABLED
        </p>
      </div>

      {/* Right Side - Form (Dark Mode) */}
      <div className="w-full md:w-1/2 bg-background text-white flex flex-col justify-center px-8 sm:px-16 lg:px-32">
        <div className="max-w-sm w-full mx-auto">
          
          <div className="mb-8 border border-gray-700 p-4 rounded bg-white/5 inline-block w-full">
            <h2 className="text-2xl font-semibold mb-1 tracking-tight">Sign in to your account</h2>
            <p className="text-gray-400 text-xs">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest font-semibold">Email</label>
              <input
                type="email"
                defaultValue="raven.k@transitops.in"
                className="w-full bg-panel border border-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest font-semibold">Password</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full bg-panel border border-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] text-gray-400 mb-1.5 uppercase tracking-widest font-semibold">Role (RBAC)</label>
              <select className="w-full bg-panel border border-border rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                <option>Dispatcher</option>
                <option>Fleet Manager</option>
                <option>Safety Officer</option>
                <option>Financial Analyst</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4 rounded bg-panel border-border" defaultChecked />
                Remember me
              </label>
              <button type="button" className="text-xs text-secondary hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#B35600] hover:bg-primary text-white font-medium py-2.5 rounded transition-colors mt-2 text-sm shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-12 text-[10px] text-gray-500 leading-relaxed border-t border-border pt-6">
            <p className="mb-2">Access is scoped by role after login:</p>
            <ul className="space-y-1">
              <li>• Fleet Manager → Fleet, Maintenance</li>
              <li>• Dispatcher → Dashboard, Trips</li>
              <li>• Safety Officer → Drivers, Compliance</li>
              <li>• Financial Analyst → Fuel & Expenses, Analytics</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}