import { WorkflowTableProps } from "@/types/workflow";
import { PinIcon } from "./PinIcon";
import { IoArrowDownSharp } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";
import { useState } from "react";
import { ExecuteConfirmationModal } from "./ExecuteConfirmationModal";
import { useSnackbar } from "notistack";

export const WorkflowTable = ({
  workflows,
  onPinToggle,
  onDelete,
}: WorkflowTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleExecuteClick = (workflowName: string) => {
    setSelectedWorkflow(workflowName);
    setShowModal(true);
  };

  const handleConfirmExecute = () => {
    console.log(`Executing workflow: ${selectedWorkflow}`);
  };

  const handleDeleteClick = async (workflowId: string, workflowName: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    
      if (onDelete) {
        onDelete(workflowId);
      }

      enqueueSnackbar(`Workflow "${workflowName}" deleted successfully`, {
        variant: "success",
        autoHideDuration: 3000,
      });
      
      setShowDeleteMenu(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      enqueueSnackbar(`Error deleting workflow: ${errorMessage}`, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const toggleDeleteMenu = (workflowId: string) => {
    setShowDeleteMenu(showDeleteMenu === workflowId ? null : workflowId);
  };

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-gray-700 text-left">
            <th className="p-3">Workflow Name</th>
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">Last Edited</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workflows.length > 0 ? (
            workflows.map((workflow) => (
              <tr key={workflow.id} className="hover:bg-gray-100">
                <td className="p-3">{workflow.name}</td>
                <td className="p-3 text-center text-gray-600">{workflow.id}</td>
                <td className="p-3 text-left text-gray-600">
                  {workflow.lastEditedBy} | {workflow.lastEditedOn}
                </td>
                <td className="p-3 text-gray-600">{workflow.description}</td>
                <td className="p-3 flex justify-center gap-2 relative">
                  <button
                    onClick={() => onPinToggle(workflow.id)}
                    className="px-3 py-2 rounded hover:bg-gray-200 cursor-pointer"
                  >
                    <PinIcon isPinned={workflow.isPinned || false} />
                  </button>
                  <button
                    onClick={() => handleExecuteClick(workflow.name)}
                    className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100 cursor-pointer"
                  >
                    Execute
                  </button>
                  <button className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100 cursor-pointer">
                    Edit
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => toggleDeleteMenu(workflow.id)}
                      className="px-3 py-2 rounded hover:bg-gray-200 cursor-pointer"
                    >
                      <RxDotsVertical />
                    </button>
                    {showDeleteMenu === workflow.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                        <button
                          onClick={() => handleDeleteClick(workflow.id, workflow.name)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="px-3 py-2 rounded cursor-pointer">
                    <IoArrowDownSharp />
                  </p>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-3 text-center text-gray-500">
                No workflows found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ExecuteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmExecute}
        workflowName={selectedWorkflow || ""}
      />
    </>
  );
};
