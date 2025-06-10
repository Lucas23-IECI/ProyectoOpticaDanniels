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
