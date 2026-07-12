export default function Footer() {
  return (
    <footer className="border-t border-white/4 bg-[#0A0A0C] text-zinc-500 text-[11px] tracking-wider uppercase">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
          
          {/* Metadata Grid */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-zinc-400 font-medium font-mono text-xs mix-blend-screen">ALL SYSTEMS NOMINAL</span>
            </div>
            <div className="text-zinc-600">
              PLATFORM: <span className="text-zinc-400">MERN.CORE</span>
            </div>
            <div className="text-zinc-600">
              BUILD: <span className="text-zinc-400">v1.0.0-PROD</span>
            </div>
          </div>

          {/* Copyright Statement */}
          <div className="text-zinc-600 normal-case font-mono tracking-normal">
            &copy; {new Date().getFullYear()} CodeFusion. Inc.
          </div>
          
        </div>
      </div>
    </footer>
  );
}