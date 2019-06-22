/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Collapse from '../components/collapse';
import Util from '../util.js';

interface IProps {
  element?: HTMLElement|string;  // the element must exist
  multiple?: boolean;
}

export default class Accordion extends Component {

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'accordion',
      onAdded(element, create) {
        create(new Accordion({ element }));
      },
      onRemoved(element, remove) {
        remove('Accordion', element);
      },
    });
  }

  private collapses: Collapse[] = [];

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super('accordion', { multiple: false }, props);
    // no-template: accordion is not a dynamic component
    const element = this.getElement();
    const toggles: HTMLElement[] = Array
      .from(element.querySelectorAll('[data-toggle="accordion"]') || []);

    toggles.forEach((toggle: HTMLElement) => {
      const collapseId: string|null =
        toggle.getAttribute('href') || toggle.getAttribute('data-target');

      if (collapseId === null) {
        throw new Error('Accordion: collapse is missing href or data-target attribute');
      }

      const collapse = document.querySelector(collapseId);

      if (collapse) {
        this.addCollapse(collapse);
      }
    });

    this.registerElement({ target: element, event: Util.Event.CLICK });
  }

  public addCollapse(element): Collapse {
    const collapse = new Collapse({
      element,
    });
    this.collapses.push(collapse);

    return collapse;
  }

  public getCollapse(element): Collapse {
    const el = this.getElement();
    let collapse = this.collapses.find(c => el.getAttribute('id') === element.getAttribute('id'));

    if (!collapse) {
      // create a new collapse
      collapse = this.addCollapse(element);
    }

    return collapse;
  }

  public getCollapses() {
    return this.collapses;
  }

  /**
   * Shows the collapse element and hides the other active collapse elements
   * @param {Element} showCollapse
   */
  public setCollapses(showCollapse): void {
    const element = this.getElement();
    const collapse = this.getCollapse(showCollapse);
    const multipleOpen = this.getProp('multiple');

    if (!multipleOpen) {
      this.collapses.filter(c => c.getElement() !== collapse.getElement()).forEach((c) => {
        // toggle icon if it exists
        this.toggleIcon(c.getElement(), 'icon-minus', 'icon-plus');
        c.hide();
      });
    }

    const v = collapse.isVisible();

    this.toggleIcon(
      collapse.getElement(),
      v ? 'icon-minus' : 'icon-plus',
      v ? 'icon-plus' : 'icon-minus',
    );

    collapse.toggle();
  }

  public onElementEvent(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    const toggleEl = Util.Selector.closest(target, '[data-toggle="accordion"]');

    if (!toggleEl) {
      return;
    }

    const collapseId = toggleEl.getAttribute('data-target') || toggleEl.getAttribute('href');

    if (!collapseId) {
      return;
    }

    const collapseEl: HTMLElement = document.querySelector(collapseId) as HTMLElement;
    const accordion = Util.Selector.closest(toggleEl, '.accordion');

    if (!accordion || !collapseEl) {
      return;
    }

    event.preventDefault();

    this.show(collapseEl);
  }

  public toggleIcon(collapse: HTMLElement, remove: string, add: string): void {
    const id = collapse.getAttribute('id');
    const selector = `[data-toggle="accordion"][href="#${id}"] .collapse-toggle`;
    const iconEl = document.querySelector(selector) as HTMLElement;

    if (!iconEl) {
      return;
    }

    if (iconEl.classList.contains(remove)) {
      iconEl.classList.remove(remove);
      iconEl.classList.add(add);
    }
  }

  /**
   * Shows the collapse element
   * @param {(string|Element)} collapseEl
   * @returns {Boolean}
   */
  public show(collapseEl: string|HTMLElement): boolean {
    let collapse: string|HTMLElement|null = collapseEl;

    if (typeof collapseEl === 'string') {
      collapse = document.querySelector(collapseEl) as HTMLElement|null;
    }

    if (!collapse) {
      throw new Error(`The collapsible ${collapseEl} is an invalid HTMLElement.`);
    }

    this.setCollapses(collapse);

    return true;
  }

  /**
   * Hides the collapse element
   * @param {(string|Element)} collapseEl
   * @returns {Boolean}
   */
  public hide(collapseEl): boolean {
    let collapse = collapseEl;
    if (typeof collapseEl === 'string') {
      collapse = document.querySelector(collapseEl);
    }

    if (!collapse) {
      throw new Error(`The collapsible ${collapseEl} is an invalid HTMLElement.`);
    }

    const collapseObj = this.getCollapse(collapse);

    return collapseObj.hide();
  }
}

// static boot
Accordion.attachDOM();
