import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
    Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#3085d6',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
};

export const showErrorAlert = (title, text) => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#d33',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            popup: 'error-alert-popup',
            title: 'error-alert-title',
            content: 'error-alert-content'
        }
    });
};

export const showValidationAlert = (title, text, field) => {
    Swal.fire({
        icon: 'warning',
        title: `❌ Error en: ${field}`,
        text,
        confirmButtonColor: '#f39c12',
        timer: 3500,
        timerProgressBar: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            popup: 'validation-alert-popup',
            title: 'validation-alert-title',
            content: 'validation-alert-content'
        }
    });
};

export const showConfirmAlert = async (title, text, confirmText = 'Sí, confirmar') => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    return result.isConfirmed;
};
