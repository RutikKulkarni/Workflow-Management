"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
// import { HiMenuAlt2 } from "react-icons/hi";
import Image from "next/image";
import { RiSearchLine } from "react-icons/ri";
import { useSnackbar } from "notistack";
import { WorkflowTable } from "@/components/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { CreateWorkflowModal } from "@/components/Modals/SaveWorkflow";
import { Workflow } from "@/types/workflow";
import { getCurrentUser, logout } from "@/lib/auth";
import { API_URLS } from "@/lib/api";

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      router.push("/auth");
      return;
    }

    fetchWorkflows();
  }, [router]);

  useEffect(() => {
    const filtered = workflows.filter((workflow) =>
      [workflow.name, workflow.id]
        .filter(Boolean)
        .some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    const sorted = [...filtered].sort(
      (a, b) => Number(b.isPinned) - Number(a.isPinned)
    );
    setFilteredWorkflows(sorted);
    setCurrentPage(1);
  }, [searchQuery, workflows]);

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

  const handlePinToggle = (workflowId: string) => {
    const updatedWorkflows = workflows.map((workflow) =>
      workflow.id === workflowId
        ? { ...workflow, isPinned: !workflow.isPinned }
        : workflow
    );
    const toggledWorkflow = updatedWorkflows.find(
      (workflow) => workflow.id === workflowId
    );

    if (toggledWorkflow?.isPinned) {
      enqueueSnackbar(`${toggledWorkflow.name} Pinned`, { variant: "info" });
    } else {
      enqueueSnackbar(`${toggledWorkflow?.name} Unpinned`, { variant: "info" });
    }

    setWorkflows(updatedWorkflows);
    setFilteredWorkflows(
      [...updatedWorkflows].sort(
        (a, b) => Number(b.isPinned) - Number(a.isPinned)
      )
    );
  };

  const handleDelete = async (workflowId: string) => {
    try {
      await axios.delete(`${API_URLS.WORKFLOWS}/${workflowId}`);

      const updatedWorkflows = workflows.filter(
        (workflow) => workflow.id !== workflowId
      );
      setWorkflows(updatedWorkflows);
    } catch (error) {
      console.error("Error deleting workflow:", error);
      enqueueSnackbar("Failed to delete workflow", { variant: "error" });
    }
  };

  const handleLogout = () => {
    try {
      logout();
      enqueueSnackbar("Logout successful!", { variant: "success" });
      router.push("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      enqueueSnackbar("Logout failed. Please try again.", {
        variant: "error",
      });
    }
  };

  const paginatedData = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdfbf6]">
      <div className="max-w-[1440px] mx-auto px-6 py-4">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <HiMenuAlt2 className="w-6 h-6 text-[#221f20]" />
            </button> */}
            <Image
              src="/menu.svg"
              alt="Menu Logo"
              width={35}
              height={35}
              className="mr-4"
            />
            <h1 className="font-semibold text-[22px] text-[#221f20]">
              Workflow Builder
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[14px] text-[#4f4f4f]">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-[14px] text-[#221f20] hover:text-[#3a3738]"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-[340px]">
            <input
              type="text"
              placeholder="Search By Workflow Name/ID"
              className="w-full h-8 pl-3 pr-10 text-xs border border-[#e0e0e0] rounded focus:outline-none focus:ring-1 focus:ring-[#221f20]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <RiSearchLine className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bdbdbd]" />
          </div>

          <button
            onClick={() => {
              // const newWorkflowId = Date.now().toString();
              router.push(`/edit`);
            }}
            className="bg-[#221f20] hover:bg-[#3a3738] text-white px-3 py-[7px] rounded text-xs font-medium transition-colors cursor-pointer"
          >
            + Create New Process
          </button>
        </div>

        <CreateWorkflowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={(newWorkflow) => setWorkflows([newWorkflow, ...workflows])}
          userEmail={user.email}
        />

        <div className="bg-white rounded-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#221f20]" />
            </div>
          ) : (
            <>
              <WorkflowTable
                workflows={paginatedData}
                onPinToggle={handlePinToggle}
                onDelete={handleDelete}
              />
              <div className="border-t border-[#f8f2e7]">
                <Pagination
                  totalItems={filteredWorkflows.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
