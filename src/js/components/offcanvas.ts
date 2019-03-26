/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element: HTMLElement|string; // the element must exist
  container?: HTMLElement|HTMLDocument;
  toggle?: false;
  closableKeyCodes?: [
    27 // Escape
  ];
  aside?: {
    md: false,
    lg: true,
    xl: true,
  };
}

interface IMediaSize {
  name: string;
  media: MediaQueryList;
}

export default class OffCanvas extends Component {

  public static attachDOM(): void {
    const className = 'offcanvas';

    Util.Observer.subscribe({
      componentClass: className,
      onAdded(element, create) {
        create(new OffCanvas({ element }));
      },
      onRemoved(element, remove) {
        remove('OffCanvas', element);
      },
    });

    document.addEventListener(Util.Event.CLICK, (event: Event) => {
      const target: HTMLElement|null = event.target as HTMLElement;

      if (!target) {
        return;
      }

      const dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === className) {
        const selector: string|null = target.getAttribute('data-target');

        if (!selector) {
          return;
        }

        const offCanvas: HTMLElement|null = document.querySelector(selector);

        if (!offCanvas) {
          return;
        }

        const offCanvasComponent = Util.Observer.getComponent(className, { element: offCanvas });

        if (!offCanvasComponent) {
          return;
        }

        // remove the focus state of the trigger
        target.blur();

        offCanvasComponent.toggle();
      }
    });
  }

  private currentWidthName: string|null = null;
  private animate: boolean = true;
  private showAside: boolean = false;
  private directions: string[] = ['left', 'right'];
  private direction: string|null = null;
  private sizes: IMediaSize[] = [];
  private backdropSelector: string = 'offcanvas-backdrop';

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super('off-canvas', {
      toggle: false,
      closableKeyCodes: [27],
      container: document.body,
      aside: {
        md: false,
        lg: true,
        xl: true,
      },
    },    props);

    // no-template: off-canvas is not a dynamic component

    const sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') };
    const md = { name: 'md', media: window.matchMedia('(min-width: 768px)') };
    const lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') };
    const xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') };

    this.sizes = [sm, md, lg, xl].reverse();

    this.checkDirection();
    this.checkWidth();

    const toggle = this.getProp('toggle');

    if (toggle) {
      this.toggle();
    }

    window.addEventListener('resize', () => this.checkWidth(), false);
  }

  public checkDirection(): void {
    const element = this.getElement();

    this.directions.every((direction) => {
      if (element.classList.contains(`offcanvas-${direction}`)) {
        this.direction = direction;
        return false;
      }
      return true;
    });
  }

  public checkWidth(): void {
    if (!('matchMedia' in window)) {
      return;
    }

    const size: IMediaSize|undefined = this.sizes.find((s: IMediaSize) => {
      const mediaQuery = s.media;
      const match = mediaQuery.media.match(/[a-z]?-width:\s?([0-9]+)/);
      return match && mediaQuery.matches ? true : false;
    });

    if (!size) {
      return;
    }

    this.setAside(size.name);
  }

  public setAside(sizeName): void {
    if (this.currentWidthName === sizeName) {
      return;
    }

    this.currentWidthName = sizeName;

    const content = this.getProp('container');
    const aside = this.getProp('aside');

    this.showAside = aside[sizeName] === true;

    if (aside[sizeName] === true) {
      if (!content.classList.contains(`offcanvas-aside-${this.direction}`)) {
        content.classList.add(`offcanvas-aside-${this.direction}`);
      }

      // avoid animation by setting animate to false
      this.animate = false;
      // remove previous backdrop
      if (this.getBackdrop()) {
        this.removeBackdrop();
      }

      if (this.isVisible() && !content.classList.contains('show')) {
        content.classList.add('show');
      } else if (!this.isVisible() && content.classList.contains('show')) {
        content.classList.remove('show');
      }
    } else {
      if (content.classList.contains(`offcanvas-aside-${this.direction}`)) {
        content.classList.remove(`offcanvas-aside-${this.direction}`);
      }

      this.animate = true;

      // force hide
      this.hide();
    }
  }

  public onElementEvent(event: KeyboardEvent): void {
    const closableKeyCodes = this.getProp('closableKeyCodes');

    if (event.type === 'keyup' && !closableKeyCodes.find(k => k === event.keyCode)) {
      return;
    }

    // hide the offcanvas
    this.hide();
  }

  public isVisible(): boolean {
    return this.getElement().classList.contains('show');
  }

  /**
   * Shows the off-canvas
   * @returns {Boolean}
   */
  public show(): boolean {
    if (this.getElement().classList.contains('show')) {
      return false;
    }

    this.triggerEvent(Util.Event.SHOW);

    if (!this.showAside) {
      this.createBackdrop();
    }

    // add a timeout so that the CSS animation works
    (async () => {
      await Util.sleep(20);

      // attach event
      this.attachEvents();

      const onShown = () => {
        this.triggerEvent(Util.Event.SHOWN);

        if (this.animate) {
          const element = this.getElement();
          element.removeEventListener(Util.Event.TRANSITION_END, onShown);
          element.classList.remove('animate');
        }
      };

      if (this.showAside) {
        const container = this.getProp('container');
        if (!container.classList.contains('show')) {
          container.classList.add('show');
        }
      }

      const el = this.getElement();

      if (this.animate) {
        el.addEventListener(Util.Event.TRANSITION_END, onShown);
        el.classList.add('animate');
      } else {
        // directly trigger the onShown
        onShown();
      }

      el.classList.add('show');
    })();

    return true;
  }

  /**
   * Hides the off-canvas
   * @returns {Boolean}
   */
  public hide(): boolean {
    const element = this.getElement();

    if (!element.classList.contains('show')) {
      return false;
    }

    this.triggerEvent(Util.Event.HIDE);

    this.detachEvents();

    if (this.animate) {
      element.classList.add('animate');
    }

    element.classList.remove('show');

    if (this.showAside) {
      const container = this.getProp('container');
      if (container.classList.contains('show')) {
        container.classList.remove('show');
      }
    }

    if (!this.showAside) {
      const backdrop = this.getBackdrop();

      if (!backdrop) {
        return true;
      }

      const onHidden = () => {
        if (this.animate) {
          element.classList.remove('animate');
        }

        backdrop.removeEventListener(Util.Event.TRANSITION_END, onHidden);
        this.triggerEvent(Util.Event.HIDDEN);
        this.removeBackdrop();
      };

      if (backdrop) {
        backdrop.addEventListener(Util.Event.TRANSITION_END, onHidden);
        backdrop.classList.add('fadeout');
      }
    }

    return true;
  }

  public toggle(): boolean {
    if (this.isVisible()) {
      return this.hide();
    }

    return this.show();
  }

  public createBackdrop(): void {
    const backdrop = document.createElement('div');
    const id: string|null = this.getId();

    if (id) {
      backdrop.setAttribute('data-id', id);
    }

    backdrop.classList.add(this.backdropSelector);

    const content = this.getProp('container');
    content.appendChild(backdrop);
  }

  public getBackdrop(): HTMLElement|null {
    return document.querySelector(`.${this.backdropSelector}[data-id="${this.getId()}"]`);
  }

  public removeBackdrop(): void {
    const backdrop = this.getBackdrop();
    if (backdrop) {
      const content = this.getProp('container');
      content.removeChild(backdrop);
    }
  }

  public attachEvents(): void {
    const element = this.getElement();

    Array.from(element.querySelectorAll('[data-dismiss]') || [])
      .forEach(button => this.registerElement({
        target: button as HTMLElement,
        event: Util.Event.CLICK,
      }));

    const backdrop = this.getBackdrop();
    if (!this.showAside && backdrop) {
      this.registerElement({ target: backdrop as HTMLElement, event: Util.Event.START });
    }

    this.registerElement({ target: document, event: 'keyup' });
  }

  public detachEvents(): void {
    const element = this.getElement();
    const dismissButtons = element.querySelectorAll('[data-dismiss]');

    if (dismissButtons) {
      Array
        .from(dismissButtons)
        .forEach(button => this.unregisterElement({
          target: button as HTMLElement,
          event: Util.Event.CLICK,
        }));
    }

    const backdrop = this.getBackdrop();
    if (!this.showAside && backdrop) {
      this.unregisterElement({ target: backdrop as HTMLElement, event: Util.Event.START });
    }

    this.unregisterElement({ target: document, event: 'keyup' });
  }
}

// static boot
OffCanvas.attachDOM();
