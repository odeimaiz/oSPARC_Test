qx.Class.define("app.modeler.splineCreator", {
  extend: qx.core.Object,

  construct : function(threeViewer)
  {
    this._threeViewer = threeViewer;
  },

  events : {
  },

  members : {
    _threeViewer: null,
    _pointList: [],
    _spline: null,

    OnMouseDown : function(event, intersects)
    {
      if (intersects.length > 0)
      {
        var intersect = intersects[0];
        this._pointList.push([intersect.point.x, intersect.point.y, intersect.point.z]);

        if (this._pointList.length>1) {
          this._threeViewer.RemoveEntity(this._spline);
          this._spline = this._threeViewer._threeWrapper.CreateSpline(this._pointList);
          this._spline.name = "Spline";
          this._threeViewer.AddEntityToScene(this._spline);
        }
      }

      return true;
    },
  },
});
