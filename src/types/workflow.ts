export interface Workflow {
  id: string;
  name: string;
  lastEditedBy: string;
  lastEditedOn: string;
  description: string;
  isPinned?: boolean;
  process?: string;
}

export interface WorkflowTableProps {
  workflows: Workflow[];
  onPinToggle: (workflowId: string) => void;
  onDelete?: (workflowId: string) => void;
}

export interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (workflow: Workflow) => void;
  userEmail: string;
}

export interface ExecuteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workflowName: string;
}
