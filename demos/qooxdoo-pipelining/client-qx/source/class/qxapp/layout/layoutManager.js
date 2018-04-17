qx.Class.define('qxapp.layout.layoutManager',
{
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base();

    let docWidth = this._getDocWidth();
    let docHeight = this._getDocHeight();

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

    this._workbench = new qxapp.components.workbench();
    this._workbench.SetSize(docWidth, docHeight);
    this.add(this._workbench);

    let scope = this;
    window.addEventListener( 'resize', function() {
      let docWidth = scope._getDocWidth();
      let docHeight = scope._getDocHeight();
      scope.set({
        width: docWidth,
        height: docHeight,
      });
      scope._workbench.SetSize(docWidth, docHeight);
    }, scope);
  },

  events: {

  },

  members: {
    _getDocWidth: function() {
      let body = document.body;
      let html = document.documentElement;
      let docWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
      return docWidth;
    },

    _getDocHeight: function() {
      let body = document.body;
      let html = document.documentElement;
      let docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
      return docHeight;
    },
  },
});
