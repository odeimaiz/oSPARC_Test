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
    _socket: null,
    _layoutManager: null,

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main: function() {
      // Call super class
      this.base();

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

      this._layoutManager = new qxapp.layout.layoutManager();
      doc.add(this._layoutManager);
    },
  },
});