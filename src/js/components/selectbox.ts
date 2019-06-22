/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/phonon-framework/phonon/blob/master/LICENSE.md)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import Util from '../util.js';

interface IProps {
  element: HTMLElement|string; // the element must exist
  name?: null;
  selectable?: boolean;
  filterItems?: () => boolean;
  multiple?: boolean;
  tag?: boolean;
}

interface ISelectboxItem {
  text: string;
  value: string;
  element: HTMLElement;
}

export default class Selectbox extends Component {

  public static attachDOM(): void {
    Util.Observer.subscribe({
      componentClass: 'selectbox',
      onAdded(element, create) {
        create(new Selectbox({ element }));
      },
      onRemoved(element, remove) {
        remove('Selectbox', element);
      },
    });
  }

  private filterItemsHandler: (event: Event) => void;
  private searchInputInContainer: boolean;

  /**
   *
   * @param props
   */
  constructor(props: IProps) {
    super('selectbox', {
      name: null,
      selectable: true,
      filterItems: null,
      multiple: false,
      tag: false,
    },    props);

    // no-template: selectbox is not a dynamic component

    if (!this.getProp('name')) {
      // Get the name from the hidden input
      const hiddenInput = this.getElement().querySelector('input[type="hidden"]');
      if (hiddenInput) {
        this.setProp('name', hiddenInput.getAttribute('name'));
      }
    }

    this.filterItemsHandler = (event: Event) => {
      const target: HTMLInputElement|null = event.target as HTMLInputElement;

      if (!target) {
        return;
      }

      const search = target.value;

      if (search === '') {
        this.showItems();
        return;
      }

      this.getItems().forEach((item) => {
        const filterItems = this.getProp('filterItems');
        const fn = typeof filterItems === 'function' ? filterItems : this.filterItems;

        if (fn(search, item)) {
          item.element.style.display = 'block';
        } else {
          item.element.style.display = 'none';
        }
      });
    };

    this.registerElement({ target: this.getElement(), event: Util.Event.CLICK });

    this.searchInputInContainer = this.getElement()
      .querySelector('.selectbox-input-container .input-select-one') !== null;

    // init active item
    const selectedItem = this.getItemData(this.getElement().querySelector('[data-selected]'));

    if (selectedItem) {
      this.setSelected(selectedItem.value, selectedItem.text);
    }
  }

  public getSearchInput(): HTMLInputElement|null {
    return this.getElement().querySelector('.input-select-one');
  }

  public filterItems(search = '', item: ISelectboxItem): boolean {
    return item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1;
  }

  public showItems(): void {
    this.getItems().forEach((item) => {
      item.element.style.display = 'block';
    });
  }

  public getItems(): ISelectboxItem[] {
    const items: HTMLElement[] = Array
      .from(this.getElement().querySelectorAll('.selectbox-menu-item') || []);
    return items.map((item) => {
      const info = this.getItemData(item);
      return { text: info.text, value: info.value, element: item };
    });
  }

  public setSelected(value: string = '', text: string = ''): boolean {
    const selectable = this.getProp('selectable');

    if (!selectable) {
      return false;
    }

    const element = this.getElement();
    const multiple = this.getProp('multiple');

    if (multiple) {
      this.addItemSelection(value);
    } else {
      const itemsSelected = Array
        .from(element.querySelectorAll('.selectbox-item-selection .item-selected') || []);

      if (itemsSelected.length === 0) {
        // generate
        this.addItemSelection(value);
      }
    }

    // update the visual input
    const lastSelectedEl = element
      .querySelector('.selectbox-item-selection .item-selected:last-child');
    const spanEl = lastSelectedEl.querySelector('[data-value]');
    if (spanEl) {
      spanEl.innerHTML = text;
    } else {
      lastSelectedEl.innerHTML = text;
    }

    // update value for the last node
    const hiddenInputs: HTMLInputElement[] = Array
      .from(this.getElement().querySelectorAll('input[type="hidden"]') || []);
    const lastInput = hiddenInputs.slice(-1).pop();

    if (lastInput) {
      lastInput.setAttribute('value', value);
    }

    // update the selected state for the list of options
    this.updateActiveList();

    // update search
    this.setSearchInputWidth();

    // update placeholder
    const searchInput = this.getSearchInput();

    if (value === '') {
      this.showPlaceholder();
    } else {
      this.showPlaceholder(false);
    }

    return true;
  }

  public getSelected(): string|string[] {
    const hiddenInputs: HTMLInputElement[] = Array
      .from(this.getElement().querySelectorAll('input[type="hidden"]') || []);

    if (!this.getProp('multiple')) {
      return hiddenInputs.length > 0 ? hiddenInputs[0].value : '';
    }

    return hiddenInputs.map(input => input.value);
  }

  public setSearchInputWidth(): void {
    if (!this.searchInputInContainer) {
      return;
    }

    const selectbox = this.getElement();
    const selection = selectbox.querySelector('.selectbox-item-selection');
    const availableSpace = selectbox.offsetWidth - selection.offsetWidth;
    const searchInput = this.getSearchInput();

    if (!searchInput) {
      throw new Error('Selectbox: search input is not defined');
    }

    const selectedItemWidth = Array
      .from(selectbox.querySelectorAll('.item-selected') || [])
      .reduce((total: number, el) => (total + (el as HTMLElement).offsetWidth), 0);

    if (availableSpace > 0) {
      searchInput.style.width = `calc(100% - ${(selectedItemWidth + 15)}px)`;
    }

    searchInput.style.left = `${selectedItemWidth}px`;
  }

  public getItemData(item: HTMLElement|null = null) {
    let text = '';
    let value = '';

    if (item) {
      text = item.getAttribute('data-text') || item.innerHTML;

      const selectedTextNode = item.querySelector('.text');
      if (selectedTextNode) {
        text = selectedTextNode.innerHTML;
      }

      value = item.getAttribute('data-value') || '';
    }

    return { text, value };
  }

  public onElementEvent(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;

    if (event.type === Util.Event.START) {
      const selectbox = Util.Selector.closest(target, '.selectbox');

      /*
       * hide the current selectbox only if the event concerns another selectbox
       * hide also if the user clicks outside a selectbox
       */
      if (!selectbox || selectbox !== this.getElement()) {
        this.hide();
      }
    } else if (event.type === Util.Event.CLICK) {
      const dataToggleAttr = target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === 'selectbox') {
        this.toggle();
        return;
      }

      const dismissButton: HTMLElement|null = Util.Selector
        .closest(target, '[data-dismiss="selectbox"]');

      if (dismissButton) {
        this.hide();
        return;
      }

      const selectedTag: HTMLElement|null = Util.Selector.closest(target, '.icon-close');

      if (selectedTag) {
        this.removeSelected(selectedTag.parentNode as HTMLElement);
        return;
      }

      const item: HTMLElement|null = Util.Selector.closest(target, '.selectbox-menu-item');

      if (item && !item.classList.contains('disabled')) {
        const itemInfo = this.getItemData(item);

        if (this.getSelected() !== itemInfo.value) {
          // the user selected another value, we dispatch the event
          this.setSelected(itemInfo.value, itemInfo.text);

          // reset
          const selectInput = this.getElement().querySelector('.input-select-one').value = '';

          const detail = { item, text: itemInfo.text, value: itemInfo.value };
          this.triggerEvent(Util.Event.ITEM_SELECTED, detail);
        }

        this.hide();
        return;
      }

      // don't toggle the selectbox if the event concerns headers, dividers
      const selectboxMenu = Util.Selector.closest(target, '.selectbox-menu');
      if (selectboxMenu) {
        return;
      }

      this.toggle();
    } else if (event.type === 'keyup' && event.keyCode === 8) {
      const inputTarget = event.target as HTMLInputElement;

      if (inputTarget.value !== '') {
        return;
      }

      if (!this.searchInputInContainer) {
        return;
      }

      this.removeLastSelected();
    }
  }

  public addItemSelection(value: string): void {
    // visual
    const itemSelectedEl = document.createElement('div');
    itemSelectedEl.classList.add('item-selected');

    if (this.getProp('tag')) {
      itemSelectedEl.classList.add('tag');

      // add value
      const spanEl = document.createElement('span');
      spanEl.setAttribute('data-value', 'true');

      itemSelectedEl.appendChild(spanEl);

      // add delete icon
      const closeEl = document.createElement('button');
      closeEl.setAttribute('type', 'button');
      closeEl.classList.add('icon-close');

      const iconEl = document.createElement('span');
      iconEl.setAttribute('class', 'icon');
      iconEl.setAttribute('aria-hidden', 'true');

      closeEl.appendChild(iconEl);

      itemSelectedEl.appendChild(closeEl);
    }

    const element = this.getElement();

    element.querySelector('.selectbox-item-selection').appendChild(itemSelectedEl);

    // hidden input(s)
    const selectbox = this.getElement();
    const hiddenInputs = Array.from(selectbox.querySelectorAll('input[type="hidden"]') || []);
    const lastHiddenInput = hiddenInputs.length > 0 ? hiddenInputs[hiddenInputs.length - 1] : null;

    if ((!this.getProp('multiple') && !lastHiddenInput) || this.getProp('multiple')) {
      const hiddenInput = document.createElement('input');
      hiddenInput.setAttribute('type', 'hidden');

      const name = this.getProp('name');
      hiddenInput.setAttribute('name', this.getProp('multiple') ? `${name}[]` : name);
      hiddenInput.setAttribute('value', value);

      selectbox.insertBefore(
        hiddenInput,
        lastHiddenInput ? (lastHiddenInput as HTMLInputElement).nextSibling : selectbox.firstChild,
      );
    }
  }

  public removeLastSelected(): void {
    const selectbox = this.getElement();
    const selectedItems = Array
      .from(selectbox.querySelectorAll('.selectbox-item-selection .item-selected') || []);

    if (selectedItems.length === 0) {
      // nothing to remove
      return;
    }

    const lastSelectedItem: HTMLElement = selectedItems[selectedItems.length - 1] as HTMLElement;

    this.removeSelected(lastSelectedItem);
  }

  public removeSelected(selectedItem: HTMLElement): void {
    const selectbox = this.getElement();
    const selectedItems = Array
      .from(selectbox.querySelectorAll('.selectbox-item-selection .item-selected') || []);

    if (selectedItems.length === 0) {
      // nothing to remove
      return;
    }

    // visual
    selectbox.querySelector('.selectbox-item-selection').removeChild(selectedItem);

    if (this.getProp('multiple')) {
      const values: string[] = this.getSelected() as string[];
      const hiddenInput = selectbox
        .querySelector(`input[type="hidden"][value="${values.slice(-1).pop()}"]`);
      this.getElement().removeChild(hiddenInput);
    } else {
      const hiddenInput = selectbox.querySelector('input[type="hidden"]');
      if (!this.getProp('multiple') && hiddenInput) {
        hiddenInput.setAttribute('value', '');
      }
    }

    this.updateActiveList();

    this.setSearchInputWidth();

    if (selectedItems.length === 1) {
      this.showPlaceholder();
    }
  }

  public showPlaceholder(show: boolean = true): void {
    const searchInput = this.getSearchInput();

    if (!searchInput) {
      return;
    }

    if (show && searchInput.classList.contains('hide-placeholder')) {
      searchInput.classList.remove('hide-placeholder');
    } else if (!show && !searchInput.classList.contains('hide-placeholder')) {
      searchInput.classList.add('hide-placeholder');
    }
  }

  public updateActiveList(): void {
    const selected = this.getSelected();
    const selectedItems = Array.isArray(selected) ? selected : [selected];
    const items: HTMLElement[] = Array
      .from(this.getElement().querySelectorAll('.selectbox-menu-item') || []);

    items.forEach((item) => {
      const data = this.getItemData(item);

      if (selectedItems.indexOf(data.value) > -1) {
        if (!item.classList.contains('selected')) {
          item.classList.add('selected');
        }
      } else {
        if (item.classList.contains('selected')) {
          item.classList.remove('selected');
        }
      }
    });
  }

  public toggle(): boolean {
    if (this.getElement().classList.contains('active')) {
      return this.hide();
    }

    return this.show();
  }

  /**
   * Shows the selectbox
   * @returns {Boolean}
   */
  public show(): boolean {
    const element = this.getElement();

    if (element.classList.contains('active')) {
      return false;
    }

    element.classList.add('active');

    const selectboxMenu = element.querySelector('.selectbox-menu');
    const selectInput = this.getSearchInput();

    // scroll to top
    selectboxMenu.scrollTop = 0;

    this.triggerEvent(Util.Event.SHOW);
    this.triggerEvent(Util.Event.SHOWN);

    this.registerElement({ target: document.body, event: Util.Event.START });

    if (selectInput) {
      this.registerElement({ target: selectInput as HTMLElement, event: 'keyup' });
      selectInput.addEventListener('keyup', this.filterItemsHandler);
      selectInput.focus();
    }

    const closeButton = element.querySelector('[data-dismiss="selectbox"]');
    if (closeButton) {
      this.registerElement({ target: closeButton, event: Util.Event.CLICK });
    }

    return true;
  }

  /**
   * Hides the selectbox
   * @returns {Boolean}
   */
  public hide(): boolean {
    const element = this.getElement();

    if (!element.classList.contains('active')) {
      return false;
    }

    element.classList.remove('active');

    this.triggerEvent(Util.Event.HIDE);
    this.triggerEvent(Util.Event.HIDDEN);

    this.unregisterElement({ target: document.body, event: Util.Event.START });

    const closeButton = element.querySelector('[data-dismiss="selectbox"]');
    if (closeButton) {
      this.unregisterElement({ target: closeButton, event: Util.Event.CLICK });
    }

    const selectInput = this.getSearchInput();

    if (selectInput) {
      selectInput.removeEventListener('keyup', this.filterItemsHandler);
      // reset
      selectInput.value = '';
      this.unregisterElement({ target: selectInput, event: 'keyup' });
    }

    this.showItems();

    return true;
  }
}

// static boot
Selectbox.attachDOM();
