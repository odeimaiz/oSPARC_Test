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
  },

  events: {
    'SettingsEditionDone': 'qx.event.type.Event',
  },

  members: {

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
  },
});
