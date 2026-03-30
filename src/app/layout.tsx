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
                  Real Estate CRM Platform
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2 text-sm">
                <Link href="/" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Dashboard
                </Link>
                <Link href="/contacts" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Contacts
                </Link>
                <Link href="/pipeline" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Pipeline
                </Link>
                <Link href="/tasks" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Tasks
                </Link>
                <Link href="/users" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Users
                </Link>
                <Link href="/settings" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition">
                  Settings
                </Link>
                <Link href="/logout" className="block rounded-xl px-4 py-3 hover:bg-slate-800 transition text-red-300">
                  Logout
                </Link>
              </nav>

              <div className="px-6 py-5 border-t border-slate-800 text-xs text-slate-500">
                TerryCRM v1 Prototype
              </div>
            </aside>

            <main className="flex-1">
              <div className="border-b border-slate-200 bg-white/80 backdrop-blur px-8 py-5">
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
