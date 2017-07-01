// TEMPLATES 



    //

    // Komplett:
    var templateKurse = '<div class="scrollbar_versteck"><div class="erg_liste"><p class="wird_geladen insert_streifen_kurse"><span></span></p></div></div><div class="rechteseite kurspreview_info mit_weissem_hg table"></div>'
    //## kursestory ist rechte Seite
    var templateTermine = '<div class="scrollbar_versteck"><div class="erg_liste"><p class="wird_geladen insert_streifen_termine"><span></span></p></div></div><div class="rechteseite termine_info mit_weissem_hg table"></div>'
    //## terminestory ...
    var templateSchulstationen = '<div class="scrollbar_versteck"><div class="erg_liste"><p class="wird_geladen insert_streifen_stationen"><span></span></p></div></div><div class="rechteseite selektorapp_info"></div>'
    //## selektorappstory ...

    // Rechte Seite:
    // muss an obige ##s appended werden 
    

    var preview = function () {
        var boxes = ""
        for (var i = 0; i < arguments.length; i++) {
            boxes += arguments[i];
        } 
        return '<div class="preview_area hoverinfo cell">'+
                    '<div class="preview_titel"></div>'+
                    '<div class="preview_boxes">' + boxes + '</div>'+
               '</div>'
    }

    var themaBox = '<div class="info_blocks thema_box"></div>'
    var leitungBox = '<div class="info_blocks leitung_box"></div>'
    var wochentagBox = '<div class="info_blocks wochentag_box"></div>'
    var altersBox = '<div class="info_blocks alters_box"></div>'
    var vonbisBox = '<div class="info_blocks von_bis_box"></div>'
    var zeitBox = '<div class="info_blocks zeit_box"></div>'
    var kategorieBox = '<div class="info_blocks kategorie_box">Hier können Schulklassen und Lehrer zweistündige Kreativaktionen mit 3 Stationen buchen</div>'

    // append to "kurspreview_info":
    var templateKursPreview = preview(themaBox,leitungBox,wochentagBox,altersBox)

    // append to "kurspreview_info":                              
    var templateWorkshopPreview = preview(themaBox,leitungBox,vonbisBox,altersBox)          

    // append to "kurspreview_info":
    var templateEventPreview = preview(themaBox,altersBox,vonbisBox)   

    // 
    var templateKategoriePreview = preview(kategorieBox)
                              


    // append to "kurspreview_info":
    var templateKurseInfo = '<div class="preview_area klickinfo_kurse cell">' +
                                '<div class="preview_titel_info">für Infos und Buchung anklicken</div>' +
                            '</div>'

    // ALTERNATIV bei Schulklassen-Switch - muss bei switch ausgewechselt werden (.empty().append)
    var templateSchulkurseInfo = '<div class="preview_area klickinfo_schulen cell">' +
                                    '<div class="preview_titel preview_titel_info">Für Lehrer / Schulklassen</div>' +
                                    '<div class="info_reminder"><p>anklicken um den Besuch mit einer Schulklasse zu planen</p></div>' +
                             '</div>'                              
    // append to "termine_info":
    var templateTerminInfo = '<div class="preview_area klickinfo_termine cell">' +
                                        '<div class="preview_titel preview_titel_info">Terminwahl:</div>' +
                                        '<div class="info_reminder"><p>Zuerst auf der linken Seite einen Termin für den Besuch auswählen...</p></div>' +
                                    '</div>'                              
      

    // used in EKA
    var templateMehrInfosEKA = '<div id="mehrinfos_container">'+
                                '<h3 id="mehrinfos_title"></h3>'+
                                '<div class="table mehrinfos_text_container">'+
                                    '<div class="cell">'+
                                        '<p id="mehrinfos_text"></p>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="mehrinfos_imgs_container">'+
                                    '<div id="mehr_bilder"></div>'+
                                '</div>'+
                            '</div>'

    // used in EKA
    var kursbuchungForm = '<form action="index.php" method="POST" id="schulformular">' +
                                '<h3>Super - fast fertig!</h3>'+
                                '<ul>' +
                                    '<li>' +
                                        '<label for "lehrer_name">Name:</label>' +
                                        '<input type="text" name="form_name" id="form_name" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for "form_kontakt">Kontakt:</label>' +
                                        '<input type="text" name="form_kontakt" id="form_kontakt" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for "form_kommentar">Kommentar:</label>' +
                                        '<textarea name="form_kommentar" id="form_kommentar" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_statStack" id="hidden_statStack" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_termin" id="hidden_termin" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_wer" id="hidden_wer" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_was" id="hidden_was" />' +
                                    '</li>' +
                                '</ul>' +
                                '<p class="resumee">Es wurden <span id="form_statStack"></span> für <span id="form_termin"></span> ausgewählt.</p>' +
                                '<input type="submit" value="jetzt anfragen" id="submit" />' +
                                '<p id="form_feedback"></p>' +
                              '</form>'                           

    var templateSelektorApp = '<div class="eventerklaerung_box table">' +
                                '<div class="infobox_schulapp cell">' +
                                    '<div class="drei_thumbs">' +
                                        '<div class="einzel_thumb erster_thumb"></div>' +
                                        '<div class="einzel_thumb mittlerer_thumb"></div>' +
                                        '<div class="einzel_thumb letzter_thumb"></div>' +
                                    '</div>' +
                                    '<div class="buchung_button_schulen center">links 3 Stationen wählen dann hier klicken</div>' +
                                     preview(themaBox,zeitBox) +
                                '</div>' + 
                              '</div>' +
                              kursbuchungForm

    // nächste Seite
    var templateEKA =   '<div class="resultate">'+
                            '<div class="einzelkursbox">'+
                            '</div>'+
                        '</div>' +
                        '<div class="buchung_formular">'+
                            kursbuchungForm+
                        '</div>'+
                        templateMehrInfosEKA+
                        '<button class="zumachen">schliessen</button>'
                            
                        
                        

    /*      

    NOCH NICHT REALISIERT

    // Eingabemaske der Event-DB
    var templateKursEingabe = '<form action="?" method="post" id="kurseingabe">' +
                                '<h3>Neuem Event / Kurs / Workshop eingeben:</h3>'+
                                '<ul>' +
                                    '<li>' +
                                        '<label for "event_name">Eventname:</label>' +
                                        '<input type="text" name="event_name" id="event_name" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for "event_kategorie">Kategorie:</label>' +
                                        '<input type="text" name="lehrer_fon" id="lehrer_fon" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<label for "lehrer_kommentar">Kommentar:</label>' +
                                        '<textarea name="lehrer_kommentar" id="lehrer_kommentar" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_statStack" id="hidden_statStack" />' +
                                    '</li>' +
                                    '<li>' +
                                        '<input type="hidden" name="hidden_termin" id="hidden_termin" />' +
                                    '</li>' +
                                '</ul>' +
                                '<p class="resumee">Es wurden <span id="form_statStack"></span> für <span id="form_termin"></span> ausgewählt.</p>' +
                                '<input type="submit" value="jetzt anfragen" id="submit" />' +
                                '<p id="form_feedback"></p>' +
                              '</form>'
    */                              