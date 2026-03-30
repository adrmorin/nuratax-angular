import Swal from 'sweetalert2';

export const NeuralSwal = Swal.mixin({
  customClass: {
    popup: 'neuraltax-swal',
    title: 'neuraltax-swal-title',
    htmlContainer: 'neuraltax-swal-text',
    confirmButton: 'neuraltax-btn neuraltax-btn-primary',
    cancelButton: 'neuraltax-btn neuraltax-btn-secondary'
  },
  buttonsStyling: false,
  reverseButtons: true
});
