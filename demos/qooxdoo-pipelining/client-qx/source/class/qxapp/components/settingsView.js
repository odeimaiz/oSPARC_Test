qx.Class.define('qxapp.components.settingsView',
{
  extend: qx.ui.container.Composite,

  construct: function() {
    this.base();

    let box = new qx.ui.layout.VBox(10, null, 'separator-vertical');
    box.set({
      alignX: 'center',
    });

    this.set({
      layout: box,
      padding: 10,
      backgroundColor: '#eee',
    });

    this._InitTitle();
    this._InitSettings();
  },

  events: {
    'SettingsEditionDone': 'qx.event.type.Event',
  },

  members: {
    _settingsBox: null,

    _InitTitle: function() {
      let box = new qx.ui.layout.HBox();
      box.set({
        spacing: 10,
        alignX: 'right',
      });
      let titleBox = new qx.ui.container.Composite(box);
      let settLabel = new qx.ui.basic.Label('Settings');
      settLabel.set({
        alignX: 'center',
        alignY: 'middle',
      });
      let doneBtn = new qx.ui.form.Button('Done');

      titleBox.add(settLabel, {width: '75%'});
      titleBox.add(doneBtn);
      this.add(titleBox);

      let scope = this;
      doneBtn.addListener('execute', function() {
        scope.fireEvent('SettingsEditionDone');
      }, scope);
    },

    _InitSettings: function() {
      this._settingsBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      this.add(this._settingsBox);
    },

    SetNodeMetadata: function(nodeMetadata) {
      this._settingsBox.removeAll();
      let changeTitleBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
      {
        let titleLabel = new qx.ui.basic.Label('Node Title');
        titleLabel.set({
          alignX: 'right',
          alignY: 'middle',
        });
        let titleInput = new qx.ui.form.TextField(nodeMetadata.GetMetaData().name);
        changeTitleBox.add(titleLabel, {width: '50%'});
        changeTitleBox.add(titleInput, {width: '50%'});
      }
      this._settingsBox.add(changeTitleBox);
    },
  },
});
