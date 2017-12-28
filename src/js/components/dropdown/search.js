/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Dropdown from './index'
import { findTargetByClass } from '../../common/utils'
import { getAttributesConfig } from '../componentManager'

const DropdownSearch = (() => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = Dropdown.identifier()
  const DEFAULT_PROPERTIES = {
    element: null,
    default: true,
    search: true,
  }
  const DATA_ATTRS_PROPERTIES = [
    'default',
    'search',
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class DropdownSearch extends Dropdown {

    constructor(options = {}) {
      super(options)

      this.filterItemsHandler = (event) => {
        const search = event.target.value

        if (search === '') {
          this.showItems()
          return
        }


        this.getItems().forEach((item) => {
          const fn = typeof this.options.filterItem === 'function' ? this.options.filterItem : this.filterItem

          if (fn(search, item)) {
            item.element.style.display = 'block'
          } else {
            item.element.style.display = 'none'
          }
        })
      }

      this.getSearchInput().addEventListener('keyup', this.filterItemsHandler)
    }

    filterItem(search = '', item = {}) {
      if (item.value.indexOf(search) > -1
        || item.text.indexOf(search) > -1) {
        return true
      }

      return false
    }

    getItems() {
      let items = Array.from(this.options.element.querySelectorAll('.item') || [])
      items = items.map((item) => {
        const info = this.getItemData(item)
        return { text: info.text, value: info.value, element: item }
      })

      return items
    }

    showItems() {
      this.getItems().forEach((item) => {
        item.element.style.display = 'block'
      })
    }

    getSearchInput() {
      return this.options.element.querySelector('.dropdown-menu input')
    }

    hide() {
      if (super.hide()) {
        // reset the value
        this.getSearchInput().value = ''
        // show all items
        this.showItems()
      }
    }

    static _DOMInterface(options) {
      return new DropdownSearch(options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []
  const dropdowns = document.querySelectorAll(`.${NAME}`)

  if (dropdowns) {
    Array.from(dropdowns).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      if (config.search) {
        // search
        components.push(new DropdownSearch(config))
      }
    })
  }

  if (dropdowns) {
    document.addEventListener('click', (event) => {
      const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu')
      if (dropdownMenu) {
        return
      }

      const dropdown = findTargetByClass(event.target, 'dropdown')

      if (dropdown) {
        const dataToggleAttr = dropdown.getAttribute('data-toggle')
        if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
          const component = components.find(c => c.getElement() === dropdown)

          if (!component) {
            return
          }

          component.toggle()
        }
      }
    })
  }

  return DropdownSearch
})()

export default DropdownSearch
