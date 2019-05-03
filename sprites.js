
const stormSpriteAnimation = () => {
    stormSpriteIndex++
    if (stormSpriteIndex === 4) { 
        stormSpriteIndex = 0;
    }
    storm_sprite.src = stormSpriteArray[stormSpriteIndex]
}

const waves_sprite = new Image()
wavesSpriteIndex = 0
waves_sprite.src = `images/waves/waves15.png`

const player_sprite = new Image()
player_sprite.src = 'images/boat/boat2.png'

const shadow_sprite = new Image()
shadow_sprite.src = 'images/shadow.png'

const island_olives = new Image()
island_olives.src = 'images/resources/resources0.png'

const island_jewellery = new Image()
island_jewellery.src = 'images/resources/resources1.png'

const island_marble = new Image()
island_marble.src = 'images/resources/resources2.png'

const island_bronze = new Image()
island_bronze.src = 'images/resources/resources3.png'

const island_wants = new Image()
island_wants.src = 'images/resources/wants.png'

const storm_sprite = new Image()
const stormSpriteArray = ['images/storm_0.png','images/storm_1.png','images/storm_2.png','images/storm_3.png']
let stormSpriteIndex = 0 
storm_sprite.src = stormSpriteArray[stormSpriteIndex]
