"use strict";
$(document).ready(function() {
    const modals = $('.modal');
    const close = $('.close');
    const areas = $('.area');
    const grids = $('.row');
    const objects = [];
    const oa = [];
    let data = undefined;

    //var csv is the CSV file with headers
    function csvJSON(csv){
        const lines = csv.split("\n");
        const result = [];
        const headers = lines[0].split(",");
        for(var i=1;i<lines.length;i++){
            const obj = {};
            const currentline = lines[i].split(",");
            for(let j=0; j<headers.length; j++){
                const key = headers[j].replace(/(\r\n|\n|\r)/gm,"")
                    .replace(/\s+/g, '').toLowerCase().trim()
                    .replace(/\(/g, '-').replace(/\)/g, '');
                const val = currentline[j].replace(/(\r\n|\n|\r)/gm,"")
                    .replace(/\s+/g, '').toLowerCase().trim()
                    .replace(/\(/g, '-').replace(/\)/g, '');
                obj[key] = val;
            }
            result.push(obj);
        }
        // const json = JSON.stringify(result);
        // console.log(json);

        const regArr = [];
        for ( let r in result ) {
            regArr.push(result[r].region);
        }
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        const uniqRegions = regArr.filter(onlyUnique);

        const objects_arr = [];
        for ( let u in uniqRegions) {
            const divisions = [];
            const region = uniqRegions[u];
            const obj = {};
            const emails = [];
            for ( i in result ) {
                if ( result[i].region === region ) {
                    const division = result[i].division;
                    divisions.push(division);
                }
            }
            obj.region = region;
            obj.division = divisions.filter(onlyUnique);
            objects_arr.push(obj);
        }
        // console.log(objects_arr);

        for ( let o in objects_arr ) {
            const region = objects_arr[o].region;
            let division;

            const obj = {};
            obj.region = region;
            obj.divisions = [];

            for ( let i in objects_arr[o].division ) {

                division = objects_arr[o].division[i];
                const emails = [];

                for ( let j in result ) {
                    if ( result[j].division === division && result[j].region === region) {
                        emails.push(result[j].mail)
                    }
                }
                const object = {
                    contact: emails,
                    division: division
                };
                obj.divisions.push(object);
            }
            oa.push(obj);
        }
        // console.log(JSON.stringify(oa));
        allRegion(oa);
    }
    $(document).ready(function() {
        $.ajax({
            type: "get",
            url: "https://snapps.springernature.com/GRC_Map/grc_map.csv",
            success: function(data) {
                csvJSON(data);
            }
        });
    });

    //Merging 2 arrays keeping only unique values
    function merge_array(array1, array2) {
        const result_array = [];
        const arr = array1.concat(array2);
        let len = arr.length;
        const assoc = {};

        while(len--) {
            const item = arr[len];

            if(!assoc[item])
            {
                result_array.unshift(item);
                assoc[item] = true;
            }
        }

        return result_array;
    }

    /*
    * Adding all divisions contact for relevant regions
     */
    function allRegion(oa) {
        let region_all;
        for ( let i in oa ) {
            if (oa[i].region === 'all') {
                region_all = oa[i].divisions;
                break;
            }
        }
        // console.log(region_all);

        for ( let r in region_all ) {

            // const di = region_all[0];
            const di = region_all[r];
            let di_exists = false;

            for ( let i in oa ) {
                for ( let d in oa[i].divisions ) {
                    if ( oa[i].divisions[d].division !== di.division ) {
                        di_exists = true;
                    }
                }
                if ( di_exists ) {
                    oa[i].divisions.push(di);
                    di_exists = false;
                }
            }
        }
        data = oa;
        // prepData(oa);
        // console.log(JSON.stringify(data));
    }

    // function prepData(data) {
    //     for ( let d in data ) {
    //
    //         for ( let dd in data.divisions ) {
    //             let size = data.divisions[dd].size();
    //             let oneLess = size -= 1;
    //             if ( data.divisions[oneLess]) {
    //                 if ( data.divisions[size].division === data.divisions[oneLess].division) {
    //                     const arr = data.divisions[size].contact.concat(data.divisions[oneLess].contact);
    //                     data.divisions[oneLess].contact = arr;
    //                     delete data.divisions[size];
    //                 }
    //             }
    //
    //         }
    //     }
    //     data = data;
    //     console.log(data);
    // }

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
        if( $(grids[i]).children().length === 0 ) {
            for ( let d in data.divisions ) {
                for ( let email in data.divisions[d].contact ){
                    osapi.jive.core.get({
                        "v":"v3",
                        "href":"/people/email/" + data.divisions[d].contact[email]
                    }).execute(function(response){
                        if(response.error){
                            console.log(response.error.message);
                        }
                        else{
                            if(isIE()){
                                insertAvatar(data.divisions[d].division,$(grids[i]),response.content.thumbnailUrl,response.content.displayName,response.content.jive.profile[0].value,response.content.emails[0].value,response.content.resources.html.ref);
                            }
                            else{
                                insertAvatar(data.divisions[d].division,$(grids[i]),response.thumbnailUrl,response.displayName,response.jive.profile[0].value,response.emails[0].value,response.resources.html.ref);
                            }
                        }
                    });
                }
            }
        }
    }

    function buildAccordion() {
        $( function() {
            $( "#grc-map" ).accordion({
                heightStyle:"content",
                collapsible:true,
                active:0,
                animate: 500
            });
            $("#grc-map .ui-accordion-content").css({
                "background-color" : "#ffffff"
            });
            $("#grc-map .ui-accordion-header").css({
                padding:"20px 1px 20px 20px"
            });
        } );
    }
    function buildItemDiv(element,class_data){
        const divElement = $("<div></div>");
        $(divElement).addClass(class_data);
        $(divElement).addClass('content');
        $(element).append(divElement);
        return divElement;
    }
    function buildDiv(){
        const divEl = $("<div></div>");
        return divEl;
    }

//build contact card
    const insertAvatar = function (sub_title,el,avatar_src,full_name,title,email,href){
        const imageElement = $("<img>");
        $(imageElement).attr("src",avatar_src);
        $(imageElement).attr("alt","avatar");
        $(imageElement).css("width","42px");
        $(imageElement).css("height","42px");
        $(imageElement).css("background","black");

        const imgLink = $("<a></a>");
        $(imgLink).attr("href",href);
        $(imgLink).attr("target","_blank");
        $(imgLink).append(imageElement);
        $(imgLink).addClass("image");
        const div1 = $(buildItemDiv(buildDiv(),"col-xs-2")).append(imgLink);

        const divElement = buildDiv();
        const aElement = $("<a></a>");
        $(aElement).attr("href",href);
        $(aElement).attr("target","_blank");
        $(aElement).text(full_name);
        $(aElement).css({"white-space": "nowrap",
            "overflow": "hidden","text-overflow":"ellipsis","font-family":"'Lucida Console', Courier, monospace","font-size":"12px","color":"DodgerBlue"});

        const mailTo = $("<a></a>");
        $(mailTo).attr("href","mailto:"+email);
        $(mailTo).text(email);
        $(mailTo).css({"color":"DodgerBlue"});
        $(divElement).append(aElement);
        $(divElement).append($("<br>"));
        $(divElement).append(title);
        $(divElement).append($("<br>"));
        $(divElement).append(mailTo);
        $(divElement).append($("<br>"));
        $(divElement).css({"white-space": "nowrap",
            "overflow": "hidden","text-overflow":"ellipsis","font-family":"'Lucida Console', Courier, monospace","font-size":"12px","margin-bottom":"10px"});
        const div2 = $(buildItemDiv(buildDiv(),"col-xs-10")).append(divElement);

        $("#" + sub_title).append(div1);
        $("#" + sub_title).append(div2);

    };

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

            const country = $(modal).attr('name');
            let datum = undefined;
            let el = $("<div id='grc-map' class='container-fluid'></div>");
            for ( let d in data ) {
                // console.log(data[d]);
                if (data[d].region === country ) {
                    datum = data[d];
                    break;
                }
            }

            for ( let d in datum.divisions ) {
                if ( datum.divisions[d].contact.length > 0 ) {
                    const element = $("<h5>" + datum.divisions[d].division.toUpperCase() + "</h5><div id=" + datum.divisions[d].division + "></div>");
                    $(el).append(element);
                }
            }

            const manual_sanctions_link = $("<div id='mmanualSanction'>" +
                "<hr class='purple'>" +
                "<a href='https://hive.springernature.com/docs/DOC-201827' target='_blank'>" +
                "<small>Please follow the link for a list of contacts for manual sanctions checks</small>" +
                "</a>" +
                "</div>")
            $(modal).find(".modal-content").append(el);
            $(modal).find(".modal-content").append(manual_sanctions_link);

            loadData(datum,index);
            // loadData(data[index],index);

            modal.style.display = 'block';
            loadInitialContacts();
        });
        $(close[index]).on('click',function(){
            $("#all").children().remove();
            $("#education").children().remove();
            $("#research").children().remove();
            $("#rhe").children().remove();
            $("#grc-map").remove();
            $("#mmanualSanction").remove();
            modal.style.display = 'none';
        });
    });

    $(".loadLess").hide();
    $(".content").slice(0, 4).show();
    $(".loadMore").on("click", function(e){
        e.preventDefault();
        let l = $(".content:hidden").length;
        $(".content:hidden").slice(0, 4).slideDown();
        if($(".content:hidden").length == 0) {
            $(".loadMore").hide();
            $(".loadLess").show();
        }
    });

    $(".loadLess").on("click", function(e){
        e.preventDefault();
        let l = $(".content:visible").length;
        $(".content:visible").slice(l-4, l).slideUp();

        if( l-4 === 4 || l === 2 ) {
            $(".loadLess").hide();
            $(".loadMore").show();
        }
    });

    function loadInitialContacts(){
        buildAccordion();
        setTimeout(function(){
            $(".content").show();
            // buildAccordion();
            }, 1000);
    }
    loadInitialContacts();
    app.resize();
});