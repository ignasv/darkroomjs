(function () {
  'use strict';

  var Defaults = {
    brush: {
      size: 20,
      color: '#FFF'
    }
  };

  var PaintOver = Darkroom.Transformation.extend({
    applyTransformation: function(canvas, image, next) {
      next(this.options.canvas);
    }
  });

  Darkroom.plugins['brush'] = Darkroom.Plugin.extend({
    active: false,
    colorPickerActive: false,
    defaults: {
      callback: function () {
        this.darkroom.selfDestroy();
      }
    },

    initialize: function InitializeDarkroomBrushPlugin() {
      var buttonGroup = this.darkroom.toolbar.createButtonGroup();

      this.brushButton = buttonGroup.createButton({
        image: 'paintbrush'
      });
      this.okButton = buttonGroup.createButton({
        image: 'done',
        type: 'success',
        hide: true
      });
      this.cancelButton = buttonGroup.createButton({
        image: 'close',
        type: 'danger',
        hide: true
      });
      this.colorIndicator = buttonGroup.createButton({
        image: 'circle',
        hide: true
      });
      this.colorPickerButton = buttonGroup.createButton({
        image: 'eyedropper',
        hide: true
      });

      this.darkroom.canvas.freeDrawingBrush.width = Defaults.brush.size;
      this.darkroom.canvas.freeDrawingBrush.color = Defaults.brush.color;

      this.brushButton.addEventListener('click', this.toggleBrush.bind(this));
      this.okButton.addEventListener('click', this.applyBrush.bind(this));
      this.cancelButton.addEventListener('click', this.cancelBrush.bind(this));
      this.colorPickerButton.addEventListener('click', this.pickColor.bind(this));
      this.darkroom.canvas.on('mouse:down', this.onMouseDown.bind(this));
    },

    toggleBrush: function () {
      if (!this.hasFocus())
        this.requireFocus();
      else
        this.releaseFocus();
    },

    hasFocus: function () {
      return this.active;
    },

    requireFocus: function () {
      this.active = true;
      var canvas = this.darkroom.canvas;
      canvas.isDrawingMode = true;
      this.showAllButtons();
      this.darkroom.canvas.defaultCursor = 'pointer';
    },

    releaseFocus: function () {
      if (!this.hasFocus()) return;

      this.active = false;
      this.hideAllButtons();
      var canvas = this.darkroom.canvas;
      canvas.isDrawingMode = false;
      this.darkroom.canvas.defaultCursor = 'default';
    },

    applyBrush: function () {
      if (!this.hasFocus()) {
        return;
      }
      this.darkroom.applyTransformation(
        new PaintOver({canvas: this.darkroom.canvas})
      );

      this.releaseFocus();
    },

    cancelBrush: function () {
      this.darkroom.reinitializeImage();
      this.releaseFocus();
    },

    pickColor: function () {
      if (!this.hasFocus()) return;

      this.colorPickerActive = true;
      this.darkroom.canvas.defaultCursor = 'pointer';
      var canvas = this.darkroom.canvas;
      canvas.isDrawingMode = false;
    },

    onMouseDown: function (event) {
      if (!this.hasFocus()) {
        return;
      }

      if(this.colorPickerActive) {
        this.colorPickerActive = false;
        this.requireFocus();
        this.setPixelColorInfo(event, this.colorIndicator);
      }
    },

    hideAllButtons: function () {
      this.brushButton.active(false);
      this.okButton.hide(true);
      this.cancelButton.hide(true);

      this.colorIndicator.hide(true);
      this.colorPickerButton.hide(true);
    },

    showAllButtons: function () {
      this.brushButton.active(true);
      this.okButton.hide(false);
      this.cancelButton.hide(false);

      this.colorIndicator.hide(false);
      this.colorPickerButton.hide(false);
    },

    setPixelColorInfo: function(event, colorIndicator) {
      var canvas = this.darkroom.canvas.lowerCanvasEl;
      var positionOnCanvas = this.findPosition(canvas);
      var x = event.e.pageX - positionOnCanvas.x;
      var y = event.e.pageY - positionOnCanvas.y;
      var c = canvas.getContext('2d');
      var pixelColorData = c.getImageData(x, y, 1, 1).data;
      var hex = "#" + ("000000" + this.rgbToHex(pixelColorData[0], pixelColorData[1], pixelColorData[2])).slice(-6);

      this.darkroom.canvas.freeDrawingBrush.color = hex;
      colorIndicator.element.childNodes[0].style.fill = hex;
    },

    findPosition: function (obj) {
      var curleft = 0, curtop = 0;
      if (obj.offsetParent) {
        do {
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x: curleft, y: curtop};
      }
      return undefined;
    },

    rgbToHex: function (r, g, b) {
      if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
      return ((r << 16) | (g << 8) | b).toString(16);
    }
  });

})();
