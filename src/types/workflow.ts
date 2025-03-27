export interface Workflow {
  id: string;
  name: string;
  lastEditedBy: string;
  lastEditedOn: string;
  description: string;
  isPinned?: boolean;
}
