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

    CreateEmptyCanvas: function(id, left, top, width, height) {
      return SVG(id).size('100%', '100%').viewbox(left, top, width, height);
    },

    DrawCurve(draw, x1, y1, x2, y2) {
      const offset = 100;
      return draw.path().M(x1, y1).C({x: x1+offset, y: y1}, {x: x2-offset, y: y2}, {x: x2, y: y2}).fill('none').stroke({width: 3, color: '#00F'});
    },

    UpdateCurve(draw, curve, x1, y1, x2, y2) {
      const offset = 100;
      return draw.path().M(x1, y1).C({x: x1+offset, y: y1}, {x: x2-offset, y: y2}, {x: x2, y: y2}).fill('none').stroke({width: 3, color: '#00F'});
    },
  },
});
