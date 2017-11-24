/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import { dispatchElementEvent } from '../core/events/dispatch'
import { generateId } from '../core/utils'

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

export default class Component {

  constructor(name, version, defaultOptions = {}, options = {}, supportDynamicElement = false) {
    this._name = name
    this._version = version
    this.options = Object.assign(defaultOptions, options)
    this.supportDynamicElement = supportDynamicElement
    this.id = generateId()
    
    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element)
    }

    if (!this.supportDynamicElement && this.options.element === null) {
      throw new Error(`${this._name}. The element is not a HTMLElement.`)
    }

    this.dynamicElement = this.options.element === null
    this.registeredElements = []
    this.elementListener = event => this.onElementEvent(event)          
  }

  get version() {
    return `${this._name}-${this._version}`
  }

  set version(version) {
    this._version = version
  }

  registerElements(elements) {
    elements.forEach(element => this.registerElement(element))
  }

  registerElement(element) {
    element.target.addEventListener(element.event, this.elementListener)
    this.registeredElements.push(element)
  }

  unregisterElements() {
    this.registeredElements.forEach((element) => {
      this.unregisterElement(element)
    })
  }

  unregisterElement(element) {
    const registeredElementIndex = this.registeredElements
      .findIndex(el => el.target === element.target && el.event === element.event)

    if (registeredElementIndex > -1) {
      const registeredElement = this.registeredElements[registeredElementIndex]
      element.target.removeEventListener(element.event, this.elementListener)
      this.registeredElements.splice(registeredElementIndex, 1)
    } else {
      console.error(`Warning! Unknown registered element: ${element.target} with event: ${element.event}.`)
    }
  }

  triggerEvent(eventName) {
    const eventNameAlias = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`

    // object event
    if (typeof this.options[eventName] === 'function') {
      this.options[eventName].apply(this)
    }

    if (typeof this.options[eventNameAlias] === 'function') {
      this.options[eventNameAlias].apply(this)
    }

    // dom event
    dispatchElementEvent(this.options.element, eventName, this._name)
  }

  onElementEvent(event) {
    //
  }

  static _DOMInterface(ComponentClass, options) {
    return new ComponentClass(options)
  }
}
