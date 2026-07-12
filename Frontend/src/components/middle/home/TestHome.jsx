import { useDispatch,useSelector } from "react-redux";
import React from 'react';

export default function DarkHeroSection() {
  const user = useSelector((state) => state.auth.userInfo);

  console.log("user info", user)

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-center relative overflow-hidden py-20">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <section className="relative max-w-7xl mx-auto px-6 text-center z-10 mb-20">
        {/* Banner Tag */}
        <div className="inline-flex items-center space-x-2 bg-gray-900/80 border border-gray-800 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-cyan-400 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>SYSTEM UPDATE V2.0 IS LIVE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15] mb-6">
          Architecting the Future of{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-teal-200 to-violet-500">
            Interactive Experiences
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A high-performance, dark-mode ecosystem optimized for next-generation platforms. Build fast, scale seamlessly, and dominate the digital landscape.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-cyan-500 to-violet-600 text-[#0b0c10] font-bold rounded-lg hover:opacity-90 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
            Get Started Free
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-gray-900/60 hover:bg-gray-800/80 text-gray-200 font-semibold rounded-lg border border-gray-800 transition-all flex items-center justify-center space-x-2">
            <span>Read Documentation</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Card 1 */}
        <div className="bg-linear-to-b from-gray-900/50 to-gray-950/50 border border-gray-800/80 p-8 rounded-2xl hover:border-cyan-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Ultrafast Response</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Engineered with extreme optimization for fluid, latency-free client streaming and UI interaction rendering.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-linear-to-b from-gray-900/50 to-gray-950/50 border border-gray-800/80 p-8 rounded-2xl hover:border-violet-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Secure Architecture</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Enterprise-grade shielding protocols keeping application structures and state engines perfectly synchronized.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-linear-to-b from-gray-900/50 to-gray-950/50 border border-gray-800/80 p-8 rounded-2xl hover:border-teal-500/40 transition-all duration-300 group">
          <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Granular Analytics</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Deep insights tracking layout usage patterns, interactive telemetry data, and network framework lifecycles.
          </p>
        </div>
      </section>
    </div>
  );
}