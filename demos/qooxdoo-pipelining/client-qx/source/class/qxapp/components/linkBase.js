qx.Class.define('qxapp.components.linkBase',
{
  extend: qx.core.Object,

  construct: function(representation) {
    this.base();

    this.setRepresentation(representation);
  },

  properties: {
    representation: {
      init: null,
    },
    linkId: {
      init: qxapp.utils.utils.uuidv4(),
      check: 'String',
      nullable: false,
    },
    inputId: {
      init: null,
      check: 'String',
    },
    outputId: {
      init: null,
      check: 'String',
    },
  },
});
