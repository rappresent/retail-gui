Ext.define('Axp.controller.master.Product', {
    extend: 'Ext.app.Controller',
    views: ['master.Product'],
    init: function () {
        console.warn('INIT', this.$className)
    }
});