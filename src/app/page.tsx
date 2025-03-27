"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HiMenuAlt2 } from "react-icons/hi";
import { RiSearchLine } from "react-icons/ri";
import { WorkflowTable } from "@/components/WorkflowTable";
import { Pagination } from "@/components/Pagination";
import { Workflow } from "@/types/workflow";
import { getCurrentUser, logout } from "@/lib/auth";

const HomePage = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      router.push("/auth");
      return;
    }

    const fetchWorkflows = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://workflows.free.beeceptor.com/data"
        );
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
    fetchWorkflows();
  }, [router]);

  useEffect(() => {
    const filtered = workflows.filter(
      (workflow) =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        workflow.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedFiltered = [...filtered].sort(
      (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
    );
    setFilteredWorkflows(sortedFiltered);
    setCurrentPage(1);
  }, [searchQuery, workflows]);

  const handlePinToggle = (workflowId: string) => {
    const updatedWorkflows = workflows.map((workflow) =>
      workflow.id === workflowId
        ? { ...workflow, isPinned: !workflow.isPinned }
        : workflow
    );
    const sortedWorkflows = [...updatedWorkflows].sort(
      (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
    );
    setWorkflows(updatedWorkflows);
    setFilteredWorkflows(sortedWorkflows);
  };

  const paginatedData = filteredWorkflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

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
            className="px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            Logout
          </button>
          <button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow cursor-pointer">
            + Create New Process
          </button>
        </div>
      </header>

      <div className="relative w-[340px] h-[32px] pb-[2px] mb-6">
        <input
          type="text"
          placeholder="Search By Workflow Name/ID"
          className="w-[340px] h-[32px] pl-[10px] pr-[40px] text-[14px] border border-gray-300 rounded-md shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <RiSearchLine className="absolute top-[9px] left-[312px] w-[14px] h-[14px] text-gray-500" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <WorkflowTable
            workflows={paginatedData}
            onPinToggle={handlePinToggle}
          />
          <Pagination
            totalItems={filteredWorkflows.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
