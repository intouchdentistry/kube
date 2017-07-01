
// gets called when this section is opened
var ankuendigungEin = false
var aktuelles = function(){
    // INIT 
    ankuendigungEin = true
    var slidesCount = 0
    $('.behaelter_aktuelles_n').empty()
    $('.aktuelle_tags').remove()

    if (Ankuendigungen[slidesCount].BeschrKurz !== "") {
        $('#aktuelles').text(Ankuendigungen[slidesCount].BeschrKurz)
    }
    else {
        $('#aktuelles').text('brandaktuelles')
    }

    // find container width. only once and once each time slideLinks() is called, 
    // but lets make a setInterval for this in the future to allow for window resizing?
    var container = $('.responsive_container')  
    var width
    var sliderbox = $('.behaelter_aktuelles_n')
    var left   

    // called each slideLinks()
    var findWidthAndLeft = function(){
        width = container.css('width')        
        width = parseInt(width)
        
        left = sliderbox.css('left')
        left = parseInt(left)
        console.log("Width: "+width+" Left: "+left)
        

        var els = document.getElementsByClassName("behaelter_850ankuendg");
        var i = 0;
        // Or
        Array.prototype.forEach.call(els, function(el) {
            // Do stuff here
            var l = i*width
            var t = -(i*100)

            $(el).css({'left': l+'px', 'top': t+'%'})
            i++
        });

    }



    for (i in Ankuendigungen){
        $('.behaelter_aktuelles_n').append('<div class="behaelter_850ankuendg">'+Ankuendigungen[i].Layouter()+'</div>')
    }

    // and omce, initially:
    findWidthAndLeft()

    
    


    // the whole show only runs if there's more than one thing to show!

    if (Ankuendigungen.length > 1) {
        var brandaktuell = ""
        var counter = 0
        

        for (i in Ankuendigungen){       
            brandaktuell += '<a class="slide_link" name="'+counter+'"><span class="slider_zahl" name="'+(parseInt(i)+1)+'">'+(parseInt(i)+1)+'</span></a>'
            // slide_link bg-color from counter:
            if (counter < 3){
            counter++
            }else{counter = 0}
        }


        brandaktuell = '<div class="floatright aktuelle_tags">'+brandaktuell+'</div>'
        $('#aktuelles').after(brandaktuell)

            

        var slideLinks = function(){
            // check what "left"-value
            // # of items n
            // sliding = true;
            
            // get container width in px

            // take that as a unit variable for the slider

            // (optimally, window resizing leads to function reset / call)

            findWidthAndLeft()

            if ( left > (-((Ankuendigungen.length-1)*width)) ) {
                
                slidesCount++

                $('.behaelter_aktuelles_n').css('left', '-'+(width*slidesCount)+'px')
                if (Ankuendigungen[slidesCount].BeschrKurz != "") {
                    $('#aktuelles').text(Ankuendigungen[slidesCount].BeschrKurz)
                }
                else { 
                    $('#aktuelles').text('brandaktuelles')
                }               

                
            }
            else{
                $('.behaelter_aktuelles_n').css('left', '0px')
                
                slidesCount = 0

                if (Ankuendigungen[slidesCount].BeschrKurz != "") {
                    $('#aktuelles').text(Ankuendigungen[slidesCount].BeschrKurz)
                }
                else {  
                    $('#aktuelles').text('brandaktuelles')
                }
            }    
        }

        var dauerSlider = setInterval(function(){slideLinks()}, 8000)

        // call this function when you want to stop slider
        function stopSlideLinks() {
            clearInterval(dauerSlider)
            // sliding = false;
        }

        // Der Knopfdruck-Slider-Stopp:

        $('.slide_link').on('click', function(){
            
            
            if ( $(this).hasClass('umrandung') ){
                $(this).removeClass('umrandung')
                $(this).css("background", "url(../IMG/leinwand.jpg)")
                dauerSlider = setInterval(function(){slideLinks()}, 8000)

            }
            else {
                $('.slide_link').removeClass('umrandung')
                $(this).addClass('umrandung')
                
                var farbZahl = $(this).attr("name")

                slidesCount = ($(this).find('.slider_zahl').attr("name"))-1
 

                $('#behaelter_aktuelles_n').css("left", (-slidesCount*width)+"px")

                if (Ankuendigungen[slidesCount].BeschrKurz != "") {
                    $('#aktuelles').text(Ankuendigungen[slidesCount].BeschrKurz)
                }
                else {
                      
                    $('#aktuelles').text('brandaktuelles')
                }
                
                
                $('.slide_link').css("background", "url(../IMG/leinwand.jpg)")
                $(this).css("background", farbOutput(vierfarben[farbZahl],voll))
                stopSlideLinks()
            }           
            
        })

        $('.slide_link').on('mouseover', function(){
            var farbZahl = $(this).attr("name")
            $(this).css("background", farbOutput(vierfarben[farbZahl],voll))
        })

        $('.slide_link').on('mouseout', function(){
            if(!($(this).hasClass('umrandung'))){
            $(this).css("background", "url(../IMG/leinwand.jpg)")
            }
        })
    }
}