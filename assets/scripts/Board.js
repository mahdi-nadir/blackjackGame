import Player from './Player.js'
import Card from './Card.js'

export default class Board {
    constructor(nbPlayers) {
        this.nbPlayers = nbPlayers
        this.mainDiv = document.querySelector('main')
        this.result = document.querySelector('.result')
        this.players = []
        this.currentPlayerTurn = 0
        this.currentPlayer
        this.nextPlayerTurn
        this.count = 0
        this.init()
    }

    init() {
        this.createPlayers()
        this.play()
        this.stop()
    }

    play() {
        let btnPlay = document.querySelectorAll('.btnPlay');
        let listOfCards = document.querySelectorAll('.player__cards');
        let score = document.querySelectorAll('.player__score');

        btnPlay.forEach(btn => {
            btn.addEventListener('click', () => {
                let idJoueur = btn.parentNode.parentNode.dataset.id;
                this.currentPlayer = this.players[this.currentPlayerTurn];

                if (idJoueur === this.currentPlayerTurn.toString() && this.currentPlayer.player.isPlaying && !this.currentPlayer.player.isOver && !this.currentPlayer.player.isStopping) {

                    let card = new Card();
                    let cardFig = card.getCard().cardFigure;
                    let cardCol = card.getCard().cardColor;
                    let cardValue = card.getCard().valeurFigure;

                    let cardDOM = `<li>${cardFig} de ${cardCol}, Tu as eu ${cardValue} points</li>`;
                    listOfCards[idJoueur].insertAdjacentHTML('beforeend', cardDOM);
                    this.currentPlayer.player.score += cardValue;
                    score[idJoueur].innerHTML = this.currentPlayer.player.score;

                    this.loseOrWin(this.currentPlayer.player.score, idJoueur);

                    // Find the index of the next player who is not out of the game and is still playing
                    this.nextPlayerTurn = (this.currentPlayerTurn + 1) % this.players.length;
                    while (this.nextPlayerTurn !== this.currentPlayerTurn) {
                        const nextPlayer = this.players[this.nextPlayerTurn];
                        if (nextPlayer.player.isPlaying && !nextPlayer.player.isOver && !nextPlayer.player.isStopping) {
                            break; // Found the next valid player, exit the loop
                        }
                        this.nextPlayerTurn = (this.nextPlayerTurn + 1) % this.players.length;
                    }

                    // Update the current player turn to the next valid player
                    this.currentPlayerTurn = this.nextPlayerTurn;
                }
                if (this.count >= this.players.length) {
                    this.annouceWinner()
                }
            });
        });
    }

    stop() {
        let btnStop = document.querySelectorAll('.btnStop');
        let btnPlay = document.querySelectorAll('.btnPlay');
        let playerDiv = document.querySelectorAll('.player');

        btnStop.forEach(btn => {
            btn.addEventListener('click', () => {
                let idJoueur = btn.parentNode.parentNode.dataset.id;
                this.currentPlayer = this.players[this.currentPlayerTurn];

                if (idJoueur === this.currentPlayerTurn.toString() && this.currentPlayer.player.isPlaying && !this.currentPlayer.player.isOver && !this.currentPlayer.player.isStopping) {
                    this.players[idJoueur].player.isStopping = true;
                    this.count++
                    playerDiv[idJoueur].style.opacity = '0.6';
                    playerDiv[idJoueur].style.border = 'yellow solid 3px';
                    btnPlay[idJoueur].setAttribute('disabled', 'disabled');
                    btnStop[idJoueur].setAttribute('disabled', 'disabled');
                    playerDiv[idJoueur].style.pointerEvents = 'none'

                    this.loseOrWin(this.currentPlayer.player.score, idJoueur);

                    // Find the index of the next player who is not out of the game and is still playing
                    this.nextPlayerTurn = (this.currentPlayerTurn + 1) % this.players.length;
                    while (this.nextPlayerTurn !== this.currentPlayerTurn) {
                        const nextPlayer = this.players[this.nextPlayerTurn];
                        if (nextPlayer.player.isPlaying && !nextPlayer.player.isOver && !nextPlayer.player.isStopping) {
                            break; // Found the next valid player, exit the loop
                        }
                        this.nextPlayerTurn = (this.nextPlayerTurn + 1) % this.players.length;
                    }

                    // Update the current player turn to the next valid player
                    this.currentPlayerTurn = this.nextPlayerTurn;
                }
                if (this.count >= this.players.length) {
                    this.annouceWinner()
                }
            });
        });
    }

    annouceWinner() {
        let overs = this.players.filter(player => player.player.isOver == true)
        let stoppers = this.players.filter(player => player.player.isStopping == true)
        let stillPlayers = this.players.filter(player => player.player.isOver == false && player.player.isStopping == false)
        let playersAndStoppers = [...stillPlayers, ...stoppers]
        const playersLength = this.players.length

        if (stillPlayers.length == 1 && overs.length == playersLength - playersAndStoppers.length) {
            this.result.style.display = 'block'
            this.result.innerHTML = `Le gagnant est le joueur ${stillPlayers[0].id + 1} avec ${stillPlayers[0].player.score} points`
        } else if (stoppers.length == 1 && overs.length == playersLength - playersAndStoppers.length) {
            this.result.style.display = 'block'
            this.result.innerHTML = `Le gagnant est le joueur ${stoppers[0].id + 1} avec ${stoppers[0].player.score} points`
        } else if (playersAndStoppers.length > 1) {
            let scores = playersAndStoppers.map(plyr => plyr.player.score)
            let maxScore = Math.max(...scores)
            let winners = playersAndStoppers.filter(plyr => plyr.player.score == maxScore)
            if (winners.length == 1) {
                this.result.style.display = "block"
                this.result.innerHTML = `Le gagnant est le joueur ${winners[0].id + 1} avec ${winners[0].player.score} points`
            } else {
                this.result.style.display = "block"
                this.result.innerHTML = `Les gagnants sont les joueurs ${winners.map(overs => overs.id + 1)} avec ${winners[0].player.score} points`
            }
        } else if (overs.length == playersLength) {
            this.result.style.display = "block"
            this.result.innerHTML = `Tous les joueurs ont perdu`
        }
    }

    loseOrWin(score, id) {
        let playerDiv = document.querySelectorAll('.player')
        let btnPlay = document.querySelectorAll('.btnPlay')
        let btnStop = document.querySelectorAll('.btnStop')

        if (score > 21) {
            this.count++
            playerDiv[id].style.opacity = '0.3'
            playerDiv[id].style.border = 'red solid 3px'
            btnPlay[id].setAttribute('disabled', 'disabled')
            btnStop[id].setAttribute('disabled', 'disabled')
            this.players[id].player.isPlaying = false
            this.players[id].player.isOver = true
            playerDiv[id].style.pointerEvents = 'none'
        }
    }

    createPlayers() {
        for (let i = 0; i < this.nbPlayers; i++) {
            let player = new Player(i)
            this.players.push(player)
            this.playerDOM(i)
        }
    }

    playerDOM(id) {
        let playerDOM = `
            <div class="player" data-id=${id}>
                <h2 class="player__name">Joueur ${id + 1}</h2>
                <ul class="player__cards"></ul>
                <div class="player__score">0</div>
                <div class="buttons-wrapper">
                    <button id="btnPlay" class="btnPlay">Play</button>
                    <button id="btnStop" class="btnStop">Stop</button>
                </div>
            </div>
        `

        this.mainDiv.insertAdjacentHTML('beforeend', playerDOM)
    }
}