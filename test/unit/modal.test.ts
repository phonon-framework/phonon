import Modal from '../../src/js/components/modal';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('Create a modal', async () => {
  const modalConsumer = new Modal({
    element: null,
    title: 'Hello',
    message: 'World',
    buttons: [
      { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
      { event: 'confirm', text: 'Danger', dismiss: true, class: 'btn btn-danger' },
      { event: 'confirm', text: 'Danger', dismiss: true, class: 'btn btn-danger' },
      { event: 'confirm', text: 'Danger', dismiss: false, class: 'btn btn-danger' },
    ],
  });

  expect((document.querySelector('.modal-title') as HTMLElement).innerHTML).toBe('Hello');
  expect((document.querySelector('.modal-body p') as HTMLElement).innerHTML).toBe('World');

  // Dismiss buttons
  expect((document
    .querySelectorAll('.modal .btn[data-dismiss="modal"]') as NodeListOf<HTMLElement>)
    .length).toBe(3);

  // Not dismiss buttons
  expect((document
    .querySelectorAll('.modal .btn:not([data-dismiss="modal"])') as NodeListOf<HTMLElement>)
    .length).toBe(1);

  expect(typeof modalConsumer.getId()).toBe('string');
});

test('Create a modal, show it then hide it programmatically', async () => {
  const modalConsumer = new Modal({ element: null });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(2000);

  // Already visible test
  expect(modalConsumer.show()).toEqual(false);

  // Hide visible modal
  expect(modalConsumer.hide()).toEqual(true);

  // Hide unvisible modal
  expect(modalConsumer.hide()).toEqual(false);
});

test('Create a modal, show it and click on backdrop to close it', async () => {
  const modalConsumer = new Modal({ element: null });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(500);

  // Backdrop interaction
  (document.querySelector('.modal-backdrop') as HTMLElement)
    .dispatchEvent(new MouseEvent('mousedown', { view: window, cancelable: true, bubbles: true }));

  await timeout(500);

  expect(modalConsumer.hide()).toEqual(false);
});

test('Create a modal, show it and press Escape to close it', async () => {
  const modalConsumer = new Modal({ element: null });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(500);

  // @ts-ignore
  document.dispatchEvent(new KeyboardEvent('keyup', { which: 27, keyCode: 27 }));

  await timeout(500);

  expect(modalConsumer.hide()).toEqual(false);
});

test('Create a modal, show it and click on a button to close it', async () => {
  const modalConsumer = new Modal({ element: null });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(500);

  // Button interaction
  (document.querySelector('[type="button"][data-dismiss="modal"]') as HTMLElement).click();

  await timeout(500);

  expect(modalConsumer.hide()).toEqual(false);
});

test('Create an uncancelable modal, show it and click on backdrop', async () => {
  const modalConsumer = new Modal({ element: null, cancelable: false });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(500);

  // Backdrop interaction
  (document.querySelector('.modal-backdrop') as HTMLElement)
    .dispatchEvent(new MouseEvent('mousedown', { view: window, cancelable: true, bubbles: true }));

  await timeout(500);

  expect(modalConsumer.hide()).toEqual(true);
});

test('Create an uncancelable modal, show it and press Escape', async () => {
  const modalConsumer = new Modal({ element: null, cancelable: false });

  // Show
  expect(modalConsumer.show()).toEqual(true);

  await timeout(500);

  // @ts-ignore
  document.dispatchEvent(new KeyboardEvent('keyup', { which: 27, keyCode: 27 }));

  await timeout(500);

  expect(modalConsumer.hide()).toEqual(true);
});
