/**
 * @asset(workbench/*)
 */

 qx.Class.define('qxapp.components.workbench',
{
  extend: qx.ui.container.Composite,

  construct: function(viewWidth, viewHeight) {
    this.base();

    let canvas = new qx.ui.layout.Canvas();
    this.set({
      layout: canvas,
      width: viewWidth,
      height: viewHeight,
    });

    this._addPlusButton();
  },

  events: {

  },

  members: {
    _addPlusButton: function() {
      let plusButton = new qx.ui.form.Button(null, 'workbench/images/add-icon.png');
      plusButton.set({
        width: 50,
        height: 50,
      });

      this.add(plusButton, {
        left: 20,
        top: 20,
      });

      let scope = this;
      plusButton.addListener('execute', function() {
        scope._addNode();
      }, scope);
    },

    _addNode: function() {
      const minWidth = 400;
      const minHeight = 400;

      let win = new qx.ui.window.Window('Modeler');
      win.setLayout(new qx.ui.layout.VBox);
      win.setMinWidth(minWidth);
      win.setMinHeight(minHeight);
      win.setAllowMaximize(false);

      let threeView = new qxapp.components.threeView(minWidth, minHeight, '#3F3F3F');
      win.add(threeView);

      win.addListener('resize', function(e) {
        // console.log('resizing window');
        // console.log('width, height: ', e.getData().width, e.getData().height);
        threeView.ViewResized(e.getData().width, e.getData().height);
      }, threeView);

      win.open();
    },
  },
});
