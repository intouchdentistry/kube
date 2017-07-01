// BAUSTELLEN

// turn this shit into functional 

// make single file to reduce loading time


// DIE RGB MASCHINE
var farbOutput = function(farbinput,deckkraft) {
    return ("rgba(" + farbinput + "," + deckkraft + ")")
}
    
// kann ständig aufgerufen werden um rgba zusammenzusetzen. zB. so: farbOutput(farbInput,0.4); oder farbOutput("30,200,150",deckkraft);
// INITIALE SETTINGS

var gruen = "0, 137, 50"  // kurssuche, Kurse #0E8B2F
var orange = "231, 103, 29" // kontakt, Workshops #EB6B0D
var lila = "223, 0, 114" // einblicke, Events #E30575
var gelb = "212, 215, 3" // team, Schulklassen #D4D703
var weiss = "255,255,255"
var fastweiss = "245,245,245"
var schwarz = "0,0,0"
var fastschwarz ="50,50,50"

var voll = 1 
var hauch = 0.5    
var mittel = 0.6
var stark = 0.725
var achtacht = 0.88    

var aktuelleFarbe = gruen

// nur von AnkuendigSlider verwendet:
var vierfarben = [gruen,orange,gelb,lila]






$(document).ready(function(){

    jsonLoad(Modus)

    var sizeZurueckKnopf = "50px"

    var filtermodus = "default"
    var ausgewaehlteKategorie = "" // durch buttons
    var KategorisierteEvents = [] // durch EventsZuKategorie
    var aktiverEvent = ""
    var hozpos = 1
    var schulklassenSwitch = false
    var nurDrei = 0
    var schulTermin = ""
    var statStack = []
    var statStackJoined = []
    var removeThumb = 0

    

    // resets

    // selector buttons color reset for hover
        
    var weissReset = function(){
        $("#knopp4").css("background", farbOutput(fastweiss,mittel))
        $("#knopp3").css("background", farbOutput(weiss,mittel))
        $("#knopp2").css("background", farbOutput(weiss,mittel))
        $("#knopp1").css("background", farbOutput(fastweiss,mittel))
        $('#knoppAlle').css("background", farbOutput("226,226,226", voll))
        $('.knopp').find('.quote').css({"color": farbOutput(schwarz,voll),"text-shadow": "none"})
    }


    // back resets


    // Zurück zum Topic Selector
    //
    // Zurueckpfeil Eins, oder Menü: Kurse fährt alles zurück
    // 1. remove course stripes from result list
    // 2. reset arrow color to white
    // 4. reset category buttons to white etc
    // 5. reset current color to green

    var resetZurueck = function(){
        //1
        $('.erg_liste').children("a").remove()
        //2
        $('.zurueckknopf').css("border-right", + sizeZurueckKnopf + " solid " + farbOutput(weiss,voll))
        $('#kleinbild_zurueckknopf').css("border-right", "80px solid " + farbOutput(weiss,voll))
        //4
        weissReset()
        //5
        aktuelleFarbe = gruen
    }

    var schattenWeg = function(derhier){
         // create a deferred object
        var s = $.Deferred()

        setTimeout(function () {
        // and call `resolve` on the deferred object, once you're done
            $(derhier).removeClass('schattenrand')
        }, 300)
        s.resolve()
        return s
    }
    var schattenHer = function(derhier){
         // create a deferred object
        var r = $.Deferred()

        setTimeout(function () {
        // and call `resolve` on the deferred object, once you're done
            $(derhier).addClass('schattenrand')
        }, 300)
        r.resolve()
        return r
    }

    // HIER: EVENTTYPEN!
    var kategorieZuFarbe = function(kat){
        switch(kat){
            case "Kurse":
            return "gruen"
            break
            case "Workshops":
            return "orange"
            break
            case "Ferienkurse":
            return "orange"
            break
            case "Events":
            return "lila"
            break
            case "Kategorie":
            return "gelb"
            break
            case "Schultermine":
            return "gelb"
            break
            case "Schulstationen":
            return "gelb"
            break
        }
    }

    var kategorieZuHex = function(kat){
        switch(kat){
            case "Kurse":
            return gruen
            break
            case "Workshops":
            return orange
            break
            case "Ferienkurse":
            return orange
            break
            case "Events":
            return lila
            break
            case "Schulklassen":
            return gelb
            break
            case "Kategorie":
            return gelb
            break
            case "Schultermine":
            return gelb
            break
            case "Schulstationen":
            return gelb
            break
            case "Alle":
            return schwarz
            break
        }
    }             


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //          KURS-FILTER         \\
    //                              \\
    //______________________________\\   


    // sortiert Eventsliste nach ausgewählter Kategorie
    // spuckt aus: Array KategorisierteEvents

    var EventsNachKategorie = function(){
        // wird auf Knoppdruck ausgeführt
        KategorisierteEvents = []
        //geht durch Events und pusht
        $(Events).each(function(){        
            if (
                ausgewaehlteKategorie === "Alle"       
                || (
                    this.Kategorie === ausgewaehlteKategorie
                    || (ausgewaehlteKategorie === "Workshops" 
                        && (this.Kategorie === "Ferienkurse")
                    )
                )
            )
            {
                KategorisierteEvents.push(this)
            }
        })
    }

    // Funktionstemplate: Loop - erstellt die Liste
    var erzeugeStreifen = function(woHerNehmen, woRein){
        //woRein : "Termine", "Kurse" oder "Stationen"
        $('.insert_streifen').stop( true, true ).fadeIn(10)
        $('.insert_streifen').find('span').html('Suche...')
        $('.insert_streifen').css({" position": "initial", "top": "auto", "display": "inline"})
        var hit = 0
        $('.hg_blende').remove() 
        for (i in woHerNehmen){
            $('<div class="hg_blende '+woHerNehmen[i].Bild+'" style="background: url(../IMG/'+woHerNehmen[i].Bild+'.jpg); background-size: cover; background-repeat: no-repeat"></div>').insertBefore('#Kapitel_Kurse')  
            $('<a id="Event'+woHerNehmen[i].EventID+'" name="' + i + '" class="listen_streifen ' + woHerNehmen[i].Kategorie + ' ' + kategorieZuFarbe(woHerNehmen[i].Kategorie) + '" >' + woHerNehmen[i].Eventname + '</a>').hide().delay(150*i).insertBefore('.insert_streifen_' + woRein).fadeIn(500)
            $('.insert_streifen').fadeOut(2750)
            hit++                    
        }
        if(hit === 0){
            $('.insert_streifen').find('span').html('nichts gefunden')
            $('.insert_streifen').css({"position": "absolute", "top": "160px"})
        }

    }

    // Erstellt die richtige Kursliste

    var kursListe = function(){
        erzeugeStreifen(KategorisierteEvents, "kurse")
    }  

    var terminListe = function(){
        erzeugeStreifen(Schultermine, "termine")         
    }
           
    var schulKursListe = function(){
        erzeugeStreifen(Schulevents, "stationen")
    }


    var eventUeberschrift = function(){
        if (ausgewaehlteKategorie === "Kurse"){
            $('#eventueberschrift').text('Alle ' + Modus + 'en Kurse')
        }
        if (ausgewaehlteKategorie === "Workshops"){
            $('#eventueberschrift').text('Alle ' + Modus + 'en Workshops')
        }
        if (ausgewaehlteKategorie === "Events"){
            $('#eventueberschrift').text('Alle ' + Modus + 'en Events')
        }
        else if (ausgewaehlteKategorie === "Schulklassen"){
            $('#eventueberschrift').text('Für Schulklassen')
        }
        if (ausgewaehlteKategorie === "Alle"){
            $('#eventueberschrift').text('Das komplette Programm')
        }

    }


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //          BUILD IT!           \\
    //                              \\
    //______________________________\\  

    // strukturtemplate selector


    var strukturTemplate = function(){
        if (filtermodus === "default") {    
            // normale kursliste ab Seite 2
            if (ausgewaehlteKategorie === "Schulklassen"){
                $('.behaelter_zwei').empty().append(templateTermine) 
                $('.termine_info').empty().append(templateTerminInfo)
                $('.behaelter_drei').empty().append(templateSchulstationen)
                $('.selektorapp_info').empty().append(templateSelektorApp)
                terminListe()  
                schulKursListe()                 
            } else {
                $('.behaelter_zwei').empty().append(templateKurse)
                $('.kurspreview_info').append(templateKurseInfo)
                
                $('.behaelter_drei').empty().append(templateEKA)
                kursListe(EventsNachKategorie())
            }
        }                
        else {
        // modus == "schulen-switch"; schultermine ab Seite 3
        // HIER KÖNNEN WIR WEITERE TEMPLATES EINFÜGEN
            $('.behaelter_drei').empty().append(templateTermine)
            $('.termine_info').empty().append(templateTerminInfo)
            $('.behaelter_vier').empty().append(templateSchulstationen)
            $('.selektorapp_info').empty().append(templateSelektorApp)
            terminListe()
            schulKursListe()
        }
    }


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //           MOVE IT!           \\
    //                              \\
    //______________________________\\   

    // Eine allgemeine Button-Funktion die den 2550er Slider hin und herschiebt, und die Layoutfunktion macht.

    var slideR = function(hoz){
        
        var newHozpos
        newHozpos = (100 * hoz - 100)
        $('.behaelter_2550').css('left', '-' + newHozpos + '%')
        // update hoz position:
        hozpos = hoz
    }


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //    SCHULEVENT SELEKTOR AP    \\
    //                              \\
    //______________________________\\  

    var fillThumbs = function(stationstreifen){

            // $('.erster_thumb').css({"background": "url(../IMG/"+aktiverSchulEvent.Bild+".jpg)", "background-size": "cover", "background-repeat": "no-repeat"})
            removeThumb = 0
            statStackJoined = []

            if ($(stationstreifen).hasClass('selektiert')){
                nurDrei--
                // remove from stack
                removeThumb = statStack.indexOf(aktiverSchulEvent)
                
                statStack.splice(removeThumb, 1)

                $(stationstreifen).toggleClass('selektiert')
            }
            else {
                if (nurDrei < 3) {
                    $(stationstreifen).toggleClass('selektiert')
                    nurDrei++
                    // add to stack
                    statStack.push(aktiverSchulEvent)  
                    statStack.forEach(function(element) {
                        statStackJoined.push(element.Eventname)
                    })            
                }
            }


            for (var i = 0; i < statStack.length; i++) {  
                $( ".drei_thumbs > .einzel_thumb:nth-child(" + (i+1) + ")" ).css({"background": "url(../IMG/" + statStack[i].Bild + ".jpg)", "background-size": "cover", "background-repeat": "no-repeat", "border": "1px solid #d4d500"})  
            }
            if (nurDrei === 3){
                $('.infobox_schulapp').hide(1000)     
                $('#form_statStack').text(statStackJoined.join(', '))
                $('#form_termin').text(schulTermin) 
                // hier werden values in die versteckten Forminputs "injiziert":
                $('#hidden_statStack').val(statStackJoined.join(', '))
                $('#hidden_termin').val('Termin: ' + schulTermin)
                $('#hidden_wer').val("Kunstlehrer/in")
                $('#hidden_was').val("Schul-Event")
                $('#schulformular').css({'opacity': '1','pointer-events':'all','background': farbOutput(gelb,voll)})
            }
            else if (nurDrei == 2) {
                $('.letzter_thumb').css({"background": "none", "border": "1px dashed #d4d500"})
                $('.infobox_schulapp').show(300)
                $('.buchung_button_schulen').text('noch 1 Station!')
                $('#schulformular').css({'opacity': '0'})
            }
            else if (nurDrei == 1) {
                $('.mittlerer_thumb').css({"background": "none", "border": "1px dashed #d4d500"})
                $('.buchung_button_schulen').text('noch 2 Stationen!')
            }
            else if (nurDrei == 0) {
                $('.erster_thumb').css({"background": "none", "border": "1px dashed #d4d500"})
                $('.buchung_button_schulen').text('noch 3 Stationen!')
                // dynamic DOM access for the thumbs-background none!      
            }
                      
        }


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //          KLICK IT!           \\
    //                              \\
    //______________________________\\ 

    $('.nav').on('click', function(){
        schattenHer($('.schatten'))
        $('.zurueckknopf').fadeOut(200)
        $('.schattencontainer').css("overflow","visible")
        aktiverEvent = ""
        resetZurueck()
        slideR(1)
        aktuelleFarbe = gruen
        $('#Kapitel_Kurse').css("background",farbOutput(aktuelleFarbe,hauch))
        $('.behaelter_zwei').empty()
        $('.behaelter_drei').empty()
        $('.behaelter_vier').empty()
        $('#eventueberschrift').text('Das komplette Programm')
        // IMMER GANZ AN DEN START ZURÜCK! ALLE TEMPLATES, KATEGORIEN WECH.
    })

    $('.knopp').on('click', function(){
        
        filtermodus = "default"

        if($(this).is("#knopp1")){
            ausgewaehlteKategorie = "Kurse"
            eventUeberschrift()
        }             
        if($(this).is("#knopp2")){
            ausgewaehlteKategorie = "Workshops"
            eventUeberschrift() 
        }
        if($(this).is("#knopp3")){
            ausgewaehlteKategorie = "Events"
            eventUeberschrift()
        }
        if($(this).is("#knopp4")){
            ausgewaehlteKategorie = "Schulklassen"
            eventUeberschrift()
        }
        if($(this).is("#knoppAlle")){
            ausgewaehlteKategorie = "Alle"
            eventUeberschrift()
        }
        
        aktuelleFarbe = kategorieZuHex(ausgewaehlteKategorie)

        $('#Kapitel_Kurse').css("background","none")  
        $('.behaelter_zwei').empty()
        $('.behaelter_drei').empty()
        $('.behaelter_vier').empty()
        
        // entfernt Schatten-Umrandung von Start-Knöppen
        schattenWeg($('.schatten'))
        $('.schattencontainer').css("overflow","hidden")
        
        slideR(hozpos + 1)
        strukturTemplate()
        
        $('.zurueckknopf').css({"border-right-color": farbOutput(aktuelleFarbe, voll)})
        $('.zurueckknopf').fadeIn(1000)
        
    })

    // zurueckknopf
    $('body').on('click', '.zurueckknopf', function(){   
        $('#hidden_statStack').val("")
        $('#form_statStack').text("")
        if (hozpos === 2) {
            $('.zurueckknopf').fadeOut(200)  
            $('.hg_blende').css({"opacity": "0"})
            $('#Kapitel_Kurse').css("background",farbOutput(gruen,hauch))
            $('#eventueberschrift').text('Das komplette Programm')
        }
        if (filtermodus === "schulen-switch"){

            if (hozpos === 3){
                ausgewaehlteKategorie = "Alle"
                eventUeberschrift()
                filtermodus = "default"
                $('.listen_streifen').fadeIn(10)
                $('.behaelter_drei').empty()
                $('.behaelter_vier').empty()
            } 
            if (hozpos === 4){
                $('.selektiert').removeClass('selektiert')
                $('.einzel_thumb').css({"background": "none"})
                $('#schulformular').css({'opacity': '0','pointer-events':'none'})
                $('#mehrinfos_container').css({'opacity': '0','pointer-events':'none'})            
                $('#form_termin').text("")
                $('#hidden_termin').val("")
                nurDrei = 0
                statStack = []
            }

        }
        if (ausgewaehlteKategorie === "Alle") {
            $('.zurueckknopf').css({"border-right": sizeZurueckKnopf + " solid " + farbOutput(schwarz, voll)})
        }
        
        if (hozpos === 3){
            $('#Kapitel_Kurse').css("background","none")  
            eventUeberschrift()
        }
        slideR(hozpos - 1)     
    })

    // listen_streifen
    $('body').on('click', '.listen_streifen', function(){
        if(!($(this).hasClass('Schulstationen'))){
            // ALLGEMEIN - SLIDE IF NOT SCHULSTATION:
            slideR(hozpos + 1)
        }

        if($(this).text() === 'Schulklassen'){
            filtermodus = "Schulklassen" 
            ausgewaehlteKategorie = "Schulklassen"
            eventUeberschrift()
            strukturTemplate()
        } 

        if($(this).hasClass('Schultermine')){
            $('.selektorapp_info').css("opacity","1")
            schulTermin = $(this).text()
        }
        else if ($(this).hasClass('Schulstationen')){
            // SCHUL-MODUL SELEKTOR-APP
            fillThumbs(this)
        }

        else {
            if ( ($(this).hasClass('Kurse')) || ($(this).hasClass('Workshops')) || ($(this).hasClass('Events')) || ($(this).hasClass('Ferienkurse')) )
             {
                $('#Kapitel_Kurse').css({"background": "url(../IMG/" + aktiverEvent.Bild + ".jpg)", "background-size": "cover", "background-repeat": "no-repeat"})
                $('.behaelter_drei').empty().append(templateEKA)
                kursAktivieren($(this), zumKurs())
                
                var myTimer = window.setTimeout(function() {
                    $('.animate_fadein2').addClass('translate2')
                    $('.animate_fadein').addClass('translate1')
                    if($('.animate_fadein3')){
                        $('.animate_fadein3').addClass('translate3')
                    }
                }, 1100)
            }
        }

        if (ausgewaehlteKategorie == "Alle"){
            if ($(this).hasClass('gruen')){
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf + " solid " + farbOutput(gruen, voll)})
            }
            else if ($(this).hasClass('orange')){
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf + " solid " + farbOutput(orange, voll)})
            }
            else if ($(this).hasClass('lila')){
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf + " solid " + farbOutput(lila, voll)})
            }
            else if ($(this).hasClass('gelb')){
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf + " solid " + farbOutput(gelb, voll)})
            }
        
        }
    })   

    var extraBilderText = function(derEvent){
        
        var extraButton = ""
        var buttonHTML = ""
        var extraHTML = ""
        
        if (derEvent.Bilderserie != ""){
            extraButton = "Galerie"
            $('.mehrinfos_imgs_container').css({"height":"100%"})
            $('.mehrinfos_text_container').hide(1)
        }
        if (derEvent.Extra.length >= 64){
            if (extraButton === "Galerie"){
                extraButton = "Mehr Infos und Galerie"
                $('.mehrinfos_imgs_container').css({"height":"50%"})
                $('.mehrinfos_text_container').css({"height":"50%"})
            } else {
                extraButton = "Mehr Infos"
                $('.mehrinfos_imgs_container').hide(1)
                $('.mehrinfos_text_container').css({"height":"100%"}) 
            } 
        }
        $('#mehrinfos_title').text(extraButton)
        var bgWhite = 'style="background:white"'
        
        // hat Bilder(serie):
        if (extraButton !== "") { 
            buttonHTML = '<button class="kursbuchung mehrinfos_button" style="background:'+selectedColor(achtacht)+'">'+extraButton+'</button>'
        }
        
        // Hat Extra Info < 64 Zeichen kurz.
        if ((derEvent.Extra.length < 64) && (derEvent.Extra.length !== 0)){
            extraHTML = '<div class="extrainfo_box appendix_box animate_fadein3" '+bgWhite+'><div class="EXTRA_INFO_LINE center"><p>'+derEvent.Extra+'</p></div></div>' 
        }   
        return extraHTML+buttonHTML    
    } 

    




    // per Knoppdruck zur Extra-info-Seite

    var bilderSerie = function(event){
        var nureinbild = ""
        if (event.Bilderserie.length === 1) {
            nureinbild = " nurein_bild"
        } else if (event.Bilderserie.length === 2) {
            nureinbild = " nurzwei_bilder"
        }
        var htmlBilder = '<div class="bild_box'+nureinbild+'"><img class="extra_bild erstes_bild" id="bilderserie_0" src="IMG/'+event.Bilderserie[0]+'.jpg"/></div>'
        var hoch = ""
        for (var i = 1; i<event.Bilderserie.length; i++){
            if (i%2 === 0) {
                hoch = "" 
            }else{hoch = " hochgestelltes_bild"}
            htmlBilder += '<div class="bild_box'+nureinbild+'"><img class="extra_bild weitere_bilder'+hoch+'" id="bilderserie_'+i+'" style="left:'+i*50+'%" src="IMG/'+event.Bilderserie[i]+'.jpg"/></div>'
        }    
        return htmlBilder
    }

    $('body').on('click', '.mehrinfos_button', function(){
        $('#mehrinfos_container').css({'opacity': '1','pointer-events':'all','background':selectedColor(voll)}) 

        if(aktiverEvent.Extra.length >= 64) {
            var extrahtml = $.parseHTML( aktiverEvent.Extra )
            $('#mehrinfos_text').append(extrahtml)
        }
        $('#mehr_bilder').empty().append(bilderSerie(aktiverEvent))
        $('.zumachen').css({'opacity': '1','pointer-events':'all','background':selectedColor(voll)})
        $('.zurueckknopf').hide(200)
    })



    $('body').on('click', '.kursbuchung_button', function(){
        $('#schulformular').css({'pointer-events':'all','opacity':'1','background':selectedColor(voll)})
        $('.resumee').css({'opacity':'0','pointer-events':'none'})
        $('.zumachen').css({'opacity':'1','pointer-events':'all','background':selectedColor(voll)})
        $('#hidden_statStack').val(aktiverEvent.Eventname)
        $('#hidden_was').val(aktiverEvent.Kategorie).slice(0, -1)
        $('#hidden_wer').val("Interessent/in")
        $('#hidden_termin').val("")
        // $('#form_statStack').text()
    })


    $('body').on('click', '.zumachen', function(){
        $('#schulformular').css({'opacity': '0','pointer-events':'none'})
        $('#mehrinfos_container').css({'opacity': '0','pointer-events':'none'})
        $(this).css({'opacity': '0','pointer-events':'none'})
        $('.resumee').css({'opacity':'1','pointer-events':'all'})
        $('.zurueckknopf').show(200)
    })





    var selectedColor = function(transparenz){
        if (aktuelleFarbe === schwarz){
            var individuelleFarbe   
            if      (aktiverEvent.Kategorie === "Kurse") individuelleFarbe = gruen
            else if ((aktiverEvent.Kategorie === "Workshops") || (aktiverEvent.Kategorie === "Ferienkurse") || (aktiverEvent.Kategorie === "KURSARTXXXX")) individuelleFarbe = orange
            else if ((aktiverEvent.Kategorie === "Events") || (aktiverEvent.Kategorie === "KURSARTYYYY")) individuelleFarbe = lila
            else if ((aktiverEvent.Kategorie === "Schultermine") || (aktiverEvent.Kategorie === "Schulstationen")) individuelleFarbe = gelb            
            
            return farbOutput(individuelleFarbe,transparenz)
        }
        else{
            return farbOutput(aktuelleFarbe,transparenz)
        }
    }


    var leereBoxenWeg = function(){
        $('.preview_boxes').children('.info_blocks').each(function(){
            if ($(this).text() === "") $(this).remove()
        })
    }


    //''''''''''''''''''''''''''''''\\
    //                              \\
    //          HOVER IT!           \\
    //                              \\
    //______________________________\\ 

    $('body').on('mouseover', '.kursbuchung_button', function(){
        $(this).css({'color': selectedColor(voll)})
    })
    $('body').on('mouseout', '.kursbuchung_button', function(){
        $(this).css({'color': 'white'})
    })
    $('body').on('mouseover', '.mehrinfos_button', function(){
        $(this).css({'color': selectedColor(voll)})
    })  
    $('body').on('mouseout', '.mehrinfos_button', function(){
        $(this).css({'color': 'white'})
    })
    $('body').on('mouseover', '.zumachen', function(){
        $(this).css({'background':'white','color': selectedColor(voll)})
    })  
    $('body').on('mouseout', '.zumachen', function(){
        $(this).css({'background':selectedColor(voll),'color': 'white'})
    })

    $('.knopp').on('mouseover', function(){

        var bgColor = function(target, bgcolor){
            target.css("background", farbOutput(bgcolor,voll)) 
        }

        if (hozpos == 1){
        // (prevents hover effects right after click)
            
            $(this).find('.quote').css({"color": farbOutput(weiss,voll), "text-shadow": "1px 1px 12px black"}) 
            if($(this).is("#knoppAlle")){
                $(".knopp").find('.quote').css("color", farbOutput(weiss,voll))
                bgColor($("#Kapitel_Kurse"), schwarz)
                $(this).css("background", farbOutput(schwarz,stark))                 
                bgColor($("#knopp3"), lila)
                bgColor($("#knopp2"), orange)
                bgColor($("#knopp1"), gruen) 
                bgColor($("#knopp4"), gelb)
            }   
            if($(this).is("#knopp1")){
                $('#Kapitel_Kurse').css("background",farbOutput(gruen,stark))
                bgColor($(this), gruen)      
            }
            if($(this).is("#knopp2")){
                $('#Kapitel_Kurse').css("background",farbOutput(orange,stark))
                bgColor($(this), orange)
            }
            if($(this).is("#knopp3")){
                $('#Kapitel_Kurse').css("background",farbOutput(lila,stark))
                bgColor($(this), lila)
            }
            if($(this).is("#knopp4")){
                $('#Kapitel_Kurse').css("background",farbOutput(gelb,stark))
                bgColor($(this), gelb)
            }
        }
    })
        
    $('.knopp').on('mouseout', function(){
        if (hozpos == 1){
        // (prevents hover effects right after click)
            
            // main bg hover reset
            $('#Kapitel_Kurse').css("background",farbOutput(gruen,hauch))       
            $(this).find('.quote').css({"color": farbOutput(schwarz,voll), "text-shadow": "none"})
            // all-hover on center button reset
            if ($(this).is("#knoppAlle")){
                weissReset()
                $(this).css("background","#E2E2E2")
            }
            // ordinary reset (unhover)
            if ($(this).is(".knopp")) weissReset()
            
        }
    })



    $('body').on('mouseover', '.listen_streifen', function(){
        kursAktivieren($(this))
            
            if ( ($(this).hasClass('Schultermine')) || ($(this).hasClass('Schulstationen')) || ($(this).text() === 'Schulklassen') ) {
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf+" solid "+farbOutput(gelb,voll)})
            }
            else if ( ($(this).hasClass('Ferienkurse')) || ($(this).text() === 'Ferienkurse')) {
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf+" solid "+farbOutput(orange,voll)})
            }
            else {
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf+" solid "+selectedColor(voll)})
            }
    })
    $('body').on('mouseout', '.listen_streifen', function(){
        if(ausgewaehlteKategorie === "Alle"){
            if (hozpos === 2) {
                $('.zurueckknopf').css({"border-right": sizeZurueckKnopf+" solid "+farbOutput(schwarz, voll)})
            }
        }
    })

    // KURS PREVIEW

    $('body').on('mouseover', 'a.Kurse', function(){
        // preview_name = BeschrKurz
        $('.kurspreview_info').find('.hoverinfo').remove()
        $('.kurspreview_info').append(templateKursPreview)
        
        $('.kurspreview_info').find('.preview_titel').text(aktiverEvent.BeschrKurz)
        $('.kurspreview_info').find('.thema_box').text(aktiverEvent.Thematik)
        $('.kurspreview_info').find('.alters_box').text("für "+aktiverEvent.Altersgruppe)
        $('.kurspreview_info').find('.leitung_box').text("Leitung: "+aktiverEvent.Kursleiter)
        var timebox
        
        // BAUSTELLE: Könnte auch als Property im Event Obj abgelegt werden:
        if(typeof aktiverEvent.TermineDeutsch === ('string')){
            timebox = aktiverEvent.TermineDeutsch
            $('.kurspreview_info').find('.wochentag_box').text(timebox)
        }else{
            timebox = "jeden "+Wochentage[(aktiverEvent.TermineDeutsch[0][0])-1]
            $('.kurspreview_info').find('.wochentag_box').text(timebox)
        } 
        // funktion muss her falls mehr als ein Wochentag
        
        $('.kurspreview_info').find('.hoverinfo').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.klickinfo_kurse').css({"display": "none"})
        
        // beide folgenden sind der HG. .hg_blende ist allgemein, also alle,
        // .aktiverEvent.Bild ist die spezielle class dessen, der ge-fadeIn() werden soll. 
        $('.hg_blende').css({"opacity": "0"})
        if (  aktiverEvent.Bild !== ""  ) {
            $('.'+aktiverEvent.Bild).css({"opacity": "1"})    
        }
        // use aktiverKurs to fill fields          
    })
    $('body').on('mouseout', 'a.Kurse', function(){
        $('.hoverinfo').css({"display": "none"})
        $('.klickinfo_kurse').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.hg_blende').css({"opacity": "0"})
    })


    // WORKSHOPS PREVIEW

    $('body').on('mouseover', 'a.Workshops', function(){
        $('.kurspreview_info').find('.hoverinfo').remove()
        $('.kurspreview_info').append(templateWorkshopPreview)
        // preview_name = BeschrKurz
        
        // sollte erst der Name werden:
        $('.kurspreview_info').find('.preview_titel').text(aktiverEvent.BeschrKurz)
        $('.kurspreview_info').find('.thema_box').text(aktiverEvent.Thematik)
        $('.kurspreview_info').find('.alters_box').text("für "+aktiverEvent.Altersgruppe)
        $('.kurspreview_info').find('.leitung_box').text("Leitung: "+aktiverEvent.Kursleiter)
        $('.kurspreview_info').find('.von_bis_box').text(aktiverEvent.VomBis())
        // funktion muss her falls mehr als ein Wochentag
        
        $('.kurspreview_info').find('.hoverinfo').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.klickinfo_kurse').css({"display": "none"})
        // beide folgenden sind der HG. .hg_blende ist allgemein, also alle,
        // .aktiverEvent.Bild ist die spezielle class dessen, der ge-fadeIn() werden soll. 
        $('.hg_blende').css({"opacity": "0"}) 
        if (  aktiverEvent.Bild !== ""  ) {
            $('.'+aktiverEvent.Bild).css({"opacity": "1"})    
        }
        // use aktiverKurs to fill fields           
    })
    $('body').on('mouseout', 'a.Workshops', function(){
        $('.hoverinfo').css({"display": "none"}) 
        $('.klickinfo_kurse').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.hg_blende').css({"opacity": "0"})       
        
    })

    // FERIENKURSE PREVIEW

    $('body').on('mouseover', 'a.Ferienkurse', function(){
        $('.kurspreview_info').find('.hoverinfo').remove()
        $('.kurspreview_info').append(templateWorkshopPreview)
        // preview_name = BeschrKurz
        // sollte erst der Name werden:
        $('.kurspreview_info').find('.preview_titel').text(aktiverEvent.BeschrKurz)
        $('.kurspreview_info').find('.thema_box').text(aktiverEvent.Thematik)
        $('.kurspreview_info').find('.alters_box').text("für "+aktiverEvent.Altersgruppe)
        $('.kurspreview_info').find('.leitung_box').text("Leitung: "+aktiverEvent.Kursleiter)
        $('.kurspreview_info').find('.von_bis_box').text(aktiverEvent.VomBis())
        // funktion muss her falls mehr als ein Wochentag
        
        $('.kurspreview_info').find('.hoverinfo').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.klickinfo_kurse').css({"display": "none"})
        // beide folgenden sind der HG. .hg_blende ist allgemein, also alle,
        // .aktiverEvent.Bild ist die spezielle class dessen, der ge-fadeIn() werden soll. 
        $('.hg_blende').css({"opacity": "0"}) 
        if (  aktiverEvent.Bild !== ""  ) {
            $('.'+aktiverEvent.Bild).css({"opacity": "1"})    
        }       
        // use aktiverKurs to fill fields           
    })
    $('body').on('mouseout', 'a.Ferienkurse', function(){
        $('.hoverinfo').css({"display": "none"}) 
        $('.klickinfo_kurse').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.hg_blende').css({"opacity": "0"})       
        
    })

    // EVENTS PREVIEW

    $('body').on('mouseover', 'a.Events', function(){
        $('.kurspreview_info').find('.hoverinfo').remove()
        $('.kurspreview_info').append(templateWorkshopPreview)
        // preview_name = BeschrKurz
        // sollte erst der Name werden:
        $('.kurspreview_info').find('.preview_titel').text(aktiverEvent.BeschrKurz)
        $('.kurspreview_info').find('.thema_box').text(aktiverEvent.Thematik)
        $('.kurspreview_info').find('.von_bis_box').text(aktiverEvent.VomBis())
        // funktion muss her falls mehr als ein Wochentag

        if (aktiverEvent.Altersgruppe != "") {
           $('.kurspreview_info').find('.alters_box').text("für "+aktiverEvent.Altersgruppe)
        }
        leereBoxenWeg()
        
        $('.kurspreview_info').find('.hoverinfo').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.klickinfo_kurse').css({"display": "none"})
        // beide folgenden sind der HG. .hg_blende ist allgemein, also alle,
        // .aktiverEvent.Bild ist die spezielle class dessen, der ge-fadeIn() werden soll. 
        $('.hg_blende').css({"opacity": "0"}) 
        if (  aktiverEvent.Bild !== ""  ) {
            $('.'+aktiverEvent.Bild).css({"opacity": "1"})    
        }
        // use aktiverKurs to fill fields           
    })
    $('body').on('mouseout', 'a.Events', function(){
        $('.hoverinfo').css({"display": "none"}) 
        $('.klickinfo_kurse').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.hg_blende').css({"opacity": "0"})       
        
    })




    // SCHULTERMINE PREVIEW
    $('body').on('mouseover', 'a.Kategorie', function(){
        $('.kurspreview_info').find('.hoverinfo').remove()
        $('.kurspreview_info').append(templateKategoriePreview)

        $('.kurspreview_info').find('.hoverinfo').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.klickinfo_kurse').css({"display": "none"})
        // beide folgenden sind der HG. .hg_blende ist allgemein, also alle,
        // .aktiverEvent.Bild ist die spezielle class dessen, der ge-fadeIn() werden soll. 
        $('.hg_blende').css({"opacity": "0"}) 
        if (  aktiverEvent.Bild !== ""  ) {
            $('.'+aktiverEvent.Bild).css({"opacity": "1"})    
        }
    })
    $('body').on('mouseout', 'a.Kategorie', function(){
        $('.hoverinfo').css({"display": "none"}) 
        $('.klickinfo_kurse').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px", "display": "table-cell"})
        $('.hg_blende').css({"opacity": "0"})       
    })


    // SCHULSTATIONEN PREVIEW
    $('body').on('mouseover', 'a.Schulstationen', function(){
        var schulKursPreviewInsert = function(){
            // sollte erst der Name werden:
            $('.infobox_schulapp').find('.preview_titel').text(aktiverSchulEvent.BeschrKurz)
            $('.infobox_schulapp').find('.thema_box').text(aktiverSchulEvent.Thematik)
            $('.infobox_schulapp').find('.zeit_box_').text("40 min")
            $('.infobox_schulapp').find('.preview_area').css({"transition": "all 0.88s ease-in", "opacity": "1", "max-height": "800px"})
            // hg-Überblending
            $('.hg_blende').css({"opacity": "0"})
            $('.'+aktiverSchulEvent.Bild).css({"opacity": "1"})
        }
        schulKursPreviewInsert()           
    })
    $('body').on('mouseout', 'a.Schulstationen', function(){
        $('.infobox_schulapp').find('.preview_area_').css({"transition": "all 0s linear", "opacity": "0", "max-height": "0"}) 
        $('.hg_blende').css({"opacity": "0"})
    })

    


    

    var zumKurs = function() {
        console.log(selectedColor(voll))
        $('.einzelkursbox').empty()
        $('#Kapitel_Kurse').css({'background-image': 'url(IMG/' + aktiverEvent.Bild + '.jpg)','background-repeat': 'no-repeat','background-size': 'cover'})
        $('#eventueberschrift').text("Detailansicht")

        $('.zurueckknopf').css("border-right", sizeZurueckKnopf+" solid "+selectedColor(voll))
        $('#kleinbild_zurueckknopf').css("border-right", "80px solid "+selectedColor(voll))


        //----------------------DER KURSBUCHUNG-BUTTON-----------------------//
        var buchenButton = '<button class="kursbuchung kursbuchung_button" style="background:'+selectedColor(achtacht)+'">MITMACHEN</button>'                    


        //------------------DAS BESCHREIBUNGS-TEMPLATE-----------------------// 
        var beschreibungTemplate = '<div class="kursbeschreibung animate_fadein" style="background:'+selectedColor(achtacht)+'">'+
                                        '<h1 class="kurstitel" style="text-shadow: 0 0 4px rgb('+schwarz+')">'+aktiverEvent.Eventname+'</h1>'+
                                        '<p>'+aktiverEvent.BeschrLang+'</p>'+
                                    '</div>'


        //--------------------DAS KURSINFO-TEMPLATE--------------------------//
        var infoTemplate = '<div class="extrainfo_box animate_fadein2">'+
                                '<div class="TIME_NAME">'+aktiverEvent.Zeitname()+' '+aktiverEvent.Stundenzahl()+'</div>' +
                                '<div class="info_blocks" style="border: 1px solid '+selectedColor(0.4)+';background:white">'+aktiverEvent.VomBis()+" "+aktiverEvent.InfoboxUhrzeit()+'</div>'+
                                '<div class="info_blocks" style="border: 1px solid '+selectedColor(0.4)+'">'+aktiverEvent.PreisOutput()+'</div>'+
                                '<div class="info_blocks" style="border: 1px solid '+selectedColor(0.4)+';background:white">Leitung: '+aktiverEvent.Kursleiter+'</div>'+
                            '</div>'

        $(beschreibungTemplate+infoTemplate+extraBilderText(aktiverEvent)+buchenButton).appendTo('.einzelkursbox')

        // wenn keine Extra-Zeile, hat der Kursbuchung-Knopf alle Ecken rund.
        var elem1 = document.getElementsByClassName('appendix_box')
        var elem2 = document.getElementsByClassName('mehrinfos_button')

        if (($('.einzelkursbox').has(elem1).length > 0 ) || ($('.einzelkursbox').has(elem2).length > 0)) {
            $('.kursbuchung_button').css({"border-radius": "0 10px 10px 0"})
        }
        else {
            $('.kursbuchung_button').css({"border-radius": "10px"})
        }
        if ($('.einzelkursbox').has(elem1).length > 0) {
            $('.mehrinfos_button').css({"border-radius": "0px"})
        } else {
            $('.mehrinfos_button').css({"border-radius": "10px 0 0 10px"})
        }
        if ($('.einzelkursbox').has(elem2).length > 0){
            $('.appendix_box').toggleClass('shorter_appendix')
        }

    }


    // THE BIG CLEAN-UP!

    $('.zurueckknopf').fadeOut(50)



    







    //''''''''''''''''''''''''''''''\\
    //                              \\
    //       KURS-SELEKTION         \\
    //                              \\
    //______________________________\\

    // Zum Einzelkurs

    var kursAktivieren = function(dieserhier){
        // ganz geil: nimmt die Kursliste "KategorisierteEvents" und greift sich nach dem Listenstreifen name-Attribut 
        // den Index
        if (dieserhier.hasClass('Kurse') || dieserhier.hasClass('Events') || dieserhier.hasClass('Workshops') || dieserhier.hasClass('Ferienkurse')) aktiverEvent = KategorisierteEvents[dieserhier.attr("name")]  
        else if (dieserhier.hasClass('Schultermine')) {}
        else if (dieserhier.hasClass('Schulstationen')) aktiverSchulEvent = Schulevents[dieserhier.attr("name")]
    }  
   


    $('#menu_kontakt').on('click', function(){
        $('.rotierWuerfel2').empty()
        $('body').on('click', '.kontakt_button', function(){
            $('.kontakt_button').removeClass('kontakt_aktiv')
            $(this).addClass('kontakt_aktiv')
            if($(this).hasClass('kontakt1')){$('.kontakt_box').fadeOut(1000);$('.karteniframe').fadeOut(1000);$('.telefonbox').fadeIn(1000)}
            if($(this).hasClass('kontakt2')){$('.kontakt_box').fadeOut(1000);$('.karteniframe').fadeOut(1000);$('.netzbox').fadeIn(1000)}
            if($(this).hasClass('kontakt3')){$('.kontakt_box').fadeOut(1000);$('.karteniframe').fadeIn(1000)}
        })
        var kontaktImgWidth = "50%"
        $('.rotierWuerfel2').append('<iframe class="karteniframe" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8470.920355833021!2d8.843564787029127!3d53.6268446569187!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xc96603dfe38d1d5a!2sKunstschule+Kube+e.V.!5e0!3m2!1sen!2sph!4v1472197444172" width="800" height="800" align="middle" frameborder="0" allowfullscreen></iframe>')
        $('.rotierWuerfel2').append('<div class="kontakt_box mit_weissem_hg netzbox"><h3>Wir sind bei:</h3><div class="kontakt_container"><a href="https://www.facebook.com/Kunstschule-KUBE-204465459689413/?fref=ts" target="_blank"><div class="imagebox" id="facebook"><img src="IMG/KUBE_fb" class="vorhanden" width="'+kontaktImgWidth+'"><p>Facebook</p></div></a><a target="_blank"><div class="imagebox" id="instagram"><img src="IMG/KUBE_Insta" class="nicht_vorhanden" width="'+kontaktImgWidth+'"><p>Instagram</p></div><a href="https://www.youtube.com/watch?v=UhX2Zps3wKg" target="_blank"><div class="imagebox" id="youtube"><img src="IMG/KUBE_Youtube" class="vorhanden" width="'+kontaktImgWidth+'"><p>Youtube</p></div></a></div></div>')
        $('.rotierWuerfel2').append('<div class="kontakt_box mit_weissem_hg telefonbox"><div class="kontakt_oben"><h3>Kunstschule Bederkesa e.v.</h3><p class="addresstext">Amtsstrasse 8</p><p class="addresstext">27624 Stadt Geestland (Bederkesa)</p></div><div class="kontakt_mitte"><h3>Telefon</h3><p class="addresstext">04745 - 5151</p></div><div class="kontakt_unten"><h3>Email</h3><p>kunstschule-kube@ewetel.net</p></div><div class="kontakt_ganzunten"><h3>Bürozeiten:</h3><p class="addresstext">Mo-Fr: 9.00 - 12.00, oder Nachricht hinterlassen.</p></div></div>')
        $('.karteniframe').show()
        $('.kontakt_box').hide()
    })


    $('#menu_team').on('click', function(){
        kursleiter()
        $('.gif').html('<img id="durchlauf" src="IMG/TEAM/durchlauf.gif">')
    })                                                     
                                                           

    $('.team_streifen').on('click', function(){
        var kl_bilderordner = $(this).attr('id')
        $('.gif').empty().html('<img id="durchlauf" src="IMG/TEAM/'+kl_bilderordner+'/pose1x.gif">')

    })

    $('#menu_aktu').on('click', function(){
        if (!ankuendigungEin){
            // nur beim ersten Mal öffnen starten
            aktuelles()
        } 
    })



    // unter der Liste kommt: "Findet ihr euren Wunschkurs nicht? 
    // Werdet ein Teil der Zukunft der KUBE - ihr könnt hier Kurse vorschlagen und sehen, welche Kurse geplant oder angedacht sind und was wir für Visionen haben. Wir bedanken uns für euer Interesse!"

    function menuNachAlfredo(){
        setTimeout(function (){
            if(!abgelaufen) {
                menuRotateAlfredo()
            }else{return}
        }, 9000)
    }
    menuNachAlfredo() 




    // Section under Construction 
    $('#Kapitel_Einblicke').find('.responsive_container').append('<div class="messagebox"><div class="table"><div class="cell"><div class="drehstein"></div><h3 class="in_arbeit">Dieser Bereich ist noch in Arbeit und wird in Kürze fertig.</h3></div></div></div>')



})





// Das Teilnehmeralter von 0 - 5 (Array beginnt bei 0)
  //  Alter "die ganze Familie", "Kleinkinder ab 6", "Kinder ab 10", "Jugendliche", "Erwachsene", "überw. Senioren"

