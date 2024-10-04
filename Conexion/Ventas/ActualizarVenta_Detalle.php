<?php
header('Content-Type: application/json');
include '../ConexionDB.php'; 

try {
    $pdo = conectarBaseDatos();

    $ventaId = (int)$_POST['ventaId'];

    $detalleProd = $_POST['det_pro'];
    $detalleCant = (int)$_POST['det_can'];
    $detalleUni = (float)$_POST['det_uni'];
    $detalleTotal = (float)$_POST['det_tot'];
    $estado = $_POST['det_est'];

    $sql = "UPDATE prueba.venta_detalle SET ven_ide = :ventaId, v_d_pro = :detalleProd, v_d_uni = :detalleUni, v_d_can = :detalleCant, 
            v_d_tot = :detalleTotal, est_ado = :estado WHERE ven_ide = :ventaId";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':ventaId', $ventaId);
    $stmt->bindParam(':detalleProd', $detalleProd);
    $stmt->bindParam(':detalleUni', $detalleUni);
    $stmt->bindParam(':detalleCant', $detalleCant);
    $stmt->bindParam(':detalleTotal', $detalleTotal);
    $stmt->bindParam(':estado', $estado);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('No se encontraron cambios en el detalle.');
        }
    } else {
        throw new Exception('Error en la ejecución de la consulta.');
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
