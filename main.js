$(document).ready(function(){
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth, canvas.height = window.innerHeight;
    const cw = canvas.width, ch = canvas.height
    document.body.appendChild(canvas);

    const grid = {
        div: 16,
        obstacles: [],
        map: [],
        setup: function() {
            let arr = arrayFunc()
        },
        colors: {
            ocean: '#001F3F',
            land: '#2C9E39'
        }
    }

    const randomN = () => {
        return Math.floor(Math.random() * 100)
    }

    const arrayFunc = () => {
        console.log(grid.div)
        for (i = 0; i < grid.div; i++) {
            let a = []
            for (j = 0; j < grid.div; j++) {
                let n = randomN()
                console.log(` n is ${n}, i is ${i}, j is ${j}`)
                if (n < 95) { a.push(0) } 
                else { a.push(1); grid.obstacles.push({x: i, y: j}) }
            }
            grid.map.push(a)
        }
        console.log(grid.map)
        console.log(grid.obstacles)
        return grid.map
    }

    columnWidth = (cw / grid.div)
    rowHeight = (ch / grid.div)

    // stores information about the player's square
    const player = {
        xy: {x: (columnWidth), y: (rowHeight)},
        prevXY: {x: (columnWidth), y: (rowHeight)},
        w: columnWidth,
        h: rowHeight,
        xcadence: columnWidth,
        ycadence: rowHeight,
        facing: 'east',
        color: 'brown'
    }

    const arrayDraw = () => {
        grid.map.forEach(function(a, ai) {     
            a.forEach(function(e, ei) {
                if (e === 0) { 
                    ctx.fillStyle = grid.colors.ocean
                    ctx.fillRect((ai * columnWidth), (ei * rowHeight), columnWidth, rowHeight)
                }
                else if (e === 1) { 
                    ctx.fillStyle = grid.colors.land
                    
                    ctx.fillRect((ai * columnWidth), (ei * rowHeight), columnWidth, rowHeight)
                }
            })
        })
    }

    const collisionDetection = (x, y) => {
        let px = parseX(x), py = parseY(y);
        return grid.obstacles.some(o => {
            if (o.x === px && o.y === py) {
                return true
            }
        })
    }

    const drawPlayer = (x, y) => {
        console.log("drawing")
        ctx.fillStyle = grid.colors.ocean
        ctx.fillRect(player.prevXY.x, player.prevXY.y, columnWidth, rowHeight)
        ctx.fillRect(player.prevXY.x, player.prevXY.y, columnWidth, rowHeight)
        paintFacing(player.facing, player.xy.x, player.xy.y)
        ctx.fillRect(x, y, columnWidth, rowHeight)

    }

    const facing = (dir) => (player.facing === dir)
    const paintFacing = (dir, x, y) => {
        switch (dir) {
            case "east": 
                ctx.fillStyle = 'yellow'
                // ctx.fillRect((x + columnWidth), y, columnWidth, (rowHeight / 2))
                // ctx.fillStyle = player.color
                // ctx.fillRect(x, y + (rowHeight / 2), columnWidth, (rowHeight / 2))
                break;
            case "north": 
                ctx.fillStyle = 'red'
                // ctx.fillRect(x, y, columnWidth, (rowHeight / 2))
                // ctx.fillStyle = player.color
                // ctx.fillRect(x, y + (rowHeight / 2), columnWidth, (rowHeight / 2))
                break;
            case "west": 
                ctx.fillStyle = 'orange'
                // ctx.fillRect(x, y, columnWidth, (rowHeight / 2))
                // ctx.fillStyle = player.color
                // ctx.fillRect(x, y + (rowHeight / 2), columnWidth, (rowHeight / 2))
                break;
            case "south": 
                ctx.fillStyle = 'blue'
                // ctx.fillRect(x, y, columnWidth, (rowHeight / 2))
                // ctx.fillStyle = player.color
                // ctx.fillRect(x, y + (rowHeight / 2), columnWidth, (rowHeight / 2))
                break;
            default: 
                console.log('no direction set')
        }
    } 

    // these two could be one function
    const parseX = (x) => {
        return (Math.floor(x / (columnWidth)) * 1)
    }

    const parseY = (y) => {
        return (Math.floor(y / (rowHeight)) * 1)
    }


    // purely for testing
    $(document).on('mousedown', function(e){
        console.log(parseX(e.clientX), parseY(e.clientY))
        console.log(e.clientX, e.clientY)
    });

    // handles keyboard input, updates coordinates of player, triggers redraw functions
    $(document).keydown(function(event){
        var keycode = event.which;
        if (keycode === 32) {
            console.log("spacebar", player.facing)
            return
        }
        // sets prev x/y as current x/y, then goes on to change the current x/y
        player.prevXY.x = player.xy.x, player.prevXY.y = player.xy.y;

        if(keycode === 37){ // left
            if (player.xy.x === 0) { return }
            if (collisionDetection((player.xy.x - player.xcadence), player.xy.y) === false) {
                if (facing('west')) {
                    player.xy.x -= player.xcadence
                }
                else { player.facing = 'west' }
            }
        }
        else if (keycode === 38) { // up
            if (player.xy.y === 0) { return }
            if (collisionDetection((player.xy.x), player.xy.y - player.ycadence) === false) {
                if (facing('north')) {
                    player.xy.y -= player.ycadence
                }
                else { player.facing = 'north' }
            }
        }
        else if (keycode === 39) { // right
            if (player.xy.x >= (columnWidth * (grid.div - 1))) { return }
            if (collisionDetection((player.xy.x + player.xcadence), player.xy.y) === false) {
                if (facing('east')) {
                    player.xy.x += player.xcadence
                }
                else { player.facing = 'east' }
            }
        }
        else if (keycode === 40) { // down
            if (player.xy.y >= (rowHeight * (grid.div - 1))) { return }
            if (collisionDetection((player.xy.x), player.xy.y + player.ycadence) === false) {
                if (facing('south')) {
                    player.xy.y += player.ycadence
                }
                else { player.facing = 'south' }
            }
        }
        drawPlayer(player.xy.x, player.xy.y)
        console.log(player.xy.x, player.xy.y)
        console.log(grid.obstacles)

    });

    grid.setup()

    arrayDraw()
    arrayDraw()
    arrayDraw()
    drawPlayer(player.xy.x, player.xy.y)
});