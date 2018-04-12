const NO_TOOL = 0;
const TOOL_ACTIVE = 1;
const ENTITY_PICKING = 2;
const FACE_PICKING = 3;

qx.Class.define('qxapp.components.threeView',
{
  extend: qx.ui.container.Composite,

  construct: function(width, height, backgroundColor) {
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

    this._threeWrapper = new qxapp.wrappers.threeWrapper();

    let scope = this;
    this._threeWrapper.addListener(('ThreeLibReady'), function(e) {
      let ready = e.getData();
      if (ready) {
        scope._threeDViewer = new qx.ui.core.Widget();
        scope.add(scope._threeDViewer, {flex: 1});

        scope._threeDViewer.addListenerOnce('appear', function() {
          scope._threeDViewer.getContentElement().getDomElement().appendChild(scope._threeWrapper.GetDomElement());

          scope._threeWrapper.SetBackgroundColor(backgroundColor);
          // scope._threeWrapper.SetCameraPosition(18, 0, 25);
          scope._threeWrapper.SetCameraPosition(21, 21, 9); // Z up
          scope._threeWrapper.SetSize(scope.getWidth(), scope.getHeight());

          document.addEventListener( 'mousedown', scope._onMouseDown.bind(scope), false );
          document.addEventListener( 'mousemove', scope._onMouseHover.bind(scope), false );

          let that = scope;
          window.addEventListener( 'resize', function() {
            that.set({
              width: window.innerWidth,
              height: window.innerHeight,
            });
            that._threeWrapper.SetSize( window.innerWidth, window.innerHeight );
          }, that );

          scope._render();
        }, scope);
      } else {
        console.log('Three.js was not loaded');
      }
    }, scope);

    this._threeWrapper.addListener(('EntityToBeAdded'), function(e) {
      let newEntity = e.getData();
      if (newEntity) {
        scope.AddEntityToScene(newEntity);
      }
    }, scope);

    this._threeWrapper.addListener(('sceneToBeExported'), function(e) {
      scope.fireDataEvent('sceneToBeExported', e.getData());
    }, scope);
  },

  events: {
    'entitySelected': 'qx.event.type.Data',
    'entitySelectedAdd': 'qx.event.type.Data',
    'entityAdded': 'qx.event.type.Data',
    'entityRemoved': 'qx.event.type.Data',
    'entitiesToBeExported': 'qx.event.type.Data',
    'sceneToBeExported': 'qx.event.type.Data',
  },

  members: {
    _threeDViewer: null,
    _threeWrapper: null,
    _transformControls: [],
    _entities: [],
    _intersected: null,
    _selectionMode: NO_TOOL,
    _activeTool: null,

    _render: function() {
      this._threeWrapper.Render();
    },

    _updateTransformControls: function() {
      for (let i = 0; i < this._transformControls.length; i++) {
        this._transformControls[i].update();
      }
      this._render();
    },

    _onMouseHover: function( event ) {
      event.preventDefault();
      if (this._selectionMode === NO_TOOL ||
        // hacky
        event.target.nodeName != 'CANVAS') {
        return;
      }

      let posX = ( event.clientX / window.innerWidth ) * 2 - 1;
      let posY = - ( event.clientY / window.innerHeight ) * 2 + 1;

      if (this._selectionMode === TOOL_ACTIVE && this._activeTool) {
        let isShiftKeyPressed = event.shiftKey;
        if (isShiftKeyPressed) {
          return;
        }

        let intersects = this._threeWrapper.IntersectEntities(this._entities, posX, posY);
        let attended = this._activeTool.OnMouseHover(event, intersects);
        if (attended) {
          return;
        }
      }
    },

    _onMouseDown: function( event ) {
      event.preventDefault();
      if (this._selectionMode === NO_TOOL ||
        // hacky
        event.target.nodeName != 'CANVAS') {
        return;
      }

      let posX = ( event.clientX / window.innerWidth ) * 2 - 1;
      let posY = - ( event.clientY / window.innerHeight ) * 2 + 1;
      let intersects = this._threeWrapper.IntersectEntities(this._entities, posX, posY);

      if (this._selectionMode === TOOL_ACTIVE && this._activeTool) {
        let isShiftKeyPressed = event.shiftKey;
        if (isShiftKeyPressed) {
          return;
        }

        let attended = this._activeTool.OnMouseDown(event, intersects);
        if (attended) {
          return;
        }
      }

      if (intersects.length > 0) {
        if (this._selectionMode === ENTITY_PICKING) {
          let isCtrlKeyPressed = event.ctrlKey;
          if (this._intersected != null && !isCtrlKeyPressed) {
            this.UnhighlightAll();
          }
          this._intersected = intersects[0];
          if (isCtrlKeyPressed) {
            this.fireDataEvent('entitySelectedAdd', this._intersected.object.uuid);
          } else {
            this.fireDataEvent('entitySelected', this._intersected.object.uuid);
          }
          this.HighlightEntities([this._intersected.object.uuid]);
        } else if (this._selectionMode === FACE_PICKING) {
          if (this._intersected != null) {
            this._intersected.face.color.setHex(this._intersected.currentHex);
          }
          this._intersected = intersects[0];
          this.fireDataEvent('entitySelected', null);
          this._intersected.currentHex = this._intersected.face.color.getHex();
          const highlightedColor = 0x000000;
          this._intersected.face.color.setHex(highlightedColor);
        }
        this._intersected.object.geometry.__dirtyColors = true;
        this._intersected.object.geometry.colorsNeedUpdate = true;
      } else {
        if (this._intersected) {
          this.fireDataEvent('entitySelected', null);
          if (this._selectionMode === ENTITY_PICKING) {
            this.UnhighlightAll();
          } else if (this._selectionMode === FACE_PICKING) {
            this._intersected.face.color.setHex(this._intersected.currentHex);
          }
          this._intersected.object.geometry.__dirtyColors = true;
          this._intersected.object.geometry.colorsNeedUpdate = true;
        }
        // remove previous intersection object reference
        this._intersected = null;
      }

      this._render();
    },

    AddEntityToScene: function(entity) {
      this._threeWrapper.AddEntityToScene(entity);
      this._entities.push(entity);
      this.fireDataEvent('entityAdded', [entity.uuid, entity.name]);
    },

    RemoveAll: function() {
      for (let i = this._entities.length-1; i >= 0; i--) {
        this.RemoveEntity(this._entities[i]);
      }
    },

    RemoveEntity: function(entity) {
      let uuid = null;
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i] === entity) {
          uuid = this._entities[i].uuid;
          this._entities.splice(i, 1);
          break;
        }
      }

      if (uuid) {
        this._threeWrapper.RemoveEntityFromSceneById(uuid);
        this.fireDataEvent('entityRemoved', uuid);
        this._render();
      }
    },

    RemoveEntityByID: function(uuid) {
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].uuid === uuid) {
          this.RemoveEntity(this._entities[i]);
          return;
        }
      }
    },

    StartTool: function(myTool) {
      this._activeTool = myTool;
      this._activeTool.StartTool();
      this.SetSelectionMode(TOOL_ACTIVE);
    },

    StopTool: function() {
      if (this._activeTool) {
        this._activeTool.StopTool();
      }
      this._activeTool = null;
      this.SetSelectionMode(NO_TOOL);
    },

    AddInvisiblePlane: function(fixed_axe = 2, fixed_position = 0) {
      let instersectionPlane = this._threeWrapper.CreateInvisiblePlane(fixed_axe, fixed_position);
      instersectionPlane.name = 'InvisiblePlaneForSnapping';
      this._entities.push(instersectionPlane);
    },

    RemoveInvisiblePlane: function() {
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].name === 'InvisiblePlaneForSnapping') {
          this._entities.splice(i, 1);
          break;
        }
      }
    },

    StartMoveTool: function( selObjId, mode ) {
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].uuid === selObjId) {
          let transformControl = this._threeWrapper.CreateTransformControls();
          transformControl.addEventListener('change', this._updateTransformControls.bind(this));
          if (mode === 'rotate') {
            transformControl.setMode('rotate');
          } else {
            transformControl.setMode('translate');
          }
          transformControl.attach(this._entities[i]);
          this._transformControls.push(transformControl);
          this._threeWrapper.AddEntityToScene(transformControl);
        }
      }
      this._render();
    },

    StopMoveTool: function() {
      for (let i = 0; i < this._transformControls.length; i++) {
        if (this._threeWrapper.RemoveEntityFromScene(this._transformControls[i])) {
          this._transformControls[i].detach();
        }
      }
      this._transformControls = [];
      this._render();
    },

    SetSelectionMode: function( mode ) {
      if (mode === FACE_PICKING) {
        this._showEdges(true);
        this.HighlightAll();
      } else {
        this._showEdges(false);
        this.UnhighlightAll();
      }

      this._selectionMode = mode;
      this.StopMoveTool();
      this._render();
    },

    CreateEntityFromResponse: function(response, name, uuid) {
      let sphereGeometry = this._threeWrapper.FromEntityMeshToEntity(response[0]);
      // var sphereMaterial = this._threeWrapper.CreateMeshNormalMaterial();
      let color = response[0].material.diffuse;
      let sphereMaterial = this._threeWrapper.CreateNewMaterial(color.r, color.g, color.b);
      let entity = this._threeWrapper.CreateEntity(sphereGeometry, sphereMaterial);

      this._threeWrapper.ApplyTransformationMatrixToEntity(entity, response[0].transform4x4);

      entity.name = name;
      entity.uuid = uuid;
      this.AddEntityToScene(entity);
    },

    HighlightAll: function() {
      for (let i = 0; i < this._entities.length; i++) {
        this._entities[i].material.opacity = 0.9;
      }
      this._render();
    },

    UnhighlightAll: function() {
      for (let i = 0; i < this._entities.length; i++) {
        this._entities[i].material.opacity = 0.6;
      }
      this._render();
    },

    HighlightEntities: function( ids ) {
      for (let i = 0; i < this._entities.length; i++) {
        if (ids.indexOf(this._entities[i].uuid) >= 0) {
          this._entities[i].material.opacity = 0.9;
        }
      }
      this._render();
    },

    ShowHideEntity: function( id, show ) {
      for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].uuid === id) {
          this._entities[i].visible = show;
          break;
        }
      }
      this._render();
    },

    _showEdges: function( showEdges ) {
      if (showEdges) {
        for (let i = 0; i < this._entities.length; i++) {
          let wireframe = this._threeWrapper.CreateWireframeFromGeometry(this._entities[i].geometry);
          this._entities[i].add( wireframe );
        }
      } else {
        for (let i = 0; i < this._entities.length; i++) {
          let wireObj = this._entities[i].getObjectByName('wireframe');
          if (wireObj) {
            this._entities[i].remove(wireObj);
          }
        }
      }
      this._render();
    },

    ImportSceneFromBuffer: function(modelBuffer) {
      this._threeWrapper.ImportSceneFromBuffer(modelBuffer);
    },

    SerializeScene: function(downloadFile, exportSceneAsBinary) {
      this._threeWrapper.ExportScene(downloadFile, exportSceneAsBinary);
    },
  },
});
