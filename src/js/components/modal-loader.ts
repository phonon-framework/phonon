/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Loader from './loader';
import Modal, { IProps } from './modal';

export default class ModalLoader extends Modal {

  private loader: Loader|null = null;

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
      },
                    props,
      ),
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
            + '<div class="mx-auto text-center">'
              + '<div class="loader mx-auto d-block">'
                + '<div class="loader-spinner"></div>'
              + '</div>'
            + '</div>'
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

  public show(): boolean {
    super.show();

    this.loader = new Loader({ element: this.getElement().querySelector('.loader') });
    this.loader.animate(true);

    return true;
  }

  public hide(): boolean {
    super.hide();

    if (this.loader) {
      this.loader.animate(false);
    }

    this.loader = null;

    return true;
  }
}
