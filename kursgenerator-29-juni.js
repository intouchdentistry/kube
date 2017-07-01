
//''''''''''''''''''''''''''''''\\
//                              \\
//        SYSTEMDATUM usw.      \\
//                              \\
//______________________________\\




// das Ferienprogramm... Wo können Schulferien Niedersachsen autom. ausgelesen werden? Oder sind die immer gleich?

    

var heute = new Date()

var Modus = "aktuell"
// alt: "vergangenen " oder "" (alle, laufend und abgelaufen)


var Wochentage = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"]
var Monate = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]
var MonateEnglisch = ["January","February","March","April","May","June","July","August","September","October","November","December"]

// andere Optionen "archiv" (KursSortierer zeigt nur abgelaufene Events) und "alle" (KursSortierer zeigt alle Events)

var Events = []
var Ankuendigungen = []
var Kursleiter = []
var Schultermine = []
var Schulevents = []

// Der prototypische Kurs    
function Event (EventID,Eventname,Kursleiter,Thematik,Altersgruppe,BeschrLang,BeschrKurz,PreisProSession,Preis,Kategorie,TermineDeutsch,Extra,Bild,Bilderserie,Layout,JSDate,Zeitname,VomBis,WtagStartEndZeit,DatumDeutsch,InfoboxUhrzeit,Stundenzahl,PreisOutput,gapCheck,diskreteUhrzeiten,Layouter){
    this.EventID = EventID
    this.Eventname = Eventname  
    this.Kursleiter = Kursleiter
    this.Thematik = Thematik
    this.Altersgruppe = Altersgruppe
    this.BeschrLang = BeschrLang
    this.BeschrKurz = BeschrKurz
    this.PreisProSession = PreisProSession
    this.Preis = Preis
    this.Kategorie = Kategorie
    this.TermineDeutsch = TermineDeutsch
    this.Extra = Extra
    this.Bild = Bild
    this.Bilderserie = Bilderserie
    this.Layout = Layout

    this.JSDate = function(){
        var datumstring = {}
        datumstring = ""+MonateEnglisch[this.TermineDeutsch[this.TermineDeutsch.length-1][0][1]-1]+", "+this.TermineDeutsch[this.TermineDeutsch.length-1][0][0]+" "+this.TermineDeutsch[this.TermineDeutsch.length-1][0][2]
        var diesesDatum = new Date(datumstring)
        return diesesDatum
    }

    //*******************************************************//
    //                       Zeitname                        //
    //*******************************************************//  
    this.Zeitname = function(){

        if (typeof this.TermineDeutsch === "object") {

            if (this.Kategorie == "Kurse"){
                return "Wöchentl. Dauerkurs"   
            }
            else if (this.TermineDeutsch.length === 1) {
                return "Einmal-Event"
            }
            else if (this.TermineDeutsch.length === 2) {
                return "Zwei Termine"
            }
            else if (this.TermineDeutsch.length > 2) {
                if (!(this.gapCheck)) {
                    if (this.GleicheWochentage) {
                        if (this.Kategorie === "Events") {
                            return "Event über mehrere Wochen"
                        }
                        else {
                            return "Kurzkurs"
                        }
                    } 
                    else {
                        return "mehrere Termine"
                    }
                }
                else {
                    return "mehrtägiger Event"     
                }
            }

        }
        else {
            return "ein Event an der Kube"
        }

        

        
    }

    /////////////////////////////////////
    //                                 //
    //    CREATES OUTPUT STRING        //
    //    FOR PREVIEW INFOBOX          //
    //    standalone helper function   //
    //                                 //
    /////////////////////////////////////        

    this.VomBis = function(){
    // NIMMT ERSTEN UND LETZTEN TERMIN BEI WS EVENTS USW, UND GIBT DEN ZEITRAUM ODER EINZELTERMIN AUS
    
        if (typeof this.TermineDeutsch != "object"){
            return this.TermineDeutsch
        }
        if (this.Kategorie === "Kurse"){
            var Wort = ""
            var WochentageErgebnis = ""
            if (this.TermineDeutsch.length > 1){
                for (i = 0; i < this.TermineDeutsch.length-1; i++){
                    if (i != this.TermineDeutsch.length-2){
                        WochentageErgebnis += Wochentage[this.TermineDeutsch[i][0]-1]+ "s, "
                    }
                    else{
                        WochentageErgebnis += "und "+Wochentage[this.TermineDeutsch[i][0]-1]+ "s, "
                    }
                // spuckt z.B. (zwecks 'immer') "Montags, und Mittwochs" aus
                Wort = "immer"
                }
            }
            else {     
                WochentageErgebnis += Wochentage[this.TermineDeutsch[0][0]-1]+ ", "
                // spuckt z.B. (Jeden) "Montag" aus
                Wort = "Jeden"
            }
            // dann noch das letzte Komma abschneiden:       
            var WochentageErgebnisOhneKomma = WochentageErgebnis.slice(0, -2)
            return Wort+" "+WochentageErgebnisOhneKomma 
        }
        else {
        // WS, Events,...

            var Jahrgleich
            var termineArray = eval(this.TermineDeutsch)

            if (this.TermineDeutsch.length > 1){
                if (this.TermineDeutsch[0][0][2] === this.TermineDeutsch[this.TermineDeutsch.length-1][0][2]){
                    Jahrgleich = ""
                }
                else {
                    Jahrgleich = this.TermineDeutsch[0][0][2]
                }
                return "vom "+this.TermineDeutsch[0][0][0]+"."+this.TermineDeutsch[0][0][1]+"."+Jahrgleich+" bis zum " +this.TermineDeutsch[this.TermineDeutsch.length-1][0][0]+"."+this.TermineDeutsch[this.TermineDeutsch.length-1][0][1]+"."+ this.TermineDeutsch[this.TermineDeutsch.length-1][0][2]
            }
            else {
                return "Am "+this.TermineDeutsch[0][0][0]+"."+this.TermineDeutsch[0][0][1]+"."+this.TermineDeutsch[0][0][2]
            }
        }
        
    }        



    ////////////////////////////////////////////
    //                                        //
    //  CHOPS UP DATE AT GIVEN INDEX (as ARR  //
    //               standalone               //
    ////////////////////////////////////////////
    this.WtagStartEndZeit = function() {
        
        var wTagStartEndzeit = []
        if (typeof this.TermineDeutsch === 'object') {
            for (i = 0; i < this.TermineDeutsch.length; i++){
                var einzelWTagStartEndzeit = []
                var neuesDatum = new Date(this.TermineDeutsch[i][0])
                var wt = Wochentage[neuesDatum.getDay()-1]
            
                var von = this.TermineDeutsch[i][1]
                von = von.toString()
                if (von.indexOf(".") != -1){
                    von = von.slice(0, -2)
                    von = von + ":30"
                }
                var bis = this.TermineDeutsch[i][2]
                bis = bis.toString()
                if (bis.indexOf(".") != -1){    
                    bis = bis.slice(0, -2)
                    bis = bis + ":30"
                }
                // viell. besser als Objekt? twt wär dann ein key
                
                einzelWTagStartEndzeit.push(wt)
                einzelWTagStartEndzeit.push(von)
                einzelWTagStartEndzeit.push(bis)
                wTagStartEndzeit.push(einzelWTagStartEndzeit)
            }
            return wTagStartEndzeit
        }
        return "" 
    }


    //////////////////////////////////////
    //                                  //
    //  CREATES COMPLETE CENTERED INFO  //
    //   uses TAGELISTE, DATUMDEUTSCH   //
    //////////////////////////////////////
    
        
        // make-over for even smarter adjustments. 
        //E.g. including repetitive patterns (e.g. same time or same week day)
        // und check if last date in G-sheet is really later. Send a unsuspicious reminder if not! (form->PHP)               

        // an array as in "[1,10,12],[1,10,12],[1,10,12]" (=mehrwö. WS)


    this.InfoboxUhrzeit = function(){
        WochentageStartzeitEndzeit = this.WtagStartEndZeit()
        var uhrZeiten = []
        var ausreisser = -1
        for (t in WochentageStartzeitEndzeit) {
           
            if (uhrZeiten.indexOf(WochentageStartzeitEndzeit[t]) === -1){
                uhrZeiten.push(WochentageStartzeitEndzeit[t])
                ausreisser++
            }
        }
        if (ausreisser === 0) {
            return ' von '+WochentageStartzeitEndzeit[0][1]+' bis '+WochentageStartzeitEndzeit[0][2]+' Uhr'
        } else if (typeof this.TermineDeutsch === "object"){
            return "Uhrzeiten siehe unten"
        } else {
            return ""
        }
    }

    //************************//
    //                        //
    //  COMPUTES TOTAL HOURS  //
    //      standalone        //
    //************************//
    this.Stundenzahl = function(){
        
        if (typeof this.TermineDeutsch === "object"){

            if (this.Kategorie != "Kurse"){
                var totalStunden = 0
                for (i = 0; i < this.TermineDeutsch.length; i++){
                    totalStunden += (this.TermineDeutsch[i][2]-this.TermineDeutsch[i][1])
                }
                return "(Insg. "+totalStunden+"h)"}
            else {
                var totalStunden = 0
                 totalStunden += (this.TermineDeutsch[0][2]-this.TermineDeutsch[0][1])
                return "(Je "+totalStunden+"h)"
            }
        }else{
            return ""
        }
    }

    //*******************************************************//
    //                     PreisOutput                       //
    //*******************************************************// 
    this.PreisOutput = function(){

        if ($.isNumeric(this.Preis)){   
            if(this.PreisProSession == "TRUE"){
                return this.Preis+" € / Sitzung"   
            } else {
                return this.Preis+" €"
            }
        } else if (this.Preis === ""){
            return "Preis auf Anfrage"
        } else {
            return "Preis "+this.Preis
        }   
    }

    this.gapCheck = function(){

        var einundDreissigTage = [3,5,7,10,12]

        for (i = 1; i < this.TermineDeutsch.length; i++){
            // startet ab dem 2. Termin, 
            
            // vergleicht zurück:
            if (new Date(TermineDeutsch[i][0]).getMonth() != new Date(TermineDeutsch[i-1][0]).getMonth()){       

                if ((new Date(TermineDeutsch[i][0]).getMonth() in einundDreissigTage) && (new Date(TermineDeutsch[i-1][0]).getDay() != "30")){
                    return false
                }
            }
            else {  // i.e. same month!
                
                if ((new Date(TermineDeutsch[i][0]).getDay() - new Date(TermineDeutsch[i-1][0]).getDay()) > 1  ){ // i.e. 20-18=2 > 1! -> false!
                    return false
                }
            }   
        }
        return true; // i.e. continuous date range!
    }


    // die folgende .method wird nicht mehr gebraucht. Aber ich finde die Methode gut.
    
    this.diskreteUhrzeiten = function(){
       
       // spuckt eine Zahl aus, z.B. 1 = ein Termin mit min. 1 abweichender Uhrzeit (von, bis oder beide)
        var diskreteUhrzeitenListe = []
        var diskreteIndicesListe = []

        // erstmal kein Unterschied, hoffentl:
        if (this.Kategorie == "Kurse") {/*daher leer*/}
        else if ((this.Kategorie == "Workshops") || (this.Kategorie == "Events")) {/*daher leer*/}

        for (i = 0; i < this.TermineDeutsch.length; i++){
            if (diskreteUhrzeitenListe.indexOf(this.TermineDeutsch[i][1]) === '-1'){
                diskreteUhrzeitenListe.push(this.TermineDeutsch[i][1])
                diskreteIndicesListe.push(i)
            }
        } 
        for (i = 0; i < this.TermineDeutsch.length; i++){    
                if (diskreteUhrzeitenListe.indexOf(this.TermineDeutsch[i][2]) === '-1'){
                    diskreteUhrzeitenListe.push(this.TermineDeutsch[i][2])  
            if (diskreteIndicesListe.indexOf(i) === '-1'){
                }
            }            
        }         
            // hat quasi gecheckt, ob es eine herausstechende Uhrzeit gibt.
            // lässt man es mit 1 und mit 2 durchlaufen, weiß man, ob es überhaupt eine weitere diskrete Uhrzeit gibt
            // mit diskreteUhrzeitenListe.length bekommt man sogar deren Anzahl.      

        return diskreteUhrzeitenListe.length-1      
    }
     

    // NUR FÜR ANKÜNDIGUNGEN! Warum nicht für alle??
    //*******************************************************//
    //                       Layouter                        //
    //*******************************************************// 
    this.Layouter = function(){
        switch(this.Layout) {
        case 'galerie1':
            return '<div class="multibilder_event"><h3>'+this.Eventname+'</h3><div class="bilderteil"><img src="IMG/EVENTS/'+this.Bild+'.jpg"/></div><p>'+this.BeschrLang+'</p></div>' 
            break
        case 'webUpdate25':
            return '<div class="ankuendigung_container mit_weissem_hg">'+
                        '<div class="quote center quoteHeim">'+
                            '<div class="event_behaelter table">'+
                                    '<div class="ankuendigung_cell cell">'+
                                            '<h1 class="event_logo">'+this.Eventname+'</h1>'+
                                            '<div class="event_datum">'+this.Extra+'</div>'+
                                    '</div>'+
                            '</div>'+
                            '<p id="ankuend_p">'+this.BeschrLang+'</p></div></div>'+ 
                        '</div>'+
                    '</div>'
            break
        case 'vollbild':
            return '<div style="width:100%;height:100%;background:white";><div style="width:100%;height:100%;background:url(IMG/'+this.Bild+'.jpg);background-size:50%;background-position:center;background-repeat:no-repeat;"></div></div>' 
            break
        //default:
          //  default code block
        }
     
    }

    //*******************************************************//
    //                    Gleiche W-Tage                     //
    //*******************************************************//
    this.GleicheWochentage = function(){
        var diskreteWochentageListe = []
        var diskreteWtageIndicesListe = []

        for (i in this.TermineDeutsch){ 


            dieserWtag = new Date().getDay

            if (diskreteWochentageListe.indexOf(this.TermineDeutsch[i][1]) === '-1'){
                diskreteWochentageListe.push(this.TermineDeutsch[i][1])
                diskreteWtageIndicesListe.push(i)

            }
        }

    }

}
// So werden Events gebildet.  
 

var HTMLStringer = function(inputstring){
    // Für die Kurstabelle:

    // *grün* **     --> <span class="grün"> ... </span>
    // *orange* **    usw...
    // *gelb* **
    // *lila* **
    // *## --> '<a href="#'          ##*  --> </a>     #* --> ">
    
    //  *link:www....* **link  --> <a href="www..." class="grün"> ... </a>
    // *link:#...* **link     --> <a href="#..."> ... </a> 

    var newString = inputstring.replace(/\*\*/g,'</span>').replace(/\*grün\*/g,'<span class="gruen">').replace(/\*orange\*/g,'<span class="orange">').replace(/\*gelb\*/g,'<span class="gelb">').replace(/\*lila\*/g,'<span class="lila">').replace(/\*##/g,'<a href="#').replace(/##\*/g,'</a>').replace(/#\*/g,'">').replace(/\*pinklink\*/g,'<span class="pinklink">').replace(/\*grünlink\*/g,'<span class="gruenlink">').replace(/\*orangelink\*/g,'<span class="orangelink">').replace(/\*gelblink\*/g,'<span class="gelblink">')
    return newString
}





//''''''''''''''''''''''''''''''\\
//                              \\
//         EVENTS-INIT          \\
//                              \\
//______________________________\\

// ID of the Google Spreadsheet
var spreadsheetID = "1pF-wRKC53cFoDF2-K4UhTiFr97SJXXggDaGB9Q1EfLY"

var zaehlerEvents = 0
var zaehlerSchulEvents = 0
var zaehlerAnkuendg = 0
var zaehlerSchultermine = 0



var jsonLoad = function(check){
       
    // Make sure it is public or set to Anyone with link can view: 
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json"

    $.getJSON(url, function(data){
            
            // zum Anzeigen als alert:
            //alert(JSON.stringify(jsonO));

            var entry = data.feed.entry
            var diesesDatum = {}
            var neuerEvent = {}


            /*
            console.log("wieOft??")
            */
            var arrayTermineDeutsch = function(derHier){
                if((derHier.gsx$termine.$t === "noch offen") || (derHier.gsx$termine.$t === "auf Wunsch")){
                    return "Termine: "+derHier.gsx$termine.$t
                }
                else if (derHier.gsx$termine.$t === "") {
                    return "Termin(e) noch offen"
                }
                else if (derHier.gsx$termine.$t === "bitte frühzeitig buchen") {
                    return derHier.gsx$termine.$t
                }
                
                var termineInputArray = derHier.gsx$termine.$t
                termineInputArray = termineInputArray.split('&')
                

                var termineSegmentedArray = []

                var finalerOutputArray = []

                var dateArray = []
                // ["n,n,nnnn,n,n","n,n,nnnn,n,n"] <-- One Long array of inividual date strings. Commas not arrayeous
                /*
                console.log("termineInputArray (&-split): "+JSON.stringify(termineInputArray))
                console.log('')
                // OUTPUT termineInputArray : ["28,4,2016,19,21","5,5,2016,19,21","12,5,2016,19,21","19,5,2016,19,21"]
                */
                for (var termin in termineInputArray) {
                    termineSegmentedArray.push(termineInputArray[termin].split(',')) 
                    // OUTPUT termineSegmentedArray : [["28","4","2016","19","21"]]
                    // next iteration: [["28","4","2016","19","21"],["5","5","2016","19","21"]] etc...
                    
                }
                var dateArrayFueller = function(derHier){
                    dateArray.push(eval(termineSegmentedArray[derHier][0]))
                    dateArray.push(eval(termineSegmentedArray[derHier][1]))
                    dateArray.push(eval(termineSegmentedArray[derHier][2]))
                }

                if (derHier.gsx$kategorie.$t === "Kurse") {
                    for (termin in termineSegmentedArray){
                        
                        dateArrayFueller(termin)
                        finalerOutputArray.push(dateArray)
                    }
                    // OUTPUT : 
                    
                }else{    
                    for (termin in termineSegmentedArray){
                        
                        var finalerOutputArraySegment = []
                        dateArrayFueller(termin)
                        finalerOutputArraySegment.push(dateArray)
                        finalerOutputArraySegment.push(eval(termineSegmentedArray[termin][3]))
                        finalerOutputArraySegment.push(eval(termineSegmentedArray[termin][4]))
                        finalerOutputArray.push(finalerOutputArraySegment) 
                    }
                }
                console.log(finalerOutputArray)
                return finalerOutputArray           
            }

           
            var arrayBilder = function(derHier){
                if (derHier.gsx$einzelbilder.$t != ""){ 
                    return eval(derHier.gsx$einzelbilder.$t)
                }else{
                    return []
                }
            }
            
            var getCurrentId = function(derHier){
                if (derHier.gsx$layout.$t == "schulklassen1"){
                    return zaehlerSchulEvents
                }
                else if (derHier.gsx$aktuelles.$t == "Ja"){
                    return zaehlerAnkuendg
                }
                else if (derHier.gsx$layout.$t == ""){
                    return zaehlerSchultermine
                }
                else {
                    return zaehlerEvents
                }
            }
            
            var eventSortierenUndHinzufuegen = function(dieserEntry, dieserEvent){
                // Fülle Array der Events, Schultermine, Schulstationen & Ankuendigungen:
                if (dieserEntry.gsx$aktuelles.$t == "Ja"){
                    Ankuendigungen.push(dieserEvent)
                    zaehlerAnkuendg++
                }

                if (dieserEntry.gsx$kategorie.$t == "Schultermine"){
                    
                    Schultermine.push(dieserEvent)
                    zaehlerSchultermine++
                }

                else if (dieserEntry.gsx$kategorie.$t == "Schulstationen"){
                    
                    Schulevents.push(dieserEvent)
                    zaehlerSchulEvents++
                }

                else if (dieserEntry.gsx$kategorie.$t != "Ankuendigungen"){
                    Events.push(dieserEvent)
                    zaehlerEvents++

                    if ((Kursleiter.indexOf(dieserEntry.gsx$kursleiter.$t) === -1) && (dieserEntry.gsx$kursleiter.$t != "")){
                        Kursleiter.push(dieserEntry.gsx$kursleiter.$t)
                    }
                }

            }


            // erst der check, ob Archivmodus, aktuell etc denn:
            // wenn Archiv: kein Check ob "stehenlassen" nötig!

            heute.setHours(0,0,0,0)


            if (check === "aktuell"){

                $(entry).each(function(){    

                    neuerEvent = new Event(
                        getCurrentId(this),
                        this.gsx$eventname.$t,
                        this.gsx$kursleiter.$t,
                        this.gsx$thematik.$t,
                        this.gsx$altersgruppe.$t,
                        HTMLStringer(this.gsx$beschr.$t),
                        this.gsx$beschrkurz.$t,
                        this.gsx$preisprosession.$t,
                        this.gsx$preis.$t,
                        this.gsx$kategorie.$t,
                        arrayTermineDeutsch(this), // this will be either the string as in "noch offen", or the German date array
                        this.gsx$extra.$t,
                        this.gsx$hintergrundbild.$t,
                        arrayBilder(this),
                        this.gsx$layout.$t
                    )

                    if ((typeof neuerEvent.TermineDeutsch === "string") 
                        // wenn der Terminstring "" ist, oder
                        || (this.gsx$kategorie.$t === "Kurse"))
                        // wenn es ein Kurs ist
                    {
                        //console.log("Event: "+ neuerEvent.Eventname+" Termine: "+neuerEvent.TermineDeutsch.length+" Kat: "+neuerEvent.Kategorie)
                        eventSortierenUndHinzufuegen(this, neuerEvent)
                        if (this.gsx$hintergrundbild.$t != ""){
                            $('<div class="preload" style="background-image: url(IMG/'+this.gsx$hintergrundbild.$t+'.jpg) no-repeat -9999px -9999px"></div>').insertBefore('body')
                        }

                    } else {
                        diesesDatum = neuerEvent.JSDate()
                        diesesDatum.setHours(0,0,0,0)
                        if ((diesesDatum.valueOf() >= heute.valueOf()) || (this.gsx$aktuelles.$t == "Ja")){
                            eventSortierenUndHinzufuegen(this, neuerEvent)
                            if (this.gsx$hintergrundbild.$t != ""){
                                $('<div class="preload" style="background-image: url(IMG/'+this.gsx$hintergrundbild.$t+'.jpg) no-repeat -9999px -9999px"></div>').insertBefore('body')
                            }
                        }
                    }
                                     
                })
            }

            else if (check === "vergangen"){
            }    
            else if (check === ""){           
            }      
                
    }) // closing of getJSON subfunction
            
} // closing of jsonLoad(check) function










