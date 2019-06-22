/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element: HTMLElement|string; // the element must exist
}

export default class Tab extends Component {

  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'tabs',
      onAdded(element, create) {
        create(new Tab({ element }));
      },
      onRemoved(element, remove) {
        remove('Tab', element);
      },
    });
  }

  private tabSelector = 'tab';
  private tabItemSelector = 'tab-item';
  private tabContentSelector = 'tab-pane';
  private onAnimation = false;

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super('tab', {}, props);

    // no-template: tab is not a dynamic component

    this.registerElement({ target: this.getElement() as HTMLElement, event: Util.Event.CLICK });
  }

  public onElementEvent(event: Event): void {
    const target: HTMLElement|null = event.target as HTMLElement;

    if (!target) {
      return;
    }

    const dataToggleAttr = target.getAttribute('data-toggle');

    if (dataToggleAttr) {
      const id = target.getAttribute('href') || target.getAttribute('data-target');

      if (!id) {
        return;
      }

      event.preventDefault();

      this.show(target);
    }
  }

  /**
   * Shows the tab
   * @returns {Boolean}
   */
  public show(tabLink: HTMLElement): boolean {
    if (this.onAnimation) {
      return false;
    }

    const tabItem = Util.Selector.closest(tabLink, `.${this.tabItemSelector}`);

    if (!tabItem || tabItem.classList.contains('active')) {
      return false;
    }

    const id: string|null = tabLink.getAttribute('href') || tabLink.getAttribute('data-target');

    if (!id) {
      return false;
    }

    const tabContainer = this.getElement();
    const tabItems: HTMLElement[] = Array.from(tabContainer.querySelectorAll('.tab-item') || []);

    tabItems.forEach((tab) => {
      if (tab.classList.contains('active')) {
        tab.classList.remove('active');
      }

      // link
      const link = tab.querySelector('.tab-link');
      if (link) {
        link.setAttribute('aria-selected', 'false');
      }
    });

    this.onAnimation = true;

    tabItem.classList.add('active');

    // link
    tabLink.setAttribute('aria-selected', 'true');

    const tabContent: HTMLElement|null = document.querySelector(id);

    if (!tabContent) {
      return false;
    }

    const tabContentParent: HTMLElement|null = tabContent.parentNode as HTMLElement;

    if (!tabContentParent) {
      return false;
    }

    const tabContents: HTMLElement[] = Array
      .from(tabContentParent.querySelectorAll(`.${this.tabContentSelector}`) || []);
    const prevTabItem: HTMLElement|null = tabContainer.querySelector('.tab-item.active');

    tabContents.forEach((tab) => {
      if (tab.classList.contains('active')) {
        tab.classList.remove('active');
      }
    });

    tabContent.classList.add('showing');

    this.triggerEvent(Util.Event.SHOW, this.getTabEvent(tabLink));

    if (prevTabItem) {
      this.triggerEvent(Util.Event.HIDE, this.getTabEvent(prevTabItem));
    }

    const onShowed = () => {
      tabContent.classList.remove('animate');
      tabContent.classList.add('active');
      tabContent.classList.remove('showing');

      this.triggerEvent(Util.Event.SHOWN, this.getTabEvent(tabLink));

      if (prevTabItem) {
        this.triggerEvent(Util.Event.HIDDEN, this.getTabEvent(prevTabItem));
      }

      this.onAnimation = false;

      tabContent.removeEventListener(Util.Event.TRANSITION_END, onShowed);
    };

    (async () => {
      await Util.sleep(20);
      tabContent.addEventListener(Util.Event.TRANSITION_END, onShowed);
      tabContent.classList.add('animate');
    })();

    return true;
  }

  /**
   * Hides the tab
   * @returns {Boolean}
   */
  public getTabEvent(tabLink): object {
    return {
      id: tabLink.getAttribute('href') || tabLink.getAttribute('data-target'),
      target: tabLink,
    };
  }

  public destroy(): void {
    this.registerElement({ target: this.getElement() as HTMLElement, event: Util.Event.CLICK });
  }
}

// static boot
Tab.attachDOM();
