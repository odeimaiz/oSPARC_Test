/**
 * @asset(workbench/svg.*js)
 * @ignore(SVG)
 */

qx.Class.define('qxapp.wrappers.svgWrapper',
{
  extend: qx.core.Object,

  construct: function() {
  },

  properties: {
    libReady: {
      nullable: false,
      init: false,
      check: 'Boolean',
    },
  },

  events: {
    'SvgLibReady': 'qx.event.type.Data',
  },

  members: {
    Init: function() {
      // initialize the script loading
      let svgPath = 'workbench/svg.js';
      let svgPathPath = 'workbench/svg.path.js';
      let dynLoader = new qx.util.DynamicScriptLoader([
        svgPath,
        svgPathPath,
      ]);

      let scope = this;
      dynLoader.addListenerOnce('ready', function(e) {
        console.log(svgPath + ' loaded');
        scope.setLibReady(true);
        scope.fireDataEvent('SvgLibReady', true);
      }, scope);

      dynLoader.addListener('failed', function(e) {
        let data = e.getData();
        console.log('failed to load ' + data.script);
        scope.fireDataEvent('SvgLibReady', false);
      }, scope);

      dynLoader.start();
    },

    CreateEmptyCanvas: function(id) {
      return SVG(id);
    },

    _getControls(x1, y1, x2, y2) {
      const offset = 100;
      return [{x: x1+offset, y: y1}, {x: x2-offset, y: y2}, {x: x2, y: y2}];
    },

    DrawCurve: function(draw, x1, y1, x2, y2) {
      const controls = this._getControls(x1, y1, x2, y2);
      return draw.path().M(x1, y1).C(controls[0], controls[1], controls[2]).fill('none').stroke({width: 3, color: '#00F'});
    },

    UpdateCurve: function(curve, x1, y1, x2, y2) {
      if (curve.type === 'path') {
        let mSegment = curve.getSegment(0);
        mSegment.coords = [x1, y1];
        curve.replaceSegment(0, mSegment);

        const controls = this._getControls(x1, y1, x2, y2);
        let cSegment = curve.getSegment(1);
        cSegment.coords = [controls[0].x, controls[0].y, controls[1].x, controls[1].y, controls[2].x, controls[2].y];
        curve.replaceSegment(1, cSegment);
      }
    },
  },
});
