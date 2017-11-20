/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Page from './page'

const Pager = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'pager'
  const VERSION = '2.0.0'

  const Event = {
    PAGE: {
      SHOW: 'show',
      SHOWN: 'shown',
      HIDE: 'hide',
      HIDDEN: 'hidden',
      HASH: 'hash',
    },
  }

  let currentPage
  let oldPage
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Pager {
    /**
     * @constructor
     *
     * @param hashPrefix {String}
     * @param useHash {Boolean}
     * @param defaultPage {String|Null}
     */
    constructor(hashPrefix = '#!', useHash = true, defaultPage = null, animatePages = true) {
      this.pages = []
      this.hashPrefix = hashPrefix
      this.useHash = useHash
      this.started = false
      this.defaultPage = defaultPage
      this.animatePages = animatePages

      // add global listeners such ash hash change, navigation, etc.
      this.addPagerEvents()

      // faster way to init pages before the DOM is ready
      this.onDOMLoaded()
    }

    // private
    _(selector) {
      return document.querySelector(selector)
    }

    getHash() {
      return window.location.hash.split(this.hashPrefix)[1]
    }

    getPageFromHash() {
      const hash = this.getHash()
      const re = new RegExp('[?\/]([^\/]*)')
      const matches = re.exec(hash)

      if (matches && matches[1]) {
        return matches[1]
      }

      return null
    }

    setHash(pageName) {
      window.location.hash = this.hashPrefix + '/' + pageName
    }

    areSamePage(pageName1, pageName2) {
      const page1 = this.getPageModel(pageName1)
      const page2 = this.getPageModel(pageName2)
      return page1 && page2 && page1.name === page2.name
    }

    /**
     * Attaches the main events for tracking hash changes,
     * click on navigation buttons and links and back history
     */
    addPagerEvents() {
      document.addEventListener('click', event => this.onClick(event))
      window.addEventListener('popstate', event => this.onBackHistory(event))
      window.addEventListener('hashchange', event => this.onHashChange(event))
      document.addEventListener('DOMContentLoaded', event => this.onDOMLoaded(event))
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    // public

    showPage(pageName, addToHistory = true, back = false) {
      const oldPage = this._('.current')
      if (oldPage) {
        const oldPageName = oldPage.getAttribute('data-page')

        if (this.areSamePage(pageName, oldPageName)) {
          return
        }

        oldPage.classList.remove('current')

        // history
        window.history.replaceState({ page: oldPageName }, oldPageName, window.location.href)

        this.triggerPageEvent(oldPageName, Event.PAGE.HIDE)
      }

      this.triggerPageEvent(pageName, Event.PAGE.SHOW)

      currentPage = pageName

      // new page
      const newPage = this._('[data-page="' + pageName + '"]')

      newPage.classList.add('current')

      // template loader
      const pageModel = this.getPageModel(pageName)

      // @todo: use template cache?
      if (pageModel && pageModel.getTemplate()) {
        pageModel.loadTemplate()
      }
      // end

      if (oldPage) {
        const oldPageName = oldPage.getAttribute('data-page')
        // use of prototype-oriented language
        oldPage.back = back
        oldPage.previousPageName = oldPageName

        if (this.animatePages) {
          oldPage.addEventListener('animationend', () => this.onPageAnimationEnd(oldPage))
          oldPage.classList.add('animate')
        } else {
          this.onPageAnimationEnd(oldPage)
        }

        oldPage.classList.add(back ? 'pop-page' : 'push-page')
      }
    }

    addUniquePageModel(pageName) {
      if (!this.getPageModel(pageName)) {
        this.pages.push(new Page(pageName))
      }
    }

    getPageModel(pageName) {
      return this.pages.find(page => page.name === pageName)
    }

    getPagesModel(pageNames) {
      return this.pages.filter(page => pageNames.indexOf(page.name) > -1)
    }

    selectorToArray(str) {
      return str.split(',').map(item => item.trim())
    }

    addEvents(callback) {
      if (this.cachePageSelector === '*') {
        // add to all page models
        this.pages.forEach((page) => {
          page.addEventCallback(callback)
        })
        return
      }

      const pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true)
      pageModels.forEach((page) => {
        page.addEventCallback(callback)
      })
      this.cachePageSelector = null
    }

    useTemplate(templatePath, renderFunction = null) {
      const pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true)
      pageModels.forEach((page) => {
        page.useTemplate(templatePath)
        if (typeof renderFunction === 'function') {
          page.useTemplateRenderer(renderFunction)
        }
      })
      this.cachePageSelector = null
    }

    triggerPageEvent(pageName, eventName, eventParams = null) {
      const pageModel = this.getPageModel(pageName)
      if (pageModel) {
        pageModel.triggerScopes(eventName, eventParams)
      }
    }

    onClick(event) {
      const target = event.target
      const pageName = target.getAttribute('data-navigate')
      const pushPage = !(target.getAttribute('data-pop-page') === 'true')

      if (pageName) {
        if (pageName === '$back') {
          // the popstate event will be triggered
          window.history.back()
          return
        }

        /*
         * If we he use the hash as trigger,
         * we change it dynamically so that the hashchange event is called
         * Otherwise, we show the page
         */
        if (this.useHash) {
          this.setHash(pageName)
        } else {
          this.showPage(pageName, true, pushPage)
        }
      }
    }

    onBackHistory(event = {}) {
      const pageName = event.state ? event.state.page : null
      if (!pageName) {
        return
      }

      this.showPage(pageName, true, true)
    }

    onPageAnimationEnd(target) {
      target.classList.remove('animate')
      target.classList.remove(target.back ? 'pop-page' : 'push-page')

      this.triggerPageEvent(currentPage, Event.PAGE.SHOWN)
      this.triggerPageEvent(target.previousPageName, Event.PAGE.HIDDEN)

      target.removeEventListener('animationend', event => this.onPageAnimationEnd(event))
    }

    onHashChange() {
      const params = (this.getHash() ? this.getHash().split('/') : []).filter(p => p.length > 0)
      if (params.length > 0) {
        // remove first value which is the page name
        params.shift()
      }

      this.triggerPageEvent(currentPage, Event.PAGE.HASH, params)

      const navPage = this.getPageFromHash()
      if (navPage) {
        this.showPage(navPage)
      }
    }

    /**
     * Queries the page nodes in the DOM
     */
    onDOMLoaded() {
      const pages = document.querySelectorAll('[data-page]')

      if (!pages) {
        return
      }

      pages.forEach((page) => {
        let pageName = page.getAttribute('data-page')
        /*
         * the page name can be given with the attribute data-page
         * or with its node name
         */
        if (!pageName) {
          pageName = page.nodeName
        }

        this.addUniquePageModel(pageName)
      })
    }

    select(pageName, addPageModel = true) {
      this.cachePageSelector = pageName

      if (addPageModel && pageName !== '*') {
        this.addUniquePageModel(pageName)
      }

      return this
    }

    start(forceDefaultPage = false) {
      // check if the app has been already started
      if (this.started) {
        throw new Error(`${NAME}. The app has been already started.`)
      }

      this.started = true

      // force default page on Cordova
      if (window.cordova) {
        forceDefaultPage = true
      }

      let pageName = this.getPageFromHash()
      if (!this.getPageModel(pageName)) {
        pageName = this.defaultPage
      }

      if (forceDefaultPage && !this.defaultPage) {
        throw new Error(`${NAME}. The default page must exist for forcing its launch!`)
      }

      // Log the device info
      if (phonon.debug) {
        console.log('Starting Phonon in ' + platform.description)
        console.log(this.pages.length + ' pages found')
        console.log('Loading ' + pageName)
      }

      /*
       * if the app is configurated to use hash tracking
       * we add the page dynamically in the url
       */
      if (this.useHash) {
        this.setHash(pageName)
      }

      this.showPage(forceDefaultPage ? this.defaultPage : pageName)
    }

    // static
    static _DOMInterface(hashPrefix, useHash, defaultPage, animatePages) {
      return new Pager(hashPrefix, useHash, defaultPage, animatePages)
    }
  }

  return Pager
})()

export default Pager
