/* ESI */
function showInfo(targetID) {
    console.warn("299 - showInfo")
    $.ajax({
      type: "POST",
      url: "/esi/ui/info/"+targetID
    });
}

function setWaypoint(systemID) {
    console.warn("299 - setWaypoint")
    $.ajax({
        type: "POST",
        url: "/esi/ui/waypoint/"+systemID
    });
}

function openMarket(targetID) {
    console.warn("299 - openMarket")
    $.ajax({
        type: "POST",
        url: "/esi/ui/market/"+targetID
    });
}

/* Pilot Search */
function openSearch() {
    document.getElementById("pilotSearchOverlay").style.display = "block";
    $(".navbar").attr("style", "display: none !important;");
    $("#pilotSearchName").focus();
}

function closeSearch() {
    document.getElementById("pilotSearchOverlay").style.display = "none";
    $(".navbar").removeAttr("style");
}

//Action the search
$(document).ready(function(){
    $("#searchForm").submit(function(e){
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/search",
            data: $('#searchForm').serialize()
        }).done(function(data){
            if(data.url) {
                window.location.assign(data.url);
            }
        }).fail(function(data){
            $("#pilotSearchName").val('').attr("placeholder", data.responseText).focus();
            $("#searchButton").empty().append('<i class="fa fa-search"></i>');           
        });
    });
});

$(document).ready(function(){
    $("#bannerMessage").submit(function(e){
        e.preventDefault();
    })
})

/* Tooltips + Navbar */
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

function sideNav() {
    $.ajax({
        type: "POST",
        url: "/internal-api/account/navbar",
    }).fail(function(err){
        console.log('Error updating side bar: ' + err);
    });
}

/*  WAITLIST FC MANAGE
* 
* > Waitlist functions (Invites, Removals, Alarms)
* > Waitlist Admin (Comp Window, Clear all, Close)
* > Waitlist Tables (Pilots in Fleet)
*/

/* Waitlist functions */
function invitePilot(characterID, fleetID) {
    $.ajax({
        type: "POST",
        url: "/commander/admin/invite/" + characterID + "/" + fleetID
    }).done(function() {
        $("#row-"+characterID).removeClass().addClass("invite-sent");        
        updateWlCounters();
    }).fail(function(text) {
        $("#row-"+characterID).removeClass().addClass("invite-failed");
        $("#" + characterID + "-status").text(text.responseText);
    });
}

function removePilot(characterID) {
    $.ajax({
        type: "POST",
        url: "/commander/admin/remove/" + characterID
    }).done(function(){
        //Colour and remove row. Then subtract the waitlist count by 1
        $("#row-"+characterID).removeClass().addClass("invite-failed");
        setTimeout(function() {
            $("#row-"+characterID).remove();
            updateWlCounters();
        }, 5000)
    });

    
}

function alarmUser(targetid, fleetid) {
    $.ajax({
        type: "POST",
        url: "/commander/admin/alarm/" + targetid + "/" + fleetid,
        datatype: "HTML",
        success: function(data) {
            setTimeout(function () {
                $("#row-"+targetid).removeClass().addClass("invite-pending");
                }, 0);
                setTimeout(function () {
                $("#row-"+targetid).removeClass();
                }, 2500);	
        }
    }).fail(function(err) {
        console.log("Faied to alarm user: ", err);
    });
}

//Updates the Waitlist/Alt Waitlist counter
function updateWlCounters(){
    $("#mainsWaitingCount").text($("#waitlistTable tr").length);
    $("#altsWaitingCount").text($("#altWaitlistTable tr").length);
}