/**
 * This class is a direct link with JSNetworkX.
 * @asset(qxapp/*)
 * @asset(jquery/*)
 * @asset(jquery-flowchart/*)
 * @ignore(jquery)
 */

qx.Class.define('qxapp.wrappers.jqueryFlowchart', {

  extend: qx.core.Object,

  construct: function() {
    // initialize the script loading
    // in debug mode load the uncompressed unobfuscated scripts
    // three.js files are in resource/three/three(.min).js
    let min = '.min';
    if (qx.core.Environment.get('qx.debug')) {
      min = '';
    }

    // initialize the script loading
    let jqueryPath = '../resource/jquery/jquery-3.3.1' + min + '.js';
    let jqueryUIPath = '../resource/jquery/jquery-ui-1.12.1' + min + '.js';
    let jqueryUICssPath = '../resource/jquery/jquery-ui-1.12.1' + min + '.css';
    let flowchartPath = '../resource/jquery-flowchart/jquery.flowchart' + min + '.js';
    let flowchartCssPath = '../resource/jquery-flowchart/jquery.flowchart' + min + '.css';
    let flowchartZ43CssPath = '../resource/jquery-flowchart/jquery.flowchart.z43' + min + '.css';
    let dynLoader = new qx.util.DynamicScriptLoader([
      jqueryPath,
      jqueryUIPath,
      flowchartPath,
    ]);
    this._addCss(jqueryUICssPath);
    this._addCss(flowchartCssPath);
    this._addCss(flowchartZ43CssPath);

    dynLoader.addListenerOnce('ready', function(e) {
      console.log(flowchartPath + ' loaded');
      this.setLibReady(true);

      this.fireDataEvent('workflowLibReady', true);
    }, this);

    dynLoader.addListener('failed', function(e) {
      let data = e.getData();
      console.log('failed to load ' + data.script);
      this.fireDataEvent('workflowLibReady', false);
    }, this);

    dynLoader.start();
  },

  events: {
    'workflowLibReady': 'qx.event.type.Data',
    'NodeClicked': 'qx.event.type.Data',
    'DoubleClicked': 'qx.event.type.Event',
  },

  properties: {
    libReady: {
      nullable: false,
      init: false,
      check: 'Boolean',
    },
  },

  members: {
    _mainGraph: null,
    _workbenchData: null,
    _canvasId: null,

    CreateEmptyCanvas: function(canvasId) {
      this._canvasId = canvasId;

      this._fillEmptyWorkbench();

      // Apply the plugin on a standard, empty div...
      let $operatorTitle = $('#operator_title');
      let $flowchart = $('#' + this._canvasId);
      let that = this;
      $flowchart.flowchart({
        data: that._workbenchData,
        multipleLinksOnOutput: true,
        multipleLinksOnInput: true,
        onOperatorSelect: function(operatorId) {
          $operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
          that._nodeSelected(operatorId);
          return true;
        },
      });
    },

    _fillEmptyWorkbench: function() {
      this._workbenchData = {
        operators: {},
        links: {},
      };
    },

    AddStuff: function(loadExample) {
      const cx = 200;
      const cy = 200;
      this._workbenchData = {
        operators: {
          operator1: {
            top: cy - 100,
            left: cx - 200,
            properties: {
              title: 'Operator 1',
              inputs: {},
              outputs: {
                output_1: {
                  label: 'Output 1',
                },
              },
            },
          },
          operator2: {
            top: cy,
            left: cx + 140,
            properties: {
              title: 'Operator 2',
              inputs: {
                input_1: {
                  label: 'Input 1',
                },
                input_2: {
                  label: 'Input 2',
                },
              },
              outputs: {},
            },
          },
        },
        links: {
          link_1: {
            fromOperator: 'operator1',
            fromConnector: 'output_1',
            toOperator: 'operator2',
            toConnector: 'input_2',
          },
        },
      };

      let $flowchart = $('#' + this._canvasId);
      $flowchart.flowchart('setData', this._workbenchData);

      /*
      //d3.select("svg.jsnx").selectAll("g.node").on('mouseenter', function(d) {
          //  console.log('mouseenter', d);
      //});

      //d3.select("svg.jsnx").selectAll("g.node").on('mouseover', function(d) {
          //  console.log('mouseover', d);
      //});
      */
    },

    StartPipeline: function() {
      const getAllInfo = true;
      let nodes = this._mainGraph.nodes(getAllInfo);
      for (let i = 0; i < nodes.length; i++) {
        let oldNode = nodes[i][0];
        this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
      }
    },

    StopPipeline: function() {
      const getAllInfo = true;
      let nodes = this._mainGraph.nodes(getAllInfo);
      for (let i = 0; i < nodes.length; i++) {
        let oldNode = nodes[i][0];
        this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
      }
    },

    UpdatePipeline: function(data) {
      const getAllInfo = true;
      let nodes = this._mainGraph.nodes(getAllInfo);
      if (data.length != nodes.length) {
        return;
      }

      for (let i = 0; i < nodes.length; i++) {
        let oldNode = nodes[i][0];
        if (data[i] == -1) {
          this._mainGraph.addNodesFrom([oldNode], {color: 'red'});
        } else if (data[i] < 1.0) {
          this._mainGraph.addNodesFrom([oldNode], {color: 'orange'});
        } else {
          this._mainGraph.addNodesFrom([oldNode], {color: 'green'});
        }
      }
    },

    _nodeSelected: function(operatorId) {
      console.log('operatorId: ', operatorId);
      if (operatorId in this._workbenchData.operators) {
        this.fireDataEvent('NodeClicked', this._workbenchData.operators[operatorId]);
      }
    },

    _addCss: function(url) {
      let head = document.getElementsByTagName('head')[0];
      let el = document.createElement('link');
      el.type = 'text/css';
      el.rel = 'stylesheet';
      el.href = qx.util.ResourceManager.getInstance().toUri(url);
      setTimeout(function() {
        head.appendChild(el);
      }, 0);
    },
  },

  /**
   * Destructor
   */
  destruct: function() {

  },
});

