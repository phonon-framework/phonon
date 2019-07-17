import Accordion from '../../src/js/components/accordion';

beforeEach(() => {
  document.body.innerHTML = '';
});

test('Click on first collapsible item', async () => {
  document.body.innerHTML = '<div class="accordion" id="test" role="tablist">' +
  '<a class="accordion-title" data-toggle="accordion" href="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
    'Collapsible Group Item #1' +
    '<button class="collapse-toggle icon-plus" type="button">' +
      '<span class="icon"></span>' +
    '</button>' +
  '</a>' +
  '<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">' +
    '<div class="card-body">' +
      'This is the content of the group item #1.' +
    '</div>' +
  '</div>' +
  '<a class="accordion-title" data-toggle="accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseOne">' +
    'Collapsible Group Item #2' +
    '<button class="collapse-toggle icon-plus" type="button">' +
      '<span class="icon"></span>' +
    '</button>' +
  '</a>' +
  '<div id="collapseTwo" class="collapse" role="tabpane2" aria-labelledby="headingTwo">' +
    '<div class="card-body">' +
      'This is the content of the group item #2.' +
    '</div>' +
  '</div>' +
'</div>';

  const accordionConsumer = new Accordion({ element: '#test' });

  expect(accordionConsumer.show('#collapseOne')).toEqual(true);
});
