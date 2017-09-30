(function() {
'use strict';

Darkroom.plugins['brush'] = Darkroom.Plugin.extend({
  
  active: false,

  defaults: {
    callback: function() {
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
    // this.dropperButton = buttonGroup.createButton({
    //   image: 'eyedropper'
    // });

    this.darkroom.canvas.freeDrawingBrush.width = 30;

    this.brushButton.addEventListener('click', this.toggleBrush.bind(this));
    this.okButton.addEventListener('click', this.applyBrush.bind(this));
    this.cancelButton.addEventListener('click', this.releaseFocus.bind(this));

    this.darkroom.canvas.on('mouse:down', this.onMouseDown.bind(this));
  },
  
  toggleBrush: function() {
    if (!this.hasFocus())
      this.requireFocus();
    else
      this.releaseFocus();
  },

  hasFocus: function() {
    return this.active;
  },

  requireFocus: function() {
    this.active = true;

    var canvas = this.darkroom.canvas;
    canvas.isDrawingMode = true;

    this.brushButton.active(true);
    this.okButton.hide(false);
    this.cancelButton.hide(false);

    this.darkroom.canvas.defaultCursor = 'pointer';    
  },

  releaseFocus: function() {
    if (!this.hasFocus())
      return;

    this.brushButton.active(false);
    this.okButton.hide(true);
    this.cancelButton.hide(true);
    this.active = false;

    var canvas = this.darkroom.canvas;
    canvas.isDrawingMode = false;
    
    this.darkroom.canvas.defaultCursor = 'default';
  },

  applyBrush: function() {
    if(!this.hasFocus())
      return;

    this.releaseFocus();
  },

  onMouseDown: function(event) {
    if (!this.hasFocus()) {
      return;
    }
  },

});

})();
