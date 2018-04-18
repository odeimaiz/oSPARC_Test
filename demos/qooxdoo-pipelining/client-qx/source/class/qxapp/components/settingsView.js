qx.Class.define('qxapp.components.settingsView',
{
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base();

    let box = new qx.ui.layout.VBox();
    box.set({
      spacing: 10,
      alignX: 'center',
      alignY: 'middle',
    });

    this.set({
      layout: box,
      backgroundColor: '#eee',
    });
  },

  events: {

  },

  members: {

    SetSize: function(viewWidth, viewHeight) {
      this.set({
        width: viewWidth,
        height: viewHeight,
      });
    },
  },
});
