<?php
include '../ConexionDB.php';

try {
    $pdo = conectarBaseDatos();

    $ventaId = (int)$_POST['ventaId'];

    $sql = "UPDATE prueba.venta_detalle SET est_ado = 1 WHERE ven_ide = :ventaId";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindParam(':ventaId', $ventaId);
    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
