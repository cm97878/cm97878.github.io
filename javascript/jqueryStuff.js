$(document).ready(function() {

    $(".held").hide();
    $("#leftMapPanelInnerDiv").hide();
    $("#rightMapPanelInnerDiv").hide();
    $("#leftMapPanelInnerDivSpecial").show();
    $("#rightMapPanelInnerDivSpecial").show();
    $("#storyButton").hide();
    $("#ascensionButton").hide();
    $("#buttonClone").hide();
    //nodes.get("home");
    //set default to be home here

    $("#buttonRelease").hide();
    $("#consumeReleaseInner").hide();

    $("#startButton").click(function () {
        $("#initialScreen").hide();
    });
    

    var loopCounter = 0;

    function gLoop() {
        updateSoul();
        if(loopCounter >=10) {
            updatePlayerStats();
            loopCounter = 0;
        }
        loopCounter++;
    }
    var gameLoop = setInterval(gLoop, 50);

    function updateSoul() {
        $("#soulCount").html(formatNumber(player.soulTotal));
    }

    function updatePlayerStats() {
        $("#pLowerAtk").html(formatNumber((player.attack * soulMulti())) + "");
        $("#pLowerDef").html(formatNumber(player.defense));
        if(!player.fighting) {
            $("#playerHealthLabel").html(formatNumber(player.health) + " <b>|</b> " + formatNumber(player.health));
            $("#playerHealthBar").css("width", "100%");
        }
    }

    //Hold shift to change texts
    $(document).bind('keydown',function(e) {
        if(e.keyCode == 16) {
           $(".unheld").hide();
           $(".held").show();
        }
    });
    $(document).bind('keyup',function(e) {
        if(e.keyCode == 16) {
           $(".unheld").show();
           $(".held").hide();
        }
    });

    //Could optimize this better. Have an activeTab variable, change active tab. Probably a good idea to do this.
    function updateTailsTabs() { //Refresh the tabs for the ascension thing
        $(".tailsInnerPanel").each(function() {
            if($(this).css("display") != "none") //If this tab is visible
            {
                $(this).css("display", "none"); //Hide it
                var x = $(this).attr("id").substring(0, 16); //Get the id *except* the ascension value
                $("#" + x + player.ascension).css("display", "inline-block"); //display id + ascension value
            }
        });
    }

    //Ascension effects
    $("#ascensionButton").click(function () {
        if(player.ascension == 1) {
            player.ascension = 2; //set to ascended
            $("#ascensionButton").addClass("ascend"); //Glow ascend
            $(".tailsButtons").each(function () {
                $(this).addClass("ascendButtons"); //glow others
            });
        }
        else { //Else unglow, unascend
            player.ascension = 1;
            $("#ascensionButton").removeClass("ascend");
            $(".tailsButtons").each(function () {
                $(this).removeClass("ascendButtons");
            });
        }
        updateTailsTabs(); //Change tabs if needed
    });

    $(".tailsButtons").click(function() {
        var buttonNum = $(this).attr("id").charAt(11); //Get button id
        var tabNum = "#tailsInnerPanel" + buttonNum + player.ascension; //ascension=1 if unascended, 2 if ascended

        if($(tabNum).css("display") != "none") { //if the chosen tab is visible, hide it
            $(tabNum).css("display", "none");
        }
        else {
            $(".tailsInnerPanel").each(function () { //Else, hide each
                $(this).css("display", "none");
            });
    
            $(tabNum).css("display", "inline-block"); //Show chosen one
        }
    });

    $("#buttonFight").click(function() {
        player.fighting = false;
        if(player.fightingArea != player.currentArea) {
            updatePlayerStats();
            $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
        }
        player.fightingArea = player.currentArea;
        $("#buttonRelease").hide();
        clearInterval(fightLoop);
        clearInterval(consumeLoop);
        fight(getEnemy(player.fightingArea));
    });

    $("#buttonFlee").click(function() {
        player.fighting = false;
        if(player.fightingArea != player.currentArea) {
            updatePlayerStats();
            if(nodes.get(player.currentArea).shape != "hexagon") {
                $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
            }
            else {
                //Put unique code here
                $("#leftMapPanelInnerDiv").hide();
                $("#leftMapPanelInnerDivSpecial").show();
            }
        }
        endFight("flee");
    });

    var consumeLoop;

    $("#buttonConsume").click(function() {
        consume(enemies[player.fightingID]);
    });

    $("#buttonRelease").click(function() {
        clearInterval(consumeLoop);
        $("#buttonRelease").hide();
        $("#consumeReleaseInner").hide();
        $("#buttonFight").show();
        updateFightDetails("init");
        player.fighting = false;
        if(player.fightingArea != player.currentArea) {
            updatePlayerStats();
            if(nodes.get(player.currentArea).shape != "hexagon") {
                $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
            }
            else {
                //Put unique code here
                $("#leftMapPanelInnerDiv").hide();
                $("#leftMapPanelInnerDivSpecial").show();
            }
        }
    });

    function getEnemy(nodeID) {
        currentNode = nodes.get(nodeID);
        chances = currentNode.details.chance;
        var enemy;

        var randomNumber = Math.floor((Math.random() * currentNode.details.sumOdds) + 1);
        currChance = 0;

        for(var i = 0; i < chances.length; i++) {
            currChance += chances[i];
            if(randomNumber <= currChance) {
                enemy = updateFightDetails(currentNode.details.enemies[i]);
                break;
            }
        }
        return enemy;
    }

    function updateFightDetails(enemyID) {
        if(enemyID == "init") {
            $("#eUpperAtk").html("-");
            $("#eUpperDef").html("-");
            $("#enemyHealthLabel").html("-");
            $("#enemyHealthBar").css("width", "0%");
            $("#enemyName").html("---");
        }
        else {
            var enemy = enemies[enemyID];
            $("#eUpperAtk").html(formatNumber(enemy.attack));
            $("#eUpperDef").html(formatNumber(enemy.defense));
            $("#enemyHealthLabel").html(formatNumber(enemy.health) + " <b>|</b> " + formatNumber(enemy.health));
            $("#enemyHealthBar").css("width", "100%");
            $("#enemyName").html(enemy.name);
            return enemy;
        }
    }

    var fightLoop;

    function fight(enemy) {
        if(player.fightingArea == player.currentArea) {
            $("#buttonFight").hide();
        }
        $("#consumeReleaseInner").hide();
        $("#buttonFlee").show();
        player.fighting = true;
        var pCurrHp = player.health;
        var pHpRatio = "100%";
        var eHpRatio = "100%";
        var eCurrHp = enemy.health;
        var pDmg;
        var eDmg;

        function fLoop() {
            pDmg = (player.attack * soulMulti()) - enemy.defense;
            if(pDmg < 0) {
                pDmg = 0;
            }
            eCurrHp -= pDmg;
            eHpRatio = ((eCurrHp/enemy.health)*100) + "%";
            $("#enemyHealthBar").css("width", eHpRatio);
            $("#enemyHealthLabel").html(formatNumber(eCurrHp) + " <b>|</b> " + formatNumber(enemy.health));
            if(eCurrHp <= 0) {
                endFight("won", enemy);
            }
            else {
                eDmg = enemy.attack - player.defense;
                if(eDmg < 0) {
                    eDmg = 0;
                }
                pCurrHp -= eDmg;
                pHpRatio = ((pCurrHp/player.health)*100) + "%";
                $("#playerHealthBar").css("width", pHpRatio);
                $("#playerHealthLabel").html(formatNumber(pCurrHp) + " <b>|</b> " + formatNumber(player.health));
                if(pCurrHp <= 0) {
                    endFight("lost", enemy);
                }
            }
        }
        fightLoop = setInterval(fLoop, 1000);
    }

    function endFight(reason, enemy) {
        clearInterval(fightLoop);
        $("#playerHealthBar").css("width", "100%");
        $("#playerHealthLabel").html(formatNumber(player.health) + " <b>|</b> " + formatNumber(player.health));
        $("#buttonFlee").hide();
        
        if(reason == "flee") {
            updateFightDetails("init");
            $("#buttonFight").show();
            player.fighting = false;
        }
        if(reason == "won") {
            $("#soulBox").css("width", "100%");
            $("#soulBox").css("height", "100%");
            $("#consumeReleaseInner").show();
            $("#buttonRelease").show();
            $("#buttonConsume").show();
            player.fightingID = enemy.id;
            if($("#autofight").is(":checked")) {
                consume(enemies[player.fightingID]);
            }

            var currArea = nodes.get(player.fightingArea);
            
            if((currArea.details.killed+1) < currArea.details.toKill) {
                currArea.details.killed += 1;
                if(player.currentArea == player.fightingArea) {
                    $("#descTabEnemiesKilled").html(currArea.details.killed + "/" + currArea.details.toKill);
                    var ratio = ((currArea.details.killed/currArea.details.toKill)*100) + "%";
                    $("#descTabBar").css("width", ratio);
                }
            }
            else {
                currArea.details.mastered = true;
                $("#nextAreaUnlocker").hide();
                unlockNextArea();
            }
        }
        if(reason == "lost") {
            updateFightDetails("init");
            console.log("player lost");
            $("#buttonFight").show();
            player.fighting = false;
            if(player.fightingArea != player.currentArea) {
                updatePlayerStats();
                if(nodes.get(player.currentArea).shape != "hexagon") {
                    $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
                }
                else {
                    //Put unique node code here
                    $("#leftMapPanelInnerDiv").hide();
                    $("#leftMapPanelInnerDivSpecial").show();
                }
            }
        }
    }

    function consume(enemy) {
        $("#buttonConsume").hide();
        var totalSoul = enemy.soul;
        var remainingSoul = enemy.soul;
        var speed = player.consumeRate * .01;
        var ratio;

        function cLoop() {
            if ((remainingSoul - speed) <= 0) {
                addSoul(remainingSoul, 2);
                addSoul(enemy.soul * 5, 1);
                $("#soulBox").css("width", "0%");
                $("#soulBox").css("height", "0%");
                $("#buttonRelease").hide();
                $("#consumeReleaseInner").hide();
                $("#buttonFight").show();
                clearInterval(consumeLoop);
                player.fighting = false;

                if($("#autofight").is(":checked")) {
                    fight(getEnemy(player.fightingArea));
                }
                else {
                    player.fighting = false;
                    if(player.fightingArea != player.currentArea) {
                        updatePlayerStats();
                        if(nodes.get(player.currentArea).shape != "hexagon") {
                            $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
                        }
                        else {
                            //Put unique node code here
                            $("#leftMapPanelInnerDiv").hide();
                            $("#leftMapPanelInnerDivSpecial").show();
                            
                        }
                    }
                }
            }
            else {
                remainingSoul -= speed;
                ratio = ((remainingSoul/totalSoul)*100) + "%";
                addSoul(speed, 2);
                $("#soulBox").css("width", ratio);
                $("#soulBox").css("height", ratio);
            }

        }
        consumeLoop = setInterval(cLoop, 10);
    }
    
    function addSoul(amnt, type) {
        player.soulTotal += amnt; //adds untyped soul to current, run, and alltime
        player.runTotalS += amnt;
        player.allTotalS += amnt;
    
        if(type == 1) {
            player.soulDark += amnt; //adds dark soul
            player.runTotalD += amnt;
            player.allTotalD += amnt;
        }
        else {
            player.soulLight += amnt; //adds light soul
            player.runTotalL += amnt;
            player.allTotalL += amnt;
        }
    }

    function updateRightPanel() {
        var node = nodes.get(player.currentArea);
        $("#descTabText").html(node.details.description);
        if(!node.details.mastered) {
            $("#nextAreaUnlocker").show();
            $("#descTabEnemiesKilled").html(node.details.killed + "/" + node.details.toKill);
            var ratio = ((node.details.killed/node.details.toKill)*100) + "%";
            $("#descTabBar").css("width", ratio);
        }
        else {
            $("#nextAreaUnlocker").hide();
        }
    }

    function unlockNextArea() {
        var node = nodes.get(player.fightingArea);
        if(!(node.details.toUnlock == null)) {
            console.log(player.fightingArea);
            for(var i = 0; i < node.details.toUnlock.length; i++) {
                nodes.update({id: node.details.toUnlock[i], hidden: false});
                console.log("showed " + node.details.toUnlock[i]);
            }
        }
    }


    //fix these. make individual .click functions for each button.
    $(".topButtons").click(function() {
        var tabname = $(this).attr("id");
        tabname = tabname.substring(0, (tabname.length - 6));

        $(".mainPaneTab").each(function() {
            if($(this).attr("id") == (tabname + "Tab")) {
                $(this).css("display","block");
            }
            else {
                $(this).css("display","none");
            }
        });
    });

    $(".lowerButtons").click(function() {
        var tabname = $(this).attr("id");
        tabname = tabname.substring(0, (tabname.length - 6));

        $(".soulTabPane").each(function() {
            if($(this).attr("id") == (tabname + "Tab")) {
                $(this).css("display","block");
            }
            else {
                $(this).css("display","none");
            }
        });
    });

    $(".storyTabButtons").click(function() {
        var tabname = $(this).attr("id");
        tabname = tabname.substring(0, (tabname.length - 6));

        $(".storyTabCategories").each(function() {
            if($(this).attr("id") == (tabname + "Cat")) {
                $(this).css("display","block");
            }
            else {
                $(this).css("display","none");
            }
        });
    });

    $("#buttonDesc").click(function() {
        if(player.activeRightMapTab != "descTab") {
            $("#"+player.activeRightMapTab).hide();
            $("#descTab").show();
            player.activeRightMapTab = "descTab";
            $("#logOptionsButton").hide();
        }
    });

    $("#buttonLog").click(function() {
        if(player.activeRightMapTab != "logTab") {
            $("#"+player.activeRightMapTab).hide();
            $("#logTab").show();
            player.activeRightMapTab = "logTab";
            $("#logOptionsButton").show();
        }
    });

    $("#buttonClone").click(function() {
        if(player.activeRightMapTab != "cloneTab") {
            $("#"+player.activeRightMapTab).hide();
            $("#cloneTab").show();
            player.activeRightMapTab = "cloneTab";
            $("#logOptionsButton").hide();
        }
    });

    $("#logOptionsButton").click(function() {
        if($("#logOptionsDiv").is(":visible")) {
            $("#logOptionsDiv").hide();
            logOptionsTab = false;
        }
        else {
            $("#logOptionsDiv").show();
            logOptionsTab = true;
            openOptionsTab = "logOptionsDiv";
        }
    });

    $(document).mouseup(function(e) 
    {
        if(logOptionsTab) {
            switch(openOptionsTab) {
                case "logOptionsDiv":
                    var container = $("#logOptionsDiv");
                    if (!$("#logOptionsButton").is(e.target) && !container.is(e.target) && container.has(e.target).length === 0)
                    {
                        container.hide();
                        logOptionsTab = false;
                    }
                    break;
            }
        }
    });
    
    logOptionsTab = false;
    openOptionsTab = "";

    function removeSoul(x) {
        player.soulTotal -= x;
    }

    function soulMulti() {
        if(player.soulTotal < 10) {
            return 1;
        }
        else {
            return Math.log10(player.soulTotal);
        }
    }


    function formatNumber(n) {
        if(n < 1000) {
            if(n == math.floor(n)) {
                return math.format(n, {notation: 'fixed', precision: 0});
            }
            return math.format(n, {notation: 'fixed', precision: 1}).replace("+","");
        }
        else {
            return math.format(n, {notation: 'exponential', precision: 2}).replace("+","");
        }
    }

    var player = {
        //misc shit. either move from player or run function to set all these active
        ascension: 1,
        stop: "",
        currentArea: "",
        fightingArea: "",
        fighting: false,
        fightingID: "",
        activeMainTab: "soulTab",
        activeLowerTab: "soulMapTab",
        activeRightMapTab: "descTab",

        //stats
        attack: 5,
        defense: 0,
        health: 20,
        consumeRate: 1,
    
        //Run-specific things
        runTotalS: 0,
        runTotalsD: 0,
        runTotalsL: 0,
    
        //All-time specific things
        allTotalS: 0,
        allTotalD: 0,
        allTotalL: 0,
    
        //Currently owned things
        soulTotal: 0,
        soulDark: 0,
        soulLight: 0,
    
        story: {
            start: true,
            soulStory1: true,
        },
    };

    function save() {
        var x = nodes.get();
        var savedNodes = [{id: x[0].id, mastered: x[0].details.mastered}];
        for(var i = 1; i < x.length; i++) {
            savedNodes.push({id: x[i].id, mastered: x[i].details.mastered});
        }
        
    }

    //================MAP SETUP================
    var container = document.getElementById('map1');

    var options = {
        groups: {
            forest: {
                color: {
                    background: '#90ee90',
                    border: '#1aa127',
                    highlight: {
                        background: '#43d151',
                        border: '#1aa127',
                    }
                }
            }
        }
    };

    var data = {
        nodes: nodes,
        edges: edges
    };

    var network = new vis.Network(container, data, options);
    
    network.setOptions({
        nodes: {
            fixed: true,
            physics: false,
            shape: 'dot',
            size: 10,
        }
    });

    network.on("click", function (params) {
        $(".optionsDiv").hide();
        var nodeID = params['nodes']['0'];

        if (nodeID) {
            var clickedNode = nodes.get(nodeID);

            if(!player.fighting) {
                if(clickedNode.shape == "hexagon")
                {
                    $("#leftMapPanelInnerDiv").hide();
                    $("#rightMapPanelInnerDiv").hide();
                    $("#leftMapPanelInnerDivSpecial").show();
                    $("#rightMapPanelInnerDivSpecial").show();
                    if(player.currentArea != nodeID) {
                        player.currentArea = nodeID;
                    }
                }
                else {
                    $("#leftMapPanelInnerDivSpecial").hide();
                    $("#rightMapPanelInnerDivSpecial").hide();
    
                    if(player.currentArea != nodeID) {
                        updateFightDetails("init");
                        player.currentArea = nodeID;
    
                        $(".sidePanelTitle").html("<b>"+clickedNode.details.name+"</b>");
                    }
    
                    $("#leftMapPanelInnerDiv").show();

                    updateRightPanel();
                    $("#rightMapPanelInnerDiv").show();
                }
            }
            else {
                if(clickedNode.shape == "hexagon")
                {
                    $("#rightMapPanelInnerDiv").hide();
                    $("#rightMapPanelInnerDivSpecial").show();
                    if(player.currentArea != nodeID) {
                        player.currentArea = nodeID;
                    }
                }
                else {
                    $("#rightMapPanelInnerDivSpecial").hide();
                    $("#buttonFight").show();
    
                    if(player.currentArea != nodeID) {
                        player.currentArea = nodeID;
    
                        $("#rightSidePanelTitle").html("<b>"+clickedNode.details.name+"</b>");
                    }

                    updateRightPanel();
                    $("#rightMapPanelInnerDiv").show();
                }
            }
        }
    });
    var focusOptions = {
        locked: false,
        animation: false,
        scale: .8,
    }
    network.once("beforeDrawing", function() {
        network.focus('home', focusOptions);
    });

    var nodeList = nodes.getIds();

    for(var i = 0; i < nodeList.length; i++) {
        var currNode = nodes.get(nodeList[i]);
        if(currNode.shape != "hexagon") {
            if(!currNode.details.sumOdds) {
                var x = 0;
                for(var j = 0; j < currNode.details.chance.length; j++) {
                    x += currNode.details.chance[j];
                }
                currNode.details.sumOdds = x;
            }
        }
    }

    $("#centerMap").click(function () {
        network.fit();
    });
    //================MAP SETUP================
});