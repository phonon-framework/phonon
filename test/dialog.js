import { JSDOM } from 'jsdom'
import test from 'unit.js'
import Dialog from '../src/js/components/dialog'

const dom = new JSDOM('<body></body>', { pretendToBeVisual: true })

global.window = dom.window
global.document = dom.window.document
global.CustomEvent = window.CustomEvent

describe('Dialog', () => {

  it('Build a dialog without a title and message', () => {
    const dialog = new Dialog()
    const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)

    test.object(dialogElement)
    test.string(dialogElement.querySelector('.dialog-title').innerHTML).is('')
    test.string(dialogElement.querySelector('.dialog-body').firstChild.innerHTML).is('')
  })

  it('Build a dialog with a title and message', () => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)

    test.object(dialogElement)
    test.string(dialogElement.querySelector('.dialog-title').innerHTML).is('Hello')
    test.string(dialogElement.querySelector('.dialog-body').firstChild.innerHTML).is('Content')
  })

  it('Show an auto build dialog', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    dialog.show()

    const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)

    setTimeout(() => {
      test.bool(dialogElement.classList.contains('show')).isTrue() 
      done()
    }, 10)
  })

  it('Show, then hide an auto build dialog', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    dialog.show()

    setTimeout(() => {
      const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)
      test.bool(dialogElement.classList.contains('show')).isTrue()

      dialog.hide()

      setTimeout(() => {
        test.bool(dialogElement.classList.contains('show')).isFalse()    
        done()  
      }, 10)
    }, 10)
  })

  it('Show, then hide an auto build dialog by clicking on a dismiss button', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    dialog.show()

    setTimeout(() => {
      const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)
      test.bool(dialogElement.classList.contains('show')).isTrue()

      // data-dismiss will hide the dialog
      dialogElement.querySelector('[data-dismiss]').click()

      setTimeout(() => {
        test.bool(dialogElement.classList.contains('show')).isFalse()    
        done()  
      }, 10)
    }, 10)
  })

  it('Show, then hide an auto build dialog by clicking on the backdrop', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    dialog.show()

    setTimeout(() => {
      const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)
      test.bool(dialogElement.classList.contains('show')).isTrue()

      // starting a click on the backdrop will hide the dialog
      document.querySelector('.dialog-backdrop').dispatchEvent(new CustomEvent('mousedown'))

      setTimeout(() => {
        test.bool(dialogElement.classList.contains('show')).isFalse()    
        done()  
      }, 10)
    }, 10)
  })

  it('Show, then hide an auto build dialog by presing the escape (ESC) key', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
    })

    dialog.show()

    setTimeout(() => {
      const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)
      test.bool(dialogElement.classList.contains('show')).isTrue()

      // simulate the escape key
      document.dispatchEvent(new CustomEvent('keyup'), { detail: { keyCode: 27 } })

      setTimeout(() => {
        test.bool(dialogElement.classList.contains('show')).isFalse()
        done()  
      }, 10)
    }, 10)
  })

  it('Show, then check that a not cancelable dialog can\'t be hidden with the backdrop or by pressing the escape key', (done) => {
    const dialog = new Dialog({
      title: 'Hello',
      message: 'Content',
      cancelable: false,
    })

    dialog.show()

    setTimeout(() => {
      const dialogElement = document.querySelector(`[data-id="${dialog.id}"]`)
      test.bool(dialogElement.classList.contains('show')).isTrue()

      // starting a click on the backdrop will hide the dialog
      document.querySelector('.dialog-backdrop').dispatchEvent(new CustomEvent('mousedown'))

      // simulate the escape key
      document.dispatchEvent(new CustomEvent('keyup'), { detail: { keyCode: 27 } })

      setTimeout(() => {
        test.bool(dialogElement.classList.contains('show')).isTrue()    
        done()  
      }, 10)
    }, 10)
  })
})
