
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

export function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target
    }
  }

  return null
}


export function findTargetById(target, parentId) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute('id') === parentId) {
      return target
    }
  }

  return null
}

export function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target
    }
  }

  return null
}
