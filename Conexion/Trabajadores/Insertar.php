<?php
include '../ConexionDB.php';

try {
    $pdo = conectarBaseDatos();

    $cod = $_POST['cod'];
    $name = $_POST['name'];
    $ap_pat = $_POST['ap_pat'];
    $ap_mat = $_POST['ap_mat'];
    $est = $_POST['est'];

    $sql = "INSERT INTO prueba.trabajador (tra_cod, tra_nom, tra_pat, tra_mat, est_ado) 
            VALUES (:cod, :name, :ap_pat, :ap_mat, :est)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':cod', $cod);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':ap_pat', $ap_pat);
    $stmt->bindParam(':ap_mat', $ap_mat);
    $stmt->bindParam(':est', $est);
    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
