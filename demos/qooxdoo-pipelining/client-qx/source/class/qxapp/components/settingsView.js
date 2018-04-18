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
      console.log(nodeMetadata.GetMetaData());

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

      let form = new qx.ui.form.Form();
      for (let i = 0; i < nodeMetadata.GetMetaData().settings.length; i++) {
        let sett = nodeMetadata.GetMetaData().settings[i];
        let input = this._fromMetadataToQxSetting(sett);
        if (input) {
          form.add(input, sett.text, null, sett.name);
        }
      }

      // form with Compute and reset button
      let computeButton = new qx.ui.form.Button('Save');
      form.addButton(computeButton);
      let resetButton = new qx.ui.form.Button('Reset');
      form.addButton(resetButton);

      let controller = new qx.data.controller.Form(null, form);
      let model = controller.createModel();

      computeButton.addListener('execute', function() {
        if (form.validate()) {
          for (let i = 0; i < nodeMetadata.GetMetaData().settings.length; i++) {
            let settKey = nodeMetadata.GetMetaData().settings[i].name;
            nodeMetadata.GetMetaData().settings[i].value = model.get(settKey);
          }
        }
      }, this);

      resetButton.addListener('execute', function() {
        form.reset();
      }, this);

      this._settingsBox.add(new qx.ui.form.renderer.Single(form));
    },

    _fromMetadataToQxSetting: function(metadata) {
      let input;
      switch (metadata.type) {
        case 'number':
          input = new qx.ui.form.Spinner();
          input.set({
            value: metadata.value,
          });
          break;
        case 'text':
          input = new qx.ui.form.TextField();
          input.set({
            value: metadata.value,
          });
          break;
        case 'select':
          input = new qx.ui.form.SelectBox();
          for (let j = 0; j < metadata.options.length; j++) {
            let optionItem = new qx.ui.form.ListItem(metadata.options[j], null, j);
            input.add(optionItem);
          }
          break;
        case 'boolean':
          input = new qx.ui.form.CheckBox();
          input.set({
            value: (metadata.value === 1),
          });
          break;
        default:
          input = null;
          break;
      }
      return input;
    },
  },
});
