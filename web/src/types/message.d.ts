type IDialog = {
  id?: string;
  visible: boolean;
  type: 'success' | 'danger' | 'warning';
  title: string;
  description?: string;
  button_span: string;
};
