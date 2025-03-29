import { useState } from "react";
import { Workflow, CreateWorkflowModalProps } from "@/types/workflow";
import { IoClose } from "react-icons/io5";

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
      id: `${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
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
      <div className="bg-white rounded-[8px] shadow-[0px_0px_60px_0px_rgba(98,127,172,0.2)] w-[596px] relative flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-[#e0e0e0]">
          <h2 className="text-xl font-semibold">Save your workflow</h2>
          <div>
            <button
              onClick={onClose}
              className="text-gray-600 cursor-pointer rounded-full h-9 w-9 flex items-center justify-center"
            >
              <IoClose size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={newWorkflow.name}
              onChange={(e) =>
                setNewWorkflow({ ...newWorkflow, name: e.target.value })
              }
              placeholder="Enter workflow name"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={newWorkflow.description}
              onChange={(e) =>
                setNewWorkflow({ ...newWorkflow, description: e.target.value })
              }
              placeholder="Enter workflow description"
              className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-gray-200"
              required
            />
          </div>

          <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ee3425] text-white rounded-md cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
