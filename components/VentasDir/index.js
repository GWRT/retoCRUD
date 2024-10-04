Ext.require(['*']);

Ext.onReady(function(){

    Ext.define('DataObject', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'vent_ser', mapping : 'ven_ide'},
            {name: 'vent_cod', mapping : 'ven_ser'},
            {name: 'vent_num', mapping : 'ven_num'},
            {name: 'vent_cli', mapping : 'ven_cli'},
            {name: 'vent_mon', mapping : 'ven_mon'},
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        model  : 'DataObject',
        proxy: {
            type: 'ajax',
            url: 'Conexion/Ventas/ConsultaVenta.php',
            reader: {
                type: 'json',
                rootProperty: ''
            }
        },
        autoLoad: true
    });

    var columns = [
        { id : 'codigo',  header: "Codigo", sortable: true, dataIndex: 'vent_ser'},
        {header: "Ser. venta", width: 100, sortable: true, dataIndex: 'vent_cod'},
        {header: "Num. venta", width: 100, sortable: true, dataIndex: 'vent_num'},
        {header: "Cliente", width: 100, sortable: true, dataIndex: 'vent_cli'},
        {header: "Monto", width: 50, sortable: false, dataIndex: 'vent_mon'},
        {
            xtype: 'actioncolumn',
            width: 50,
            padding: '0 0 0 20',
            items: [ 
                {
                    iconCls: 'small-trash-icon',
                    tooltip: 'Eliminar',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        Ext.Msg.confirm('Confirmar', '¿Estás seguro de que deseas cambiar el estado de esta venta?', function(btn) {
                            if (btn === 'yes') {
                                Ext.Ajax.request({
                                    url: 'Conexion/Ventas/ChangeStatus.php',
                                    method: 'POST',
                                    params: {
                                        ventaId: rec.get('vent_ser'), 
                                    },
                                    success: function(response) {
                                        var result = Ext.decode(response.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert('Éxito', 'Estado cambiado con éxito.');
                                            grid.getStore().load();
                                            showDetalleVenta(rec);
                                        } else {
                                            Ext.Msg.alert('Error', 'No se pudo cambiar el estado: ' + result.message);
                                        }
                                    },
                                    failure: function() {
                                        Ext.Msg.alert('Error', 'Error en la comunicación con el servidor.');
                                    }
                                });
                            }
                        });
                    }
                }
            ]
        }
    ];

    var grid = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: columns,
        enableDragDrop: true,
        stripeRows: true,
        width: 600,
        height: 500,
        flex: 1,
        margins: '0 2 0 0',
        region: 'west',
        title: 'Lista de ventas',
        selModel: {
            selType: 'rowmodel'
        },
        listeners: {
            select: function(rowModel, record, index, eOpts) {
                //console.log("Fila seleccionada", record.data);
                showDetalleVenta(record);
            }
        }
    });

    grid.getSelectionModel().on('selectionchange', function(selModel, selections) {
        updateButton.setDisabled(selections.length === 0);
    });

    var formPanel = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar venta',
        bodyStyle  : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        width      : 350,
        margins    : '0 0 0 3',
        items: [
            {xtype: 'textfield', fieldLabel: 'Serie de venta', name: 'vent_ser', allowBlank: false},
            {xtype: 'textfield', fieldLabel: 'Numero de venta', name: 'vent_num', allowBlank: false},
            {xtype: 'textfield', fieldLabel: 'Cliente', name: 'vent_cli', allowBlank: false},
            {xtype: 'numberfield', fieldLabel: 'Monto', name: 'vent_mon', allowBlank: false}
        ]
    });

    var detalleFormPanel = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Detalles de Venta',
        bodyStyle  : 'padding: 10px; background-color: #DFE8F6',
        labelWidth : 100,
        width      : 350,
        margins    : '0 0 0 3',
        items: [
            {xtype: 'textfield', fieldLabel: 'Producto', name: 'det_pro', allowBlank: false},
            {xtype: 'numberfield', fieldLabel: 'Cantidad', name: 'det_can', allowBlank: false},
            {xtype: 'numberfield', fieldLabel: 'Precio Unitario', name: 'det_uni', allowBlank: false},
            {xtype: 'numberfield', fieldLabel: 'Total', name: 'det_tot', allowBlank: true},
            {xtype: 'numberfield', fieldLabel: 'Estado', name: 'det_est', allowBlank: false}
        ]
    });

    var saveButton = Ext.create('Ext.button.Button', {
        text: 'Guardar Nueva Venta y Detalles',
        handler: function() {
            var ventaForm = formPanel.getForm();
            var detalleForm = detalleFormPanel.getForm();
            saveButton.setDisabled(false);
            updateButton.setDisabled(true);
    
            if (ventaForm.isValid() && detalleForm.isValid()) {
                ventaForm.submit({
                    url: 'Conexion/Ventas/InsertarVenta.php',
                    method: 'POST',
                    success: function(form, action) {
                        Ext.Msg.alert('Exito', 'Venta guardada con éxito');
                        
                        var ventaId = action.result.ventaId;
    
                        detalleForm.submit({
                            url: 'Conexion/Ventas/InsertarVenta_Detalle.php',
                            method: 'POST',
                            params: { ventaId: ventaId },
                            success: function(form, action) {
                                Ext.Msg.alert('Exito', 'Detalle guardado con éxito');
                                gridStore.load();
                                ventaForm.reset();
                                detalleForm.reset();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Fallo', 'No se pudo guardar el detalle: ' + action.response.responseText);
                            }
                        });
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Fallo', 'No se pudo guardar la venta: ' + action.response.responseText);
                    }
                });
            } else {
                Ext.Msg.alert('Advertencia', 'Por favor, completa todos los campos requeridos.');
            }
        }
    });

    var updateButton = Ext.create('Ext.button.Button', {
        text: 'Actualizar Venta y Detalles',
        disabled: true,
        handler: function() {
            var ventaForm = formPanel.getForm();
            var detalleForm = detalleFormPanel.getForm();
            var selectedRecord = grid.getSelectionModel().getSelection()[0];
            console.log("Selected ROW: ",selectedRecord)
    
            if (!selectedRecord) {
                Ext.Msg.alert('Advertencia', 'Por favor, selecciona un registro para actualizar.');
                return;
            }
    
            if (ventaForm.isValid() && detalleForm.isValid()) {
                ventaForm.updateRecord(selectedRecord);
    
                ventaForm.submit({
                    url: 'Conexion/Ventas/ActualizarVenta.php',
                    method: 'POST',
                    params: {
                        cod: selectedRecord.get('vent_ser'),
                        vent_ser: selectedRecord.get('vent_ser'),
                        vent_num: selectedRecord.get('vent_num'),
                        vent_cli: selectedRecord.get('vent_cli'),
                        vent_mon: selectedRecord.get('vent_mon')
                    },
                    success: function(form, action) {
                        var ventaId = action.result.ventaId;

                        detalleForm.submit({
                            url: 'Conexion/Ventas/ActualizarVenta_Detalle.php',
                            method: 'POST',
                            params: { 
                                ventaId: ventaId,
                                det_pro: detalleForm.findField('det_pro').getValue(),
                                det_can: detalleForm.findField('det_can').getValue(),
                                det_uni: detalleForm.findField('det_uni').getValue(),
                                det_tot: detalleForm.findField('det_tot').getValue(),
                                det_est: detalleForm.findField('det_est').getValue()
                             },
                            success: function(form, action) {
                                Ext.Msg.alert('Exito', 'Registro actualizado');
                                gridStore.load();
                                ventaForm.reset();
                                detalleForm.reset();
                            },
                            failure: function(form, action) {
                                Ext.Msg.alert('Fallo', 'No se pudo actualizar el detalle: ' + action.response.responseText);
                            }
                        });
                    },
                    failure: function(form, action) {
                        Ext.Msg.alert('Fallo', 'No se pudo actualizar la venta: ' + action.response.responseText);
                    }
                });
            } else {
                Ext.Msg.alert('Advertencia', 'Por favor, completa todos los campos requeridos.');
            }
        }
    });

    var PanelDetalleVenta = Ext.create('Ext.Panel', {
        title: 'Detalles de la Venta',
        region: 'center',
        bodyPadding: 10,
        html: '<h2>Detalles de la venta seleccionada aparecerán aquí.</h2>',
        hidden: true,
        buttons: [
            {
                text: 'Editar',
                handler: function() {
                    var selectedRecord = grid.getSelectionModel().getSelection()[0];
                    if (selectedRecord) {
                        showDetalleVenta(selectedRecord);
                        updateSaleData(selectedRecord);

                        saveButton.setDisabled(true);
                        updateButton.setDisabled(false);
                    } else {
                        Ext.Msg.alert('Advertencia', 'Por favor, selecciona un registro para editar.');
                    }
                }
            }
        ]
    });

    function showDetalleVenta(record) {
        Ext.Ajax.request({
            url: 'Conexion/Ventas/ConsultaVenta_Detalle.php',
            method: 'GET',
            params: {
                id: record.data.vent_ser
            },
            success: function(response) {
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    PanelDetalleVenta.update({
                        html: '<h1>VENTA</h1>' +
                              '<p><strong>Cliente:</strong> ' + result.venta.ven_cli + '</p>' +
                              '<p><strong>Serie:</strong> ' + result.venta.ven_ser + '</p>' +
                              '<p><strong>Número:</strong> ' + result.venta.ven_num + '</p>' +
                              '<p><strong>Monto:</strong> ' + result.venta.ven_mon + '</p>' +
                              '<h1>DETALLES</h1>' +
                              '<p>Producto: ' + result.detalle.v_d_pro + '</p>' +
                              '<p>Cantidad: ' + result.detalle.v_d_can + '</p>' +
                              '<p>Precio Unitario: ' + result.detalle.v_d_uni + '</p>' +
                              '<p>Total: ' + result.detalle.v_d_tot + '</p>' +
                              '<p>Estado: ' + result.detalle.est_ado + '</p>'
                    });
    
                    formsContainer.hide();
                    PanelDetalleVenta.show();
                } else {
                    Ext.Msg.alert('Error', 'No se encontraron detalles para esta venta.');
                }
            },
            failure: function() {
                Ext.Msg.alert('Error', 'No se pudo obtener los detalles de la venta.');
            }
        });
    }

    function updateSaleData(record) {
        var ventaForm = formPanel.getForm();
        ventaForm.loadRecord(record); 

        Ext.Ajax.request({
            url: 'Conexion/Ventas/ConsultaVenta_Detalle.php',
            method: 'GET',
            params: {
                id: record.data.vent_ser
            },
            success: function(response) {
                var result = Ext.decode(response.responseText);
                console.log(result);
                if (result.success) {
                    var detalleForm = detalleFormPanel.getForm();
                    detalleForm.reset();
                    detalleForm.setValues({
                        det_pro: result.detalle.v_d_pro,
                        det_can: result.detalle.v_d_can,
                        det_uni: result.detalle.v_d_uni,
                        det_tot: result.detalle.v_d_tot,
                        det_est: result.detalle.est_ado
                    });
                    formsContainer.show();
                    PanelDetalleVenta.hide();
                } else {
                    Ext.Msg.alert('Error', 'No se encontraron detalles para esta venta.');
                }
            },
            failure: function() {
                Ext.Msg.alert('Error', 'No se pudo obtener los detalles de la venta.');
            }
        });
    }

    var addNewVentaButton = Ext.create('Ext.button.Button', {
        text: 'Añadir Nueva Venta',
        handler: function() {
            console.log("Boton presionado")
            formPanel.getForm().reset();
            detalleFormPanel.getForm().reset();
            PanelDetalleVenta.hide();
            formsContainer.show();
        }
    });

    var formsContainer = Ext.create('Ext.Panel', {
        layout: 'vbox',
        width: 400,
        region: 'east',
        items: [formPanel, detalleFormPanel],
        buttons: [updateButton, saveButton],
        hidden: true
    });

    var gridPanelContainer = Ext.create('Ext.Panel', {
        region: 'west',
        layout: 'vbox',
        width: 550,
        items: [addNewVentaButton, grid]
    });

    var displayPanel = Ext.create('Ext.Panel', {
        layout: 'border',
        width: 1000,
        height: 500,
        renderTo: 'VentasContainer',
        bodyPadding: '5',
        items: [
            gridPanelContainer, 
            formsContainer,
            PanelDetalleVenta
        ],
        bbar: [
            '->',
            {
                text    : 'Refrescar',
                handler : function() {
                    //refresh source grid
                    gridStore.load();
                    formPanel.getForm().reset();
                }
            }
        ]
    });
    //formsContainer.show();
    //PanelDetalleVenta.hide();
});
