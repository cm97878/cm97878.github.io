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
            description: "The cliffside pulls away from the trail, although the dense forest vegetation is too thick to\
            comfortably traverse. The trail itself winds south, and both the sound and smell of running water can be\
            heard from nearby.",
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [10, 5],
            toKill: 1,
            killed: 0,
            mastered: false,
            toUnlock: ["trailNorthClearing1"],
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
            name: 'Forest Trail'}},

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