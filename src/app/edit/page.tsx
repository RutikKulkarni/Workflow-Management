'use client';

import { useState, useRef } from 'react';

export default function EditPage() {
  const [nodes, setNodes] = useState([
    { id: 'start', type: 'start', content: 'Start' },
    { id: 'end', type: 'end', content: 'End' }
  ]);
  const [showOptions, setShowOptions] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null); // Added type for TypeScript

  const addNode = (type: string) => { // Changed 'any' to 'string' for better typing
    const newNode = {
      id: Date.now().toString(),
      type,
      content: type === 'api' ? 'API Call' : type === 'email' ? 'Email' : 'Text Box'
    };
    
    setNodes(prev => {
      const newNodes = [...prev];
      newNodes.splice(newNodes.length - 1, 0, newNode);
      return newNodes;
    });
    setShowOptions(false);
  };

  const deleteNode = (id: string) => { // Changed 'any' to 'string' for better typing
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSave = () => {
    localStorage.setItem('flowchart', JSON.stringify(nodes));
    alert('Progress saved!');
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={handleBack} 
          className="bg-gray-800 text-white px-4 py-2 rounded mr-4 hover:bg-gray-900"
        >
          Back
        </button>
        <button 
          onClick={handleSave} 
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Save
        </button>
      </div>

      <div className="flex flex-1">
        <div className="w-72 border-r border-gray-200 p-4 overflow-y-auto">
          {nodes.map((node) => (
            <div key={node.id} className="flex items-center mb-4 gap-4">
              <div className="p-4 rounded-lg min-w-[100px] text-center bg-gray-800 text-white">
                {node.content}
              </div>
              {node.type !== 'start' && node.type !== 'end' && (
                <button 
                  onClick={() => deleteNode(node.id)}
                  className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-900"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 p-8" ref={canvasRef}>
          <div className="flex flex-col items-center">
            {nodes.map((node, index) => (
              <div key={node.id} className="flex flex-col items-center">
                <div className="p-4 m-2 rounded-lg min-w-[100px] text-center bg-gray-800 text-white">
                  {node.content}
                </div>
                {index === nodes.length - 2 && (
                  <div className="relative">
                    <button 
                      onClick={() => setShowOptions(true)}
                      className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xl text-white hover:bg-gray-700"
                    >
                      +
                    </button>
                    {showOptions && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded p-2 flex flex-col gap-2 z-10">
                        <button 
                          onClick={() => addNode('api')}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-black"
                        >
                          API Call
                        </button>
                        <button 
                          onClick={() => addNode('email')}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-black"
                        >
                          Email
                        </button>
                        <button 
                          onClick={() => addNode('text')}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-black"
                        >
                          Text Box
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {index < nodes.length - 1 && (
                  <div className="text-2xl my-2 text-black">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useSnackbar } from "notistack";
// import { Workflow } from "@/types/workflow";
// import { FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

// type NodeType = "start" | "end" | "api" | "email" | "text" | "connection";
// type Node = {
//   id: string;
//   type: NodeType;
//   position: { x: number; y: number };
//   content?: string;
// };

// export default function WorkflowEditPage() {
//   const router = useRouter();
//   const params = useParams();
//   const { enqueueSnackbar } = useSnackbar();
//   const workflowId = params.id as string;

//   console.log("Workflow ID from params:", workflowId); // Debug log

//   const [workflow, setWorkflow] = useState<Workflow | null>(null);
//   const [nodes, setNodes] = useState<Node[]>([
//     { id: "start", type: "start", position: { x: 100, y: 300 } },
//     { id: "end", type: "end", position: { x: 600, y: 300 } },
//     { id: "conn1", type: "connection", position: { x: 0, y: 0 } },
//   ]);
//   const [showAddOptions, setShowAddOptions] = useState(false);

//   useEffect(() => {
//     const fetchWorkflow = async () => {
//       try {
//         const response = await fetch(`/api/workflows/${workflowId}`);
//         if (!response.ok) throw new Error("Workflow not found");
//         const data = await response.json();
//         setWorkflow(data);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         enqueueSnackbar("Failed to load workflow", { variant: "error" });
//       }
//     };
//     fetchWorkflow();
//   }, [workflowId, enqueueSnackbar]);

//   const handleSave = async () => {
//     try {
//       const updatedWorkflow = {
//         ...workflow,
//         process: JSON.stringify(nodes),
//         lastEditedOn: new Date().toISOString(),
//       };
//       const response = await fetch(`/api/workflows/${workflowId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedWorkflow),
//       });
//       if (!response.ok) throw new Error("Save failed");
//       enqueueSnackbar("Workflow saved successfully", { variant: "success" });
//     } catch (error) {
//       enqueueSnackbar("Failed to save workflow", { variant: "error" });
//     }
//   };

//   const handleAddNode = (type: "api" | "email" | "text") => {
//     const newNode: Node = {
//       id: `${type}-${Date.now()}`,
//       type,
//       position: { x: 350, y: 300 },
//       content: `${type.toUpperCase()} Task`,
//     };
//     setNodes([...nodes, newNode]);
//     setShowAddOptions(false);
//   };

//   const handleDeleteNode = (nodeId: string) => {
//     setNodes(nodes.filter((node) => node.id !== nodeId));
//   };

//   if (!workflow) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => router.back()}
//             className="p-2 rounded hover:bg-gray-200"
//           >
//             <FaArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-2xl font-semibold">{workflow.name} - Edit</h1>
//         </div>
//         <button
//           onClick={handleSave}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           <FaSave /> Save
//         </button>
//       </div>
//       {/* Rest of your canvas code remains the same */}
//       <div className="relative w-full h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
//         {nodes.map((node) => (
//           <React.Fragment key={node.id}>
//             {node.type === "start" && (
//               <div
//                 className="absolute w-24 h-12 bg-green-500 text-white rounded-full flex items-center justify-center"
//                 style={{ left: node.position.x, top: node.position.y }}
//               >
//                 Start
//               </div>
//             )}
//             {node.type === "end" && (
//               <div
//                 className="absolute w-24 h-12 bg-red-500 text-white rounded-full flex items-center justify-center"
//                 style={{ left: node.position.x, top: node.position.y }}
//               >
//                 End
//               </div>
//             )}
//             {["api", "email", "text"].includes(node.type) && (
//               <div
//                 className="absolute w-40 h-20 bg-blue-100 border border-blue-300 rounded flex items-center justify-between p-2"
//                 style={{ left: node.position.x, top: node.position.y }}
//               >
//                 <span>{node.content}</span>
//                 <button
//                   onClick={() => handleDeleteNode(node.id)}
//                   className="p-1 text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             )}
//           </React.Fragment>
//         ))}
//         <svg className="absolute w-full h-full pointer-events-none">
//           <line
//             x1={150}
//             y1={324}
//             x2={600}
//             y2={324}
//             stroke="gray"
//             strokeWidth="2"
//             markerEnd="url(#arrow)"
//           />
//           <defs>
//             <marker
//               id="arrow"
//               markerWidth="10"
//               markerHeight="10"
//               refX="8"
//               refY="3"
//               orient="auto"
//             >
//               <path d="M0,0 L0,6 L9,3 z" fill="gray" />
//             </marker>
//           </defs>
//         </svg>
//         <button
//           className="absolute w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
//           style={{ left: 350, top: 310 }}
//           onClick={() => setShowAddOptions(!showAddOptions)}
//         >
//           <FaPlus />
//         </button>
//         {showAddOptions && (
//           <div
//             className="absolute bg-white border rounded shadow-lg p-2 flex flex-col gap-2"
//             style={{ left: 200, top: 300 }}
//           >
//             <button
//               onClick={() => handleAddNode("api")}
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               API Call
//             </button>
//             <button
//               onClick={() => handleAddNode("email")}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//             >
//               Email
//             </button>
//             <button
//               onClick={() => handleAddNode("text")}
//               className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
//             >
//               Text Box
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
