import Card from './Card.js'

export default class Player {
    constructor(id) {
        this.id = id
        this.player = this.createPlayer()
        this.isPlaying = true;
        this.isStopping = false;
        this.isOver = false;
        this.img = `assets/image/players/player${id}.jpg`
    }

    createPlayer() {
        let card = new Card()
        return {
            card,
            score: 0,
            isPlaying: true,
            isStopping: false,
            isOver: false,
            img: this.img
        }
    }

    playing() {
        return this.isPlaying
    }
}