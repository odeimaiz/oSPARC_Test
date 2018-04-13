qx.Class.define('qxapp.layout.layoutManager',
{
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base();

    let body = document.body;
    let html = document.documentElement;

    let docWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
    let docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

    this.set({
      width: docWidth,
      height: docHeight,
    });

    let box = new qx.ui.layout.VBox();
    box.set({
      spacing: 10,
      alignX: 'center',
      alignY: 'middle',
    });

    this.set({
      layout: box,
    });

    this._workbench = new qxapp.components.workbench(docWidth, docHeight);
    this.add(this._workbench);
  },

  events: {

  },

  members: {
    _addNode: function() {
      console.log('Add Node');
    },
  },
});
