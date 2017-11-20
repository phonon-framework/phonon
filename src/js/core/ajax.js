/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Ajax = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'ajax'
  const VERSION = '2.0.0'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Ajax {
    constructor(opts) {
      if (typeof opts !== 'object') {
        throw new Error(`${NAME}-${VERSION}`)
      }
      this.opts = opts
      this.errorCode = null
    }

    createXhr() {
      const xhr = new XMLHttpRequest()
      if ('withCredentials' in xhr && this.opts.crossDomain === true) {
        xhr.withCredentials = true
      }
      return xhr
    }

    setHeaders(headers = {}) {
      for (const key in headers) {
        this.xhr.setRequestHeader(key, headers[key])
      }
    }

    onPreExecute() {
      if (typeof this.opts.headers === 'object') {
        this.setHeaders(this.opts.headers)
      }

      if (typeof this.opts.timeout === 'number') {
        this.xhr.timeout = this.opts.timeout
        this.xhr.ontimeout = () => {
          this.errorCode = 'TIMEOUT_EXCEEDED'
        }
      }

      if (typeof this.opts.contentType === 'string') {
        this.setHeaders({ 'Content-type': this.opts.contentType })
      }

      if (this.opts.dataType === 'xml' && this.xhr.overrideMimeType) {
        this.xhr.overrideMimeType('application/xml; charset=utf-8')
      }
    }

    parseResponse() {
      let response = null
      if (this.opts.dataType === 'json') {
        try {
          response = JSON.parse(this.xhr.responseText)
        } catch (error) {
          this.errorCode = 'JSON_MALFORMED'
        }
      } else if (this.opts.dataType === 'xml') {
        response = this.xhr.responseXML
      } else {
        response = this.xhr.responseText
      }
      return response
    }

    runRequest() {
      this.xhr = this.createXhr()
      this.xhr.open(this.opts.method, this.opts.url, true)
      this.onPreExecute()

      this.xhr.onreadystatechange = (event) => {
        if (parseInt(this.xhr.readyState) === 4) {
          const status = this.xhr.status.toString()

          // response received
          if (typeof this.opts.complete === 'function') {
            this.opts.complete(this.errorCode, this.xhr)
          }

          // success 2xx
          if (status[0] === '2') {
            if (typeof this.opts.success === 'function') {
              this.opts.success(this.parseResponse(), this.xhr)
            }
            return
          }

          // error (1xx, 2xx, 3xx, 5xx)
          if (typeof this.opts.error === 'function') {
            // Timeout in order to wait on the timeout limit
            window.setTimeout(() => {
              this.opts.error(this.errorCode, this.xhr)
            }, 1)
          }
        }
      }
      this.xhr.send(this.opts.data)

      return this
    }

    cancel() {
      this.errorCode = 'CANCELED'
      if (this.xhr) {
        this.xhr.abort()
      }
      this.xhr = null
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    // public

    // static
    static _DOMInterface(opts) {
      return new Ajax(opts).runRequest()
    }
  }

  return Ajax
})()

export default Ajax
