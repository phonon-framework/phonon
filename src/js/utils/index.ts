import dispatch from './dispatch';
import errorHandler from './error';
import events from './events';
import observer from './observer';
import selector from './selector';
import sleep from './sleep';

// global exception handler
errorHandler();

export default {
  sleep,
  Event: events,
  Dispatch: dispatch,
  Selector: selector,
  Observer: observer,
};
