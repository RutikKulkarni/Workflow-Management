import { WorkflowTableProps } from "@/types/workflow";
import { PinIcon } from "./PinIcon";
import { IoArrowDownSharp } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";
import { useState } from "react";
import { ExecuteConfirmationModal } from "./ExecuteConfirmationModal";

export const WorkflowTable = ({
  workflows,
  onPinToggle,
}: WorkflowTableProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);

  const handleExecuteClick = (workflowName: string) => {
    setSelectedWorkflow(workflowName);
    setShowModal(true);
  };

  const handleConfirmExecute = () => {
    console.log(`Executing workflow: ${selectedWorkflow}`);
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
                <td className="p-3 flex justify-center gap-2">
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
                  <p className="px-3 py-2 rounded cursor-pointer">
                    <RxDotsVertical />
                  </p>
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