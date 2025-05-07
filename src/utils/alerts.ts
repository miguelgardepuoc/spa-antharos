import Swal, { SweetAlertResult } from 'sweetalert2';

interface ConfirmationOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

interface AlertOptions {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
}

export const showConfirmationAlert = async (options: ConfirmationOptions): Promise<SweetAlertResult> => {
  return await Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'question',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Continuar',
    cancelButtonText: options.cancelButtonText || 'Cancelar',
  });
};

type SweetAlertIcon = 'warning' | 'error' | 'success' | 'info' | 'question';

export const showAlert = async (options: AlertOptions): Promise<void> => {
  await Swal.fire({
    title: options.title,
    text: options.text,
    icon: options.icon || 'info',
    confirmButtonText: options.confirmButtonText || 'OK'
  });
};