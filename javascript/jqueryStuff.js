$(document).ready(function() {

    $(".held").hide(); //Hide all the text that shows when shift is held
    $("#leftMapPanelInnerDiv").hide();
    $("#rightMapPanelInnerDiv").hide();
    $("#leftMapPanelInnerDivSpecial").show();
    $("#rightMapPanelInnerDivSpecial").show();
    //nodes.get("home");
    //set default to be home here

    $("#buttonRelease").hide();
    $("#consumeReleaseInner").hide();
    

    var loopCounter = 0;

    function gLoop() {
        checkUpgrades(); //Function below. Updates display of upgrades
        getStoryUpdates(); //Function below. Reveals new story bits.
        updateSoul();
        if(loopCounter >=10) {
            updatePlayerStats();
            loopCounter = 0;
        }
        loopCounter++;
    }
    var gameLoop = setInterval(gLoop, 50); //get that loop goin', boi

    function updateSoul() {
        $("#soulCount").html(formatNumber(player.soulTotal));
    }

    function checkUpgrades() {
        for(var x in player.upgrades) {
            if(player.upgrades.hasOwnProperty(x)) {
                if(player.soulTotal >= player.upgrades[x].cost) {
                    $("#"+player.upgrades[x].id).prop("disabled", false);
                }
                else {
                    $("#"+player.upgrades[x].id).prop("disabled", true);
                }
            }
        }
    }

    function updatePlayerStats() {
        $("#pLowerAtk").html(formatNumber((player.attack * soulMulti())) + "");
        $("#pLowerDef").html(formatNumber(player.defense));
        if(!player.fighting) {
            $("#playerHealthLabel").html(formatNumber(player.health) + " <b>|</b> " + formatNumber(player.health));
            $("#playerHealthBar").css("width", "100%");
        }
        //SET VARIABLE FOR FIGHTING SO HEALTH ISNT UPDATED
    }

    var story = { 
        //Story-unlocking will go here. All story text will be in story tab, inside of individual <span> tags
        storyIntro: {
            category: "Tails", //Category. Must be capitalized, fills in tab and button name both
            position: "st1", //id of <span> tag to be unhidden. ss1 stands for "story soul 1". tails 3 would be "st3".
        },
        soul100: {
            category: "Soul",
            position: "ss1",
        },
    };

    function getStoryUpdates() {
        if(player.story.start) { //This'd be the first time the game started. For now it was making sure this code worked.
            newStoryUpdate(story.storyIntro); 
            player.story.start = false;
        }
        if(player.story.soulStory1 && player.soulTotal >= 100) {
            newStoryUpdate(story.soul100);
            player.story.soulStory1 = false;
        }
    } //How the function will be called. Not sure if this is the method I want.
      //May have it be more specific, only triggering once on certain things. Probably will, as this method will quickly bloat.

    function newStoryUpdate(storyObj) {
        $("#storyButton").addClass("newStry"); //Glow the story button
        $("#story"+storyObj.category+"Button").addClass("newStry"); //glow the sub-tab button
        $("#"+storyObj.position).css("display", "inline-block");
    }

    $("#storyButton").click(function() {
        $(".storyTabCategories").each(function() {
            //Essentially, this is: If story tab clicked and visible tab is soul, remove glow from soul.
            //Function of this is to immediately remove the glow from the active tab, if it's there
            //If a story condition is met while in soul tab, glow will remain until button is clicked, but im not sure how best
            //to counteract that.
            if($(this).css("display") != "none") {
                var tabname = $(this).attr("id");
                tabname = tabname.substring(0, (tabname.length - 3));
                $("#"+tabname+"Button").removeClass("newStry");
            }
        });
        $(this).removeClass("newStry");
    });

    $(".storyTabButtons").click(function() {
        $(this).removeClass("newStry"); //Same as above, basically.
    });

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
            $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
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
        player.fighting = false;
        if(player.fightingArea != player.currentArea) {
            updatePlayerStats();
            $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
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
                $("#playerHealthLabel").html(formatNumber(pCurrHp) + " <b>|</b> " + formatNumber(pCurrHp));
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
        }
        if(reason == "lost") {
            updateFightDetails("init");
            console.log("player lost");
            $("#buttonFight").show();
            player.fighting = false;
            if(player.fightingArea != player.currentArea) {
                updatePlayerStats();
                $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
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
                        $(".sidePanelTitle").html("<b>"+nodes.get(player.currentArea).details.name+"</b>");
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
    

/* CONSUME/RELEASE OLD
    $(".buttonConsume").click(function() {
        var targetID = $(this).attr("id").charAt(8); //Which target. soulCons1 -> soulRel1, soulCons2 -> soulRel2, etc
        var bar = "#soulBar" + targetID; //Sets vars as matching target id's
        var rel = "#soulRel" + targetID;
        var cons = "#" + $(this).attr("id");
        var perc = "#barPerc" + targetID;

        var sCurr = 0; //Current soul = 0
        $(this).css("display","none"); //Hide cons
        $(rel).css("display","inline-block"); //Show rel
        $(bar).css("width","100%"); //Fill bar

        var interv = setInterval(consFunc, player.spd); //Set that interval

        function consFunc() {
            if(Number($(bar).css("width").replace(/[^\d\.\-]/g, '')) <= 0 || player.stop == targetID) {
                if(player.stop != targetID) {
                    addSoul(player.cGain, "d");
                }
                $(bar).css("width","0%");
                $(cons).css("display","inline-block");
                $(rel).css("display","none");
                clearInterval(interv);
                player.stop = "";
            }
            else {
                if(player.sRate <= (player.sCap - sCurr)) {
                    addSoul(player.sRate, "l");
                    sCurr += player.sRate;
                }
                else {
                    addSoul((player.sCap - sCurr), "l");
                    sCurr = player.sCap;
                }

                if((1-parseFloat(sCurr/player.sCap)) <= 0) {
                    $(bar).css("width", 0);
                }
                else {
                    $(bar).css("width", (100-parseFloat(sCurr/player.sCap)*100)+"%");
                }
                $(perc).html((parseFloat(player.sCap - sCurr).toFixed(1)) + "/" + player.sCap);
            }
        }
    });

    $(".buttonRelease").click(function() {
        player.stop = $(this).attr("id").charAt(7);
    });
 */
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

    $(".upgrade").click(function() { //Each button has to link to its own cost with its own function assignment
        $(this).attr("data-unlocked", true); //Sets unlocked attribute to true, triggers CSS change
        $(this).prop("disabled", true);
        removeSoul(player.upgrades[$(this).attr("id")].cost);
    });
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
        //misc shit
        ascension: 1,
        stop: "",
        currentArea: "",
        fightingArea: "",
        fighting: false,
        fightingID: "",

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
    
        //Upgrade details
        upgrades: {
            s11: {
                cost: 100,
                id: "s11",
                unlocked: false,
            },
            s21: {
                cost: 5000,
                id: "s21",
                unlocked: false,
            },
        },
        story: {
            start: true,
            soulStory1: true,
        },
    };


    //================MAP SETUP================
    var container = document.getElementById('map1');
    var data = {
        nodes: nodes,
        edges: edges
    };
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
                    $("#rightMapPanelInnerDiv").show();
                }
            }
            else {
                if(clickedNode.shape == "hexagon")
                {
                    $("#rightMapPanelInnerDiv").hide();
                    $("#rightMapPanelInnerDivSpecial").show();
                }
                else {
                    $("#rightMapPanelInnerDivSpecial").hide();
                    $("#buttonFight").show();
    
                    if(player.currentArea != nodeID) {
                        player.currentArea = nodeID;
    
                        $("#rightSidePanelTitle").html("<b>"+clickedNode.details.name+"</b>");
                    }

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
    //================MAP SETUP================
});

    

