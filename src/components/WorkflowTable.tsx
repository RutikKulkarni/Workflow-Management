import React, { useState } from "react";
import { WorkflowTableProps } from "@/types/workflow";
import { PinIcon } from "./PinIcon";
import { IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";
import { ExecuteConfirmationModal } from "./Modals/Confirmation";
import { useSnackbar } from "notistack";
import { TbExternalLink } from "react-icons/tb";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const WorkflowTable = ({
  workflows,
  onPinToggle,
  onDelete,
}: WorkflowTableProps) => {
  const [showModal, setShowModal] = useState<"execute" | "delete" | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const handleExecuteClick = (workflowId: string, workflowName: string) => {
    setSelectedWorkflow({ id: workflowId, name: workflowName });
    setShowModal("execute");
  };

  const handleConfirmExecute = () => {
    if (selectedWorkflow) {
      console.log(`Executing workflow: ${selectedWorkflow.name}`);
    }
    setShowModal(null);
    setSelectedWorkflow(null);
  };

  const handleDeleteClick = (workflowId: string, workflowName: string) => {
    setSelectedWorkflow({ id: workflowId, name: workflowName });
    setShowModal("delete");
    setShowDeleteMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedWorkflow) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (onDelete) {
          onDelete(selectedWorkflow.id);
        }
        enqueueSnackbar(
          `Workflow "${selectedWorkflow.name}" deleted successfully`,
          {
            variant: "success",
            autoHideDuration: 3000,
          }
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        enqueueSnackbar(`Error deleting workflow: ${errorMessage}`, {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    }
    setShowModal(null);
    setSelectedWorkflow(null);
  };

  const toggleDeleteMenu = (workflowId: string) => {
    setShowDeleteMenu(showDeleteMenu === workflowId ? null : workflowId);
  };

  const toggleRowExpansion = (workflowId: string) => {
    setExpandedRow((prev) => (prev === workflowId ? null : workflowId));
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b-0">
            <th className="pl-9 py-6 text-left font-medium text-sm text-[#000000]">
              Workflow Name
            </th>
            <th className="py-6 text-left font-medium text-sm text-[#000000]">
              ID
            </th>
            <th className="py-6 text-left font-medium text-sm text-[#000000]">
              Last Edited
            </th>
            <th className="py-6 text-left font-medium text-sm text-[#000000]">
              Description
            </th>
            <th className="py-6 text-right"></th>
          </tr>
          <tr className="border-t border-[#f68b21] h-[1px]">
            <th colSpan={5} className="p-0 h-[1px]"></th>
          </tr>
        </thead>
        <tbody>
          {workflows.length > 0 ? (
            workflows.map((workflow) => (
              <React.Fragment key={workflow.id}>
                <tr className="h-[70px] border-b border-[#f8f2e7]">
                  <td className="pl-9 font-medium text-sm text-[#4f4f4f]">
                    {workflow.name}
                  </td>
                  <td className="font-normal text-sm text-[#4f4f4f]">
                    #{workflow.id}
                  </td>
                  <td className="font-normal text-xs text-[#4f4f4f]">
                    {workflow.lastEditedBy} | {workflow.lastEditedOn}
                  </td>
                  <td className="font-normal text-xs text-[#4f4f4f]">
                    {workflow.description}
                  </td>
                  <td className="pr-6">
                    <div className="flex items-center justify-end gap-2 cursor-pointer">
                      <button
                        onClick={() => onPinToggle(workflow.id)}
                        className="p-[1.25px]"
                      >
                        <PinIcon isPinned={workflow.isPinned || false} />
                      </button>
                      <button
                        onClick={() =>
                          handleExecuteClick(workflow.id, workflow.name)
                        }
                        className="h-8 px-3 py-[7px] text-xs font-medium text-[#221f20] border border-[#e0e0e0] rounded cursor-pointer"
                      >
                        Execute
                      </button>
                      <button
                        onClick={() => router.push(`/edit`)}
                        className="h-8 px-3 py-[7px] text-xs font-medium text-[#221f20] border border-[#e0e0e0] rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => toggleDeleteMenu(workflow.id)}
                          className="p-[1.25px] cursor-pointer"
                        >
                          <RxDotsVertical className="w-5 h-5 text-[#221f20]" />
                        </button>
                        {showDeleteMenu === workflow.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-[#e0e0e0] rounded shadow-lg z-10">
                            <button
                              onClick={() =>
                                handleDeleteClick(workflow.id, workflow.name)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-red-600 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => toggleRowExpansion(workflow.id)}
                        className="p-[1.25px] cursor-pointer"
                      >
                        {expandedRow === workflow.id ? (
                          <IoArrowUpSharp className="w-6 h-6 text-[#221f20]" />
                        ) : (
                          <IoArrowDownSharp className="w-6 h-6 text-[#221f20]" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === workflow.id && (
                  <>
                    <tr className="bg-[#fffaf1] border-b border-[#f8f2e7]">
                      <td colSpan={5} className="pl-9 py-5">
                        <div className="relative">
                          <div className="absolute w-0.5 h-full top-10 left-[-18px] bg-[#ffe1d2]" />
                          <div className="absolute w-4 h-4 top-[3px] left-[-25px] bg-[#ffe0d2] rounded-lg">
                            <div className="relative w-2 h-2 top-1 left-1 bg-[#ff5200] rounded" />
                          </div>

                          <div className="flex items-center gap-2">
                            <Image
                              src="/passTag.svg"
                              alt="Pass"
                              width={50}
                              height={50}
                              quality={100}
                              priority
                              unoptimized
                              className="pr-2"
                            />
                            <span className="font-normal text-[14px] text-[#4f4f4f]">
                              {workflow.lastEditedOn}
                            </span>
                            <span
                              onClick={() => router.push(`/edit`)}
                              className="cursor-pointer"
                            >
                              <TbExternalLink className="w-5 h-5 text-[#221f20]" />
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-[#fffaf1] border-b border-[#f8f2e7]">
                      <td colSpan={5} className="pl-9 py-5">
                        <div className="relative">
                          <div className="absolute w-0.5 h-full bottom-10 left-[-18px] bg-[#ffe1d2]" />
                          <div className="absolute w-4 h-4 top-[3px] left-[-25px] bg-[#ffe0d2] rounded-lg">
                            <div className="relative w-2 h-2 top-1 left-1 bg-[#ff5200] rounded" />
                          </div>

                          <div className="flex items-center gap-2">
                            <Image
                              src="/failTag.svg"
                              alt="Pass"
                              width={50}
                              height={50}
                              quality={100}
                              priority
                              unoptimized
                              className="pr-2"
                            />
                            <span className="font-normal text-[14px] text-[#4f4f4f]">
                              {workflow.lastEditedOn}
                            </span>
                            <span
                              onClick={() => router.push(`/edit`)}
                              className="cursor-pointer"
                            >
                              <TbExternalLink className="w-5 h-5 text-[#221f20]" />
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="h-[70px] text-center text-sm text-[#4f4f4f]"
              >
                No workflows found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedWorkflow && (
        <ExecuteConfirmationModal
          isOpen={showModal !== null}
          onClose={() => {
            setShowModal(null);
            setSelectedWorkflow(null);
          }}
          onConfirm={
            showModal === "execute" ? handleConfirmExecute : handleConfirmDelete
          }
          workflowName={selectedWorkflow.name}
          title={
            showModal === "execute"
              ? "Are You Sure You Want To Execute The Process"
              : "Are You Sure You Want To Delete The Process"
          }
        />
      )}
    </div>
  );
};
