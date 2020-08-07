let player = {
    currentSoul: {
        //currency
        soulTotal: 0, //should always be sum of next two, may want to remove?
        soulDark: 0,
        soulLight: 0,
        
        //prestige currency
        beadsLight: 0,
        beadsDark: 0,
    },

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
    
    unlocks: {
        //tabs
        tailsUnlocked: false,
        storyUnlocked: false,
        crystalsUnlocked: false,
        mansionUnlocked: false,

        //prestige mechanics
        prestigeLightUnlocked: false,
        prestigeDarkUnlocked: false,
    },

    areaInfo: {
        special: {
            home: {
                title: "Home",
                description: "test",
            },
        },
        general: {
            trailNorth1: {
                title: "Forest Trail",
                description: "A worn trail winds east away through the underbrush from the den nestled in the cliffside.\
                It seems well-traveled by the smaller creatures of the forest, and a good place to hunt.",
                enemies: ["redSquirrel", "blackSquirrel"], //Array of enemy names that appear
                chance: [20, 5], //%chance for each, could combine this + above into objects?
                toKill: 1, //# needed to kill to unlock connected nodes
                killed: 0, //# killed
                mastered: false, //i think this was meant to be a check of whether connected nodes have been unlocked or not but can just do killed==toKill?
                toUnlock: ["trailNorth2"], //nodes unlocked when completed
            },
            trailNorth2: {
                title: "Forest Trail",
                description: "As the vegetation thins out for a short ways, the path seems to split. To the west is the trail to the\
                den, while there's a fork to the east - one winding north, towards the sound and smell of flowing water, and one\
                drifting south, deeper into the forest. There seems to be a small patch in the brambles to the southwest, as well.",
                enemies: ["redSquirrel", "blackSquirrel"],
                chance: [10, 5],
                toKill: 2,
                killed: 0,
                mastered: false,
                toUnlock: ["trailNorthClearing1", "trailRiver1", "trailNorth3"],
            },
            trailNorthClearing1: {
                title: "Forest Clearing",
                description: "A small path through some brambles you could barely squeeze through lead into this small clearing.\
            The sunlight trickles through the thinner branches of the trees, giving the clearing a calm, serene look.",
                enemies: ["redSquirrel", "blackSquirrel"],
                chance: [5, 10],
                toKill: 1,
                killed: 0,
                mastered: false,
                toUnlock: [],
            },
        },
        unlockedNodes: {
            trailNorth1: true,
            trailNorth2: true,
        }
    },

    activeStuff: {
        //whatever panels or tabs are currently open, may remove this from player object later
        activeMainTab: "soul",
        activeSoulTab: "map",
        sidePanelSpecial: "home",
        sidePanelTitle: "error! report this",
        sidePanelDescription: "error! report this",

        isFighting: false, //a few tab changes and the like work differently when the player is mid-combat
    },

    loading: true,
    showIntro: true,
}




let nodes = new vis.DataSet([
    {
        id: 'home',  
        x: 0, 
        y: 0,
        group: 'forest',
        shape: 'hexagon',
        size: 15,
    }, //home



    {
        id: 'trailNorth1', 
        x: 100, 
        y: -30,
        group: 'forest',
    }, //trailNorth1
            
    {
        id: 'trailNorth2', 
        x: 180, 
        y: 10,
        group: 'forest',
        hidden: true,
    }, //trailNorth2

    {
        id: 'trailNorthClearing1', 
        x: 110, 
        y: 40,
        group: 'forest',
        hidden: true,
    }, //trailNorthClearing1

    {
        id: 'trailNorth3', 
            x: 250, 
            y: 105,
            group: 'forest',
            hidden: true,
            details: {
                description: "Filler text, im tired of writing",
                enemies: ["redSquirrel", "blackSquirrel"],
                chance: [10, 5],
                toKill: 2,
                killed: 0,
                mastered: false,
                toUnlock: [],
            name: 'Forest Trail'
        }
    }, //trailNorth3

    {
        id: 'trailRiver1', 
            x: 255, 
            y: 7,
            group: 'forest',
            hidden: true,
            details: {
                description: "The faint path meets and follows the bank of a river as it emerges from the forest. The water here seems\
                deep and fast. Looking to the west, the vegetation hugging the river is too thick to comfortably move through, and\
                in the distance you can see a waterfall flowing down the cliffside.",
                enemies: ["redSquirrel", "blackSquirrel"],
                chance: [10, 5],
                toKill: 2,
                killed: 0,
                mastered: false,
                toUnlock: [],
            name: 'River Trail - Forest Side'
        }
    }, ///trailRiver 1


                
    {
        id: 'trailSouth1',  
        x: 10, 
        y: 100,
        group: 'forest',
        details: {
            description: "Not so much a trail as a stretch of rocky ground that can't support much more than moss and weeds,\
            this clear area lazily follows the cliffside to the south.",
            enemies: ["redSquirrel","blackSquirrel","mole"],
            chance: [20, 10, 5],
            toKill: 6,
            killed: 0,
            mastered: false,
            toUnlock: [],
            name: 'Rocky Trail'
        }
    }, //trailSouth1
]);

let edges = new vis.DataSet([
    {id: "home-trailNorth1", 
        from: 'home', to: 'trailNorth1'}, //home-trailNorth1

    {id: "trailNorth1-trailNorth2", 
        from: 'trailNorth1', to: 'trailNorth2'}, //trailNorth1-trailNorth2

    {id: "trailNorth2-trailNorthClearing1",
        from: 'trailNorth2', to: 'trailNorthClearing1'}, //trailNorth2-trailNorthClearing1

    {id: "trailNorth2-trailNorth3",
        from: 'trailNorth2', to: 'trailNorth3'}, //trailNorth2-trailNorth3

    {id: "trailNorth2-trailRiver1",
        from: 'trailNorth2', to: 'trailRiver1'}, //trailNorth2-trailRiver1


    {id: "home-trailSouth1",
        from: 'home', to: 'trailSouth1'}, //home-trailSouth1
]);

let options = {
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

window.addEventListener('load', function() {

    const format = new Format("scientific");

    Vue.component('vis-network', {
        template: `
        <div>
            <div id="map-network"></div>
        </div>`,
        data() {
            return {
                nodes: nodes,
                edges: edges,
                options: options,
                container: '',
                unlockedNodes: player.areaInfo.unlockedNodes,
            }
        },
    
        computed: {
            graph_data() {
                return {
                    nodes: this.nodes,
                    edges: this.edges
                }
            },
        },

        mounted() {
            this.container = document.getElementById('map-network');
            this.network = new vis.Network(this.container, this.graph_data, this.options);
            this.network.setOptions({
                nodes: {
                    fixed: true,
                    physics: false,
                    shape: 'dot',
                    size: 10,
                }
            });

            this.network.on("click", (params) => {
                const nodeID = params['nodes']['0'];
                if (nodeID) {
                    const clickedNode = nodes.get(nodeID);
                    vm.updateSidePanels(clickedNode.shape == "hexagon", nodeID); //Maybe change to an event?
                }
            });
        },
    });


    const vm = new Vue({
        el: '#vueWrapper',
        data: player,
        computed: {
            formattedSoul: function () {
                return format.formatNumber(this.currentSoul.soulTotal);
            },
            formattedLightSoul: function () {
                return format.formatNumber(this.currentSoul.soulLight);
            },
            formattedDarkSoul: function () {
                return format.formatNumber(this.currentSoul.soulDark);
            },
            formattedBeadsLight: function () {
                return format.formatNumber(this.currentSoul.beadsLight);
            },
            formattedBeadsDark: function () {
                return format.formatNumber(this.currentSoul.beadsDark);
            }
        },
        methods: {
            updateSidePanels: function (isSpecial, name) {
                if (isSpecial) {
                    this.activeStuff.sidePanelSpecial = name;
                }
                else {
                    this.activeStuff.sidePanelSpecial = false;
                    this.activeStuff.sidePanelTitle = this.areaInfo.general[name].title;
                }
            },
            saveToLocal: function () {
                localStorage.setItem("manualSave", window.btoa(JSON.stringify(player)));
                console.log("Saved:");
                console.log(JSON.parse(window.atob(localStorage.getItem("manualSave"))));
            },
            loadFromLocal: function () {
                try {
                    let temp = JSON.parse(window.atob(localStorage.getItem("manualSave")));
                    this.currentSoul = temp.currentSoul;
                    this.stats = temp.stats;
                    this.unlocks = temp.unlocks;
                    this.areaInfo = temp.areaInfo;
                    this.$forceUpdate();
                }
                catch(e) {
                    console.log("No save found!");
                }
            },
            clearData: function () {
                localStorage.removeItem("manualSave");
                console.log("Cleared save.");
            }
        },
    });
    player.loading = false; //TODO: This isn't good enough, as with components and the eventual loading in of data, it needs multiple. Semaphores seem to be suggested?
});


class Format {
    constructor(notation) {
        this.Notation = notation; //Notation
    }

    formatNumber(n) {
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
}