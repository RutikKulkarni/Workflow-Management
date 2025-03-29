import React from "react";
import { IoClose } from "react-icons/io5";
import { ExecuteConfirmationModalProps } from "@/types/workflow";

export const ExecuteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  workflowName,
  title = "Are You Sure You Want To Execute The Process",
}: ExecuteConfirmationModalProps & { title?: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[8px] shadow-[0px_0px_60px_0px_rgba(98,127,172,0.2)] w-[596px] relative flex flex-col">
        <div className="p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-600  cursor-pointer rounded-full h-9 w-9 flex items-center justify-center"
          >
            <IoClose size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center px-4 py-2 gap-5">
          <p className="font-semibold text-sm text-[#333333] tracking-[0.28px] leading-5">
            {`${title} "${workflowName}"?`}
          </p>
          <p className="font-medium text-xs text-[#ee3425] tracking-[0.24px] leading-5">
            You Cannot Undo This Step
          </p>
        </div>

        <div className="p-4 border-t border-[#e0e0e0] flex justify-end gap-4">
          <button
            onClick={() => {
              onConfirm();
            }}
            className="rounded font-medium text-xs text-[#4f4f4f] border border-[#e0e0e0] px-3 py-1.5"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="rounded font-medium text-xs text-[#4f4f4f] border border-[#e0e0e0] px-3 py-1.5"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
