"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { useWorkflowStore, NodeType } from "../../store/workflowStore";
import { LuRedo, LuUndo } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { RiSubtractLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CreateWorkflowModal } from "@/components/Modals/SaveWorkflow";
import { getCurrentUser } from "@/lib/auth";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Workflow } from "@/types/workflow";
import { API_URLS } from "@/lib/api";
import Image from "next/image";

const nodeOptions = [
  { type: "api" as NodeType, label: "API Call", color: "#839e4b" },
  { type: "email" as NodeType, label: "Email", color: "#839e4b" },
  { type: "textbox" as NodeType, label: "Text Box", color: "#839e4b" },
];

export default function EditPage() {
  const [user, setUser] = React.useState<{ email: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { nodes, zoom, setZoom, removeNode, undo, redo, setNodes } =
    useWorkflowStore();

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  const handleAddNode = (type: NodeType, label: string, color: string) => {
    const startIndex = nodes.findIndex((node) => node.type === "start");
    const endIndex = nodes.findIndex((node) => node.type === "end");

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      const newNode = {
        id: Date.now().toString(),
        type,
        label,
        color,
      };
      const updatedNodes = [...nodes];
      updatedNodes.splice(endIndex, 0, newNode);
      setNodes(updatedNodes);
    }
  };

  const fetchWorkflows = async () => {
    setIsLoading(true);
    const fetchingSnackbarKey = enqueueSnackbar("Fetching the Workflow data", {
      variant: "info",
      persist: true,
    });

    try {
      const response = await axios.get(API_URLS.WORKFLOWS);
      const workflowsWithPin = response.data.workflows.map(
        (workflow: Workflow) => ({
          ...workflow,
          isPinned: false,
        })
      );
      setWorkflows(workflowsWithPin);
      setFilteredWorkflows(workflowsWithPin);
      closeSnackbar(fetchingSnackbarKey);
      enqueueSnackbar("Workflow data fetched successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error fetching workflows:", error);
      closeSnackbar(fetchingSnackbarKey);
      enqueueSnackbar("Failed to fetch workflows", {
        variant: "error",
        autoHideDuration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      router.push("/auth");
      return;
    }

    fetchWorkflows();
  }, [router]);

  console.log("nodes", isLoading, workflows, filteredWorkflows, user, zoom);

  return (
    <div className="w-full h-full bg-[#f8f2e7] overflow-hidden">
      <div className="relative h-[827px]">
        <div className="absolute top-0 left-0 overflow-scroll">
          <div
            className="relative w-[2631px] h-[1383px] top-[-280px] left-[-625px]"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            <div className="absolute w-[300px] h-[661px] top-[443px] left-[1170px]">
              {nodes.map((node, index) => (
                <div key={node.id} className="relative mb-4">
                  {node.type === "start" || node.type === "end" ? (
                    <div className="relative w-20 h-20 rounded-[40px] mx-auto">
                      <div
                        className={`absolute w-20 h-20 rounded-[40px] border-[6.15px] border-solid`}
                        style={{ borderColor: node.color }}
                      >
                        <div
                          className="relative w-[58px] h-[58px] top-[5px] left-[5px] rounded-[28.85px]"
                          style={{ backgroundColor: node.color }}
                        />
                        <div className="absolute h-6 top-7 left-[21px] font-medium text-white text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                          {node.label}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Card
                      className="w-[300px] h-16 border border-solid rounded-lg relative"
                      style={{ borderColor: node.color }}
                    >
                      <div
                        className="relative w-[302px] h-[66px] -top-px -left-px bg-white rounded-lg border border-solid"
                        style={{ borderColor: node.color }}
                      >
                        <div className="absolute h-[18px] top-[22px] left-6 font-medium text-[#4f4f4f] text-xs tracking-[0] leading-[18px] whitespace-nowrap">
                          {node.label}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-[18px] cursor-pointer"
                          onClick={() => removeNode(node.id)}
                        >
                          <Image
                            src="/delete.svg"
                            alt="delete"
                            width={20}
                            height={20}
                            quality={100}
                            priority
                            unoptimized
                            className="pr-2"
                          />
                        </Button>
                      </div>
                    </Card>
                  )}

                  {index < nodes.length - 1 && (
                    <div className="w-7 h-[77px] mx-auto relative">
                      <div className="relative h-[76px]">
                        <img
                          className="absolute w-px h-[76px] top-0 left-3.5"
                          alt="Connection line"
                          src="/group-1321314615.png"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="top-[25px] left-0 absolute w-7 h-7 rounded-[14px] border-[1.17px] border-solid border-[#4f4f4f] p-0 cursor-pointer"
                            >
                              <GoPlus className="w-4 h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            side="right"
                            className="bg-white shadow-lg border border-gray-200 p-2 rounded-lg"
                          >
                            <div className="flex flex-col gap-2">
                              {nodeOptions.map((option) => (
                                <Button
                                  key={option.type}
                                  variant="ghost"
                                  onClick={() => {
                                    handleAddNode(
                                      option.type,
                                      option.label,
                                      option.color
                                    );
                                    document.dispatchEvent(new Event("click"));
                                  }}
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex w-[78px] items-start absolute top-[977px] left-[675px] bg-white rounded-[8.57px]">
              <Button
                variant="outline"
                size="icon"
                className="inline-flex items-center justify-center p-2.5 relative flex-[0_0_auto] rounded-[8.57px_0px_0px_8.57px] border-[1.43px] border-solid border-[#e0e0e0] cursor-pointer"
                onClick={undo}
              >
                <LuUndo className="absolute w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="relative flex-[0_0_auto] mr-[-0.57px] ml-[-1.43px] rounded-[0px_8.57px_8.57px_0px] border-[1.43px] border-solid border-[#e0e0e0] inline-flex items-center justify-center cursor-pointer"
                onClick={redo}
              >
                <LuRedo className="absolute w-4 h-4" />
              </Button>
            </div>

            <Card className="inline-flex items-center gap-6 px-6 py-[7px] absolute top-[332px] left-[675px] bg-white rounded-md shadow-shadow-XS">
              <Button
                variant="link"
                className="relative w-fit font-semibold text-[#221f20] text-base tracking-[0] leading-[normal] underline p-0 cursor-pointer"
                onClick={() => router.push(`/`)}
              >
                &lt;- Go Back
              </Button>

              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-semibold text-[#221f20] text-base tracking-[0] leading-[normal]">
                  Untitled
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="p-0 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <FaRegSave className="relative w-16 h-16" />
              </Button>
            </Card>
          </div>
        </div>

        <div className="absolute w-[381px] h-10 top-[697px] left-[950px] bg-white rounded-[8.57px] border border-solid border-[#e0e0e0] flex items-center">
          <div className="absolute w-[79px] h-10 top-0 left-0 flex">
            <Button
              variant="outline"
              size="icon"
              className="border-0 absolute top-0 left-0 rounded-[8.57px_0px_0px_8.57px] border-[1.43px] border-solid border-[#e0e0e0] inline-flex items-center justify-center p-2.5 bg-none cursor-pointer"
              onClick={() => setZoom(1)}
            >
              <div className="relative w-5 h-5 bg-white rounded-[10px] border-[1.25px] border-solid border-[#abcd62]">
                <div className="relative w-3.5 h-3.5 top-0.5 left-0.5 bg-[#abcd62] rounded-[6.88px]" />
              </div>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-0 absolute top-0 left-[39px] inline-flex items-center justify-center p-2.5 bg-none cursor-pointer"
              onClick={handleZoomOut}
            >
              <RiSubtractLine className="relative flex-[0_0_auto]" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="border-0 absolute top-0 left-[341px] rounded-[0px_8.57px_8.57px_0px] inline-flex items-center justify-center p-2.5 bg-none cursor-pointer"
            onClick={handleZoomIn}
          >
            <GoPlus className="relative flex-[0_0_auto]" />
          </Button>

          <div className="absolute w-[230px] h-4 top-3 left-[95px]">
            <div className="relative w-[234px] h-4 -left-0.5">
              <input
                aria-label="Zoom"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <CreateWorkflowModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={(newWorkflow) =>
              setWorkflows([newWorkflow, ...workflows])
            }
            userEmail={user?.email || ""}
          />
        </div>
      </div>
    </div>
  );
}
