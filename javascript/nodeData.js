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
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [20, 5],
            name: 'Trail1'}},
            
    {id: 'trailNorth2', 
        x: 180, 
        y: 10,
        group: 'forest',
        hidden: true,
        details: {
            enemies: ["redSquirrel", "blackSquirrel"],
            chance: [10, 5],
            name: 'Trail'}},

    {id: 'trailSouth1',  
        x: 10, 
        y: 100,
        group: 'forest',
        details: {
            enemies: ["redSquirrel","blackSquirrel","mole"],
            chance: [20, 10, 5],
            name: 'Trail2'}},
]);

var edges = new vis.DataSet([
    {id: "home-trailNorth1", 
        from: 'home', to: 'trailNorth1'},

    {id: "home-trailSouth1",
        from: 'home', to: 'trailSouth1'},

    {id: "trailNorth1-trailNorth2", 
        from: 'trailNorth1', to: 'trailNorth2'},
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