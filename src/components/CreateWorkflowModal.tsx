import { useState } from "react";
import { Workflow, CreateWorkflowModalProps } from "@/types/workflow";

export function CreateWorkflowModal({
  isOpen,
  onClose,
  onCreate,
  userEmail,
}: CreateWorkflowModalProps) {
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const formattedTime = `${currentTime} IST-${currentDate}`;

    const workflowData: Workflow = {
      ...newWorkflow,
      id: `#${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      lastEditedBy: userEmail.split("@")[0] || "Unknown User",
      lastEditedOn: formattedTime,
      isPinned: false,
    };

    onCreate(workflowData);
    setNewWorkflow({ name: "", description: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Create New Process</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              aria-label="Name of workflow"
              type="text"
              value={newWorkflow.name}
              onChange={(e) =>
                setNewWorkflow({ ...newWorkflow, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              aria-label="Description"
              value={newWorkflow.description}
              onChange={(e) =>
                setNewWorkflow({ ...newWorkflow, description: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
