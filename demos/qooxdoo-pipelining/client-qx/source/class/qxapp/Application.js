/* ************************************************************************

   Copyright: 2018 undefined

   License: MIT license

   Authors: undefined

************************************************************************ */

/**
 * This is the main application class of "app"
 *
 * @asset(qxapp/*)
 */
qx.Class.define('qxapp.Application',
{
  extend: qx.application.Standalone,

  include: [qx.locale.MTranslation],

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members:
  {
    _threeView: null,
    _entityList: null,

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main: function() {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get('qx.debug')) {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      qx.locale.Manager.getInstance().setLocale( 'en' );
      qx.locale.Manager.getInstance().addListener('changeLocale', function(e) {
        qx.locale.Manager.getInstance().setLocale( e.getData() );
      }, this);

      // Document is the application root
      let doc = this.getRoot();

      // openning web socket
      this._socket = new qxapp.wrappers.webSocket('app');
      this._socket.connect();

      let body = document.body;
      let html = document.documentElement;

      this._workbench = new qxapp.components.workbench();
      doc.add(this._workbench);


      let docWidth = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
      let docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
      this._threeView = new qxapp.components.threeView(docWidth, docHeight, '#3F3F3F');
  
      // components to document
      doc.add(this._threeView);
    },
  },
});
