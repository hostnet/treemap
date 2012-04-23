<?php
$dir = dirname(__DIR__);
require_once "phar://$dir/dead.phar/loader.php";
require_once "phar://$dir/dead.phar/task/JsonTask.php";

$task = new JsonTask($_GET['path']);
$task->run();
