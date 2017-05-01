'use strict';

(function () {

  /******************************************************************************\
    prototype
  \******************************************************************************/

  var prototype = Object.create(HTMLElement.prototype);

  /******************************************************************************\
    addTag
  \******************************************************************************/

  prototype.addTag = function addTag(value) {
    var isDuplicate = this.isDuplicate(value);

    if (this.allowDuplicates || !isDuplicate) {
      this.value.push(value);
      this.tagList.appendChild(this.createTag(value));

      this.triggerEvent('add', value);

      this.log('groupCollapsed', 'adding tag');
      this.log('added tag:', value);
      this.log('groupEnd');

      return true;
    }

    this.handleDuplicate();
    return false;
  };

  /******************************************************************************\
    attachedCallback
  \******************************************************************************/

  prototype.attachedCallback = function attachedCallback() {
    this.log('tags-input attached!', this);
  };

  /******************************************************************************\
    attributeChangedCallback
  \******************************************************************************/

  prototype.attributeChangedCallback = function attributeChangedCallback(attribute, oldValue, newValue) {
    var prop = null;

    this.log('groupCollapsed', 'attribute changed');
    this.log('attribute:', attribute);

    switch (attribute) {
      case 'data-duplicates':
        prop = 'allowDuplicates';
        break;
      case 'data-multiple':
        prop = 'allowMultiple';
        break;
      case 'data-new':
        prop = 'allowNew';
        break;
      case 'data-debug':
        prop = 'debug';
        break;
    }

    if (prop) {
      this.updateAttribute(attribute, prop);
      this.log('prop:', prop);
    }

    this.log('old value:', oldValue);
    this.log('new value:', newValue);
    this.log('groupEnd');
  };

  /******************************************************************************\
    blurOption
  \******************************************************************************/

  prototype.blurOption = function blurOption(option) {
    option.classList.remove('focus');
  };

  /******************************************************************************\
    blurTag
  \******************************************************************************/

  prototype.blurTag = function blurTag(tag) {
    tag.classList.remove('focus');
  };

  /******************************************************************************\
    clearInput
  \******************************************************************************/

  prototype.clearInput = function clearInput() {
    this.input.value = '';
  };

  /******************************************************************************\
    clearOptions
  \******************************************************************************/

  prototype.clearOptions = function clearOptions() {
    this.optionList.innerHTML = '';
  };

  /******************************************************************************\
    clearSelectedTag
  \******************************************************************************/

  prototype.clearSelectedTag = function clearSelectedTag() {
    var selectedTag = this.tagList.querySelector('.focus');

    if (selectedTag) {
      this.blurTag(selectedTag);
    }
  };

  /******************************************************************************\
    createdCallback
  \******************************************************************************/

  prototype.createdCallback = function createdCallback() {
    // Add bindings for Backbone.Stickit
    this.initializeStickit();

    this.updateAttribute('data-duplicates', 'allowDuplicates');
    this.updateAttribute('data-multiple', 'allowMultiple');
    this.updateAttribute('data-new', 'allowNew');
    this.updateAttribute('data-debug', 'debug');
    this.identifier = this.getAttribute('id') || this.getAttribute('name');

    this.log('groupCollapsed', 'tags-input');
    this.log('Allow Duplicates:', this.allowDuplicates);
    this.log('Allow Multiple:', this.allowMultiple);
    this.log('Allow New:', this.allowNew);
    this.log('Debug:', this.debug);
    this.log('groupEnd');

    this.value = [];

    this.optionList = document.createElement('ol');
    this.tagList = document.createElement('ul');

    var startingValue = this.getAttribute('value');
    if (startingValue) {
      startingValue.split(',').forEach(this.addTag.bind(this));
    }

    this.optionList.classList.add('options');
    this.tagList.classList.add('tags');

    this.hideOptions();

    this.createShadowRoot();
    this.shadowRoot.appendChild(this.createStylesheet());
    this.shadowRoot.appendChild(this.tagList);
    this.shadowRoot.appendChild(this.createInput());
    this.shadowRoot.appendChild(this.optionList);
  };

  /******************************************************************************\
    createInput
  \******************************************************************************/

  prototype.createInput = function createInput() {
    var _this = this;

    this.input = document.createElement('input');

    this.input.setAttribute('type', 'search');
    this.input.addEventListener('keydown', this.handleKeybinds.bind(this));
    this.input.addEventListener('input', this.handleInput.bind(this));
    this.input.addEventListener('focus', function () {
      _this.setAttribute('data-focus', '');
      _this.showOptions();
    });
    this.input.addEventListener('blur', function () {
      _this.removeAttribute('data-focus');
      _this.hideOptions();
    });

    return this.input;
  };

  /******************************************************************************\
    createOption
  \******************************************************************************/

  prototype.createOption = function createOption(option) {
    var optionElement = document.createElement('li');

    if (typeof option === 'string') {
      optionElement.innerHTML = option;
      optionElement.setAttribute('data-value', option);
    } else {
      optionElement.innerHTML = option.value;
      optionElement.setAttribute('data-value', option.value);

      if (option.id) {
        optionElement.setAttribute('data-id', option.id);
      }
    }

    optionElement.addEventListener('mouseover', this.focusOption.bind(this, optionElement));
    optionElement.addEventListener('mouseout', this.blurOption.bind(this, optionElement));

    return optionElement;
  };

  /******************************************************************************\
    createRemoveButton
  \******************************************************************************/

  prototype.createRemoveButton = function createRemoveButton(tag) {
    var removeButton = document.createElement('button');

    removeButton.innerHTML = '&times;';

    removeButton.addEventListener('mousedown', this.removeTag.bind(this, tag));

    return removeButton;
  };

  /******************************************************************************\
    createStylesheet
  \******************************************************************************/

  prototype.createStylesheet = function createStylesheet() {
    var stylesheet = document.createElement('style');

    stylesheet.innerHTML = ':host {' + 'align-content: stretch;' + 'align-items: center;' + 'background-color: white;' + 'border: 1px solid black;' + 'display: flex;' + 'flex-wrap: wrap;' + 'position: relative;' + '}' +

    //    ':host * {' +
    //      'box-sizing: border-box;'
    //    '}' +

    ':host input {' + 'border: none;' + 'flex-grow: 1;' + 'flex-shrink: 0;' + 'min-width: 20%;' + 'outline: none;' + 'padding: 1rem 1.5rem;' + '}' + ':host button {' + 'background: none;' + 'background-color: rgba(0, 0, 0, 0);' + 'border: none;' + 'border-radius: 0;' + 'flex-grow: 1;' + 'margin: 0;' + 'margin-left: 0.5rem;' + 'padding: 0 0.5rem;' + '}' + ':host button:hover {' + 'background-color: rgba(0, 0, 0, 0.3);' + '}' + ':host .options,' + ':host .tags {' + 'list-style: none;' + 'margin: 0;' + 'padding: 0;' + '}' + ':host .options {' + 'background-color: white;' + 'border: 1px solid black;' + 'left: 0;' + 'position: absolute;' + 'right: 0;' + 'top: 100%;' + 'width: 100%;' + 'z-index: 1;' + '}' + ':host .options:empty {' + 'display: none;' + '}' + ':host .options li {' + 'padding: 1rem;' + '}' + ':host .options .focus {' + 'background-color: lightgrey;' + '}' + ':host .tags {' + 'align-items: center;' + 'display: flex;' + 'flex-wrap: wrap;' + 'flex-shrink: 0;' + 'max-width: 100%;' + '}' + ':host .tags li {' + 'background-color: lightgrey;' + 'margin: 0.5rem;' + 'padding: 0 0 0 0.5rem;' + '}' + ':host .tags .focus {' + 'background-color: blue;' + 'color: white;' + '}' + ':host .hide {' + 'display: none;' + '}';

    return stylesheet;
  };

  /******************************************************************************\
    createTag
  \******************************************************************************/

  prototype.createTag = function createTag(value) {
    var tag = document.createElement('li');

    if (typeof value === 'string') {
      tag.setAttribute('data-value', value);
    } else {
      tag.setAttribute('data-value', value.value);

      if (value.id) {
        tag.setAttribute('data-id', value.id);
      }
    }

    tag.appendChild(this.createTextWrapper(value));
    tag.appendChild(this.createRemoveButton(tag));

    return tag;
  };

  /******************************************************************************\
    createTextWrapper
  \******************************************************************************/

  prototype.createTextWrapper = function createTextWrapper(value) {
    var textWrapper = document.createElement('span');

    if (typeof value === 'string') {
      textWrapper.innerHTML = value;
    } else {
      textWrapper.innerHTML = value.value;
    }

    return textWrapper;
  };

  /******************************************************************************\
    detachedCallback
  \******************************************************************************/

  prototype.detachedCallback = function detachedCallback() {
    this.log('tags-input detached!', this);
  };

  /******************************************************************************\
    findOption
  \******************************************************************************/

  prototype.findOption = function findOption(option) {
    var queryString = void 0;

    if (typeof option === 'string') {
      queryString = '[data-value=' + option + ']';
    } else {
      if (option.id) {
        queryString = '[data-id=\'' + option.id + '\']';
      } else {
        queryString = '[data-value=\'' + option.value + '\']';
      }
    }

    return this.optionList.querySelector(queryString);
  };

  /******************************************************************************\
    focusOption
  \******************************************************************************/

  prototype.focusOption = function focusOption(option) {
    var selectedOption = this.optionList.querySelector('.focus');
    var selectedTag = this.tagList.querySelector('.focus');

    if (selectedOption) {
      this.blurOption(selectedOption);
    }

    if (selectedTag) {
      this.blurTag(selectedTag);
    }

    option.classList.add('focus');
  };

  /******************************************************************************\
    focusTag
  \******************************************************************************/

  prototype.focusTag = function focusTag(tag) {
    var selectedTag = this.tagList.querySelector('.focus');

    if (selectedTag) {
      this.blurTag(selectedTag);
    }

    tag.classList.add('focus');
  };

  /******************************************************************************\
    getElementValue
  \******************************************************************************/

  prototype.getElementValue = function getElementValue(element) {
    if (element.hasAttribute('data-id')) {
      return {
        id: element.getAttribute('data-id'),
        value: element.getAttribute('data-value')
      };
    } else {
      return element.getAttribute('data-value');
    }
  };

  /******************************************************************************\
    handleDuplicate
  \******************************************************************************/

  prototype.handleDuplicate = function handleDuplicate() {
    this.triggerEvent('error', 'duplicate');
    this.log('warn', 'duplicate tag');
  };

  /******************************************************************************\
    handleInvalid
  \******************************************************************************/

  prototype.handleInvalid = function handleInvalid() {
    this.triggerEvent('error', 'invalid');
    this.log('warn', 'invalid tag');
  };

  /******************************************************************************\
    handleDelete
  \******************************************************************************/

  prototype.handleDelete = function handleDelete() {
    if (this.shouldCaptureKeybind()) {
      event.preventDefault();

      var selectedTag = this.tagList.querySelector('.focus');

      if (selectedTag) {
        var previousTag = selectedTag.previousElementSibling;

        if (previousTag) {
          this.focusTag(previousTag);
        }

        this.removeTag(selectedTag);
      } else if (selectedTag = this.tagList.querySelector('li:last-of-type')) {
        this.focusTag(selectedTag);
      }
    }
  };

  /******************************************************************************\
    handleDownArrow
  \******************************************************************************/

  prototype.handleDownArrow = function handleDownArrow() {
    event.preventDefault();

    var selectedOption = this.optionList.querySelector('.focus');

    if (selectedOption) {
      var nextOption = selectedOption.nextElementSibling;

      if (nextOption) {
        this.blurOption(selectedOption);
        this.focusOption(nextOption);
      }
    } else {
      selectedOption = this.optionList.querySelector('li:first-of-type');

      if (selectedOption) {
        this.focusOption(selectedOption);
      }
    }
  };

  /******************************************************************************\
    handleInput
  \******************************************************************************/

  prototype.handleInput = function handleInput() {
    this.clearSelectedTag();

    this.search(this.input.value);
  };

  /******************************************************************************\
    handleLeftArrow
  \******************************************************************************/

  prototype.handleLeftArrow = function handleLeftArrow() {
    if (this.shouldCaptureKeybind()) {
      event.preventDefault();

      var selectedTag = this.tagList.querySelector('.focus');

      if (selectedTag) {
        var previousTag = selectedTag.previousElementSibling;

        if (previousTag) {
          this.clearSelectedTag();
          this.focusTag(previousTag);
        }
      } else {
        selectedTag = this.tagList.querySelector('li:last-of-type');

        if (selectedTag) {
          this.focusTag(selectedTag);
        }
      }
    }
  };

  /******************************************************************************\
    handleKeybinds
  \******************************************************************************/

  prototype.handleKeybinds = function handleKeybinds(event) {
    switch (event.which) {
      case 9: // tab
      case 13: // enter
      case 188:
        // comma
        this.handleReturn(event);
        break;

      case 8: // backspace
      case 46:
        // delete
        this.handleDelete();
        break;

      case 37:
        // left arrow
        this.handleLeftArrow();
        break;

      case 39:
        // right arrow
        this.handleRightArrow();
        break;

      case 38:
        // up arrow
        this.handleUpArrow();
        break;

      case 40:
        // down arrow
        this.handleDownArrow();
        break;
    }
  };

  /******************************************************************************\
    handleOptionClick
  \******************************************************************************/

  prototype.handleOptionClick = function handleOptionClick(event) {
    event.preventDefault();

    var target = event.target;
    var value = this.getElementValue(target);

    if (this.addTag(value)) {
      this.clearInput();
      this.clearOptions();
    }

    this.input.focus();

    this.log('groupCollapsed', 'handleOptionClick');
    this.log('value', value);
    this.log('target', target);
    this.log(this.input);
    this.log('groupEnd');
  };

  /******************************************************************************\
    handleReturn
  \******************************************************************************/

  prototype.handleReturn = function handleReturn(event) {
    var firstOption = this.optionList.querySelector('li:first-of-type');
    var selectedOption = this.optionList.querySelector('.focus');
    var value = void 0;

    if (!this.input.value) {
      return;
    }

    if (this.allowNew) {
      value = this.input.value;
    } else if (firstOption) {
      value = this.getElementValue(firstOption);
    }

    if (selectedOption) {
      value = this.getElementValue(selectedOption);
    }

    if (!this.allowNew && !firstOption) {
      this.handleInvalid();
      return;
    }

    if (value) {
      event.preventDefault();

      this.addTag(value);

      this.clearInput();
      this.clearOptions();
    }
  };

  /******************************************************************************\
    handleRightArrow
  \******************************************************************************/

  prototype.handleRightArrow = function handleRightArrow() {
    if (this.shouldCaptureKeybind()) {
      event.preventDefault();

      var selectedTag = this.tagList.querySelector('.focus');

      if (selectedTag) {
        var nextTag = selectedTag.nextElementSibling;

        if (nextTag) {
          this.focusTag(nextTag);
        }

        this.clearSelectedTag();
      }
    }
  };

  /******************************************************************************\
    handleUpArrow
  \******************************************************************************/

  prototype.handleUpArrow = function handleUpArrow() {
    event.preventDefault();

    var selectedOption = this.optionList.querySelector('.focus');

    if (selectedOption) {
      var previousOption = selectedOption.previousElementSibling;

      if (previousOption) {
        this.focusOption(previousOption);
      }

      this.blurOption(selectedOption);
    }
  };

  /******************************************************************************\
    hideOptions
  \******************************************************************************/

  prototype.hideOptions = function hideOptions() {
    this.optionList.classList.add('hide');
  };

  /******************************************************************************\
    initializeStickit
  \******************************************************************************/

  prototype.initializeStickit = function initializeStickit() {
    var _this2 = this;

    if (window.Backbone && window.Backbone.Stickit) {
      Backbone.Stickit.addHandler({
        events: ['blur'],
        getVal: function getVal($el, event, options) {
          return $el.val();
        },
        onGet: function onGet(value, options) {
          if (value) {
            if (Array.isArray(value)) {
              value.forEach(_this2.addTag);
            } else if (typeof value === 'string') {
              value.split(',').forEach(_this2.addTag.bind(_this2));
            }
          }

          return value;
        },
        selector: 'tags-input'
      });
    }
  };

  /******************************************************************************\
    isDuplicate
  \******************************************************************************/

  prototype.isDuplicate = function isDuplicate(value) {
    var ret = void 0;

    if (typeof value === 'string') {
      ret = this.value.indexOf(value) !== -1;
    } else {
      ret = this.matchValue(value) !== -1;
    }

    return ret;
  };

  /******************************************************************************\
    log
  \******************************************************************************/

  prototype.log = function log() {
    // Default to using console.log
    var type = 'log';

    // Check to see if the first argument passed is a console function. If so,
    // remove it from the arguments and use it instead of log
    if (Object.keys(console).indexOf(arguments[0]) !== -1) {
      type = [].shift.call(arguments);
    }

    if (this.debug) {
      console[type].apply(this, arguments);
    }
  };

  /******************************************************************************\
    matchValue
  \******************************************************************************/

  prototype.matchValue = function matchValue(value) {
    for (var i = 0, length = this.value.length; i < length; i++) {
      if (this.value[i].id && value.id) {
        if (this.value[i].id === value.id) {
          return i;
        }
      } else if (this.value[i].value === value.value) {
        return i;
      }
    }

    return -1;
  };

  /******************************************************************************\
    removeTag
  \******************************************************************************/

  prototype.removeTag = function removeTag(tag) {
    var value = this.getElementValue(tag);
    var index = void 0;

    if (typeof value === 'string') {
      index = this.value.indexOf(value);
    } else {
      this.matchValue(value);
    }

    this.value.splice(index, 1);

    tag.querySelector('button').removeEventListener('mousedown', this.removeTag);
    tag.remove();

    this.triggerEvent('remove', value);

    this.log('groupCollapsed', 'removing tag');
    this.log('value:', value);
    this.log('groupEnd');
  };

  /******************************************************************************\
    search
  \******************************************************************************/

  prototype.search = function search(query) {
    if (query) {
      this.triggerEvent('search', query);
    }

    this.log('groupCollapsed', 'search');
    this.log(query ? 'query:' + query : 'no query');
    this.log('groupEnd');
  };

  /******************************************************************************\
    shouldCaptureKeybind
  \******************************************************************************/

  prototype.shouldCaptureKeybind = function shouldCaptureKeybind() {
    var input = this.input;

    if (!input.selectionStart && !input.selectionEnd) {
      return true;
    }

    return false;
  };

  /******************************************************************************\
    showOptions
  \******************************************************************************/

  prototype.showOptions = function showOptions() {
    this.optionList.classList.remove('hide');
  };

  /******************************************************************************\
    triggerEvent
  \******************************************************************************/

  prototype.triggerEvent = function triggerEvent(type, detail) {
    this.dispatchEvent(new CustomEvent(type, {
      detail: detail
    }));
  };

  /******************************************************************************\
    updateAttribute
  \******************************************************************************/

  prototype.updateAttribute = function updateAttribute(attribute, property) {
    var hasAttribute = this.hasAttribute(attribute);
    var value = this.getAttribute(attribute);

    // If the attribute doesn't exist, we'll just return false
    if (!hasAttribute) {
      value = false;

      // getAttribute returns an empty string for boolean attributes
    } else if (typeof value === 'string' && value === '') {
      value = true;
    }

    if (typeof value === 'string' && /(true|false)/gi.test(value)) {
      value = value.toLowerCase() === 'true';
    }

    this[property] = value;
  };

  /******************************************************************************\
    updateOptions
  \******************************************************************************/

  prototype.updateOptions = function updateOptions(options, merge) {
    var _this3 = this;

    if (!merge) {
      this.clearOptions();
    }

    options.forEach(function (option) {
      if (merge && _this3.findOption(option)) {
        return;
      }

      var optionElement = _this3.createOption(option);

      optionElement.addEventListener('mousedown', _this3.handleOptionClick.bind(_this3));

      _this3.optionList.appendChild(optionElement);
    });

    this.log('groupCollapsed', 'updating options');
    this.log('options:', options);
    this.log('groupEnd');
  };

  document.registerElement('tags-input', {
    prototype: prototype
  });
})();
