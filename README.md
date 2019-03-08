# el
Lightweight utility for shorthand easy creation and modification of collections of DOM elements.

![GitHub](https://img.shields.io/github/license/NetworkMonk/el.svg)
![npm (scoped)](https://img.shields.io/npm/v/@networkmonkey/el.svg)
![npm](https://img.shields.io/badge/minified%20size-5.87%20kB-blue.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/NetworkMonk/el.svg)
![npm](https://img.shields.io/npm/dt/@networkmonkey/el.svg)


## Installation
You can simply include the el.min.js in your project to give you access to el


### Usage

You can use el to create nested DOM elements easily
```
el('<div></div>').append([
    el('<p></p>').text('P node here),
    'Some text node here',
]);
```

You can use el to apply css styles to elements inline
```
el('.my-class').css('color', '#444').css('fontSize', '1.5rem');
```

One of the most exciting features of el, is that you can use it to setup and trigger PURE CSS transitions on elements dynamically.
```
el('.my-class').ani({opacity: 0}, 500, callback)
```
Will fade an element (or group of elements) to 0 opacity over 500ms, after the transition is completed the callback is callback.
.stop() can be called to stop a transition at any time, elements will retain current mid transition properties.

No per frame javascript is called during transition, this should be very lightweight.


Set attribute values inline to multiple elements
```
el('.input-fields).attr('disabled', 'disabled');
```

el can accept jquery objects
```
el($('.input-fields')).css('color', '#444');
```

You can add events to elements in bulk
```
el('.class-selector').addEvent('click', function() {
    // Do something
});
```

### Developing

You will need an up to date install of Node JS and NPM set up.

Download or fork the source, run this command to install all dependencies for building from source.
```
npm install
```


## Building
Gulp is used to build the minified JS file, use the command gulp build to create, this will create the build in the dist folder.

Run the following command to build minified files from source
```
gulp build
```