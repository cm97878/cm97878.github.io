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
            toUnlock: [""],
            name: 'Rocky Trail'}},
]);

var edges = new vis.DataSet([
    {id: "home-trailNorth1", 
        from: 'home', to: 'trailNorth1'},

    {id: "home-trailSouth1",
        from: 'home', to: 'trailSouth1'},

    {id: "trailNorth1-trailNorth2", 
        from: 'trailNorth1', to: 'trailNorth2'},

    {id: "trailNorth2-trailNorthClearing1",
        from: 'trailNorth2', to: 'trailNorthClearing1'},

    {id: "trailNorth2-trailNorth3",
        from: 'trailNorth2', to: 'trailNorth3'},

    {id: "trailNorth2-trailRiver1",
        from: 'trailNorth2', to: 'trailRiver1'},
]);


var enemies = {
    redSquirrel: {
        name: "Red Squirrel",
        id: "redSquirrel",
        health: 10,
        attack: 3,
        defense: 1,
        soul: 5,
        resilience: 1,
    },
    blackSquirrel: {
        name: "Black Squirrel",
        id: "blackSquirrel",
        health: 15,
        attack: 5,
        defense: 2,
        soul: 12,
        resilience: .8,
    },
    mole: {
        name: "Mole",
        id: "mole",
        health: 20,
        attack: 2,
        defense: 3,
        soul: 12,
        resilience: 1.2,
    },
}