<?php
include '../ConexionDB.php';

try {
    $pdo = conectarBaseDatos();

    $cod = $_POST['cod'];

    $sql = "UPDATE prueba.trabajador SET est_ado = 1 WHERE tra_cod = :cod";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindParam(':cod', $cod);
    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
