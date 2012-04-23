<?php
require_once "phar://__DIR__/dead.phar/loader.php";
require_once "phar://__DIR__/dead.phar/task/JsonTask.php";

$task = new JsonTask($_GET['path']);
$task->run();
