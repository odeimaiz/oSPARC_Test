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

    // Create a horizontal split pane
    this._pane = new qx.ui.splitpane.Pane('horizontal').set({
      width: docWidth,
      height: docHeight,
    });

    const settingsWidth = 500;
    this._settingsView = new qxapp.components.settingsView();
    this._settingsView.set({
      minWidth: settingsWidth/2,
      maxWidth: settingsWidth,
    });
    this._settingsView.SetSize(settingsWidth, docHeight);
    this._pane.add(this._settingsView, 0);

    this._workbench = new qxapp.components.workbench();
    this._workbench.SetSize(docWidth-settingsWidth, docHeight);
    this._pane.add(this._workbench, 1);

    this.add(this._pane);

    let scope = this;
    window.addEventListener( 'resize', function() {
      let docWidth = scope._getDocWidth();
      let docHeight = scope._getDocHeight();
      scope.set({
        width: docWidth,
        height: docHeight,
      });
      // scope._workbench.SetSize(docWidth, docHeight);
    }, scope);
  },

  events: {

  },

  members: {
    _pane: null,

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

  destruct: function() {
    this._disposeObjects('_pane', '_settingsView', '_workbench');
  },
});
