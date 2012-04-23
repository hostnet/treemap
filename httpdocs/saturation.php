<?php
header("Content-Type: image/svg+xml");
//require_once("phar:///usr/bin/dead.phar/loader.php");
//require_once("phar:///usr/bin/dead.phar/task/SaturationGraphTask.php");
require_once '/home/ontw/dead/toolset/loader.php';
require_once '/home/ontw/dead/toolset/task/SaturationGraphTask.php';

if(isset($_GET['path'])) {
  $path = $_GET['path'];
} else {
  $path = null;
}

if(isset($_GET['tables'])) {
  $tables = explode(PATH_SEPARATOR, $_GET['tables']);
} else {
  $tables = null;
}

$scale = $tables !== null ;

$task = new SaturationGraphTask($tables,1000,500,$path,$scale);
$task->run();
