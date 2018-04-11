qx.Class.define('qxapp.components.workflowView',
  {
    extend: qx.ui.container.Composite,

    construct: function(width, height) {
      this.base(arguments);
      this.set({
        width: width,
        height: height,
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

      const useJSNetworkX = false;
      if (useJSNetworkX) {
        this._workflowLibWrapper = new qxapp.wrappers.JSNetworkX();
      } else {
        this._workflowLibWrapper = new qxapp.wrappers.jqueryFlowchart();
      }

      let scope = this;
      this._workflowLibWrapper.addListener(('workflowLibReady'), function(e) {
        let ready = e.getData();
        if (ready) {
          scope._workflowView = new qx.ui.core.Widget();
          scope.add(scope._workflowView, {flex: 1});
          const canvasId = 'workflowCanvas';
          scope._workflowView.getContentElement().setAttribute('id', canvasId);
          scope._workflowView.getContentElement().setAttribute('height', height + 'px');
          scope._workflowView.getContentElement().setAttribute('width', width + 'px');

          scope._workflowView.addListenerOnce('appear', function() {
            scope._workflowLibWrapper.CreateEmptyCanvas(canvasId);
            // scope._workflowView.getContentElement().getDomElement().appendChild(scope._networksxWrapper.GetDomElement());
          }, scope);
        } else {
          console.log('JSNetworkX.js was not loaded');
        }
      }, scope);
    },

    events: {
    },

    members: {
      _workflowLibWrapper: null,
      _workflowView: null,

      LoadDefault: function(which) {
        this._workflowLibWrapper.AddStuff(which);
      },

      StartPipeline: function() {
        this._workflowLibWrapper.StartPipeline();
      },

      StopPipeline: function() {
        this._workflowLibWrapper.StopPipeline();
      },

      UpdatePipeline: function(data) {
        this._workflowLibWrapper.UpdatePipeline(data);
      },
    },
  });
