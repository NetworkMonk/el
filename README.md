# el
Utility for shorthand easy creation and modification of collections of DOM elements.

## Installation
You can simply include the el.min.js and el.min.css in your projects to give you access


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


Set attribute values inline to multiple elements
```
el('.input-fields).attr('disabled', 'disabled');
```


### Developing

You will need an up to date install of Node JS and NPM set up.

Download or fork the source, run this command to install all dependencies for building from source.
```
npm install
```


## Building
Gulp is used to build the minified JS file, use the command gulp build to create, this will create the build in the dist folder under the relevant version number.

Run the following command to build minified files from source
```
gulp build
```