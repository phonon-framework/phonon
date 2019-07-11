phonon.tagManager = (function () {
  if (typeof riot === 'undefined') {
    return;
  }

  const tags = [];

  const addTag = function (tag, name) {
	    tag[0].tagName = name;
	    tags.push(tag[0]);
  };

  const getAll = function () {
    return tags;
  };

  const trigger = function (pageName, eventName, eventParams) {
    const arr = [];
    let i = tags.length - 1;

    for (; i >= 0; i--) {
      if (tags[i].tagName === pageName) {
        arr.push(eventName);
        const conc = arr.concat(eventParams);
        tags[i].trigger.apply(this, conc);
        break;
      }
    }
  };

  return {
    addTag,
    getAll,
    trigger,
  };
}());
