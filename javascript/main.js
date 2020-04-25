var player = {
    currentSoul: {
        //currency
        soulTotal: 0,
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
        tailsUnlocked: true,
        storyUnlocked: false,
        crystalsUnlocked: false,
        mansionUnlocked: false,

        //prestige mechanics
        prestigeLightUnlocked: true,
        prestigeDarkUnlocked: true,
    },

    activeStuff: {
        activeMainTab: "soul",
        activeSoulTab: "map",
    },

    combat: {
        isFighting: false,
    },

    loading: true,
    showIntro: true,
}

var nodes = new vis.DataSet([
    {id: 'home',  
        x: 0, 
        y: 0,
        group: 'forest',
        shape: 'hexagon',
        size: 15,
        details: {
            name: 'Home',}},



    {id: 'trailNorth1', 
        x: 100, 
        y: -30,
        group: 'forest',
        details: {
            description: "A worn trail winds east away through the underbrush from the den nestled in the cliffside.\
            It seems well-traveled by the smaller creatures of the forest, and a good place to hunt.",
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [20, 5],
            toKill: 1,
            killed: 0,
            mastered: false,
            toUnlock: ["trailNorth2"],
            name: 'Forest Trail'}},
            
    {id: 'trailNorth2', 
        x: 180, 
        y: 10,
        group: 'forest',
        hidden: true,
        details: {
            description: "As the vegetation thins out for a short ways, the path seems to split. To the west is the trail to the\
            den, while there's a fork to the east - one winding north, towards the sound and smell of flowing water, and one\
            drifting south, deeper into the forest. There seems to be a small patch in the brambles to the southwest, as well.",
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [10, 5],
            toKill: 2,
            killed: 0,
            mastered: false,
            toUnlock: ["trailNorthClearing1", "trailRiver1", "trailNorth3"],
            name: 'Forest Trail'}},

    {id: 'trailNorthClearing1', 
        x: 110, 
        y: 40,
        group: 'forest',
        hidden: true,
        details: {
            description: "A small path through some brambles you could barely squeeze through lead into this small clearing.\
            The sunlight trickles through the thinner branches of the trees, giving the clearing a calm, serene look.",
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [5, 10],
            toKill: 1,
            killed: 0,
            mastered: false,
            toUnlock: [],
            name: 'Forest Clearing'}},

    {id: 'trailNorth3', 
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
                name: 'Forest Trail'}},

    {id: 'trailRiver1', 
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
                name: 'River Trail - Forest Side'}},



                
    {id: 'trailSouth1',  
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
            name: 'Rocky Trail'}},
]);

var edges = new vis.DataSet([
    {id: "home-trailNorth1", 
        from: 'home', to: 'trailNorth1'},

    {id: "trailNorth1-trailNorth2", 
        from: 'trailNorth1', to: 'trailNorth2'},

    {id: "trailNorth2-trailNorthClearing1",
        from: 'trailNorth2', to: 'trailNorthClearing1'},

    {id: "trailNorth2-trailNorth3",
        from: 'trailNorth2', to: 'trailNorth3'},

    {id: "trailNorth2-trailRiver1",
        from: 'trailNorth2', to: 'trailRiver1'},


    {id: "home-trailSouth1",
        from: 'home', to: 'trailSouth1'},
]);

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

window.addEventListener('load', function() {

    const format = new Format("scientific");

    Vue.component('vis-network', {
        template: `
        <div>
            <div id="mynetwork"></div>
        </div>`,
        data() {
            return {
                nodes: nodes,
                edges: edges,
                options: options,
                container: '',
            }
        },
    
        computed: {
            graph_data() {
                return {
                    nodes: this.nodes,
                    edges: this.edges
                }
            },
            fighting() {
                return fighting = player.combat.isFighting;
            }
        },

        props: {

        },

        methods: {

        },

        mounted() {
            this.container = document.getElementById('mynetwork');
            this.network = new vis.Network(this.container, this.graph_data, this.options);
            this.network.setOptions({
                nodes: {
                    fixed: true,
                    physics: false,
                    shape: 'dot',
                    size: 10,
                }
            });

            var focusOptions = {
                locked: false,
                animation: false,
                scale: .8,
            }
            this.network.focus('home', focusOptions);

            this.network.on("click", (params) => {
                var nodeID = params['nodes']['0'];

                if (nodeID) { //returns true if a node was clicked
                    var clickedNode = nodes.get(nodeID); //Gets the actual parameters of the node

                    if(clickedNode.shape == "hexagon") //If special hexagon shape
                    {
                        console.log(this.fighting);
                    }
                }
            });
        }
    });

    var vm = new Vue({
        el: '#vueWrapper',
        data: player,
        computed: { //I THINK IM DOING THIS WRONG. MAYBE A WAY TO FORMAT NUMBERS IN A BETTER WAY THAN A TON OF COMPUTEDS?
            formattedSoul: function() {
                return format.formatNumber(this.currentSoul.soulTotal);
            },
            formattedLightSoul: function() {
                return format.formatNumber(this.currentSoul.soulLight);
            },
            formattedDarkSoul: function() {
                return format.formatNumber(this.currentSoul.soulDark);
            },
            formattedBeadsLight: function() {
                return format.formatNumber(this.currentSoul.beadsLight);
            },
            formattedBeadsDark: function() {
                return format.formatNumber(this.currentSoul.beadsDark);
            }
        },
    });
    player.loading = false;
    //vm.$refs.mapNetwork.?();
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