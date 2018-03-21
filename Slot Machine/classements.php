<?php

/*Connection a la BDD*/
class Conf {
    private static $database = array(
        'hostname' => 'webinfo.iutmontp.univ-montp2.fr',
        'database' => 'guizelinf',
        'login'    => 'guizelinf',
        'password' => '1234'
    );

    static public function getLogin() {
        return self::$database['login'];
    }

    static public function getHostname() {
        return self::$database['hostname'];
    }

    static public function getDatabase() {
        return self::$database['database'];
    }

    static public function getPassword() {
        return self::$database['password'];
    }
}


class Model {

    public static $pdo;

    public static function init_pdo() {
        $host   = Conf::getHostname();
        $dbname = Conf::getDatabase();
        $login  = Conf::getLogin();
        $pass   = Conf::getPassword();
        try {
            self::$pdo = new PDO("mysql:host=$host;dbname=$dbname", $login, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            die("Problème lors de la connexion à la base de données.");
        }
    }

    /*Obtient les 10 premières données de la BDD*/
    public static function selectLeaderboard() {
        try {
            $sql = "SELECT * FROM `sl_leaderboad` ORDER BY Score DESC LIMIT 10;"; 
            $req_prep = self::$pdo->prepare($sql);
            $req_prep->execute();
            $req_prep->setFetchMode(PDO::FETCH_OBJ);
            $tabResults = $req_prep->fetchAll();
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de la recherche dans la base de données.");
        }
    }

    /*verifie si le joueur existe déjà*/
    public static function selectPseudo($pseudo) {
        try {
            $sql = "SELECT * FROM sl_leaderboad WHERE Pseudo=:pseudo"; 
            $req_prep = self::$pdo->prepare($sql);
            $values = array("pseudo" => $pseudo);
            $req_prep->execute($values);
            $tabResults = $req_prep->fetchAll(PDO::FETCH_CLASS, get_class());
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de l'insertion dans la base de données.");
        }
    }

    /*verifie si le joueur a obtenu un meilleur score*/
    public static function select($pseudo, $score) {
        try {
            $sql = "SELECT * FROM sl_leaderboad WHERE Pseudo=:pseudo AND Score<=:score"; 
            $req_prep = self::$pdo->prepare($sql);
            $values = array("pseudo" => $pseudo, "score" => $score);
            $req_prep->execute($values);
            $tabResults = $req_prep->fetchAll(PDO::FETCH_CLASS, get_class());
            return $tabResults;
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de l'insertion dans la base de données.");
        }
    }

    /*Insertion ou Mise a jour du classements dans la BDD*/
    public static function insertLeaderboard($pseudo, $score) {
        try {
        	if (empty(Model::selectPseudo($pseudo))) {
				print_r("Insert");
	            $sql = "INSERT INTO sl_leaderboad(Pseudo, Score, Nbplayed) VALUES(:pseudo, :score, 1);";
        	} else {
        		if (!empty(Model::select($pseudo, $score))) {
        			print_r("update");
					$sql = "UPDATE sl_leaderboad SET Score=:score, Nbplayed=Nbplayed+1 WHERE Pseudo=:pseudo;"; 
        		} else {
        			print_r("update nb");
					$sql = "UPDATE sl_leaderboad SET Nbplayed=Nbplayed+1 WHERE Pseudo=:pseudo;";
					$req_prep = self::$pdo->prepare($sql);
			        $values = array("pseudo" => $pseudo);
			        $req_prep->execute($values);
        		}
        	}
	        $req_prep = self::$pdo->prepare($sql);
	        $values = array("pseudo" => $pseudo, ":score" => $score);
	        $req_prep->execute($values);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die("Erreur lors de l'insertion dans la base de données.");
        }
    }

}

Model::init_pdo();
/*Verifie si la requête demandé est une insertion ou une demande de données de la BDD*/
if(isset($_GET['pseudo'])) {
	Model::insertLeaderboard($_GET['pseudo'], $_GET['score']);
} else {
	$result = Model::selectLeaderboard();
	echo json_encode($result);
}
