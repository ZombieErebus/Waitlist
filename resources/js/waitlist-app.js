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
* > Update fleet info (FC, Backseat, Comms, Type)
* > Waitlist functions (Invites, Removals, Alarms)
* > Waitlist Admin (Comp Window, Clear all, Close)
* > Waitlist Tables (Pilots in Fleet)
*/
function setFC(fleetID) {
    $.ajax({
        type: "POST",
        url: '/commander/'+  fleetID +'/update/commander'
    }).done(function() {
        pollFleetInfo(fleetID)
    }).fail(function(err) {
        console.log("Error updating the backseat: ", err);
    })
}

function setBackseat(fleetID) {
    $.ajax({
        type: "POST",
        url: '/commander/'+ fleetID +'/update/backseat'
    }).done(function() {
        pollFleetInfo(fleetID);
    }).fail(function(err) {
        console.log("Error updating the backseat: ", err);
    })
}

function setCommsChannel(fleetID, commsUrl, commsName) {
    $.ajax({
        type: "POST",
        url: '/commander/'+ fleetID +'/update/comms',
        data: {
            name: commsName,
            url: commsUrl
        }
    }).done(function() {
        pollFleetInfo(fleetID)
    }).fail(function(err) {
        console.log("Error updating comms information: ", err);
    });
}

function setFleetStatus(fleetID, fleetStatus) {
    $.ajax({
        type: "POST",
        url: '/commander/'+ fleetID +'/update/status',
        data: {
            status: fleetStatus
        }
    }).done(function() {
        pollFleetInfo(fleetID)
    }).fail(function(err) {
        console.log("Error updating fleet status: ", err);
    });
}

function setFleetType(fleetID, fleetType) {
    $.ajax({
        type: "POST",
        url: '/commander/'+ fleetID +'/update/type',
        data: {
            type: fleetType
        }
    }).done(function() {
        pollFleetInfo(fleetID)
    }).fail(function(err) {
        console.log("Error updating fleet type: ", err);
    });
}

function pollFleetInfo(fleetID){
    $.ajax({
        type: "POST",
        url: '/commander/'+ fleetID +'/update/info',
        success: function(payload){
            $("#fcBoss").text(payload.fc.name).attr("onclick", "showInfo(" + payload.fc.characterID + ")");
            $("#fcBackseat").text(payload.backseat.name).attr("onclick", "showInfo(" + payload.backseat.characterID + ")")
            $("#status").text(payload.status);
            $("#type").text(payload.type);
            $("#comms").text(payload.comms.name).attr("href", payload.comms.url);
            $("#fleetSystem").text(payload.location.name).attr("onclick", "setWaypoint(" + payload.location.systemID + ")");
        }
    }).fail(function(err){
        console.log("Failed to update the fleet info panel");
    })
}
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


/* Waitlist Tables */
function pollPilotsInFleet(fleetID){
    $.ajax({
        type: "GET",
        url: "/internal-api/fleet/"+ fleetID +"/members"
    }).done(function(data){
        $("#fleetPilotsTable").empty();
        for(var i = 0; i < data.length; i++){
            var html = "<tr id='row-"+data[i].pilot.characterID+"'>";
                    html +="<td>"
                        html += "<img src='https://image.eveonline.com/Character/"+data[i].pilot.characterID+"_64.jpg' style='height:75%' alt='avatar'> "
                    html += "</td>";
                    html += "<td>";
                        html += "<a href='javascript:void(0);' onclick='showInfo("+data[i].pilot.characterID+")'>"+data[i].pilot.name+"</a>";
                        //TODO: Display alt if info is there.  
                    html += "</td>";
                    html += "<td>";
                        html += "<div class='dropdown'>";
                            html += "<button class='btn btn-info btn-sm dropdown-toggle' data-toggle='dropdown' aria-expanded='false' type='button'><i class='fas fa-caret-circle-down' style='margin-right:-50%'></i></button>";
                            html += "<div class='dropdown-menu' role='menu'>";
                                html += "<a class='dropdown-item' href='/commander/"+data[i].pilot.name.replace(' ','-')+"/profile'>View Pilot Profile</a>";
                                html += "<a class='dropdown-item' href='/commander/"+data[i].pilot.name.replace(' ','-')+"/skills'>View Pilot Skills</a>";
                                //TODO: XMPP if info is there
                            html += "</div>";
                        html += "</div>";
                    html += "</td>";
                    html += "<td>";
                        html += "<button class='btn btn-danger btn-sm disabled' onclick='removePilot()'><i class='fa fa-minus'></i></button>";
                    html += "</td>";
                    html += "<td>";
                        html += "<img src='https://image.eveonline.com/Render/"+data[i].activeShip+"_32.png' alt='Active Ship'>";
                    html += "</td>";
                    html += "<td>";
                        //there ships here
                    html += "</td>";
                    html += "<td>";
                        html += "<a href='javascript:void(0);' onclick='setWaypoint("+data[i].system.systemID+")'>"+data[i].system.name+"</a></td>";
                    html += "</td>";
                    html += "<td>"+data[i].joined+"</td>";
                html += "</tr>";

            $("#fleetPilotsTable").prepend(html);
            $("#numMembers").text(data.length);
        }
    }).fail(function(err){
        console.log(err);
    })
}

//Updates the Waitlist/Alt Waitlist counter
function updateWlCounters(){
    $("#mainsWaitingCount").text($("#waitlistTable tr").length);
    $("#altsWaitingCount").text($("#altWaitlistTable tr").length);
}