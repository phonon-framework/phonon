/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Modal, { IProps } from './modal';

interface IModalPromptProps extends IProps {
  inputValue?: string;
}

export default class ModalPrompt extends Modal {

  /**
   *
   * @param props
   */
  constructor(props: IModalPromptProps) {
    super(
      Object.assign({
        buttons: [
          { event: 'cancel', text: 'Cancel', dismiss: true, class: 'btn btn-secondary' },
          { event: 'confirm', text: 'Ok', dismiss: true, class: 'btn btn-primary' },
        ],
        inputValue: '',
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
            + '<input class="form-control" type="text" value="">'
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

  /**
   * Shows the prompt
   * @returns {Boolean}
   */
  public show(): boolean {
    super.show();

    const defaultValue = this.getProp('inputValue');

    if (typeof defaultValue === 'string') {
      this.setInputValue(defaultValue);
    }

    this.attachInputEvent();

    return true;
  }

  /**
   * Hides the prompt
   * @returns {Boolean}
   */
  public hide(): boolean {
    super.hide();
    this.detachInputEvent();

    return true;
  }

  public setInputValue(value: string = '') {
    this.getInput().value = value;
  }

  public getInputValue(): string {
    return this.getInput().value;
  }

  public onElementEvent(event: Event) {
    if (event.target === this.getInput()) {
      return;
    }
  }

  private getInput(): HTMLInputElement {
    return this.getElement().querySelector('.form-control');
  }

  private attachInputEvent(): void {
    this.registerElement({ target: this.getInput(), event: 'keyup' });
  }

  private detachInputEvent(): void {
    this.unregisterElement({ target: this.getInput(), event: 'keyup' });
  }
}
