import Modal from '../../src/js/components/modal';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('Create a modal, show it then hide it', async () => {
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
