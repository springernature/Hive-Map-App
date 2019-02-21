"use strict";
$(document).ready(function() {
    var modals = $('.modal');
    var close = $('.close');
    var areas = $('.area');
    var grids = $('.row');
    var data = {
        0:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        1:["william.curtis@springer.com","d.sanderson@us.nature.com","michael.elf@springernature.com","eileen.purelis@springer.com","ned.woods@springer.com","heath.wagenheim@springernature.com"],
        2:["alfredo.echeverria@macmillaneducation.com"],
        3:["alfredo.echeverria@macmillaneducation.com"],
        4:["acacio.queiroz@macmillaneducation.com"],
        5:["piotr.pich@macmillaneducation.com"],
        6:["kefiloe.kgomo@macmillaneducation.co.za"],
        7:["fernando.rastrollo@macmillaneducation.com"],
        8:["sanjiv.goswami@springer.com","emma.bourne@macmillaneducation.com","preeti.wadhawan@macmillan.co.in","rajesh.pasari@macmillan.co.in","dayalu.subburayalu@springer.com","matthias.wissel@springer.com","bas.amesz@springernature.com","maurice.kwong@springer.com"],
        9:["thomas.thiekoetter@springer.com"],
        10:["marta.martinez@macmillaneducation.com","javier.cazana@macmillaneducation.com","ignacio.lopez@macmillaneducation.com","lola.luengo@macmillaneducation.com","isabel.castillo@macmillaneducation.com","jesus.ahumada@springer.com","josemaria.balboa@macmillaneducation.com","carmen.ardura@macmillaneducation.com","fernando.rastrollo@macmillaneducation.com"],
        11:["a.bocquet@nature.com","maurice.kwong@springer.com","cedric.noeillac@springernature.com","fukio.matsuda@springer.com","emma.bourne@macmillaneducation.com","jane.dale@springernature.com","katrin.stienemeier@springernature.com"],
        12:["arnout.jacobs@nature.com","yvonne.su@springernature.com","emma.bourne@macmillaneducation.com","jessica.zheng@springernature.com","cedric.noeillac@springernature.com","maurice.kwong@springer.com"],
        13:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        14:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        15:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        16:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        17:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        18:["dinah.spence@springernature.com","stephanie.norman@springernature.com"],
        19:["dinah.spence@springernature.com","stephanie.norman@springernature.com"]
    };
    $('map').imageMapResize();
    $('.panel').hide();

    //check if IE is used
    function isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            return true;
        }
        else
        {
            return false
        }
    }

    //Populating data for modals
    function loadData(data,i){
        if( $(grids[i]).children().length === 0 ){
            $(data).each(function(index,email){
                osapi.jive.core.get({
                    "v":"v3",
                    "href":"/people/email/"+email
                }).execute(function(response){
                    if(response.error){
                        console.log(response.error.message);
                    }
                    else{
                        if(isIE()){
                            insertAvatar($(grids[i]),response.content.thumbnailUrl,response.content.displayName,response.content.jive.profile[0].value,response.content.emails[0].value,response.content.resources.html.ref);
                        }
                        else{
                            insertAvatar($(grids[i]),response.thumbnailUrl,response.displayName,response.jive.profile[0].value,response.emails[0].value,response.resources.html.ref);
                        }
                    }
                });
            });
        }
    }

    //show country information on mouse move
    $(areas).each(function(index, area){
        $(area).on('mouseleave',function(){
            $('.panel').hide();
        });
        $(area).on('mouseenter',function(){
            $('.panel-heading').text(area.title);
            $('#panel').css({
                left:+($(window).width()/2) - +150,
                top:0,
                position:'absolute'
            });
            $('.panel').show();
        });
    });

    //load modal after clicking region or country
    $(modals).each(function(index,modal){
        $(areas[index]).click(function(){
            loadData(data[index],index);
            modal.style.display = 'block';
        });
        $(close[index]).on('click',function(){
            modal.style.display = 'none';
        });
    });

    // When the user clicks anywhere outside of the modal_canada, close it
    window.onclick = function(event) {
        $(modals).each(function(index,modal){
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    //build contact card
    var insertAvatar = function (el,avatar_src,full_name,title,email,href){
        var imageElement = $("<img>");
        var mother_div = buildDiv();
        $(mother_div).addClass("row");
        $(el).append(mother_div);

        $(imageElement).attr("src",avatar_src);
        $(imageElement).attr("alt","avatar");
        $(imageElement).css("width","42px");
        $(imageElement).css("height","42px");
        $(imageElement).css("background","black");

        var imgLink = $("<a></a>");
        $(imgLink).attr("href",href);
        $(imgLink).attr("target","_blank");
        $(imgLink).append(imageElement);
        $(imgLink).addClass("image");
        $(buildItemDiv(mother_div,"col-xs-2")).append(imgLink);

        var divElement = buildDiv();
        var aElement = $("<a></a>");;
        $(aElement).attr("href",href);
        $(aElement).attr("target","_blank");
        $(aElement).text(full_name)

        var mailTo = $("<a></a>");
        $(mailTo).attr("href","mailto:"+email);
        $(mailTo).text(email);
        $(divElement).append(aElement);
        $(divElement).append($("<br>"));
        $(divElement).append(title);
        $(divElement).append($("<br>"));
        $(divElement).append(mailTo);
        $(divElement).append($("<br>"));
        $(divElement).css({"white-space": "nowrap",
        "overflow": "hidden","text-overflow":"ellipsis"});
        $(buildItemDiv(mother_div,"col-xs-10")).append(divElement);
    }
    function buildItemDiv(element,class_data){
        var divElement = $("<div></div>");
        $(divElement).addClass(class_data);
        $(element).append(divElement);
        return divElement;
    }
    function buildDiv(){
        var divEl = $("<div></div>");
        return divEl;
    }
    app.resize();
});
