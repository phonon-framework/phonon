/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Event from '../../common/events'
import Component from '../component'
import { getAttributesConfig } from '../componentManager'
import { findTargetByAttr } from '../../common/utils'

const OffCanvas = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'off-canvas'
  const VERSION = '2.0.0'
  const BACKDROP_SELECTOR = 'off-canvas-backdrop'
  const DEFAULT_PROPERTIES = {
    element: null,
    aside: {
      md: false,
      lg: false,
      xl: false,
    },
  }
  const DATA_ATTRS_PROPERTIES = [
    'aside',
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class OffCanvas extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true)

      this.useBackdrop = true
      this.currentWidth = null
      this.animate = true

      this.directions = ['left', 'right']

      const sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') }
      const md = { name: 'md', media: window.matchMedia('(min-width: 768px)') }
      const lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') }
      const xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') }

      this.sizes = [sm, md, lg, xl].reverse()

      this.checkDirection()
      this.checkWidth()

      window.addEventListener('resize', () => this.checkWidth(), false)
    }

    checkDirection() {
      this.directions.every((direction) => {
        if (this.options.element.classList.contains(`off-canvas-${direction}`)) {
          this.direction = direction
          return false
        }
        return true
      })
    }

    checkWidth() {
      if (!('matchMedia' in window)) {
        return
      }

      this.sizes.every((size) => {
        const match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/)

        if (match) {
          if (size.media.matches) {
            if (this.currentWidth !== size.name) {
              this.setAside(size.name)
            }
            this.currentWidth = size.name
            return false
          }
        }

        return true
      })
    }

    preventClosable() {
      return super.preventClosable() || this.options.aside[this.currentWidth] === true
    }

    setAside(name) {
      const content = document.body

      if (this.options.aside[name] === true) {
        if (!content.classList.contains(`off-canvas-aside-${this.direction}`)) {
          content.classList.add(`off-canvas-aside-${this.direction}`)
        }

        this.useBackdrop = false

        // avoid animation by setting animate to false
        this.animate = false
        this.show()
        // remove previous backdrop
        this.removeBackdrop()
      } else {
        if (content.classList.contains(`off-canvas-aside-${this.direction}`)) {
          content.classList.remove(`off-canvas-aside-${this.direction}`)
        }

        this.hide()
        this.useBackdrop = true
        this.animate = true
      }
    }

    onElementEvent(event) {
      if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
        return
      }

      // hide the off-canvas
      this.hide()
    }

    show() {
      if (this.options.element.classList.contains('show')) {
        return false
      }

      // add a timeout so that the CSS animation works
      setTimeout(() => {
        this.triggerEvent(Event.SHOW)

        const onShown = () => {
          this.triggerEvent(Event.SHOWN)

          if (this.animate) {
            this.options.element.removeEventListener(Event.TRANSITION_END, onShown)
            this.options.element.classList.remove('animate')
          }
        }

        if (this.useBackdrop) {
          this.createBackdrop()
        }


        if (this.animate) {
          this.options.element.addEventListener(Event.TRANSITION_END, onShown)
          this.options.element.classList.add('animate')
        } else {
          // directly trigger the onShown
          onShown()
        }

        this.options.element.classList.add('show')

        // attach event
        this.attachEvents()
      }, 1)

      return true
    }

    hide() {
      if (!this.options.element.classList.contains('show')) {
        return false
      }

      this.triggerEvent(Event.HIDE)

      this.detachEvents()

      if (this.animate) {
        this.options.element.classList.add('animate')
      }

      this.options.element.classList.remove('show')

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop()

        const onHidden = () => {
          if (this.animate) {
            this.options.element.classList.remove('animate')
          }

          backdrop.removeEventListener(Event.TRANSITION_END, onHidden)
          this.triggerEvent(Event.HIDDEN)
          this.removeBackdrop()
        }

        backdrop.addEventListener(Event.TRANSITION_END, onHidden)
        backdrop.classList.add('fadeout')
      }

      return true
    }

    createBackdrop() {
      const backdrop = document.createElement('div')
      backdrop.setAttribute('data-id', this.id)
      backdrop.classList.add(BACKDROP_SELECTOR)

      document.body.appendChild(backdrop)
    }

    getBackdrop() {
      return document.querySelector(`.${BACKDROP_SELECTOR}[data-id="${this.id}"]`)
    }

    removeBackdrop() {
      const backdrop = this.getBackdrop()
      if (backdrop) {
        document.body.removeChild(backdrop)
      }
    }

    attachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]')

      if (dismissButtons) {
        Array.from(dismissButtons).forEach(button => this.registerElement({ target: button, event: 'click' }))
      }

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop()
        this.registerElement({ target: backdrop, event: Event.START })
      }

      this.registerElement({ target: document, event: 'keyup' })
    }

    detachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]')

      if (dismissButtons) {
        Array.from(dismissButtons).forEach(button => this.unregisterElement({ target: button, event: 'click' }))
      }

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop()
        this.unregisterElement({ target: backdrop, event: Event.START })
      }

      this.unregisterElement({ target: document, event: 'keyup' })
    }

    static identifier() {
      return NAME
    }

    static _DOMInterface(options) {
      return super._DOMInterface(OffCanvas, options)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = []

  const offCanvas = document.querySelectorAll(`.${NAME}`)
  if (offCanvas) {
    Array.from(offCanvas).forEach((element) => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      components.push({ element, offCanvas: new OffCanvas(config) })
    })
  }

  document.addEventListener('click', (event) => {
    const target = findTargetByAttr(event.target, 'data-toggle')
    if (!target) {
      return
    }

    const dataToggleAttr = target.getAttribute('data-toggle')
    if (dataToggleAttr && dataToggleAttr === NAME) {
      const id = target.getAttribute('data-target')
      const element = document.querySelector(id)

      const component = components.find(c => c.element === element)

      if (!component) {
        return
      }

      target.blur()

      component.offCanvas.show()
    }
  })

  return OffCanvas
})()

export default OffCanvas
