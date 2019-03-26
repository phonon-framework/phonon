// phonon bundle
const phonon = require('../../../dist/js/phonon');

function showModal() {
  const modal = phonon.modal({
    title: 'Modal title',
    message: 'Modal body text goes here.',
  });

  modal.show();
}

document.querySelector('#createModal').addEventListener('click', showModal);
