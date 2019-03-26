// Use Phonon bundle
// const phonon = require('../../../dist/js/phonon');

// Or CommonJS component
const Modal = require('../../../dist/js/components/modal');

function showModal() {
  const options = {
    title: 'Modal title',
    message: 'Modal body text goes here.',
  };

  /*
  // with Phonon bundle (UMD)
  const modal = phonon.modal(options);
  */

  // with Phonon component (CommonJS)
  const modal = new Modal(options);

  modal.show();
}

document.querySelector('#createModal').addEventListener('click', showModal);
