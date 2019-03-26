/**
 * Phonon bundle
 * List of components available as a UMD bundle
 */
import Accordion from './components/accordion';
import Alert from './components/alert';
import Collapse from './components/collapse';
import Loader from './components/loader';
import Modal from './components/modal';
import ModalConfirm from './components/modal-confirm';
import ModalLoader from './components/modal-loader';
import ModalPrompt from './components/modal-prompt';
import Notification from './components/notification';
import OffCanvas from './components/offcanvas';
import Selectbox from './components/selectbox';
import Tab from './components/tab';

import Util from './util.js';

const componentCreator = (component: any, options: any = {}) => {
  return Util.Observer.getComponent(component, options) || new component(options);
};

const api = {
  accordion: (options: any) => componentCreator(Accordion, options),
  alert: (options: any) => componentCreator(Alert, options),
  modal: (options: any) => componentCreator(Modal, options),
  modalConfirm: (options: any) => componentCreator(ModalConfirm, options),
  modalLoader: (options: any) => componentCreator(ModalLoader, options),
  modalPrompt: (options: any) => componentCreator(ModalPrompt, options),
  loader: (options: any) => componentCreator(Loader, options),
  collapse: (options: any) => componentCreator(Collapse, options),
  notification: (options: any) => componentCreator(Notification, options),
  offCanvas: (options: any) => componentCreator(OffCanvas, options),
  tab: (options: any) => componentCreator(Tab, options),
  selectbox: (options: any) => componentCreator(Selectbox, options),
};

// rollup takes care to attach the API to window.phonon
export default Object.assign(api, Util); // keep the utils in the bundle
