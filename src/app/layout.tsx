import "./globals.css";
import Link from "next/link";
import AuthGate from "../components/AuthGate";

export const metadata = {
  title: "PipeDesk",
  description: "PipeDesk — Multi-Industry CRM Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <AuthGate>
          <div className="min-h-screen flex">
            <aside className="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800">
              <div className="px-6 py-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">PD</div>
                  <div className="text-xl font-bold tracking-tight">PipeDesk</div>
                </div>
                <div className="text-sm text-slate-400 mt-1 ml-10">Multi-Industry CRM</div>
              </div>
              <nav className="flex-1 px-4 py-4 space-y-1 text-sm overflow-y-auto">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">General</div>
                <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>📊</span> Dashboard</Link>
                <Link href="/contacts" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>👥</span> Contacts</Link>
                <Link href="/pipeline" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>🔀</span> Pipeline</Link>
                <Link href="/tasks" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>✅</span> Tasks</Link>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Industry Pipelines</div>
                <Link href="/real-estate" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-blue-900/40 transition group"><span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">RE</span><span className="text-slate-300 group-hover:text-white transition">Real Estate</span></Link>
                <Link href="/insurance" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-emerald-900/40 transition group"><span className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">IN</span><span className="text-slate-300 group-hover:text-white transition">Insurance</span></Link>
                <Link href="/mortgage" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-violet-900/40 transition group"><span className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">ML</span><span className="text-slate-300 group-hover:text-white transition">Mortgage & Lending</span></Link>
                <Link href="/auto" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-red-900/40 transition group"><span className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">AU</span><span className="text-slate-300 group-hover:text-white transition">Automotive</span></Link>
                <Link href="/solar" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-yellow-900/40 transition group"><span className="w-6 h-6 rounded-md bg-yellow-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">SO</span><span className="text-slate-300 group-hover:text-white transition">Solar Energy</span></Link>
                <Link href="/financial" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-blue-900/40 transition group"><span className="w-6 h-6 rounded-md bg-blue-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">FI</span><span className="text-slate-300 group-hover:text-white transition">Financial Services</span></Link>
                <Link href="/legal" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-700/40 transition group"><span className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">LG</span><span className="text-slate-300 group-hover:text-white transition">Legal</span></Link>
                <Link href="/recruiting" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-indigo-900/40 transition group"><span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">RC</span><span className="text-slate-300 group-hover:text-white transition">Recruiting</span></Link>
                <Link href="/healthcare" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-cyan-900/40 transition group"><span className="w-6 h-6 rounded-md bg-cyan-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">HC</span><span className="text-slate-300 group-hover:text-white transition">Healthcare</span></Link>
                <Link href="/construction" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-orange-900/40 transition group"><span className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">CO</span><span className="text-slate-300 group-hover:text-white transition">Construction</span></Link>
                <Link href="/consulting" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-purple-900/40 transition group"><span className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">CN</span><span className="text-slate-300 group-hover:text-white transition">Consulting</span></Link>
                <Link href="/ecommerce" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-pink-900/40 transition group"><span className="w-6 h-6 rounded-md bg-pink-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">EC</span><span className="text-slate-300 group-hover:text-white transition">E-Commerce</span></Link>
                <Link href="/property-management" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-teal-900/40 transition group"><span className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">PM</span><span className="text-slate-300 group-hover:text-white transition">Property Mgmt</span></Link>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">Account</div>
                <Link href="/users" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>👤</span> Users</Link>
                <Link href="/settings" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition"><span>⚙️</span> Settings</Link>
                <Link href="/logout" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition text-red-400"><span>🚪</span> Logout</Link>
              </nav>
              <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500">PipeDesk v1 · 13 Industries · pipedesk.app</div>
            </aside>
            <main className="flex-1 overflow-auto">
              <div className="border-b border-slate-200 bg-white/80 backdrop-blur px-8 py-4">
                <div className="text-sm text-slate-500">PipeDesk / Workspace</div>
              </div>
              <div className="p-8">{children}</div>
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
