import { useState } from "react";
import { Menu, X, Search, LogOut, ArrowRight } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-[#0A0A0C]/80 backdrop-blur-md text-zinc-100">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        
        {/* Left: Search input */}
        <div className="hidden md:flex items-center relative group">
          <Search size={14} className="absolute left-3 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-60 bg-white/2 hover:bg-white/4 focus:bg-white/6 border border-white/6 focus:border-white/20 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none transition-all placeholder:text-zinc-600"
          />
        </div>

        {/* Center: Clean Typography Logo */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-semibold tracking-[0.2em] uppercase text-white">
            CODEFUSION
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#docs" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
            Documentation
          </a>
          <div className="h-4 w-px bg-white/8" />
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors group">
            <LogOut size={13} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Toggle Trigger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-zinc-400 hover:text-white p-1 transition-colors"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/6 bg-[#0A0A0C] px-6 py-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center relative">
            <Search size={14} className="absolute left-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full bg-white/4 border border-white/6 rounded-lg pl-9 pr-4 py-2 text-xs outline-none text-zinc-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a href="#docs" className="flex items-center justify-center py-2.5 rounded-lg border border-white/6 bg-white/2 text-xs text-zinc-300">
              Documentation
            </a>
            <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rose-950/40 bg-rose-950/10 text-xs text-rose-400">
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}