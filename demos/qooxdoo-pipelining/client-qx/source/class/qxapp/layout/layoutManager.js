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

    let box = new qx.ui.layout.Canvas();

    this.set({
      layout: box,
    });

    // Create a horizontal split pane
    this._pane = new qx.ui.splitpane.Pane('horizontal');

    const settingsWidth = 400;
    this._settingsView = new qxapp.components.settingsView();
    this._settingsView.set({
      minWidth: settingsWidth/2,
      maxWidth: settingsWidth,
    });
    this._pane.add(this._settingsView, 0);

    this._workbench = new qxapp.components.workbench();
    this._pane.add(this._workbench, 1);

    this.add(this._pane, {left: 0, top: 0, right: 0, bottom: 0});

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

    _showSettings: function(showSettings) {
      if (showSettings) {
        this._settingsView.show();
        this._workbench.show();
      } else {
        this._settingsView.exclude();
        this._workbench.show();
      }
    },
  },

  destruct: function() {
    this._disposeObjects('_pane', '_settingsView', '_workbench');
  },
});
