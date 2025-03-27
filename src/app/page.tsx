"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HiMenuAlt2 } from "react-icons/hi";
import { RiSearchLine } from "react-icons/ri";
import { WorkflowTable } from "@/components/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { CreateWorkflowModal } from "@/components/CreateWorkflowModal";
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
    } catch (error) {
      console.error("Error fetching workflows:", error);
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
    setWorkflows(updatedWorkflows);
    setFilteredWorkflows(
      [...updatedWorkflows].sort(
        (a, b) => Number(b.isPinned) - Number(a.isPinned)
      )
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const paginatedData = filteredWorkflows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex items-center mb-6">
        <div className="flex items-center">
          <HiMenuAlt2 className="w-6 h-6 mr-4" />
          <h1 className="text-3xl font-semibold">Workflow Builder</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg shadow hover:bg-gray-100"
          >
            Logout
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow"
          >
            + Create New Process
          </button>
        </div>
      </header>

      <div className="relative w-[340px] h-[32px] pb-[2px] mb-6">
        <input
          type="text"
          placeholder="Search By Workflow Name/ID"
          className="w-full h-full pl-[10px] pr-[40px] text-[14px] border border-gray-300 rounded-md shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <RiSearchLine className="absolute top-[9px] left-[312px] w-[14px] h-[14px] text-gray-500" />
      </div>

      <CreateWorkflowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(newWorkflow) => setWorkflows([...workflows, newWorkflow])}
        userEmail={user.email}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
        </div>
      ) : (
        <>
          <WorkflowTable
            workflows={paginatedData}
            onPinToggle={handlePinToggle}
          />
          <Pagination
            totalItems={filteredWorkflows.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
