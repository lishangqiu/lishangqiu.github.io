import Handler from './scaling_manager.js'
import UIScene from './UI.js'
import Game from './main_scene.js'
import {MAX_SIZE_WIDTH_SCREEN,MAX_SIZE_HEIGHT_SCREEN,MIN_SIZE_WIDTH_SCREEN,
    MIN_SIZE_HEIGHT_SCREEN,SIZE_WIDTH_SCREEN,SIZE_HEIGHT_SCREEN} from "./config.js"

// Aspect Ratio 16:9 - Portrait


const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: SIZE_WIDTH_SCREEN,
        height: SIZE_HEIGHT_SCREEN,
        min: {
            width: MIN_SIZE_WIDTH_SCREEN,
            height: MIN_SIZE_HEIGHT_SCREEN
        },
        max: {
            width: MAX_SIZE_WIDTH_SCREEN,
            height: MAX_SIZE_HEIGHT_SCREEN
        }
    },
    dom: {
        createContainer: true
    },
    backgroundColor: '#000000',
    scene: [Handler, UIScene, Game],
    mipmapFilter: "LINEAR_MIPMAP_LINEAR"

}

const game = new Phaser.Game(config)

// Global
game.debugMode = true
game.embedded = false // game is embedded into a html iframe/object

game.screenBaseSize = {
    maxWidth: MAX_SIZE_WIDTH_SCREEN,
    maxHeight: MAX_SIZE_HEIGHT_SCREEN,
    minWidth: MIN_SIZE_WIDTH_SCREEN,
    minHeight: MIN_SIZE_HEIGHT_SCREEN,
    width: SIZE_WIDTH_SCREEN,
    height: SIZE_HEIGHT_SCREEN
}

game.orientation = "portrait"