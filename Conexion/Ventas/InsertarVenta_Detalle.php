<?php
include '../ConexionDB.php';

try{
    $pdo = conectarBaseDatos();
    
    $vent_id = $_POST['ventaId'];
    $det_prod = $_POST['det_pro'];
    $det_can = (float) $_POST['det_can'];
    $det_uni = (float) $_POST['det_uni'];
    $det_tot = (float) $_POST['det_tot'];
    $det_est = $_POST['det_est'];

    $sql = "INSERT INTO prueba.venta_detalle (ven_ide, v_d_pro, v_d_uni, v_d_can, v_d_tot, est_ado) 
        VALUES (:vent_id, :det_prod, :det_uni, :det_can, :det_tot, :det_est)";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':vent_id', $vent_id);
    $stmt->bindParam(':det_prod', $det_prod);
    $stmt->bindParam(':det_uni', $det_uni);
    $stmt->bindParam(':det_can', $det_can);
    $stmt->bindParam(':det_tot', $det_tot);
    $stmt->bindParam(':det_est', $det_est);

    $stmt->execute();

    echo json_encode(['success' => true]);
}
catch(Exception $e){
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}