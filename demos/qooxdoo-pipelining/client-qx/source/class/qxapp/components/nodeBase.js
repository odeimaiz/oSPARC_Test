qx.Class.define('qxapp.components.nodeBase',
{
  extend: qx.ui.window.Window,

  construct: function() {
    this.base();

    this.set({
      showMinimize: false,
      showMaximize: false,
      showClose: false,
      showStatusbar: false,
      resizable: false,
      allowMaximize: false,
      minWidth: 160,
    });

    this.setNodeId(qxapp.utils.utils.uuidv4());

    let nodeLayout = new qx.ui.layout.VBox(5, null, 'separator-vertical');
    this.setLayout(nodeLayout);

    let inputsOutputsLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
    this.add(inputsOutputsLayout, {flex: 1});

    let inputsBox = new qx.ui.layout.VBox(5);
    inputsBox.setAlignX('left');
    this._inputsLabels = new qx.ui.container.Composite(inputsBox);
    inputsOutputsLayout.add(this._inputsLabels, {width: '50%'});

    let outputsBox = new qx.ui.layout.VBox(5);
    outputsBox.setAlignX('right');
    this._outputsLabels = new qx.ui.container.Composite(outputsBox);
    inputsOutputsLayout.add(this._outputsLabels, {width: '50%'});

    let progressBox = new qx.ui.layout.HBox(5);
    progressBox.setAlignX('center');
    let progressLayout = new qx.ui.container.Composite(progressBox);
    this._progressLabel = new qx.ui.basic.Label('0%');
    progressLayout.add(this._progressLabel);
    this.add(progressLayout);

    this._inputLinkIDs = [];
    this._outputLinkIDs = [];
  },

  events: {

  },

  properties: {
    nodeId: {
      check: 'String',
      nullable: false,
    },
  },

  members: {
    _inputsLabels: null,
    _outputsLabels: null,
    _progressLabel: null,
    _inputLinkIDs: null,
    _outputLinkIDs: null,

    SetServiceName: function(name) {
      this.setCaption(name);
    },

    SetInputs: function(names) {
      names.forEach((name) => {
        let label = new qx.ui.basic.Label(name);
        this._inputsLabels.add(label);
      });
    },

    SetOutputs: function(names) {
      names.forEach((name) => {
        let label = new qx.ui.basic.Label(name);
        this._outputsLabels.add(label);
      });
    },

    AddInputLinkID: function(linkID) {
      this._inputLinkIDs.push(linkID);
    },

    GetInputLinkIDs: function() {
      return this._inputLinkIDs;
    },

    AddOutputLinkID: function(linkID) {
      this._outputLinkIDs.push(linkID);
    },

    GetOutputLinkIDs: function() {
      return this._outputLinkIDs;
    },
  },
});
