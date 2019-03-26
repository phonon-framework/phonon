/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|string;  // the element must exist
  toggle?: boolean;
}

export default class Collapse extends Component {

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  public static attachDOM(): void {
    const className = 'collapse';

    Util.Observer.subscribe({
      componentClass: className,
      onAdded(element, create) {
        create(new Collapse({ element }));
      },
      onRemoved(element, remove) {
        remove('Collapse', element);
      },
    });

    document.addEventListener(Util.Event.CLICK, (event: Event) => {
      if (!event.target) {
        return;
      }

      const target = Util.Selector.closest(event.target as HTMLElement, '[data-toggle]');

      if (!target) {
        return;
      }

      const dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === className) {
        const id = target.getAttribute('data-target') || target.getAttribute('href');

        if (!id) {
          return;
        }

        // prevent default
        event.preventDefault();

        const collapse: HTMLElement|null = document.querySelector(id);

        if (!collapse) {
          return;
        }

        const collapseComponent = Util.Observer.getComponent(className, { element: collapse });

        if (!collapseComponent) {
          return;
        }

        // force toggle
        collapseComponent.toggle({ element: collapse, toggle: true });
      }
    });
  }

  /**
   *
   * @param props
   */
  constructor(props: IProps = { toggle: false }) {
    super('collapse', { toggle: false }, props);
    // no-template: collapse is not a dynamic component

    const toggle = this.getProp('toggle');

    if (toggle) {
      // toggle directly
      this.toggle();
    }
  }

  public getHeight(): number {
    return this.getElement().getBoundingClientRect(this.getElement()).height;
  }

  public toggle() {
    if (this.isVisible()) {
      return this.hide();
    }

    return this.show();
  }
  /**
   * Shows the collapse
   * @returns {Boolean}
   */
  public show(): boolean {
    const element = this.getElement();

    if (element.classList.contains('collapsing') || this.isVisible()) {
      return false;
    }

    this.triggerEvent(Util.Event.SHOW);

    const onCollapsed = () => {
      this.triggerEvent(Util.Event.SHOWN);

      element.classList.add('show');
      element.classList.remove('collapsing');
      element.removeEventListener(Util.Event.TRANSITION_END, onCollapsed);

      element.setAttribute('aria-expanded', true);

      // reset the normal height after the animation
      element.style.height = 'auto';
    };

    if (!element.classList.contains('collapsing')) {
      element.classList.add('collapsing');
    }

    element.addEventListener(Util.Event.TRANSITION_END, onCollapsed);

    // get real height
    const height = this.getHeight();

    element.style.height = '0px';

    setTimeout(() => {
      element.style.height = `${height}px`;
    },         20);

    return true;
  }

  /**
   * Hides the collapse
   * @returns {Boolean}
   */
  public hide(): boolean {
    const element = this.getElement();

    if (element.classList.contains('collapsing')) {
      return false;
    }

    if (!element.classList.contains('show')) {
      return false;
    }

    this.triggerEvent(Util.Event.HIDE);

    const onCollapsed = () => {
      this.triggerEvent(Util.Event.HIDDEN);

      element.classList.remove('collapsing');
      element.style.height = 'auto';
      element.removeEventListener(Util.Event.TRANSITION_END, onCollapsed);

      element.setAttribute('aria-expanded', false);
    };

    // transform auto height by real height in px
    element.style.height = `${element.offsetHeight}px`;

    setTimeout(() => {
      element.style.height = '0px';
    },         20);

    element.addEventListener(Util.Event.TRANSITION_END, onCollapsed);

    if (!element.classList.contains('collapsing')) {
      element.classList.add('collapsing');
    }

    element.classList.remove('show');

    return true;
  }

  // used by accordion
  public isVisible(): boolean {
    return this.getElement().classList.contains('show');
  }
}

// static boot
Collapse.attachDOM();
