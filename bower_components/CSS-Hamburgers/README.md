# [CSS-Hamburgers](http://osahan.github.io/CSS-Hamburgers/)
CSS only Hamburgers, for Burger or CSS lovers. 

## Getting Started

### Download
[Download CSS Hamburgers](https://github.com/osahan/CSS-Hamburgers/archive/master.zip) and include the CSS in the `<head>` of your site:
    
```html
<link rel="stylesheet" href="/dist/css-hamburgers.min.css">
```

### Bower

```shell
$ bower install hamburgers
```

## How to use


### 1. Add Markup
Simple semantic markup.
```html

<!-- CSS Hamburger Markup -->
<button class="m-hamburger mm-hamburger--l-rotating-arrow"
    aria-label="Menu" aria-controls="navigation">
    <span>Menu</span>
</button> 
<!-- / Hamburger -->

<!-- Your Navigation -->
<nav id="navigation">
    ....
</nav>
```

### 2. Pick your favorite Hamburger
Start with the base module class name `m-hamburger` and use one of the following module modifiers. In addition to these classNames you can also use `mm-hamburger--inverted` modifier to invert the color of your Hamburger.

`mm-hamburger--l-rotating-arrow`, `mm-hamburger--r-rotating-arrow`. `mm-hamburger--grid`, `mm-hamburger--l-stacked`, `mm-hamburger--r-stacked`, `mm-hamburger--l-rotate`, `mm-hamburger--r-rotate`, `mm-hamburger--l-cross`, `mm-hamburger--r-cross`, `mm-hamburger--l-arrow`, `mm-hamburger--r-arrow`. 

### 3. Add Javascript
Even though CSS is animating our Hamburger, but you still need some javascript to toggle `is-active` class

```javascript
// jQuery

    $('.m-hamburger').toggleClass('is-active');

// or just plain javascript
      (function() {
          'use strict';

          var toggles = document.querySelectorAll('.m-hamburger');

          for (var i = toggles.length - 1; i >= 0; i--) {

              var toggle = toggles[i];
              toggleHandler(toggle);
          };

          function toggleHandler(toggle) {

              toggle.addEventListener( 'click', function(e) {
                  e.preventDefault();
                  this.classList.toggle('is-active');
              });
          }
      })();

```
## Customize your Hamburger

[Download CSS Hamburgers Source](https://github.com/osahan/CSS-Hamburgers/archive/master.zip) 

### List of sass variable you can change

```scss

$burger_font_size: 10px;
$burger_size: 6em;
$burger_color: #000;
$buger_color_inverted: #ddd;
$burger_transf_duration: 0.3s;
$burger-module: "hamburger";

@import "path/to/css-hamburgers";

```
### Change the name of your module

```scss

$burger-module: "vegi-burger";

```

This will change all your classNames from `*-hamburger-*` to `*-vegi-burger-*`.

## License

Licensed under the MIT license, http://www.opensource.org/licenses/mit-license.php





