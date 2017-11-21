
export function loadFile(url, fn, postData) {
  const req = new XMLHttpRequest()
  if (req.overrideMimeType) req.overrideMimeType('text/html; charset=utf-8')
  req.onreadystatechange = () => {
    if (req.readyState === 4 && (parseInt(req.status) === 200 || !req.status && req.responseText.length)) {
      fn(req.responseText)
    }
  }

  if (typeof postData !== 'string') {
    req.open('GET', url, true)
    req.send('')
  } else {
    req.open('POST', url, true)
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    req.send(postData)
  }
}

export function generateId() {
  return Math.random().toString(36).substr(2, 10)
}
