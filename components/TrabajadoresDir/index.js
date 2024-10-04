Ext.require(['*']);

Ext.onReady(function(){

    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'cod', mapping : 'tra_cod'},
            {name: 'name', mapping : 'tra_nom'},
            {name: 'ap_pat', mapping : 'tra_pat'},
            {name: 'ap_mat', mapping : 'tra_mat'},
            {name: 'est', mapping : 'est_ado'},
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        model  : 'DataObject',
        proxy: {
            type: 'ajax',
            url: 'Conexion/Trabajadores/Consulta.php',
            reader: {
                type: 'json',
                rootProperty: ''
            }
        },
        autoLoad: true
    });

    var columns = [
        { id : 'codigo',  header: "Codigo", sortable: true, dataIndex: 'cod'},
        {header: "nombre", width: 100, sortable: true, dataIndex: 'name'},
        {header: "Apellido Paterno", width: 100, sortable: true, dataIndex: 'ap_pat'},
        {header: "Apellido Materno", width: 100, sortable: true, dataIndex: 'ap_mat'},
        {header: "Estado", width: 50, sortable: false, dataIndex: 'est'},
        {
            xtype: 'actioncolumn',
            width: 50,
            padding: '0 0 0 20',
            items: [
                {
                    iconCls: 'small-edit-icon',
                    tooltip: 'Editar',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        //Ext.Msg.alert('Editar', rec.get('codigo'));
                        formPanel.getForm().loadRecord(rec);
                        textField5.setValue(rec.get('est'));
                    }
                },
                {
                    iconCls: 'small-trash-icon',
                    tooltip: 'Eliminar',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        Ext.Msg.confirm('Eliminar', '¿Está seguro de cambiar el estado del trabajador?', function(btn){
                            if(btn === 'yes'){
                                Ext.Ajax.request({
                                    url: 'Conexion/Trabajadores/ChangeStatus.php',
                                    method: 'POST',
                                    params: {
                                        cod: rec.get('cod')
                                    },
                                    success: function(response){
                                        var data = Ext.decode(response.responseText);
                                        if(data.success){
                                            Ext.Msg.alert('Exito', 'El estado se actualizo correctamente');
                                            gridStore.load();
                                        } else {
                                            Ext.Msg.alert('Error', 'No se pudo eliminar el trabajador: ' + data.message);
                                        }
                                    },
                                    failure: function(response){
                                        var text = response.responseText;
                                        Ext.Msg.alert('Error', text);
                                    }
                                });
                            }
                        });
                    }
                },
            ]
        }
    ];

    var grid = Ext.create('Ext.grid.Panel', {
        viewConfig: {
            plugins: {
                ddGroup: 'GridExample',
                ptype: 'gridviewdragdrop',
                enableDrop: false
            }
        },
        store: gridStore,
        columns: columns,
        enableDragDrop: true,
        stripeRows: true,
        width: 600,
        margins: '0 2 0 0',
        region: 'west',
        title: 'Lista de trabajadores',
        selModel: Ext.create('Ext.selection.RowModel', {singleSelect : true})
    });

    var textField5 = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: 'Estado',
        name: 'est',
        store: Ext.create('Ext.data.Store', {
            fields: ['text', 'value'],
            data: [
                {text: 'Activo', value: 0},
                {text: 'Inactivo', value: 1}
            ]
        }),
        queryMode: 'local',
        displayField: 'text',
        valueField: 'value',
        allowBlank: false,
        editable: false
    });

    var formPanel = Ext.create('Ext.form.Panel', {
        region     : 'center',
        title      : 'Ingresar trabajador',
        bodyStyle  : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 150,
        width      : 300,
        margins    : '0 0 0 3',
        items      : [
            { xtype: 'textfield', fieldLabel: 'Codigo', name: 'cod', allowBlank: false },
            { xtype: 'textfield', fieldLabel: 'Nombre', name: 'name', allowBlank: false },
            { xtype: 'textfield', fieldLabel: 'Apellido Paterno', name: 'ap_pat', allowBlank: false },
            { xtype: 'textfield', fieldLabel: 'Apellido Materno', name: 'ap_mat', allowBlank: false },
            textField5
        ],
        buttons:[{
            text: 'Enviar',
            handler: function(){
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    var record = form.getRecord();
                    if(record){
                        form.updateRecord(record);

                        form.submit({
                            url: 'Conexion/Trabajadores/Actualizar.php',
                            waitMsg: 'Guardando cambios...',
                            method: 'POST',
                            params: {
                                cod: record.get('cod'),
                            },
                            success: function(form, action) {
                                Ext.Msg.alert('Éxito', 'Los datos han sido actualizados correctamente.');
                                gridStore.load();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'No se pudo actualizar los datos: '+ action.response.responseText);
                            }
                        });
                    }else{
                        form.submit({
                            url: 'Conexion/Trabajadores/Insertar.php',
                            waitMsg: 'Enviando datos...',
                            method: 'POST',
                            success: function(form, action) {
                                Ext.Msg.alert('Exito', 'Los datos se han enviado correctamente.');
                                gridStore.load();
                                form.reset();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Error', 'Los datos no se han enviado correctamente: '+ action.response.responseText);
                            }
                        });
                    }
                }
            }
        }]
    });

    var displayPanel = Ext.create('Ext.Panel', {
        width    : 1000,
        height   : 300,
        layout   : 'border',
        renderTo : 'TrabajadoresContainer',
        bodyPadding: '5',
        items    : [
            grid,
            formPanel
        ],
        bbar    : [
            '->',
            {
                text    : 'Refrescar',
                handler : function() {
                    gridStore.load();
                    formPanel.getForm().reset();
                }
            }
        ]
    });

    /****
    * Setup Drop Targets
    ***/

    // This will make sure we only drop to the view container
    var formPanelDropTargetEl =  formPanel.body.dom;

    var formPanelDropTarget = Ext.create('Ext.dd.DropTarget', formPanelDropTargetEl, {
        ddGroup: 'GridExample',
        notifyEnter: function(ddSource, e, data) {

            //Add some flare to invite drop.
            formPanel.body.stopAnimation();
            formPanel.body.highlight();
        },
        notifyDrop  : function(ddSource, e, data){

            // Reference the record (single selection) for readability
            var selectedRecord = ddSource.dragData.records[0];

            // Load the record into the form
            formPanel.getForm().loadRecord(selectedRecord);

            // Delete record from the source store.  not really required.
            ddSource.view.store.remove(selectedRecord);

            return true;
        }
    });
});