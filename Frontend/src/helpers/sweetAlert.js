import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
    Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#3085d6',
    });
};

export const showErrorAlert = (title, text) => {
    Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#d33',
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
    });
    return result.isConfirmed;
};
