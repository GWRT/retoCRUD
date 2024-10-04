<?php
include '../ConexionDB.php';

try {
    $pdo = conectarBaseDatos();
    $ventaId = $_GET['id'];

    $queryVenta = "SELECT * FROM prueba.venta WHERE ven_ide = :ventaId";
    $stmt = $pdo->prepare($queryVenta);
    $stmt->bindParam(':ventaId', $ventaId);
    $stmt->execute();
    $venta = $stmt->fetch(PDO::FETCH_ASSOC);

    $queryDetalle = "SELECT * FROM prueba.venta_detalle WHERE ven_ide = :ventaId";
    $stmt = $pdo->prepare($queryDetalle);
    $stmt->bindParam(':ventaId', $ventaId);
    $stmt->execute();
    $detalle = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'venta' => $venta, 'detalle' => $detalle]);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
