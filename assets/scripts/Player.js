import Card from './Card.js'

export default class Player {
    constructor(id) {
        this.id = id
        this.player = this.createPlayer()
        this.isPlaying = true;
        this.isStopping = false;
        this.isOver = false
    }

    createPlayer() {
        let card = new Card()
        return {
            card,
            score: 0,
            isPlaying: true,
            isStopping: false,
            isOver: false
        }
    }

    playing() {
        return this.isPlaying
    }

    // stopping() {
    //     return !this.isPlaying
    // }
}