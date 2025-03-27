"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BsPinAngle } from "react-icons/bs";
import { IoArrowDownSharp } from "react-icons/io5";
import { RxDotsVertical } from "react-icons/rx";
import { RiSearchLine } from "react-icons/ri";
import { HiMenuAlt2 } from "react-icons/hi";
import { getCurrentUser, logout } from "@/lib/auth";

interface Workflow {
  id: string;
  name: string;
  lastEditedBy: string;
  lastEditedOn: string;
  description: string;
}

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
        setWorkflows(response.data.workflows);
        setFilteredWorkflows(response.data.workflows);
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
    setFilteredWorkflows(filtered);
    setCurrentPage(1);
  }, [searchQuery, workflows]);

  const paginatedData = filteredWorkflows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <div className="flex items-center mb-6">
        <div className="flex items-center">
          <HiMenuAlt2 className="w-6 h-6 mr-4" />
          <h1 className="text-3xl font-semibold">Workflow Builder</h1>
        </div>
        <button className="bg-black hover:bg-black-700 text-white px-5 py-2 rounded-lg shadow ml-auto">
          + Create New Process
        </button>
      </div> */}
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <HiMenuAlt2 className="w-6 h-6 mr-4" />
          <h1 className="text-3xl font-semibold">Workflow Builder</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-700">Welcome, {user.email}</span>
          <button
            onClick={handleLogout}
            className=" px-4 py-2 rounded-lg shadow cursor-pointer"
          >
            Logout
          </button>
          <button className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow cursor-pointer">
            + Create New Process
          </button>
        </div>
      </div>

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

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
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
                {paginatedData.length > 0 ? (
                  paginatedData.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-100">
                      <td className="p-3">{workflow.name}</td>
                      <td className="p-3 text-center text-gray-600">
                        {workflow.id}
                      </td>
                      <td className="p-3 text-left text-gray-600">
                        {workflow.lastEditedBy} | {workflow.lastEditedOn}
                      </td>
                      <td className="p-3 text-gray-600">
                        {workflow.description}
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <p className="px-3 py-2 rounded">
                          <BsPinAngle />
                        </p>
                        <button className="w-[71px] h-[32px] border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100">
                          Execute
                        </button>
                        <button className="w-[71px] h-[32px] border border-gray-300 rounded-[6px] px-[12px] py-[7px] text-sm bg-white hover:bg-gray-100">
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

            <div className="flex justify-end mt-12 space-x-2 pr-8">
              {Array.from(
                { length: Math.ceil(filteredWorkflows.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ease-in-out ${
                      currentPage === i + 1
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
