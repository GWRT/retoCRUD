<?php
header('Content-Type: application/json');
include '../ConexionDB.php'; 

try {
    $pdo = conectarBaseDatos();

    $ventaId  = (int)$_POST['cod'];
    $ventaCod = $_POST['vent_ser'];
    $ventaNum = $_POST['vent_num'];
    $ventaCli = $_POST['vent_cli'];
    $ventaMon = (float)$_POST['vent_mon'];

    $sql = "UPDATE prueba.venta SET ven_ser = :ventaCod, ven_num = :ventaNum,
     ven_cli = :ventaCli, ven_mon = :ventaMon WHERE ven_ide = :ventaId";
    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':ventaCod', $ventaCod);
    $stmt->bindParam(':ventaNum', $ventaNum);
    $stmt->bindParam(':ventaCli', $ventaCli);
    $stmt->bindParam(':ventaMon', $ventaMon);
    $stmt->bindParam(':ventaId', $ventaId);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'ventaId' => $ventaId]);
        } else {
            throw new Exception('No se encontraron cambios.');
        }
    } else {
        throw new Exception('Error en la ejecución de la consulta.');
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}