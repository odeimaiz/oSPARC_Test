qx.Class.define('qxapp.components.linkBase',
{
  extend: qx.core.Object,

  construct: function(representation) {
    this.base();

    this.setLinkId(qxapp.utils.utils.uuidv4());

    this.setRepresentation(representation);
  },

  properties: {
    representation: {
      init: null,
    },
    linkId: {
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
