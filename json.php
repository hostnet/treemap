<?php
//require_once "phar:///usr/bin/dead.phar/loader.php";
//require_once "phar:///usr/bin/dead.phar/task/JsonTask.php";
require_once '/home/ontw/dead/toolset/loader.php';
require_once '/home/ontw/dead/toolset/task/JsonTask.php';

$task = new JsonTask($_GET['path']);
$task->run();
