export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'default' | 'error';
}
