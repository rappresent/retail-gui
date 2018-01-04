Ext.define('Axp.controller.Module', {
    extend: 'Ext.app.Controller',
    views: ['Module'],
    refs: [
        {ref: 'modules', selector: 'moduleView'},
        {ref: 'contents', selector: 'contentView'},
    ],
    events: {
        'moduleView': {
            cellclick: 'onClickModule'
        }
    },
    loadModule: function () {
        let {data} = this.application.backend;
        let modules = Object.assign({}, data.modules);
        let buildStore = function (grid) {
            let me = this;
            let models = {};
            let {backend} = me.application;
            let store = grid.getStore();
            let url = backend.origin + '/api/' + me.modelBackend;
            let proxy = {
                type: 'ajax',
                headers: {
                    'Accept': 'application/json',
                    'X-Token': localStorage[backend.storageKey]
                },
                url,
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'PUT',
                    destroy: 'DELETE'
                },
                startParam: 'offset',
                noCache: false,
                writer: {
                    type: 'json',
                    encode: true
                },
                reader: {
                    type: 'json',
                    root: 'data'
                }
            };

            grid.up().treePanel.record.raw.tables.forEach(function (table) {
                let {reader, writer} = backend.models[table];
                models[table] = {reader, writer}
            });
            store.model.setFields(models[me.modelBackend].reader);
            store.setProxy(proxy);

            return store;
        };

        data.menus = {
            text: 'Module',
            rootVisible: false,
            expanded: true,
            children: []
        };
        //
        for (let m in modules) {
            let node = modules[m];
            let hasChildren = Object.keys(modules).filter(function (n) {
                if (modules[n].parent === node.id) return 1;
                return 0
            });
            node.text = node.name;
            node.expanded = true;
            if (node.class) {
                let list = node.class.split('.');
                let cls = list[list.length - 1];
                cls = cls[0].toUpperCase() + cls.substr(1);
                list[list.length - 1] = cls;
                node.class = 'Axp.controller.' + list.join('.');
                this.application.addController(node.class, {
                    options: {buildStore}
                });
            }
            if (!node.parent || (node.parent && hasChildren.length)) {
                node.leaf = false;
            } else {
                node.leaf = true;
            }
        }
        for (let m in modules) {
            let node = modules[m];
            if (node.parent) {
                let parent = modules[node.parent];
                parent.children = modules[node.parent].children || [];
                parent.children.push(node);
                parent.children.sort(function (a, b) {
                    return a.seq - b.seq
                })
            } else {
                node.leaf = false;
            }
        }
        for (let m in modules) {
            if (modules[m].parent) {
                delete modules[m];
            } else {
                data.menus.children.push(modules[m])
            }
        }
        return data.menus;
    },
    onClickModule: function (treepanel, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        let me = this;
        let tabPanel = me.getContents();
        if (record.raw.class) {
            let viewClass = record.raw.class.replace('Axp.controller', 'Axp.view');
            let exist = tabPanel.items.items.filter(function (e) {
                return e.$className === viewClass
            })[0];
            if (exist) {
                tabPanel.setActiveTab(exist);
            } else {
                exist = Ext.create(viewClass, {
                    title: record.raw.text,
                    layout: 'fit',
                    closable: true,
                    border: true,
                    treePanel: {el: treepanel, record}
                });
                tabPanel.add(exist);
            }
            tabPanel.setActiveTab(exist);
        }
    },
    init: function () {
        let me = this;
        let modules = me.loadModule();

        for (let query in me.events) {
            let events = me.events[query];
            for (let e in events) {
                let handler = me[events[e]];
                if (handler) events[e] = handler;
                else delete events[e]
            }
        }

        me.getModules().setRootNode(modules);
        me.control(me.events);
    }
});