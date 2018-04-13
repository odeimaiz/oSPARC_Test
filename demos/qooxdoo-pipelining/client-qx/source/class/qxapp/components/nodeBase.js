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
      minWidth: 200,
    });

    let nodeLayout = new qx.ui.layout.VBox(10);
    this.setLayout(nodeLayout);

    let inputsOutputsLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox(10, null, 'separator-horizontal'));
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
  },

  events: {

  },

  members: {
    _inputsLabels: null,
    _outputsLabels: null,
    _progressLabel: null,

    SetServiceName: function(name) {
      this.setCaption(name);
    },

    SetInputs: function(names) {
      names.forEach((name) => {
        let label = new qx.ui.basic.Label('name');
        this._inputsLabels.add(label);
      });
    },

    SetOutputs: function(names) {
      names.forEach((name) => {
        let label = new qx.ui.basic.Label('name');
        this._outputsLabels.add(label);
      });
    },
  },
});
