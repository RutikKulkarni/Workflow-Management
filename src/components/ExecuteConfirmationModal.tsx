import React from "react";
import { IoClose } from "react-icons/io5";
import { ExecuteConfirmationModalProps } from "@/types/workflow";

export const ExecuteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  workflowName,
}: ExecuteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-[8px] shadow-lg w-[500px] h-[250px] relative flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <IoClose size={24} />
        </button>

        <div className="mb-4 flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-800">
              Are you sure you want to Execute the process{" "}
              <span className="font-semibold">{`'${workflowName}'`}</span>?
            </p>
            <p className="text-red-600 text-sm mt-2">You cannot undo this step</p>
          </div>
        </div>
        <div className="h-[0.1px] bg-gray-500 shadow-xl shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.5)]"></div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100 cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100 cursor-pointer"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
