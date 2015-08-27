phonon.tagManager = (function () {

	if(typeof riot === 'undefined') {
		return;
	}

	var tags = [];

	var addTag = function(tag, name) {
	    tag[0].tagName = name;
	    tags.push(tag[0]);
	};

	var getAll = function() {
		return tags;
	};

	var trigger = function(pageName, eventName, eventParams) {

      var i = tags.length - 1;

      for (; i >= 0; i--) {
        if(tags[i].tagName === pageName) {
          tags[i].trigger( eventName , eventParams );
          break;
        }
      }
	};

	return {
		addTag: addTag,
		getAll: getAll,
		trigger: trigger
	};

})();