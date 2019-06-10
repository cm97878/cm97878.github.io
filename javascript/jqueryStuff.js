$(document).ready(function() {
    /* #region init stuff */
    $(".held").hide();
    $("#leftMapPanelInnerDiv").hide();
    $("#rightMapPanelInnerDiv").hide();
    $("#leftMapPanelInnerDivSpecial").show();
    $("#rightMapPanelInnerDivSpecial").show();
    //$("#storyButton").hide();
    $("#ascensionButton").hide();
    $("#buttonClone").hide();
    //nodes.get("home");
    //set default to be home here
    $("#buttonRelease").hide();
    $("#consumeReleaseInner").hide();
    $("#soulBeads").hide();
    $("#soulBeadsBeta").hide();

    /* #endregion */

    $("#startButton").click(function () {
        $("#initialScreen").hide();
    });

    var player = {
        //misc shit. either move from player or run function to set all these active on load
        ascension: 1,
        currentArea: "",
        fightingArea: "",
        fighting: false,
        fightingID: "",
        activeMainTab: "soulTab",
        activeLowerTab: "soulMapTab",
        activeRightMapTab: "descTab",
        consuming: false,

        //stats
        attack: 5,
        attackSpeed: 100,
        defense: 0,
        health: 20,
        consumeRate: 1,
    
        stats: {
            //Run-specific things
            runTotalS: 0,
            runTotalsD: 0,
            runTotalsL: 0,
        
            //All-time specific things
            allTotalS: 0,
            allTotalD: 0,
            allTotalL: 0,
        },
    
        //Currently owned things
        currentSoul: {
            soulTotal: 0,
            soulDark: 0,
            soulLight: 0,
        },
/*         story: {
            start: true,
            soulStory1: true,
        }, */

        upgrades: {
            h0: {
                unlocked: true,
            },
            h1: {
                unlocked: false,
                cost: 1,
            },
            h2: {
                unlocked: false,
                cost: 1000,
            },
        },
    };

    /* #region gameloop */

    var loopCounter = 0;
    function gLoop() {
        updateSoul();
        if(loopCounter >= 10) {
            updatePlayerStats();
            updateUpgradeDetails();
            loopCounter = 0;
        }
        loopCounter++;
    }
    var gameLoop = setInterval(gLoop, 50);

    function updateSoul() {
        $("#soulCount").html(formatNumber(player.currentSoul.soulTotal));
    }

    function updateUpgradeDetails() {
        $("#soulMultiUpgradeSpan").html(formatNumber(soulMulti()));
    }

    function updatePlayerStats() {
        if(!player.fighting) {
            $("#pLowerAtk").html(formatNumber(getAttack()));
            $("#pLowerDef").html(formatNumber(getDefense()));
            $("#playerHealthLabel").html(formatNumber(getHealth()) + " <b>|</b> " + formatNumber(getHealth()));
            $("#playerHealthBar").css("width", "100%");
        }
    }

    /* #endregion */

    /* #region getters */

    function getAttack() {
        var atk = player.attack;
        if(player.upgrades.h2.unlocked) {
            atk += 5;
        }
        if(player.upgrades.h1.unlocked) {
            atk *= soulMulti();
        }
        return atk;
    }

    function getAttackSpeed() {
        var spd = player.attackSpeed;
        return spd;
    }

    function getDefense() {
        var def = player.defense;
        return def;
    }

    function getHealth() {
        var hp = player.health;
        return hp;
    }

    function getConsumeSpeed() {
        var consSpeed = player.consumeRate;

        consSpeed *= .01;
        return consSpeed;
    }

    function soulMulti() {
        if(player.currentSoul.soulTotal < 10) {
            return 1;
        }
        else {
            return Math.log10(player.currentSoul.soulTotal);
        }
    }

    /* #endregion */

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

    //Have an activeTab variable, change active tab
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

    /* #region combat stuff */

    var combatLogList = [];
    var tableColorState = 0;
    function updateCombatLog() {
        if(combatLogList.length > 70) {
            combatLogList.pop();
        }

        var atBottom = false;
        var lt = $("#logTab");

        if (lt[0].scrollHeight - lt.scrollTop() == lt.height())
        {
            atBottom = true;
        }

        $("#logTable").html("");
        for(var i = combatLogList.length-1; i >= 0; i--) {
            $("#logTable").append("<tr><td>" + combatLogList[i] + "</td></tr>");
        }

        if(tableColorState == 0) {
            $("#logTable tr:nth-child(even)").css("background-color", "rgb(45, 45, 45)");
            $("#logTable tr:nth-child(odd)").css("background-color", "rgb(35, 35, 35)");
        }
        else {
            $("#logTable tr:nth-child(odd)").css("background-color", "rgb(45, 45, 45)");
            $("#logTable tr:nth-child(even)").css("background-color", "rgb(35, 35, 35)");
        }

        if(atBottom) {
            lt.scrollTop(lt[0].scrollHeight);
        }
    }
    
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
        endFight("flee", enemies[player.fightingID]);
    });

    var consumeLoop;

    $("#buttonConsume, #soulBox").click(function() {
        if(!player.consuming) {
            consume(enemies[player.fightingID]);
        }
    });

    $("#buttonConsume, #soulBox").mouseenter(function() {
        $("#soulBox").css("box-shadow", "inset 0px 0px 15px 0px black");
    });
    $("#buttonConsume, #soulBox").mouseleave(function() {
        if(!player.consuming) {
            $("#soulBox").css("box-shadow", "");
        }
    })


    $("#buttonRelease").click(function() {
        clearInterval(consumeLoop);
        $("#buttonRelease").hide();
        $("#consumeReleaseInner").hide();
        $("#buttonFight").show();
        updateFightDetails("init");
        player.consuming = false;

        var combatText = "";
        if(enemies[player.fightingID].named) {
            combatText = "<b><span style=\"color: white;\">You've released " + enemies[player.fightingID].name + ", letting them scurry away with their life.</span></b>";
        }
        else {
            combatText = "<b><span style=\"color: white;\">You've released the " + enemies[player.fightingID].name.toLowerCase() + ", letting it scurry away alive.</span></b>";
        }
        combatLogList.unshift(combatText);
        updateCombatLog();

        player.fighting = false;
        player.fightingID = "";
        updatePlayerStats();
        if(player.fightingArea != player.currentArea) {
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

        var combatText = "";
        if(enemy.named) {
            combatText = "<b><span style=\"color: rgb(0, 140, 255);\">You have encountered " + enemy.name + ".</b></span>";
        }
        else {
            if(isVowel(enemy.name.charAt(0))) {
                combatText = "<b><span style=\"color: rgb(0, 140, 255);\">You have encountered an " + enemy.name.toLowerCase() + ".</b></span>";
            }
            else {
                combatText = "<b><span style=\"color: rgb(0, 140, 255);\">You have encountered a " + enemy.name.toLowerCase() + ".</b></span>";
            }
        }
        combatLogList.unshift(combatText);
        updateCombatLog();

        player.fightingID = enemy.id;
        $("#consumeReleaseInner").hide();
        $("#buttonFlee").show();
        player.fighting = true;
        var pCurrHp = getHealth();
        var pHpRatio = "100%";
        var eHpRatio = "100%";
        var eCurrHp = enemy.health;
        var pDmg;
        var eDmg;
        var turnTimer = 0;
        var pHp = getHealth();
        var pAtk = getAttack();
        var pAtkSpd = getAttackSpeed();
        var pDef = getDefense();

        function fLoop() {
            if(turnTimer % pAtkSpd == 0 && turnTimer != 0) {
                pDmg = pAtk - enemy.defense;
                if(pDmg < 0) {
                    pDmg = 0;
                }
                eCurrHp -= pDmg;
                eHpRatio = ((eCurrHp/enemy.health)*100) + "%";
                $("#enemyHealthBar").css("width", eHpRatio);
                $("#enemyHealthLabel").html(formatNumber(eCurrHp) + " <b>|</b> " + formatNumber(enemy.health));

                if(enemy.named) {
                    combatText = "You strike " + enemy.name + " for " + formatNumber(pDmg) + " damage.";
                }
                else {
                    //add in special text instead of scratches
                    combatText = "You strike the " + enemy.name.toLowerCase() + " for " + formatNumber(pDmg) + " damage."; 
                    
                }
                combatLogList.unshift(combatText);
                updateCombatLog();

                if(eCurrHp <= 0) {
                    endFight("won", enemy);
                }
            }
            if (turnTimer % enemy.attackSpeed == 0 && turnTimer != 0 && !(eCurrHp <= 0)) {
                eDmg = enemy.attack - pDef;
                if(eDmg < 0) {
                    eDmg = 0;
                }
                pCurrHp -= eDmg;
                pHpRatio = ((pCurrHp/pHp)*100) + "%";
                $("#playerHealthBar").css("width", pHpRatio);
                $("#playerHealthLabel").html(formatNumber(pCurrHp) + " <b>|</b> " + formatNumber(pHp));
                
                if(enemy.named) {
                    combatText = enemy.name + " combat text put it here bitch " + formatNumber(eDmg) + " damage.";
                }
                else {
                    //add in special text instead of scratches
                    combatText = "The " + enemy.name.toLowerCase() + " scratches you for " + formatNumber(eDmg) + " damage."; 
                    
                }
                combatLogList.unshift(combatText);
                updateCombatLog();

                if(pCurrHp <= 0) {
                    endFight("lost", enemy);
                }
            }
            turnTimer += 1;
        }
        fightLoop = setInterval(fLoop, 10);
    }

    function endFight(reason, enemy) {
        clearInterval(fightLoop);
        $("#buttonFlee").hide();
        var combatText = "";
        
        if(reason == "flee") {
            player.fightingID = "";
            updateFightDetails("init");
            $("#buttonFight").show();
            player.fighting = false;
            updatePlayerStats();
            
            if(enemy.named) {
                combatText = "<b><span style=\"color: rgb(255, 166, 0);\">You've fled from " + enemy.name + ".</span></b>";
            }
            else {
                combatText = "<b><span style=\"color: rgb(255, 166, 0);\">You've fled from the " + enemy.name.toLowerCase() + ".</span></b>";
            }
            combatLogList.unshift(combatText);
            updateCombatLog();
        }
        if(reason == "won") {
            $("#soulBox").css("width", "100%");
            $("#soulBox").css("height", "100%");
            $("#consumeReleaseInner").show();
            $("#buttonRelease").show();
            $("#buttonConsume").show();

            if(enemy.named) {
                combatText = "<b><span style=\"color: rgb(21, 180, 35);\">You've defeated " + enemy.name + ".</span></b>";
            }
            else {
                combatText = "<b><span style=\"color: rgb(21, 180, 35);\">You've defeated the " + enemy.name.toLowerCase() + ".</span></b>";
            }
            combatLogList.unshift(combatText);
            updateCombatLog();

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
            else if (!currArea.details.mastered) {
                currArea.details.mastered = true;
                $("#nextAreaUnlocker").hide();
                unlockNextArea();
            }
        }
        if(reason == "lost") {
            updateFightDetails("init");
            player.fightingID = "";

            if(enemy.named) {
                combatText = "<b><span style=\"color: rgb(249, 46, 46);\">" + enemy.name + " has defeated you.</span></b>";
            }
            else {
                combatText = "<b><span style=\"color: rgb(249, 46, 46);\">The " + enemy.name.toLowerCase() + " has defeated you.</span></b>";
            }
            combatLogList.unshift(combatText);
            updateCombatLog();

            $("#buttonFight").show();
            player.fighting = false;
            updatePlayerStats();
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
        player.consuming = true;
        player.fighting = false;
        var totalSoul = enemy.soul;
        var remainingSoul = enemy.soul;
        var spd = getConsumeSpeed();
        var ratio;
        
        var combatText = "";
        if(enemy.named) {
            combatText = "You've begun to consume " + enemy.name + ".";
        }
        else {
            combatText = "You've begun to consume the " + enemy.name + ".";
        }
        combatLogList.unshift(combatText);
        updateCombatLog();

        function cLoop() {
            if ((remainingSoul - spd) <= 0) {
                addSoul(remainingSoul, false);
                addSoul(enemy.soul * 5, true);
                $("#soulBox").css("width", "0%");
                $("#soulBox").css("height", "0%");
                $("#soulBox").css("box-shadow", "");
                $("#buttonRelease").hide();
                $("#consumeReleaseInner").hide();
                $("#buttonFight").show();
                clearInterval(consumeLoop);
                player.fightingID = "";
                updatePlayerStats();
                player.consuming = false;
                
                if(enemy.named) {
                    combatText = "<b><span style=\"color: rgb(100,100,100);\">You've fully consumed " + enemy.name + ".</span></b>";
                }
                else {
                    combatText = "<b><span style=\"color: rgb(100,100,100);\">You've fully consumed the " + enemy.name.toLowerCase() + ".</span></b>";
                }
                combatLogList.unshift(combatText);
                updateCombatLog();

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
                remainingSoul -= spd;
                ratio = ((remainingSoul/totalSoul)*100) + "%";
                addSoul(spd, false);
                $("#soulBox").css("width", ratio);
                $("#soulBox").css("height", ratio);
            }

        }
        consumeLoop = setInterval(cLoop, 10);
    }

    /* #endregion */
    
    function addSoul(amnt, addDS) {
        player.currentSoul.soulTotal += amnt; //adds untyped soul to current, run, and alltime
        player.stats.runTotalS += amnt;
        player.stats.allTotalS += amnt;
    
        if(addDS) {
            player.currentSoul.soulDark += amnt; //adds dark soul
            player.stats.runTotalD += amnt;
            player.stats.allTotalD += amnt;
        }
        else {
            player.currentSoul.soulLight += amnt; //adds light soul
            player.stats.runTotalL += amnt;
            player.stats.allTotalL += amnt;
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

/*     $(".storyTabButtons").click(function() {
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
    }); */

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
        player.currentSoul.soulTotal -= x;
        updateSoul();
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

    
    function isVowel(x) {
        return /[aeiouAEIOU]/.test(x);
    }


    function save() {
        var x = nodes.get();
        var savedNodes = [{id: x[0].id, details: x[0].details}];
        for(var i = 1; i < x.length; i++) {
            savedNodes.push({id: x[i].id, details: x[i].details});
        }
        localStorage.setItem('nodes', savedNodes);

    }
    $("#saveButton").click(save());

    $("#clearButton").click(function () {
        localStorage.removeItem('nodes');
    });

    /* #region map setup */
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
        $(".popupOptionsDiv").hide();
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
    /* #endregion */

    /* #region vue stuff */
    var mainVue = new Vue({ 
        el: '#upgradeGroupHome',
        data: {
            h0: player.upgrades.h0,
            h1: player.upgrades.h1,
            h2: player.upgrades.h2,
            soul: player.currentSoul
        }
    });

    /* 
    if(!upgrade.unlocked && !upgrade.buyable && upgrade.cost < player.soul) {
        upgrade.buyable = true;
        button.disabled = false;
    }
    */

    /* #endregion */

    /* #region upgrade buttons */

    $("#homeUpgrade1Button").click(function () {
        player.upgrades.h1.unlocked = true;
        removeSoul(player.upgrades.h1.cost);
    });

    $("#homeUpgrade2Button").click(function () {
        player.upgrades.h2.unlocked = true;
        removeSoul(player.upgrades.h2.cost);
    });

    /* #endregion */

});