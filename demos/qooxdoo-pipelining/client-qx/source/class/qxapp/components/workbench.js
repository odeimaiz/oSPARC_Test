/**
 *
 * @asset(qxapp/icons/workbench/*)
 */

const LINKS_LAYER_ID = 'drawing';

qx.Class.define('qxapp.components.workbench',
{
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base();

    let canvas = new qx.ui.layout.Canvas();
    this.set({
      layout: canvas,
    });

    let plusButton = this._getPlusButton();

    this.add(plusButton, {
      right: 20,
      bottom: 20,
    });

    this._createSvgLinksLayer();
  },

  events: {

  },

  members: {
    _nodes: [],
    _links: [],
    _svgWrapper: null,
    _linksCanvas: null,

    SetSize: function(viewWidth, viewHeight) {
      this.set({
        width: viewWidth,
        height: viewHeight,
      });
    },

    _createSvgLinksLayer: function() {
      this._svgWrapper = new qxapp.wrappers.svgWrapper();

      let scope = this;
      this._svgWrapper.addListener(('SvgLibReady'), function(e) {
        let ready = e.getData();
        if (ready) {
          let svgPlaceholder = qx.dom.Element.create('div');
          qx.bom.element.Attribute.set(svgPlaceholder, 'id', LINKS_LAYER_ID);
          qx.bom.element.Style.set(svgPlaceholder, 'z-index', 12);
          scope.getContentElement().getDomElement().appendChild(svgPlaceholder);

          scope._linksCanvas = scope._svgWrapper.CreateEmptyCanvas(LINKS_LAYER_ID, 0, 0, scope.getWidth(), scope.getHeight());
        }
      }, scope);

      this._svgWrapper.Init();
    },

    _getPlusButton: function() {
      let menuNodeTypes = new qx.ui.menu.Menu();

      let producersButton = new qx.ui.menu.Button('Producers', null, null, this._getProducers());
      let computationalsButton = new qx.ui.menu.Button('Computationals', null, null, this._getComputationals());
      let analysesButton = new qx.ui.menu.Button('Analyses', null, null, this._getAnalyses());

      menuNodeTypes.add(producersButton);
      menuNodeTypes.add(computationalsButton);
      menuNodeTypes.add(analysesButton);

      let plusButton = new qx.ui.form.MenuButton(null, 'qxapp/icons/workbench/add-icon.png', menuNodeTypes);
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
      let nNodesB = this._nodes.length;
      node.moveTo(50 + nNodesB*250, 200);
      node.open();
      this._nodes.push(node);

      let nNodesA = this._nodes.length;
      if (nNodesA > 1) {
        // force rendering to get the node's updated position
        qx.ui.core.queue.Layout.flush();
        this._addLink(this._nodes[nNodesA-2], this._nodes[nNodesA-1]);
      }
    },

    _addNode: function(nodeName) {
      let nodeBase = new qxapp.components.nodeBase();
      nodeBase.SetServiceName(nodeName);
      nodeBase.SetInputs(['In-Bat']);
      nodeBase.SetOutputs(['Out-Bat']);
      this._addNodeToWorkbench(nodeBase);

      let scope = this;
      nodeBase.addListener('move', function(e) {
        let linksInvolved = new Set([]);
        nodeBase.GetInputLinkIDs().forEach((linkId) => {
          linksInvolved.add(linkId);
        });
        nodeBase.GetOutputLinkIDs().forEach((linkId) => {
          linksInvolved.add(linkId);
        });

        linksInvolved.forEach((linkId) => {
          let link = scope._getLink(linkId);
          if (link) {
            let node1 = scope._getNode(link.getInputId());
            let node2 = scope._getNode(link.getOutputId());
            const pointList = scope._getLinkPoints(node1, node2);
            const x1 = pointList[0][0];
            const y1 = pointList[0][1];
            const x2 = pointList[1][0];
            const y2 = pointList[1][1];
            scope._svgWrapper.UpdateCurve(link.getRepresentation(), x1, y1, x2, y2);
          }
        });
      }, scope);
    },

    _addLink: function(node1, node2) {
      const pointList = this._getLinkPoints(node1, node2);
      const x1 = pointList[0][0];
      const y1 = pointList[0][1];
      const x2 = pointList[1][0];
      const y2 = pointList[1][1];
      let linkRepresentation = this._svgWrapper.DrawCurve(this._linksCanvas, x1, y1, x2, y2);
      let linkBase = new qxapp.components.linkBase(linkRepresentation);
      linkBase.setInputId(node1.getNodeId());
      linkBase.setOutputId(node2.getNodeId());
      node1.AddOutputLinkID(linkBase.getLinkId());
      node2.AddInputLinkID(linkBase.getLinkId());
      this._links.push(linkBase);

      linkBase.getRepresentation().node.addEventListener('click', function(e) {
        console.log('clicked', linkBase.getLinkId(), e);
      });
    },

    _getLinkPoints: function(node1, node2) {
      const node1Pos = node1.getBounds();
      const node2Pos = node2.getBounds();

      const x1 = node1Pos.left + node1Pos.width;
      const y1 = node1Pos.top + 50;
      const x2 = node2Pos.left;
      const y2 = node2Pos.top + 50;
      return [[x1, y1], [x2, y2]];
    },

    _getNode: function(id) {
      for (let i = 0; i < this._nodes.length; i++) {
        if (this._nodes[i].getNodeId() === id) {
          return this._nodes[i];
        }
      };
      return null;
    },

    _getLink: function(id) {
      for (let i = 0; i < this._links.length; i++) {
        if (this._links[i].getLinkId() === id) {
          return this._links[i];
        }
      };
      return null;
    },

    _getConnectedLinks: function(id) {
      let connectedLinks = Set([]);
      this._links.forEach((link) => {
        if (link.getInputId() === id) {
          connectedLinks.add(link.getLinkId());
        }
        if (link.getOutputId() === id) {
          connectedLinks.add(link.getLinkId());
        }
      });
      return connectedLinks;
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
