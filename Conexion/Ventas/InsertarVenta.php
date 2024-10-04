<?php
include '../ConexionDB.php';

try{

    $pdo = conectarBaseDatos();
    
    $v_ser = $_POST['vent_ser'];
    $v_num = $_POST['vent_num'];
    $v_cli = $_POST['vent_cli'];
    $v_mon = $_POST['vent_mon'];

    $queryVenta = "INSERT INTO prueba.venta (ven_ser, ven_num, ven_cli, ven_mon) 
                VALUES (:ven_ser, :ven_num, :ven_cli, :ven_mon) RETURNING ven_ide";
    
    $stmt = $pdo->prepare($queryVenta);
    $stmt->bindParam(':ven_ser', $v_ser);
    $stmt->bindParam(':ven_num', $v_num);
    $stmt->bindParam(':ven_cli', $v_cli);
    $stmt->bindParam(':ven_mon', $v_mon);
    $stmt->execute();

    $ventaId = $stmt->fetchColumn();

    echo json_encode(['success' => true, 'ventaId' => $ventaId]);

}
catch(Exception $e){
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}