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

    let plusButton = this._getPlusButton();

    this.add(plusButton, {
      left: 20,
      top: 20,
    });
  },

  events: {

  },

  members: {
    _nodes: [],

    _getPlusButton: function() {
      let menuNodeTypes = new qx.ui.menu.Menu();

      let producersButton = new qx.ui.menu.Button('Producers', null, null, this._getProducers());
      let computationalsButton = new qx.ui.menu.Button('Computationals', null, null, this._getComputationals());
      let analysesButton = new qx.ui.menu.Button('Analyses', null, null, this._getAnalyses());

      menuNodeTypes.add(producersButton);
      menuNodeTypes.add(computationalsButton);
      menuNodeTypes.add(analysesButton);

      let plusButton = new qx.ui.form.MenuButton(null, 'workbench/images/add-icon.png', menuNodeTypes);
      plusButton.set({
        width: 50,
        height: 50,
      });
      return plusButton;
    },

    _getProducers: function() {
      const producers = ['Producer 1', 'Producer 2'];
      return this._createMenuFromList(producers);
    },

    _getComputationals: function() {
      const computationals = ['Computational 1', 'Computational 2', 'Computational 3', 'Computational 4'];
      return this._createMenuFromList(computationals);
    },

    _getAnalyses: function() {
      const analyses = ['Analysis 1', 'Analysis 2', 'Analysis 3'];
      return this._createMenuFromList(analyses);
    },

    _createMenuFromList: function(nodesList) {
      let buttonsListMenu = new qx.ui.menu.Menu;

      nodesList.forEach((node) => {
        let nodeButton = new qx.ui.menu.Button(node);

        let scope = this;
        nodeButton.addListener('execute', function() {
          scope._addNode(node);
        }, scope);

        buttonsListMenu.add(nodeButton);
      });

      return buttonsListMenu;
    },

    _addNodeToWorkbench(node) {
      let nNodes = this._nodes.length;
      node.moveTo(50 + nNodes*250, 200);
      node.open();

      this._nodes.push(node);
    },

    _addNode: function(nodeName) {
      let nodeBase = new qxapp.components.nodeBase();
      nodeBase.SetServiceName(nodeName);
      nodeBase.SetInputs(['In-Bat']);
      nodeBase.SetOutputs(['Out-Bat', 'Out-Bi', 'Out-Hiru']);
      this._addNodeToWorkbench(nodeBase);

      nodeBase.addListener('move', function(e) {
        console.log(e.getData(), nodeBase);
      });
    },

    _addModeler: function() {
      const minWidth = 400;
      const minHeight = 400;

      let win = new qx.ui.window.Window('Modeler');
      win.setLayout(new qx.ui.layout.VBox);
      win.setMinWidth(minWidth);
      win.setMinHeight(minHeight);
      win.setAllowMaximize(false);
      win.open();

      let threeWidget = new qxapp.components.threeWidget(minWidth, minHeight, '#3F3F3F');
      win.add(threeWidget, {flex: 1});

      win.addListener('resize', function(e) {
        threeWidget.ViewResized(e.getData().width, e.getData().height);
      }, this);
    },
  },
});
