/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component'
import Event from '../../core/events'
import { findTargetByClass } from '../../core/utils'
import { getAttributesConfig } from '../componentManager'

const Dropdown = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'dropdown'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    default: true,
  }
  const DATA_ATTRS_PROPERTIES = [
    'default',
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)

      const selected = this.options.element.querySelector('[data-selected]')
      const item = this.getItemData(selected)

      this.setSelected(item.value, item.text, false)

      // search input
      const searchInput = this.options.element.querySelector('.dropdown-menu input')
      if (searchInput) {
        this.initSearch(searchInput)
      }
    }

    setSelected(value = '', text = null, checkExists = true) {
      if (!this.options.default) {
        return false
      }

      let textDisplay = text
      this.options.element.querySelector('.default-text').innerHTML = text
      this.options.element.querySelector('input[type="hidden"]').value = value

      const items = this.options.element.querySelectorAll('.item') || []
      let itemFound = false

      Array.from(items).forEach((item) => {
        if (item.classList.contains('selected')) {
          item.classList.remove('selected')
        }

        const data = this.getItemData(item)

        if (value === data.value) {
          if (!item.classList.contains('selected')) {
            item.classList.add('selected')
          }

          textDisplay = data.text
          itemFound = true
        }
      })

      if (checkExists && itemFound) {
        this.options.element.querySelector('.default-text').innerHTML = textDisplay
      } else if (checkExists && !itemFound) {
        throw new Error(`${NAME}. The value "${value}" does not exist in the list of items.`)        
      }

      return true
    }

    initSearch(searchInput) {
      this.filterItemsHandler = (event) => {
        const search = event.target.value
        let items = Array.from(this.options.element.querySelectorAll('.item') || [])

        items = items.map((item) => {
          const info = this.getItemData(item)
          return { text: info.text, value: info.value, element: item }
        })

        if (search === '') {
          items.forEach((item) => {
            item.element.style.display = 'block'
          })

          return
        }

        Array.from(items).forEach((item) => {
          const fn = typeof this.options.filterItem === 'function' ? this.options.filterItem : this.filterItem

          if (fn(search, item)) {
            item.element.style.display = 'block'
          } else {
            item.element.style.display = 'none'
          }
        })
      }

      searchInput.addEventListener('keyup', this.filterItemsHandler)
    }

    filterItem(search, item) {
      if (item.value.indexOf(search) > -1
        || item.text.indexOf(search) > -1) {
        return true
      } else {
        return false
      }
    }

    getSelected() {
      return this.options.element.querySelector('input[type="hidden"]').value
    }

    getItemData(item = null) {
      let text = ''
      let value = ''

      if (item) {
        text = item.getAttribute('data-text') || item.innerHTML

        const selectedTextNode = item.querySelector('.text')
        if (selectedTextNode) {
          text = selectedTextNode.innerHTML
        }

        value = item.getAttribute('data-value') || ''
      }

      return { text, value }
    }

    onElementEvent(event) {
      if (event.type === Event.START) {
        const dropdown = findTargetByClass(event.target, 'dropdown')
        if (!dropdown) {
          this.hide()
        }

      } else if (event.type === 'click') {
        const item = findTargetByClass(event.target, 'item')

        if (item) {
          if (item.classList.contains('disabled')) {
            return
          }

          const itemInfo = this.getItemData(item)

          if (this.getSelected() !== itemInfo.value) {
            // the user selected another value, we dispatch the event
            this.setSelected(itemInfo.value, itemInfo.text, false)
            const detail = { item, text: itemInfo.text, value: itemInfo.value }
            this.triggerEvent(Event.ITEM_SELECTED, detail)
          }

          this.hide()
          return
        }

        // don't toggle the dropdown if the event concerns headers, dividers
        const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu')
        if (dropdownMenu) {
          return
        }

        this.toggle()
      }
    }

    toggle() {
      if (this.options.element.classList.contains('active')) {
        return this.hide()
      }

      return this.show()
    }

    show() {
      if (this.options.element.classList.contains('active')) {
        return false
      }

      this.options.element.classList.add('active')

      const dropdownMenu = this.options.element.querySelector('.dropdown-menu')

      // scroll to top
      dropdownMenu.scrollTop = 0

      this.triggerEvent(Event.SHOW)
      this.triggerEvent(Event.SHOWN)

      this.registerElement({ target: dropdownMenu, event: 'click' })      
      this.registerElement({ target: document.body, event: Event.START })

      return true
    }

    hide() {
      if (!this.options.element.classList.contains('active')) {
        return false
      }

      this.options.element.classList.remove('active')

      this.triggerEvent(Event.HIDE)
      this.triggerEvent(Event.HIDDEN)

      this.unregisterElement({ target: this.options.element.querySelector('.dropdown-menu'), event: 'click' })      
      this.unregisterElement({ target: document.body, event: Event.START })

      return true
    }

    static _DOMInterface(options) {
      return super._DOMInterface(Dropdown, options)
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

      components.push(new Dropdown(config))
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

  return Dropdown
})()

export default Dropdown
