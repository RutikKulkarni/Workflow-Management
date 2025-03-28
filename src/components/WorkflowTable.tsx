import { WorkflowTableProps } from "@/types/workflow";
import { PinIcon } from "./PinIcon";
import { IoArrowDownSharp } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";

export const WorkflowTable = ({
  workflows,
  onPinToggle,
}: WorkflowTableProps) => {
  return (
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
                  className="px-3 py-2 rounded hover:bg-gray-200"
                >
                  <PinIcon isPinned={workflow.isPinned || false} />
                </button>
                <button className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100">
                  Execute
                </button>
                <button className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100">
                  Edit
                </button>
                <p className="px-3 py-2 rounded">
                  <RxDotsVertical />
                </p>
                <p className="px-3 py-2 rounded">
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
  );
};
