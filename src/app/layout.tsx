import "./globals.css";
import Link from "next/link";
import AuthGate from "../components/AuthGate";

export const metadata = {
  title: "TerryCRM",
  description: "TerryCRM Core Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <AuthGate>
          <div className="min-h-screen flex">
            <aside className="w-72 bg-slate-950 text-white flex flex-col border-r border-slate-800">
              <div className="px-6 py-6 border-b border-slate-800">
                <div className="text-2xl font-bold tracking-tight">TerryCRM</div>
                <div className="text-sm text-slate-400 mt-1">
                  Multi-Industry CRM Platform
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 text-sm overflow-y-auto">

                {/* Main nav */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">
                  General
                </div>
                <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">📊</span> Dashboard
                </Link>
                <Link href="/contacts" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">👥</span> Contacts
                </Link>
                <Link href="/pipeline" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">🔀</span> Pipeline
                </Link>
                <Link href="/tasks" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">✅</span> Tasks
                </Link>

                {/* Industry pipelines */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">
                  Industry Pipelines
                </div>

                <Link href="/real-estate" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-blue-900/40 transition group">
                  <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">RE</span>
                  <span className="text-slate-300 group-hover:text-white transition">Real Estate</span>
                </Link>

                <Link href="/insurance" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-emerald-900/40 transition group">
                  <span className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">IN</span>
                  <span className="text-slate-300 group-hover:text-white transition">Insurance</span>
                </Link>

                <Link href="/mortgage" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-violet-900/40 transition group">
                  <span className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">ML</span>
                  <span className="text-slate-300 group-hover:text-white transition">Mortgage & Lending</span>
                </Link>

                {/* Account */}
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2">
                  Account
                </div>
                <Link href="/users" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">👤</span> Users
                </Link>
                <Link href="/settings" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition">
                  <span className="text-base">⚙️</span> Settings
                </Link>
                <Link href="/logout" className="flex items-center gap-3 rounded-xl px-4 py-2.5 hover:bg-slate-800 transition text-red-400">
                  <span className="text-base">🚪</span> Logout
                </Link>
              </nav>

              <div className="px-6 py-5 border-t border-slate-800 text-xs text-slate-500">
                TerryCRM v1 · 3 Industries
              </div>
            </aside>

            <main className="flex-1 overflow-auto">
              <div className="border-b border-slate-200 bg-white/80 backdrop-blur px-8 py-4">
                <div className="text-sm text-slate-500">
                  TerryCRM / Internal Workspace
                </div>
              </div>
              <div className="p-8">{children}</div>
            </main>
          </div>
        </AuthGate>
      </body>
    </html>
  );
}
