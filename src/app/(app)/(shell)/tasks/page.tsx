export default function TasksPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Task List</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Add Task
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-100 rounded-lg p-3">Call seller follow-up</div>
          <div className="bg-slate-100 rounded-lg p-3">Review buyer list</div>
          <div className="bg-slate-100 rounded-lg p-3">Send offer document</div>
        </div>
      </div>
    </main>
  );
}
