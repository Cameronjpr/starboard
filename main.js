$(document).ready(function(){
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 640, canvas.height = 640;
    const cspan = canvas.width;

    var map = document.getElementById('map');

    document.getElementById('canvas-wrapper').appendChild(canvas);
    let hpText = document.getElementById('hp-info');
    let goldText = document.getElementById('gold-info');
    let footer = document.getElementById('footer-container')
    let footerText = $(footer).find( '#footer-text' )[0]
    let help = document.getElementById('help')

    const game = {
        turnCount: 1,
    }

    const grid = {
        div: 16,
        land: [],
        islands: [],
        storms: [],
        map: [],
        setup: function() {
            arrayFunc()
            makeIslands()
        },
        colors: {
            ocean: '#488fa9',
            land: '#2C9E39',
            storm: 'silver',
            menu: '#E7DFC6',
        },
        tooltip: false,
    }

    const tilespan = (cspan / grid.div)

    // stores information about the player's square
    let player = {
        // to effectively place the player at 1, 1
        xy: {x: (tilespan), y: (tilespan)},
        prevXY: {x: null, y: null},
        w: tilespan,
        h: tilespan,
        facing: 'east',
        facingIsland: null,
        color: 'brown',
        ship: {
            hp: 100,
            cargo: '',
            gold: 100
        },
        age: 21
    }

    const chanceOfDeath = () => {
        let n = randomN(player.age)
        console.log(n)
        if (n % 40 === 0) console.log('died of old age')
    }

    const resetPlayerStats = () => {
        player = {
            xy: {x: (tilespan), y: (tilespan)},
            prevXY: {x: null, y: null},
            w: tilespan,
            h: tilespan,
            facing: 'east',
            facingIsland: null,
            color: 'brown',
            ship: {
                hp: 100,
                cargo: '',
                gold: 100
            },
            age: 21
        }
    }

    const islandArrays = {
        names: ['Pallos', 'Achos', 'Mystera', 'Ion'],
        resources: ['bronze', 'marble', 'olives', 'jewellery'],
        sellPrice: [[40, 45, 50], [45, 50, 55], [10, 15, 20], [50, 55, 70]],
        buyPrice: [[60, 65, 70], [70, 75, 80], [30, 35, 40], [90, 95, 100]]
    }

    const makeIslands = () => {
        for (i = 0; i < 4; i++) { 
            console.log(i)
            let rn = randomN(4)
            let wn = randomN(4)
            let pn = randomN(3)
            while (rn === wn) { rn = randomN(4) }
            console.log(rn, wn)

            let islandInfo = document.getElementById(`island-${i}`)
            let nameInfo = $(islandInfo).find( '#name-of-island' )[0]
            let resourcesInfo = $(islandInfo).find( '#island-produces' )[0]
            let wantsInfo = $(islandInfo).find( '#island-wants' )[0]
            let coordinatesInfo = $(islandInfo).find( '#coordinates' )[0]

            // could get rid of all these duplications? ??
            if (grid.land) {
                grid.land[i].name = islandArrays.names[i] 
                nameInfo.innerHTML = grid.land[i].name
    
                grid.land[i].resource = islandArrays.resources[rn]
                resourcesInfo.innerHTML = islandArrays.resources[rn]
                grid.land[i].sellPrice = islandArrays.sellPrice[rn][pn]
    
                grid.land[i].wants = islandArrays.resources[wn]
                wantsInfo.innerHTML = islandArrays.resources[wn]
                grid.land[i].buyPrice = islandArrays.buyPrice[wn][pn]
    
                coordinatesInfo.innerHTML = `X: ${grid.land[i].x}, Y: ${grid.land[i].y}`
            }
            else makeIslands()
        }
        console.table(grid.land)
    }

    const move = {
        west: (-tilespan),
        north: (-tilespan),
        east: (+tilespan),
        south: (+tilespan)
    }

    const randomN = (mult) => {
        return Math.floor(Math.random() * mult)
    }

    const arrayFunc = () => {
        grid.map = []
        grid.land = []
        grid.storms = []
        for (i = 0; i < grid.div; i++) {
            let a = []
            for (j = 0; j < grid.div; j++) {
                let n = randomN(100)
                if (i === 2 && j === 2) { a[j] = 1; grid.land.push({x: j, y: i}) } 
                else if (i === 2 && j === 13) { a[j] = 1; grid.land.push({x: j, y: i}) } 
                else if (i === 13 && j === 2) { a[j] = 1; grid.land.push({x: j, y: i}) } 
                else if (i === 13 && j === 13) { a[j] = 1; grid.land.push({x: j, y: i}) } 
                else if (n === 66) {
                        a.push(2);
                        grid.storms.push({x: j, y: i}) 
                    }
                else { a.push(0) } 
            }
            grid.map.push(a)
        }
        console.table(grid.map)
        console.table(grid.land)
        console.table(grid.storms)
        return grid.map
    }

    grid.setup()

    const arrayDraw = () => {
        grid.map.forEach(function(a, ai) {     
            a.forEach(function(e, ei) {
                if (e === 0) { 
                    ctx.fillStyle = grid.colors.ocean
                    ctx.fillRect((ei * tilespan), (ai * tilespan), tilespan, tilespan)
                    ctx.drawImage(waves_sprite, (ei * tilespan), (ai * tilespan))
                }
                else if (e === 1) { 
                    ctx.drawImage(waves_sprite, (ei * tilespan), (ai * tilespan))
                    switch (getIsland(ei * tilespan, ai * tilespan).resource) {
                        case "olives":
                            ctx.drawImage(island_olives, (ei * tilespan), (ai * tilespan))
                            break;
                        case "jewellery":
                            ctx.drawImage(island_jewellery, (ei * tilespan), (ai * tilespan))
                            break;
                        case "marble":
                            ctx.drawImage(island_marble, (ei * tilespan), (ai * tilespan))  
                            break;
                        case "bronze":
                            ctx.drawImage(island_bronze, (ei * tilespan), (ai * tilespan))
                            break;
                        default: 
                            break;

                    }
                    if (getIsland(ei * tilespan, ai * tilespan).wants === player.ship.cargo) {
                        ctx.drawImage(island_wants, (ei * tilespan), (ai * tilespan))
                    }
                }
                else if (e === 2) {
                    ctx.drawImage(waves_sprite, (ei * tilespan), (ai * tilespan))
                    ctx.drawImage(shadow_sprite, (ei * tilespan), (ai * tilespan))
                    ctx.drawImage(storm_sprite, (ei * tilespan), (ai * tilespan))
                }
            })
        })
        if (grid.storms.length < 3 && (game.turnCount % 2 !== 0)) {
            generateNewStorms()
        }
    }

    const hazardDraw = () => {
        grid.storms.forEach((storm) => {
            
        })
    }


    // returns true or false
    const landCollision = (x, y) => {
        let px = parse(x), py = parse(y);
        return grid.land.some(o => {
            if (o.x === px && o.y === py) {
                // loadCargo(o.resource, o.sellPrice)
                // isWanted(o, player.ship.cargo)
                return o;
            }
        })
    }

    // returns an island object
    const getIsland = (x, y) => {
        let px = parse(x), py = parse(y);
        let island
        grid.land.some(o => {
            if (o.x === px && o.y === py) {
                island = o
            }
        })
        return island
    }

    // returns true or false
    const stormCollision = (x, y) => {
        let px = parse(x), py = parse(y);
        return grid.storms.some(o => {
            if (o.x === px && o.y === py) {
                return true
            }
        })
    }

    const killedByStorm = () => {
        player.ship.gold -= 20;
        player.ship.hp -= 50;
        player.ship.cargo = ''
        footerText.innerHTML = `Your ship capsised in a storm. You lose 20 gold, 50 hp, and all of your cargo.`
        updateHP()
        updateGold()
        updateCargo('')
        grid.setup()
    }

    // problem exists somewhere in storm code -- when one storm dies the others sometimes miss a step
    const stormPath = () => { 
        if (grid.storms.length) { 
            grid.storms.forEach((storm, index) => {
                if (landCollision((storm.x - 1) * tilespan, storm.y * tilespan) === false && storm.x > 0) {
                    grid.map[storm.y][storm.x] = 0;
                    storm.x--;
                    grid.map[storm.y][storm.x] = 2
                } else {
                    grid.map[storm.y][storm.x] = 0;
                    grid.storms.splice(index, 1)
                }
            })
            stormCollision(player.x, player.y)
        }
    }   

    const generateNewStorms = () => {
        grid.map.forEach((row, rowIndex) => {
            let n = randomN(256)
            if (n === 123) { 
                grid.map[rowIndex][15] = 2
                grid.storms.push({x: 15, y: rowIndex})
            } else return
        })
    }

    const drawPlayer = () => {
        ctx.drawImage(player_sprite, player.xy.x, player.xy.y)
    }

    const buyQuestion = () => {
        if (player.ship.gold >= player.facingIsland.sellPrice) {
            footerText.innerHTML = `Docked at ${player.facingIsland.name}. Purchase ${player.facingIsland.resource} for ${player.facingIsland.sellPrice} gold? Y / N`
        }
        else { 
            footerText.innerHTML = `Docked at ${player.facingIsland.name}. You need ${player.facingIsland.sellPrice} gold to purchase their ${player.facingIsland.resource}.`
            player.facingIsland = null;
        }
        increaseTurnCount()
    }

    const sellQuestion = () => {
        footerText.innerHTML = `Docked at ${player.facingIsland.name}. Sell your ${player.ship.cargo} for ${player.facingIsland.buyPrice} gold? Y / N`
        increaseTurnCount()
    }

    const notWanted = () => {
        footerText.innerHTML = `Docked at ${player.facingIsland.name}. They don't want your ${player.ship.cargo}.`
        increaseTurnCount()
        player.facingIsland = null
    }

    const loadCargo = (resource, sellPrice) => {
        if (player.ship.cargo === "") {
            if (player.ship.gold > sellPrice)  {
                player.ship.gold -= sellPrice;
                updateCargo(resource)
                updateGold()
            }
            else footerText.innerHTML = `You do not have enough gold to purchase ${resource}. You need ${sellPrice} gold.`
        }
        else { return }
    }

    const updateHP = () => {
        hpText.innerHTML = `HP: ${player.ship.hp}`
    }

    const updateGold = () => {
        goldText.innerHTML = `Gold: ${player.ship.gold}`
    }

    const updateCargo = (resource) => {
        if (resource) {
            player.ship.cargo = resource;
            footerText.innerHTML = `You are now carrying ${player.ship.cargo} on board.`
            document.getElementById('cargo-info').innerHTML = `Cargo: ${player.ship.cargo}`
        } else {
            document.getElementById('cargo-info').innerHTML = `No cargo.`
        }
        
    }

    const showMap = () => {
        console.log('M pressed')
        $(canvas).toggleClass('hidden')
        $(map).toggleClass('hidden')
    }

    const showHelp = () => {
        console.log('M pressed')
        $(canvas).toggleClass('hidden')
        $(help).toggleClass('hidden')
        $(footerText).toggleClass('hidden')
    }

    const parse = (num) => {
        return (Math.floor(num / (tilespan)) * 1)
    }

    const directionParser = (keycode) => {
        switch(keycode) {
            case 37:
                return 'west'
            case 38:
                return 'north'
            case 39:
                return 'east'
            case 40:
                return 'south'
            default: 
                return null;
        }
    }

    const movePlayer = (keydir) => {
        if (game.turnCount % 2 === 0) {
            if (keydir === player.facing) {
                switch (player.facing) {
                    case 'west': 
                        if (player.xy.x === 0) return
                        if (stormCollision((player.xy.x + move.west), player.xy.y)) { killedByStorm(); increaseTurnCount() }
                        else {
                            if (landCollision((player.xy.x + move.west), player.xy.y) === false) { player.xy.x += move.west; player.facingIsland = null; increaseTurnCount()  }
                            else { 
                                player.facingIsland = getIsland((player.xy.x + move.west), player.xy.y)
                                if (player.ship.cargo === '') buyQuestion()
                                else {
                                    if (player.ship.cargo === player.facingIsland.wants) sellQuestion()
                                    else notWanted()
                                }
                            }
                        }
                        break
                    case 'north': 
                        if (player.xy.y === 0) return
                        if (stormCollision(player.xy.x, (player.xy.y + move.north))) { killedByStorm(); increaseTurnCount() }
                        else { 
                            if (landCollision(player.xy.x, (player.xy.y + move.north)) === false) { player.xy.y += move.north; player.facingIsland = null; increaseTurnCount()  }
                            else { 
                                player.facingIsland = getIsland(player.xy.x, (player.xy.y + move.north))
                                if (player.ship.cargo === '') buyQuestion()
                                else {
                                    if (player.ship.cargo === player.facingIsland.wants) sellQuestion()
                                    else notWanted()
                                }
                            }
                        }
                        break
                    case 'east':
                        if (player.xy.x >= (tilespan * (grid.div - 1))) return
                        if (stormCollision((player.xy.x + move.east), player.xy.y)) { killedByStorm(); increaseTurnCount() }
                        else {
                            if (landCollision((player.xy.x + move.east), player.xy.y) === false) { player.xy.x += move.east; player.facingIsland = null; increaseTurnCount()  }
                            else {
                                player.facingIsland = getIsland((player.xy.x + move.east), player.xy.y)
                                if (player.ship.cargo === '') buyQuestion()
                                else {
                                    if (player.ship.cargo === player.facingIsland.wants) sellQuestion()
                                    else notWanted()
                                }
                            }
                        }
                        break
                    case 'south':
                        if (player.xy.y >= (tilespan * (grid.div - 1))) return
                        if (stormCollision(player.xy.x, (player.xy.y + move.south))) { killedByStorm(); increaseTurnCount() }
                        else {
                            if (landCollision(player.xy.x, (player.xy.y + move.south)) === false) { player.xy.y += move.south; player.facingIsland = null; increaseTurnCount() }
                            else { 
                                player.facingIsland = getIsland(player.xy.x, (player.xy.y + move.south))
                                if (player.ship.cargo === '') buyQuestion()
                                else {
                                    if (player.ship.cargo === player.facingIsland.wants) sellQuestion()
                                    else notWanted()
                                }
                            }
                        }
                          
                        break
                    default: 
                        console.log("error at move player switch")
                }
                player.prevXY.x = player.xy.x, player.prevXY.y = player.xy.y;     
            }
            else { 
                player.facing = keydir;
                paintFacing(player.facing, player.xy.x, player.xy.y) 
            }
            (player.facingIsland) ? console.log(player.facingIsland) : null
        }
    }

    const paintFacing = (dir) => {
        switch (dir) {
            case "west": 
                player_sprite.src = 'images/boat/boat0.png'
                break
            case "north": 
                player_sprite.src = 'images/boat/boat3.png'
                break
            case "east": 
                player_sprite.src = 'images/boat/boat2.png'
                break
            case "south": 
                player_sprite.src = 'images/boat/boat1.png'
                break
            default: 
                console.log('no direction set')
        }
    } 

    // handles keyboard input, updates coordinates of player, triggers redraw functions
    $(document).keydown(function(event, keycode = event.which){
        // console.log(event.repeat)
        // if (event.repeat) {
                if (player.facingIsland) {
                    console.log(`Docked at ${player.facingIsland.name}.`)
                    if (player.ship.cargo === player.facingIsland.wants) {
                        switch (keycode) {
                            case 89: 
                                footerText.innerHTML = `You sold your ${player.ship.cargo} to the people of ${player.facingIsland.name} for ${player.facingIsland.buyPrice} gold.`
                                player.ship.cargo = ''
                                player.ship.gold += player.facingIsland.buyPrice
                                updateCargo()
                                updateGold()
                                player.facingIsland = null
                                increaseTurnCount()
                                break
                            case 78: 
                                footerText.innerHTML = `You decide not to sell your ${player.ship.cargo}. You think you can get a better price elsewhere...`
                                player.facingIsland = null
                                break
                        }
                        return
                    }
                    else if (player.ship.cargo === '') {
                        switch (keycode) {
                            case 89: // Y
                                console.log('Y')
                                footerText.innerHTML = `You purchase ${player.facingIsland.resource} from the island of ${player.facingIsland.name}.`
                                loadCargo(player.facingIsland.resource, player.facingIsland.sellPrice)
                                player.facingIsland = null
                                increaseTurnCount()
                                break
                            case 78: // N
                                console.log('N')
                                footerText.innerHTML = `You decide not to buy ${player.facingIsland.resource} from the island of ${player.facingIsland.name}.`
                                player.facingIsland = null
                                break
                        }
                    }
                }
                else switch (keycode) {
                    case 81: // Q
                        player.ship.cargo = ""
                        footerText.innerHTML = `Your cargo hold is empty.`
                        updateCargo()
                    case 32: // space
                        break
                    case 72: // H
                        showHelp()
                        break;
                    case 77: // M
                        // showMap()
                        break
                    default: 
                        movePlayer(directionParser(keycode))
                }
        // }
    });

    const drawFrame = () => {
        arrayDraw()
        drawPlayer()
        if (game.turnCount % 2 === 0) hazardDraw()
    }

    const gameOverCheck = () => {
        if (player.ship.hp <= 0) {
            footerText.innerHTML = 'GAME OVER. You died.'
            resetPlayerStats()
        }
        else if (player.ship.gold <= 0) {
            footerText.innerHTML = 'GAME OVER. You\'re broke'
            resetPlayerStats()
        }
    }

    const hazardsTurnCheck = () => {
        if (game.turnCount % 2 === 0) {
            return
        } else {
            hazardsTurn()
        }
    }

    const hazardsTurn = () => {
        stormPath()
        increaseTurnCount()
    }

    const increaseTurnCount = () => {
        game.turnCount++
        if (game.turnCount % 50 === 0) increasePlayerAge()
    }

    const increasePlayerAge = () => {
        player.age++; console.log(player.age)
        chanceOfDeath()
    }

    let frames = 0
    window.main = function () {
        window.requestAnimationFrame( main );
        frames++
        if (frames === 10) { 
            frames = 0;         
            stormSpriteAnimation();
            gameOverCheck()
            hazardsTurnCheck()
            if (stormCollision(player.xy.x, player.xy.y)) killedByStorm()
        }
        drawFrame()
    };

    main(); // Start the cycle
});