/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Modal, { IProps } from './modal';

export default class ModalConfirm extends Modal {

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super(
      Object.assign({
        buttons: [
          { event: 'cancel', text: 'Cancel', dismiss: true, class: 'btn btn-secondary' },
          { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
        ],
      },            props),
      false,
    );

    this.setTemplate(''
      + '<div class="modal" tabindex="-1" role="modal" data-no-boot>'
      + '<div class="modal-inner" role="document">'
        + '<div class="modal-content">'
          + '<div class="modal-header">'
            + '<h5 class="modal-title"></h5>'
            + '<button type="button" class="icon-close" data-dismiss="modal" aria-label="Close">'
              + '<span class="icon" aria-hidden="true"></span>'
            + '</button>'
          + '</div>'
          + '<div class="modal-body">'
            + '<p></p>'
          + '</div>'
          + '<div class="modal-footer">'
          + '</div>'
        + '</div>'
      + '</div>'
    + '</div>');

    if (this.getElement() === null) {
      this.build();
    }
  }
}
