<?php
include '../ConexionDB.php';

try {
    $pdo = conectarBaseDatos();

    $cod = $_POST['cod'];
    $name = $_POST['name'];
    $ap_pat = $_POST['ap_pat'];
    $ap_mat = $_POST['ap_mat'];
    $est = $_POST['est'];

    $sql = "UPDATE prueba.trabajador SET tra_nom = :name, tra_pat = :ap_pat, tra_mat = :ap_mat, est_ado = :est WHERE tra_cod = :cod";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':ap_pat', $ap_pat);
    $stmt->bindParam(':ap_mat', $ap_mat);
    $stmt->bindParam(':est', $est);
    $stmt->bindParam(':cod', $cod);
    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
