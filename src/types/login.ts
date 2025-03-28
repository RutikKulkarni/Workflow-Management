export interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  error: string | null;
}