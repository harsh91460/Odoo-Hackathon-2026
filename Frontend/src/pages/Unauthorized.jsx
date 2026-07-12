import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
      
      
      <div className="max-w-md space-y-6 rounded-2xl border border-red-200 bg-white/40 p-8 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 ring-4 ring-red-500/10">
          <ShieldAlert className="h-10 w-10" />
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Access Denied
        </h1>
        
        <p className="text-slate-400">
          You do not have the required permissions to view this section. Please contact your administrator if you believe this is in error.
        </p>
        
        <div className="pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 text-sm font-semibold text-slate-900 transition-all shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
