import { useState } from "react";
import axios from "axios";
import { Workflow } from "@/types/workflow";
import { API_URLS } from "@/lib/api";

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workflow: Workflow) => void;
  userEmail: string;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

      const workflowData = {
        ...newWorkflow,
        id: `#${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        lastEditedBy: userEmail.split("@")[0] || "Unknown User",
        lastEditedOn: formattedTime,
        isPinned: false,
      };

      const response = await axios.post(API_URLS.WORKFLOWS, workflowData);
      onCreate(response.data);
      setNewWorkflow({ name: "", description: "" });
      onClose();
    } catch (error) {
      console.error("Error creating workflow:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
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
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
