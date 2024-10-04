<?php
function conectarBaseDatos() {
    $host = "localhost";
    $dbname = "reto";
    $username = "postgres";
    $password = "qwerty";

    try {
        $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        echo "Error en la conexión: " . $e->getMessage();
        exit();
    }
}