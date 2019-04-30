/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|string; // the element must exist
  height?: number;
  min?: number;
  max?: number;
  now?: number;
  label?: boolean;
  striped?: boolean;
  animate?: boolean;
  background?: null|string;
}

export default class Progress extends Component {

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'progress',
      onAdded(element, create) {
        create(new Progress({ element }));
      },
      onRemoved(element, remove) {
        remove('Progress', element);
      },
    });
  }

  private onTransition: boolean = false;

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super('progress', {
      height: 8,
      min: 0,
      max: 100,
      now: 0,
      label: false,
      striped: false,
      animate: true,
      background: null,
    },    props);

    // no-template: progress is not a dynamic component

    // Set progress bar height
    this.setHeight();

    // ARIA accessibility
    this.setAccessibility();

    // Striped
    if (this.getProp('striped')) {
      this.setStriped();
    }

    // Background
    if (this.getProp('background')) {
      this.setBackground();
    }

    // Set current value
    this.set(this.getProp('now'));
  }

  public set(value: number = 0): boolean {
    const progressBar = this.getProgressBar();
    const min = this.getProp('min');
    const max = this.getProp('max');

    const progress: number = Math.round((value / (min + max)) * 100);

    if (value < min) {
      console.error(`Progress: Warning, ${value} is under min value.`);
      return false;
    }

    if (value > max) {
      console.error(`Progress: Warning, ${value} is above max value.`);
      return false;
    }

    progressBar.setAttribute('aria-valuenow', `${value}`);

    // Set label
    if (this.getProp('label')) {
      progressBar.innerHTML = `${progress}%`;
    }

    // Set percentage
    progressBar.style.width = `${progress}%`;

    return true;
  }

  public animateProgressBar(startAnimation: boolean = true): boolean {
    if (!this.getProp('striped')) {
      throw new Error('Progress: Animation works only with striped progress.');
      return false;
    }

    const progressBar = this.getProgressBar();

    if (startAnimation && !progressBar.classList.contains('progress-bar-animated')) {
      progressBar.classList.add('progress-bar-animated');
    }

    if (!startAnimation && progressBar.classList.contains('progress-bar-animated')) {
      progressBar.classList.remove('progress-bar-animated');
    }

    return true;
  }

  /**
   * Shows the progress bar
   * @returns {Boolean}
   */
  public show(): boolean {
    const progress = this.getElement();
    progress.style.height = `${this.getProp('height')}px`;

    this.triggerEvent(Util.Event.SHOW);
    this.triggerEvent(Util.Event.SHOWN);

    return true;
  }

  /**
   * Hides the progress bar
   * @returns {Boolean}
   */
  public hide(): boolean {
    const progress = this.getElement();
    progress.style.height = '0px';

    this.triggerEvent(Util.Event.HIDE);
    this.triggerEvent(Util.Event.HIDDEN);

    return true;
  }

  public destroy(): void {
    this.unregisterElements();
    this.hide();
  }

  private setHeight(): void {
    this.getElement().style.height = `${this.getProp('height')}px`;
  }

  private setAccessibility(): void {
    const progress = this.getElement();
    progress.setAttribute('aria-valuemin', `${this.getProp('min')}`);
    progress.setAttribute('aria-valuemax', `${this.getProp('max')}`);
  }

  private setStriped(): void {
    this.getProgressBar().classList.add('progress-bar-striped');

    if (this.getProp('animate')) {
      this.animateProgressBar();
    }
  }

  private setBackground(): void {
    const progressBar = this.getProgressBar();
    const background = this.getProp('background');

    if (progressBar.classList.contains(`bg-${background}`)) {
      progressBar.classList.add(`bg-${background}`);
    }
  }

  private getProgressBar(): HTMLElement {
    return this.getElement().querySelector('.progress-bar');
  }
}

// static boot
Progress.attachDOM();
