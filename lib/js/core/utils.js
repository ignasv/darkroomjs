(function () {
  'use strict';

  Darkroom.Utils = {
    extend: extend,
    computeImageViewPort: computeImageViewPort
  };


// Utility method to easily extend objects.
  function extend(b, a) {
    var prop;
    if (b === undefined) {
      return a;
    }
    for (prop in a) {
      if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop) === false) {
        b[prop] = a[prop];
      }
    }
    return b;
  }

  function computeImageViewPort(image) {
    return {
      height: Math.abs(image.width * (Math.sin(image.angle * Math.PI / 180))) + Math.abs(image.height * (Math.cos(image.angle * Math.PI / 180))),
      width: Math.abs(image.height * (Math.sin(image.angle * Math.PI / 180))) + Math.abs(image.width * (Math.cos(image.angle * Math.PI / 180))),
    };
  }

})();
