(function () {
    let store = Ext.create('A.store.Status');

    return Ext.define('A.view.master.Status', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.masterStatus',
        items: [
            {
                store,
                xtype: 'grid',
                loadMask: true,
                selModel: {
                    selType: 'checkboxmodel', //'Ext.selection.CheckboxModel'
                    checkOnly: true,
                    mode: 'MULTI'
                },
                columns: [
                    //new Ext.grid.RowNumberer(),
                    {text: 'ID', dataIndex: 'id', minWidth: 50, autoSizeColumn: true},
                    {
                        text: 'Name',
                        dataIndex: 'name',
                        autoSizeColumn: true,
                        minWidth: 100,
                        editor: {xtype: 'textfield'}
                    },
                    {
                        text: 'Notes',
                        dataIndex: 'notes',
                        flex: 1,
                        editor: {xtype: 'textfield'}
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        align: 'center',
                        todo: 'edit',
                        items: [
                            {
                                xtype: 'button',
                                icon: 'img/icons/essential/png/edit.png',
                                iconCls: 'icon-bg',
                                tooltip: 'Edit',
                            }
                        ]
                    },
                    {
                        xtype: 'actioncolumn',
                        width: 30,
                        align: 'center',
                        todo: 'delete',
                        items: [
                            {
                                xtype: 'button',
                                icon: 'img/icons/essential/png/trash.png',
                                iconCls: 'icon-bg',
                                tooltip: 'Delete'
                            }
                        ]
                    }
                ],
                plugins: [
                    {
                        ptype: 'cellediting', //'Ext.grid.plugin.CellEditing'
                        clicksToEdit: 1
                    }
                ],
                viewConfig: {
                    trackOver: false,
                    stripeRows: true,
                },
                dockedItems: [
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        displayInfo: true,
                        displayMsg: 'Displaying data {0} - {1} of {2}',
                        emptyMsg: 'No data to display',
                        inputItemWidth: 50
                    },
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [
                            {
                                xtype: 'button',
                                icon: 'img/icons/essential/png/add-1.png',
                                iconCls: 'icon-bg',
                                text: 'New',
                                todo: 'add',
                                tooltip: 'Add new',
                            },
                            '->',
                            {
                                xtype: 'button',
                                icon: 'img/icons/essential/png/trash.png',
                                iconCls: 'icon-bg',
                                text: 'Delete',
                                todo: 'delete',
                                tooltip: 'Delete selection',
                            },
                            {
                                xtype: 'button',
                                icon: 'img/icons/essential/png/save.png',
                                iconCls: 'icon-bg',
                                text: 'Save',
                                todo: 'save',
                                tooltip: 'Save selection',
                            }
                        ]
                    }
                ]
            }
        ]
    })
})();
