import { create } from "zustand";

export type NodeType = "start" | "end" | "api" | "email" | "textbox";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  color: string;
  position?: { x: number; y: number };
}

interface WorkflowState {
  nodes: WorkflowNode[];
  zoom: number;
  history: WorkflowNode[][];
  currentHistoryIndex: number;
  addNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  setZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [
    { id: "start", type: "start", label: "Start", color: "#839e4b" },
    { id: "end", type: "end", label: "End", color: "#ee3425" },
  ],
  zoom: 1,
  history: [],
  currentHistoryIndex: -1,

  addNode: (node) =>
    set((state) => {
      const newNodes = [...state.nodes, node];
      const newHistory = [
        ...state.history.slice(0, state.currentHistoryIndex + 1),
        newNodes,
      ];
      return {
        nodes: newNodes,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      };
    }),

  removeNode: (id) =>
    set((state) => {
      const newNodes = state.nodes.filter((node) => node.id !== id);
      const newHistory = [
        ...state.history.slice(0, state.currentHistoryIndex + 1),
        newNodes,
      ];
      return {
        nodes: newNodes,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1,
      };
    }),

  setZoom: (zoom) => set({ zoom }),

  undo: () =>
    set((state) => {
      if (state.currentHistoryIndex <= 0) return state;
      return {
        nodes: state.history[state.currentHistoryIndex - 1],
        currentHistoryIndex: state.currentHistoryIndex - 1,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.currentHistoryIndex >= state.history.length - 1) return state;
      return {
        nodes: state.history[state.currentHistoryIndex + 1],
        currentHistoryIndex: state.currentHistoryIndex + 1,
      };
    }),
}));
