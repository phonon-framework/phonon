import Alert from '../../src/js/components/alert';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('Show an alert', async () => {
  document.body.innerHTML = '<div class="alert alert-primary" id="test" role="alert">Test</div>';

  expect(new Alert({ element: '#test' }).show()).toEqual(true);
  expect(new Alert({ element: '#test' }).show()).toEqual(false);
});

test('Show an alert and click on close button', async () => {
  document.body.innerHTML = '<div class="alert alert-primary" id="test" role="alert">' +
    '<button type="button" class="icon-close" data-dismiss="alert" aria-label="Close">' +
      '<span class="icon" aria-hidden="true"></span>' +
    '</button>' +
  '</div>';

  const alerConsumer = new Alert({ element: '#test' });
  (document.querySelector('#test [data-dismiss="alert"]') as HTMLElement).click();

  // The alert is already in the "hidden" state
  expect(alerConsumer.hide()).toEqual(false);
});
