export interface Workflow {
  id: string;
  name: string;
  lastEditedBy: string;
  lastEditedOn: string;
  description: string;
  isPinned?: boolean;
}

export interface WorkflowTableProps {
  workflows: Workflow[];
  onPinToggle: (workflowId: string) => void;
}

export interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workflow: Workflow) => void;
  userEmail: string;
}
