<?php
include '../ConexionDB.php';

try{
    $pdo = conectarBaseDatos();
    $sql = "SELECT * FROM prueba.venta";
    $stmt = $pdo->query($sql);

    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($res);

} catch (Exception $e) {
    echo "Error en la consulta: " . $e->getMessage();
}