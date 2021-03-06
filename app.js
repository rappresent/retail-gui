Ext.require([
    'Ext.window.MessageBox',
    'Ext.tip.*'
]);
Ext.onReady(function () {
    let ajax = function (config = {}) {
        let request = $.ajax(Object.assign(config, {async: false}));
        let {status, statusText} = request;
        let response = request.responseJSON || request.responseText;
        return {response, status, statusText}
    };
    let baseReq = ajax({url: 'config.json'}),
        base = baseReq.response;

    let backendReq = ajax({url: base.url}),
        backend = backendReq.response;

    if (!backend) {
        Ext.Msg.show({
            title: 'Error',
            msg: backendReq.statusText,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR
        });
    } else {
        let {protocol, ip, port, name} = backend;
        ip = ip || 'localhost';
        backend.origin = `${protocol + ip}:${port}`;
        $('title').text(backend.name);

        Ext.override(Ext, {
            selector: function (string) {
                return Ext.ComponentQuery.query(string)
            }
        });
        Ext.app.Application.prototype.addController = function (classPath, opts) {
            let self = this, config = opts || {};

            Ext.require(classPath, function () {
                let applier = Ext.apply({
                    application: self
                }, config.options || {});
                let controller = Ext.create(classPath, applier);

                self.controllers.add(classPath, controller);

                controller.init();

                if (config.callback) {
                    config.callback.call((config.scope || this), config, controller)
                }
            });
        };
        Ext.application({
            name: 'A',
            appFolder: 'app',
            controllers: ['Core'],
            version: base.version,
            moneyStep: base.moneyStep,
            currency: base.currency,
            title: name,
            enableQuickTips: true,
            backend, ajax,
            autoCreateViewport: true,
            datetime: backend.time,
            intSeparator: ',0',
            floatSeparator: ',0.00',
            formatMoney: function (value, format) {
                return Ext.util.Format.number(value, format || this.intSeparator);
            }
        });
        //
        setInterval(function () {
            let nDateTime = new Date(new Date(A.app.datetime).getTime() + 1000);
            A.app.datetime = nDateTime;
            A.app.date = Ext.Date.format(nDateTime, 'Y-m-d');
            A.app.time = Ext.Date.format(nDateTime, 'H:i:s');
        }, 1000)
    }
});