/* eslnt no-undef: 0 */
import { Selector, ClientFunction } from 'testcafe';

fixture `Modal`
  .page `./test.html`;


test('Build a modal without a title and message', async (t) => {
  await ClientFunction(() => {
    return phonon.modal().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').exists).ok()
    .expect(Selector('.modal.show .modal-title').innerText).eql('')
    .expect(Selector('.modal.show .modal-body').innerText).eql('')
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Build the same modal with jQuery', async (t) => {
  await ClientFunction(() => {
    return $().modal().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').exists).ok()
    .expect(Selector('.modal.show .modal-title').innerText).eql('')
    .expect(Selector('.modal.show .modal-body').innerText).eql('')
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Build a modal with a title and a message', async (t) => {
  const title = 'My Title';
  const message = 'My message';

  await ClientFunction((title, message) => {
    return phonon.modal({ title, message }).show();
  })(title, message);

  await t
    .wait(1000)
    .expect(Selector('.modal.show .modal-title').innerText).eql(title)
    .expect(Selector('.modal.show .modal-body p').innerText).eql(message)
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Build a modal with a title, a message and custom buttons', async (t) => {
  const title = 'My Title';
  const message = 'My message';
  const eventName = 'myEvent';
  const buttons = [
    {
      event: eventName,
      text: 'Custom button',
      dismiss: true,
      class: 'btn btn-primary',
    },
  ];

  // await t.eval(new Function(`phonon.modal({title: "${title}", message: "${message}", buttons: ${JSON.stringify(buttons)}}).show();`))

  await ClientFunction((title, message, buttons) => {
    return phonon.modal({ title, message, buttons }).show();
  })(title, message, buttons);

  await t
    .wait(1000)
    .expect(Selector('.modal.show .modal-title').innerText).eql(title)
    .expect(Selector('.modal.show .modal-body p').innerText).eql(message)
    .expect(Selector(`.modal-footer [data-event="${eventName}"]`).innerText).eql('Custom button')
    // close the modal with the custom button
    .click(`.modal-footer [data-event="${eventName}"]`)
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Show a modal from a button', async (t) => {
  const title = 'Modal title';
  const message = 'Modal body text goes here.';

  await t
    .click('[data-target="#exampleModal"]')
    .wait(1000)
    .expect(Selector('.modal.show .modal-title').innerText).eql(title)
    .expect(Selector('.modal.show .modal-body p').innerText).eql(message)
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Close a cancelable modal with Escape key', async (t) => {
  await ClientFunction(() => {
    return phonon.modal().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').exists).ok()
    .expect(Selector('.modal.show .modal-title').innerText).eql('')
    .expect(Selector('.modal.show .modal-body').innerText).eql('')
    .pressKey('esc')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Close a cancelable modal by clicking on the backdrop', async (t) => {
  await ClientFunction(() => {
    return phonon.modal().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').exists).ok()
    .expect(Selector('.modal.show .modal-title').innerText).eql('')
    .expect(Selector('.modal.show .modal-body').innerText).eql('')
    .click('.modal-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Test uncancelable modal and then close with a button', async (t) => {
  await ClientFunction(() => {
    return phonon.modal({ cancelable: false }).show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').exists).ok()
    .pressKey('esc')
    .wait(1000)
    .expect(Selector('.modal.show').count).eql(1)
    .click('.modal-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.modal.show').count).eql(1)
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});

test('Test open 2 modals', async (t) => {
  await ClientFunction(() => {
    phonon.modal().show();
    phonon.modal().show();
  })();

  await t
    .wait(1000)
    .expect(Selector('.modal.show').count).eql(2)
    .click('.modal-backdrop', { offsetX: 5, offsetY: 5 })
    .wait(1000)
    .expect(Selector('.modal.show').count).eql(1)
    .click('.modal.show .btn-primary')
    .wait(1000)
    .expect(Selector('.modal.show').exists).notOk();
});
