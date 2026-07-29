"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../../lib/supabase";

type Candidate = {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role_title: string;
  current_company: string;
  linkedin_url: string;
  stage: string;
  source: string;
  owner?: string | null;
  created_at?: string;
};

type Note = { id?: number; candidate_id: number; content: string; created_at?: string };
type Task = { id?: number; candidate_id: number; title: string; due_date: string | null; status: string; created_at?: string };
type Communication = { id?: number; candidate_id: number; type: string; direction: string | null; subject: string | null; content: string | null; occurred_at?: string };
type Activity = { id?: number; candidate_id: number; activity_type: string; detail: string | null; created_at?: string };

const STAGES = [
  "Prospect", "Contacted", "Discovery Call", "NDA", "Executive Interview",
  "Founder Interview", "Due Diligence", "Reference Checks", "Offer",
  "Negotiation", "Accepted", "Active Executive",
];

type Tab = "notes" | "tasks" | "communications" | "activity";

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtTime(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comms, setComms] = useState<Communication[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("notes");
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState<Partial<Candidate>>({});

  const [noteInput, setNoteInput] = useState("");
  const [taskForm, setTaskForm] = useState({ title: "", due_date: "" });
  const [commForm, setCommForm] = useState({ type: "email", direction: "outbound", subject: "", content: "" });

  async function loadAll() {
    setLoading(true);
    const [{ data: c }, { data: n }, { data: t }, { data: cm }, { data: a }] = await Promise.all([
      supabase.from("exec_candidates").select("*").eq("id", id).single(),
      supabase.from("exec_notes").select("*").eq("candidate_id", id).order("created_at", { ascending: false }),
      supabase.from("exec_tasks").select("*").eq("candidate_id", id).order("due_date", { ascending: true }),
      supabase.from("exec_communications").select("*").eq("candidate_id", id).order("occurred_at", { ascending: false }),
      supabase.from("exec_activities").select("*").eq("candidate_id", id).order("created_at", { ascending: false }),
    ]);
    setCandidate(c || null);
    setInfoForm(c || {});
    setNotes(n || []);
    setTasks(t || []);
    setComms(cm || []);
    setActivities(a || []);
    setLoading(false);
  }

  useEffect(() => { if (id) loadAll(); }, [id]);

  async function logActivity(activity_type: string, detail: string) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("exec_activities").insert({ candidate_id: id, activity_type, detail, actor: user?.id });
  }

  async function handleStageChange(newStage: string) {
    if (!candidate) return;
    const prevStage = candidate.stage;
    setCandidate({ ...candidate, stage: newStage });
    const { error } = await supabase.from("exec_candidates")
      .update({ stage: newStage, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { setCandidate({ ...candidate, stage: prevStage }); alert(error.message); return; }
    await logActivity("stage_change", `Moved from ${prevStage} to ${newStage}`);
    loadAll();
  }

  async function handleSaveInfo() {
    const { error } = await supabase.from("exec_candidates")
      .update({
        name: infoForm.name, email: infoForm.email, phone: infoForm.phone,
        role_title: infoForm.role_title, current_company: infoForm.current_company,
        linkedin_url: infoForm.linkedin_url, source: infoForm.source,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
    if (error) { alert(error.message); return; }
    setEditingInfo(false);
    loadAll();
  }

  async function handleDeleteCandidate() {
    if (!confirm("Delete this candidate? This cannot be undone.")) return;
    const { error } = await supabase.from("exec_candidates").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    router.push("/executive-leadership");
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("exec_notes").insert({ candidate_id: id, content: noteInput.trim(), created_by: user?.id });
    if (error) { alert(error.message); return; }
    setNoteInput("");
    await logActivity("note_added", noteInput.trim().slice(0, 80));
    loadAll();
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("exec_tasks").insert({
      candidate_id: id, title: taskForm.title.trim(), due_date: taskForm.due_date || null,
      assigned_to: user?.id, created_by: user?.id,
    });
    if (error) { alert(error.message); return; }
    setTaskForm({ title: "", due_date: "" });
    await logActivity("task_created", taskForm.title.trim());
    loadAll();
  }

  async function handleToggleTask(task: Task) {
    const newStatus = task.status === "open" ? "completed" : "open";
    const { error } = await supabase.from("exec_tasks").update({ status: newStatus }).eq("id", task.id);
    if (error) { alert(error.message); return; }
    loadAll();
  }

  async function handleAddComm(e: React.FormEvent) {
    e.preventDefault();
    if (!commForm.subject.trim() && !commForm.content.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("exec_communications").insert({
      candidate_id: id, type: commForm.type, direction: commForm.direction,
      subject: commForm.subject.trim() || null, content: commForm.content.trim() || null,
      created_by: user?.id,
    });
    if (error) { alert(error.message); return; }
    setCommForm({ type: "email", direction: "outbound", subject: "", content: "" });
    await logActivity("communication_logged", `${commForm.type}: ${commForm.subject || "(no subject)"}`);
    loadAll();
  }

  const openTasks = useMemo(() => tasks.filter((t) => t.status === "open"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed"), [tasks]);

  if (loading) return <div className="text-center py-20 text-slate-400">Loading candidate...</div>;
  if (!candidate) return <div className="text-center py-20 text-slate-400">Candidate not found.</div>;

  return (
    <>
      <Link href="/executive-leadership" className="text-sm text-slate-400 hover:text-slate-700 mb-4 inline-block">← Back to Candidates</Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {editingInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={infoForm.name || ""} onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })} placeholder="Name" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.role_title || ""} onChange={(e) => setInfoForm({ ...infoForm, role_title: e.target.value })} placeholder="Role" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.email || ""} onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })} placeholder="Email" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.phone || ""} onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })} placeholder="Phone" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.current_company || ""} onChange={(e) => setInfoForm({ ...infoForm, current_company: e.target.value })} placeholder="Current Company" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.linkedin_url || ""} onChange={(e) => setInfoForm({ ...infoForm, linkedin_url: e.target.value })} placeholder="LinkedIn URL" className="border border-slate-300 rounded-xl px-3 py-2" />
                <input value={infoForm.source || ""} onChange={(e) => setInfoForm({ ...infoForm, source: e.target.value })} placeholder="Source" className="border border-slate-300 rounded-xl px-3 py-2" />
                <div className="flex gap-2 md:col-span-2">
                  <button onClick={handleSaveInfo} className="bg-slate-950 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition text-sm">Save</button>
                  <button onClick={() => { setEditingInfo(false); setInfoForm(candidate); }} className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{candidate.name}</h1>
                <p className="text-slate-500 mt-1">{candidate.role_title}{candidate.current_company ? ` · ${candidate.current_company}` : ""}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-slate-500">
                  {candidate.email && <span>✉️ {candidate.email}</span>}
                  {candidate.phone && <span>📞 {candidate.phone}</span>}
                  {candidate.linkedin_url && <a href={candidate.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">🔗 LinkedIn</a>}
                  {candidate.source && <span>Source: {candidate.source}</span>}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <select value={candidate.stage} onChange={(e) => handleStageChange(e.target.value)} className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold bg-white">
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <div className="flex gap-3">
              {!editingInfo && <button onClick={() => setEditingInfo(true)} className="text-blue-600 hover:underline text-sm">Edit info</button>}
              <button onClick={handleDeleteCandidate} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex border-b border-slate-200 px-6 overflow-x-auto">
          {([
            { key: "notes", label: `Notes (${notes.length})` },
            { key: "tasks", label: `Tasks (${openTasks.length})` },
            { key: "communications", label: `Communications (${comms.length})` },
            { key: "activity", label: "Activity" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={"px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition " + (tab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === "notes" && (
            <div>
              <form onSubmit={handleAddNote} className="flex gap-3 mb-5">
                <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Add a note..." className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5" />
                <button type="submit" className="bg-slate-950 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm">Add</button>
              </form>
              {notes.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No notes yet.</div>
              ) : (
                <div className="space-y-3">
                  {notes.map((n) => (
                    <div key={n.id} className="bg-slate-50 rounded-xl px-4 py-3">
                      <div className="text-sm text-slate-700">{n.content}</div>
                      <div className="text-xs text-slate-400 mt-1">{fmtTime(n.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "tasks" && (
            <div>
              <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3 mb-5">
                <input value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title..." className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5" />
                <input type="date" value={taskForm.due_date} onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })} className="border border-slate-300 rounded-xl px-4 py-2.5" />
                <button type="submit" className="bg-slate-950 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm">Add Task</button>
              </form>
              {tasks.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No tasks yet.</div>
              ) : (
                <div className="space-y-2">
                  {[...openTasks, ...completedTasks].map((t) => (
                    <label key={t.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 cursor-pointer">
                      <input type="checkbox" checked={t.status === "completed"} onChange={() => handleToggleTask(t)} className="w-4 h-4" />
                      <span className={"flex-1 text-sm " + (t.status === "completed" ? "line-through text-slate-400" : "text-slate-700")}>{t.title}</span>
                      {t.due_date && <span className="text-xs text-slate-400">{fmtDate(t.due_date)}</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "communications" && (
            <div>
              <form onSubmit={handleAddComm} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <select value={commForm.type} onChange={(e) => setCommForm({ ...commForm, type: e.target.value })} className="border border-slate-300 rounded-xl px-4 py-2.5 bg-white">
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
                <select value={commForm.direction} onChange={(e) => setCommForm({ ...commForm, direction: e.target.value })} className="border border-slate-300 rounded-xl px-4 py-2.5 bg-white">
                  <option value="outbound">Outbound</option>
                  <option value="inbound">Inbound</option>
                </select>
                <input value={commForm.subject} onChange={(e) => setCommForm({ ...commForm, subject: e.target.value })} placeholder="Subject" className="border border-slate-300 rounded-xl px-4 py-2.5 md:col-span-2" />
                <textarea value={commForm.content} onChange={(e) => setCommForm({ ...commForm, content: e.target.value })} placeholder="Notes / content" className="border border-slate-300 rounded-xl px-4 py-2.5 md:col-span-2" rows={2} />
                <button type="submit" className="bg-slate-950 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition text-sm md:col-span-2">Log Communication</button>
              </form>
              {comms.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No communications logged yet.</div>
              ) : (
                <div className="space-y-3">
                  {comms.map((c) => (
                    <div key={c.id} className="bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <span>{c.type}</span><span>·</span><span>{c.direction}</span>
                      </div>
                      {c.subject && <div className="text-sm font-medium text-slate-800 mt-1">{c.subject}</div>}
                      {c.content && <div className="text-sm text-slate-600 mt-1">{c.content}</div>}
                      <div className="text-xs text-slate-400 mt-1">{fmtTime(c.occurred_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "activity" && (
            <div>
              {activities.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No activity yet.</div>
              ) : (
                <div className="relative pl-4 space-y-3">
                  <div className="absolute left-1.5 top-0 bottom-0 w-px bg-slate-100" />
                  {activities.map((a) => (
                    <div key={a.id} className="relative">
                      <div className="absolute -left-[11px] top-2 h-2 w-2 rounded-full bg-slate-300" />
                      <div className="bg-slate-50 rounded-xl px-4 py-3">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{a.activity_type.replace(/_/g, " ")}</div>
                        {a.detail && <div className="text-sm text-slate-700 mt-0.5">{a.detail}</div>}
                        <div className="text-xs text-slate-400 mt-1">{fmtTime(a.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
