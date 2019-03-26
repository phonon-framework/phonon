import Component from '../component';
import { Color, Size } from '../mixins';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|string;  // the element must exist
  color?: Color;
  size?: Size;
}

export default class Loader extends Component {

  /**
   *
   * @param props
   */
  constructor(props: IProps = { color: Color.primary, size: Size.md }) {
    super('loader', { fade: true, size: Size.md, color: Color.primary }, props);

    // no-template: loader is not a dynamic component
  }

  /**
   * Shows the alert
   * @returns {Boolean}
   */
  public show(): boolean {
    const element = this.getElement();

    if (element.classList.contains('hide')) {
      element.classList.remove('hide');
    }

    this.triggerEvent(Util.Event.SHOW);

    // set size
    const size = this.getProp('size');

    Util.Selector.removeClasses(element, Object.values(Size), 'loader');
    element.classList.add(`loader-${size}`);

    // set color
    const color = this.getProp('color');
    const spinner = this.getSpinner();

    Util.Selector.removeClasses(spinner, Object.values(Color), 'loader');
    spinner.classList.add(`loader-${color}`);

    this.triggerEvent(Util.Event.SHOWN);

    return true;
  }

  public animate(startAnimation: boolean = true): boolean {
    if (startAnimation) {
      this.show();
    } else {
      this.hide();
    }

    const loaderSpinner = this.getSpinner();

    if (startAnimation
      && !loaderSpinner.classList.contains('loader-spinner-animated')) {
      loaderSpinner.classList.add('loader-spinner-animated');
      return true;
    }

    if (!startAnimation
      && loaderSpinner.classList.contains('loader-spinner-animated')) {
      loaderSpinner.classList.remove('loader-spinner-animated');
    }

    return true;
  }

  public hide(): boolean {
    const element = this.getElement();

    if (!element.classList.contains('hide')) {
      element.classList.add('hide');
    }

    this.triggerEvent(Util.Event.HIDE);
    this.triggerEvent(Util.Event.HIDDEN);

    return true;
  }

  private getSpinner(): HTMLElement {
    return this.getElement().querySelector('.loader-spinner');
  }
}
