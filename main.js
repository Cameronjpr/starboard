$(document).ready(function(){
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 640, canvas.height = 640;
    const cspan = canvas.width;

    var map = document.getElementById('map');

    document.getElementById('canvas-wrapper').appendChild(canvas);
    

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
    const player = {
        // to effectively place the player at 1, 1
        xy: {x: (tilespan), y: (tilespan)},
        prevXY: {x: null, y: null},
        futureXY: (0, 0),
        w: tilespan,
        h: tilespan,
        facing: 'east',
        color: 'brown',
        ship: {
            hp: 100,
            cargo: '',
            gold: 100
        }
    }

    const islandArrays = {
        names: ['Pallos', 'Achos', 'Mystera', 'Ion'],
        resources: ['bronze', 'marble', 'olives', 'jewellery'],
        sellPrice: [[40, 45, 50], [45, 50, 55], [10, 15, 20], [50, 55, 70]],
        buyPrice: [[60, 65, 70], [70, 75, 80], [30, 35, 40], [90, 95, 100]]
    }


    const island = {
        name: "",
        resource: "",
        wants: "",
        sellPrice: 0,
        buyPrice: 0,
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
        console.table(grid.land)
    }

    const move = {
        west: (-tilespan),
        north: (-tilespan),
        east: (+tilespan),
        south: (+tilespan)
    }

    // SPRITES
    const waves_sprite = new Image()
    wavesSpritArray = ['images/waves_0.png', 'images/waves_1.png', 'images/waves_2.png'] 
    wavesSpriteIndex = 0
    waves_sprite.src = wavesSpritArray[wavesSpriteIndex]

    const wavesSpriteAnimation = () => {
        wavesSpriteIndex++ 
        if (wavesSpriteIndex === 3) {
            wavesSpriteIndex = 0
        }
        waves_sprite.src = wavesSpritArray[wavesSpriteIndex]
    }

    const waves_shadow_sprite = new Image()
    waves_shadow_sprite.src = 'images/waves_shadow.png'

    const player_sprite = new Image()
    player_sprite.src = 'images/boat_east.png'

    const shadow_sprite = new Image()
    shadow_sprite.src = 'images/shadow.png'

    const island_sprite = new Image()
    island_sprite.src = 'images/island.png'

    const storm_sprite = new Image()
    const stormSpriteArray = ['images/storm_0.png','images/storm_1.png','images/storm_2.png','images/storm_3.png']
    let stormSpriteIndex = 0 
    storm_sprite.src = stormSpriteArray[stormSpriteIndex]

    const stormSpriteAnimation = () => {
        stormSpriteIndex++
        if (stormSpriteIndex === 4) { 
            stormSpriteIndex = 0;
        }
        storm_sprite.src = stormSpriteArray[stormSpriteIndex]
    }
    // END OF SPRITES

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
                if (n === 66) { a.push(2) ; grid.storms.push({x: i, y: j}) } 

                else if (i === 2 && j === 2) { a[j] = 1; grid.land.push({x: i, y: j}) } 
                else if (i === 2 && j === 13) { a[j] = 1; grid.land.push({x: i, y: j}) } 
                else if (i === 13 && j === 2) { a[j] = 1; grid.land.push({x: i, y: j}) } 
                else if (i === 13 && j === 13) { a[j] = 1; grid.land.push({x: i, y: j}) } 
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
                    ctx.fillRect((ai * tilespan), (ei * tilespan), tilespan, tilespan)
                    ctx.drawImage(waves_sprite, (ai * tilespan), (ei * tilespan))
                }
                else if (e === 1) { 
                    ctx.drawImage(waves_sprite, (ai * tilespan), (ei * tilespan))
                    // ctx.fillRect((ai * tilespan), (ei * tilespan), tilespan, tilespan)
                    ctx.drawImage(island_sprite, (ai * tilespan), (ei * tilespan))
                }
                else {
                    ctx.drawImage(waves_sprite, (ai * tilespan), (ei * tilespan))
                    // ctx.fillRect((ai * tilespan), (ei * tilespan), tilespan, tilespan)
                    ctx.drawImage(shadow_sprite, (ai * tilespan), (ei * tilespan))
                    ctx.drawImage(storm_sprite, (ai * tilespan), (ei * tilespan))
                }
            })
        })
    }

    const landCollision = (x, y) => {
        let px = parseX(x), py = parseY(y);
        return grid.land.some(o => {
            if (o.x === px && o.y === py) {
                loadCargo(o.resource, o.sellPrice)
                isWanted(o, player.ship.cargo)
                return o;
            }
        })
    }

    const stormCollision = (x, y) => {
        let px = parseX(x), py = parseY(y);
        return grid.storms.some(o => {
            if (o.x === px && o.y === py) {
                return true
            }
        })
    }

    const stormPath = (storm) => { 

    }   

    const drawPlayer = (x, y) => {
        ctx.fillStyle = grid.colors.ocean
        ctx.fillRect(player.prevXY.x, player.prevXY.y, tilespan, tilespan)
        ctx.drawImage(waves_shadow_sprite, player.xy.x, player.xy.y)
        ctx.drawImage(player_sprite, player.xy.x, player.xy.y)

    }

    const loadCargo = (resource, sellPrice) => {
        if (player.ship.cargo === "")  {
            console.log(`loading cargo. Cargo is ${resource}`)
            player.ship.cargo = resource;
            player.ship.gold -= sellPrice;
            console.log(player.ship)
            updateGold()
        }
        else { return }
        document.getElementById('cargo-info').innerHTML = `Cargo: ${player.ship.cargo}`
    }

    const isWanted = (island) => { 
        console.log(player.ship)
        if (island.wants === player.ship.cargo) {
            player.ship.gold += island.buyPrice
            console.log(`SOLD! You gain ${island.buyPrice} gold. Your gold total is now ${player.ship.gold}`)
            player.ship.cargo = ""
            updateGold()
            console.log(player.ship)
            document.getElementById('cargo-info').innerHTML = `Cargo: ${player.ship.cargo}`
        }
    } 

    const updateGold = () => {
        document.getElementById('gold-info').innerHTML = `Gold: ${player.ship.gold}`
    }

    const showMap = () => {
        console.log('M pressed')
        $(canvas).toggleClass('hidden')
        $(map).toggleClass('hidden')
    }

    const drawIslandTooltip = (island) => {
        console.log(`island x and y are ${island.x, island.y}`)
        if (island && grid.tooltip === false) {
            let centeredX = ((island.x * tilespan) - (tilespan * 1.5))
            let centeredY = (island.y * tilespan)
            ctx.fillStyle = grid.colors.menu;
            ctx.fillRect(centeredX, (centeredY), (tilespan * 4), (tilespan * 4))
            ctx.fillStyle = 'black'
            ctx.font = '20px serif'
            ctx.fillText(`${island.name}`, (centeredX + 3), (centeredY + 20));
            // ctx.fillText(`${island.name}`, (centeredX + 3), (centeredY + 20));
            grid.tooltip = true;
        }
    }

    // these two could be one function
    const parseX = (x) => {
        return (Math.floor(x / (tilespan)) * 1)
    }

    const parseY = (y) => {
        return (Math.floor(y / (tilespan)) * 1)
    }

    const getIslandFromCoordinates = (x, y) => {
        let px = parseX(x), py = parseY(y);
        let island;
        grid.land.forEach(o => {
            if (o.x === px && o.y === (py)) {
                island = o;
                drawIslandTooltip(island)
            }
        })
    }


    // purely for testing
    $(document).on('mousedown', function(e){
        console.log(grid.tooltip)
        if (grid.tooltip === true) {
            grid.tooltip = false;
        }
        else {
            getIslandFromCoordinates(e.offsetX, e.offsetY)
        }
    });

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
        if (keydir) { 
            if (keydir === player.facing) {
                switch (player.facing) {
                    case 'west': 
                        if (player.xy.x === 0) { return }
                        if (stormCollision((player.xy.x + move.west), player.xy.y)) {
                            console.log("dead")
                            grid.setup()
                        }
                        if (landCollision((player.xy.x + move.west), player.xy.y) === false) { 
                            player.xy.x += move.west;
                        }
                        break;
                    case 'north': 
                        if (player.xy.y === 0) { return }
                        if (stormCollision(player.xy.x, (player.xy.y + move.north))) {
                            console.log("dead")
                            grid.setup()
                        }
                        if (landCollision(player.xy.x, (player.xy.y + move.north)) === false) { 
                            player.xy.y += move.north
                        }
                        break;
                    case 'east':
                        if (player.xy.x >= (tilespan * (grid.div - 1))) { return }
                        if (stormCollision((player.xy.x + move.east), player.xy.y)) {
                            console.log("dead")
                            grid.setup()
                        }
                        if (landCollision((player.xy.x + move.east), player.xy.y) === false) { 
                            player.xy.x += move.east
                        }
                        break;
                    case 'south':
                        if (player.xy.y >= (tilespan * (grid.div - 1))) { return } 
                        if (stormCollision(player.xy.x, (player.xy.y + move.south))) {
                            console.log("dead")
                            grid.setup()
                        }  
                        if (landCollision(player.xy.x, (player.xy.y + move.south)) === false) { 
                            player.xy.y += move.south
                        }   
                        break;
                    default: 
                        console.log("switch error")
                }
                
                player.prevXY.x = player.xy.x, player.prevXY.y = player.xy.y;
                
            }
            else { 
                player.facing = keydir;
                paintFacing(player.facing, player.xy.x, player.xy.y) 
            }
        }
        player.facing = keydir;
    }

    const facingIsland = () => {
        if (landCollision((player.xy.x + move.west), player.xy.y) === true) { return landCollision((player.xy.x + move.west), player.xy.y)}
        else if (landCollision(player.xy.x, (player.xy.y + move.north)) === true) { return landCollision(player.xy.x, (player.xy.y + move.north)) }
        else if (landCollision((player.xy.x + move.east), player.xy.y) === true) { return landCollision((player.xy.x + move.east), player.xy.y) }
        else if (landCollision(player.xy.x, (player.xy.y + move.south)) === true) { return landCollision(player.xy.x, (player.xy.y + move.south)) }
        else { return false }
    }

    const paintFacing = (dir, x, y) => {
        switch (dir) {
            case "east": 
                player_sprite.src = 'images/boat_east.png'
                break;
            case "north": 
                player_sprite.src = 'images/boat_north.png'
                break;
            case "west": 
            ctx.fillStyle = 'orange'
                player_sprite.src = 'images/boat_west.png'
                break;
            case "south": 
                player_sprite.src = 'images/boat_south.png'
                break;
            default: 
                console.log('no direction set')
        }
    } 

    // handles keyboard input, updates coordinates of player, triggers redraw functions
    $(document).keydown(function(event){
        var keycode = event.which;
        if (keycode === 32) {
            console.log("spacebar", player.facing)
            if (facingIsland() === true) { 
                console.log(`true`)
                console.log(facingIsland())
                let facedIsland = facingIsland()
                console.log(facedIsland)
            }
            else { console.log('false')}
        }
        else if (keycode === 77) {
            showMap()
        }
        else { 
            let parsed = directionParser(keycode)
            movePlayer(parsed)
        }
    });

    const drawFrame = () => {
        arrayDraw()
        drawPlayer()
    }

    setTimeout(drawFrame(), 500)

    let frames = 0
    window.main = function () {
        window.requestAnimationFrame( main );
        frames++
        if (frames === 15) { 
            frames = 0;         
            wavesSpriteAnimation();
            stormSpriteAnimation();
            }
        drawFrame() 
      };
      main(); // Start the cycle
});