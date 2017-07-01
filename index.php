<?php
include('kube-v3.html');
// $to = 'info@kunstschule-bederkesa.de';
$to = 'kunstschule-kube@ewetel.net';
$to2 = 'nils@intouchdentistry.com';
$wer = $_POST['hidden_wer'];
$was = $_POST['hidden_was'];
$subject = 'Ein/e '.$wer.' möchte einen '.$was.' buchen!';
$name = $_POST['form_name'];
$kontakt = $_POST['form_kontakt'];
$kommentar = $_POST['form_kommentar'];
$buchung = $_POST['hidden_statStack'];
$termin = $_POST['hidden_termin'];

$message = <<<EMAIL

Hallo Kube! 

$kommentar

{$was}-Buchung: $buchung

$termin

Diese Nachricht ist von $name.
Kontakt: $kontakt

EMAIL;

$header = '';

if($_POST){
	mail($to, $subject, $message, $header);
	mail($to2, $subject, $message, $header);
}


?>