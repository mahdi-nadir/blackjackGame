import Player from './Player.js'
import Card from './Card.js'

export default class Board {
    constructor(nbPlayers) {
        this.nbPlayers = nbPlayers
        this.mainDiv = document.querySelector('main')
        this.overlay = document.querySelector('.overlay')
        this.result = document.querySelector('.result')
        this.scorePara = document.querySelector('.scoreParagraph')
        this.winnerImg = document.querySelector('.winnerImg')
        this.players = []
        this.currentPlayerTurn = 0
        this.currentPlayer
        this.nextPlayerTurn
        this.count = 0
        this.init()
    }

    init() {
        this.createPlayers()
        let playerDiv = document.querySelectorAll('.player');
        for (let i = 1; i < this.players.length; i++) {
            playerDiv[i].style.opacity = '0.5'
            playerDiv[i].style.pointerEvents = 'none'
        }
        this.play()
        this.stop()
    }


    play() {
        let btnPlay = document.querySelectorAll('.btnPlay');
        let listOfCards = document.querySelectorAll('.player__cards');
        let score = document.querySelectorAll('.player__score');
        let playerDiv = document.querySelectorAll('.player');

        btnPlay.forEach(btn => {
            btn.addEventListener('click', () => {
                playerDiv.forEach(element => {
                    element.style.opacity = '0.5'
                });
                let idJoueur = btn.parentNode.parentNode.dataset.id;
                this.currentPlayer = this.players[this.currentPlayerTurn];

                if (idJoueur === this.currentPlayerTurn.toString() && this.currentPlayer.player.isPlaying && !this.currentPlayer.player.isOver && !this.currentPlayer.player.isStopping) {

                    let card = new Card();
                    let cardFig = card.getCard().cardFigure;
                    let cardCol = card.getCard().cardColor;
                    let cardValue = card.getCard().valeurFigure;
                    let cardImage = card.getCard().img;

                    let cardDOM = `<div class=${document.body.clientWidth > '960' ? "card" : "littleCard"}><img src="${cardImage}"></div>`;
                    listOfCards[idJoueur].insertAdjacentHTML('beforeend', cardDOM);
                    this.currentPlayer.player.score += cardValue;
                    score[idJoueur].innerHTML = `Total: ${this.currentPlayer.player.score}`;
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
                    for (let i = 0; i < this.players.length; i++) {
                        if (i == this.currentPlayerTurn) {
                            playerDiv[i].style.opacity = '1';
                            playerDiv[i].style.pointerEvents = 'auto'
                        } else {
                            playerDiv[i].style.pointerEvents = 'none'
                        }
                    }
                    // playerDiv[this.currentPlayerTurn].style.backgroundColor = 'blue';
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
                playerDiv.forEach(element => {
                    element.style.opacity = '0.8'
                });
                let idJoueur = btn.parentNode.parentNode.dataset.id;
                this.currentPlayer = this.players[this.currentPlayerTurn];
                let playerStatus = playerDiv[idJoueur].querySelector('.player__status')

                if (idJoueur === this.currentPlayerTurn.toString() && this.currentPlayer.player.isPlaying && !this.currentPlayer.player.isOver && !this.currentPlayer.player.isStopping) {
                    this.players[idJoueur].player.isStopping = true;
                    this.count++
                    playerDiv[idJoueur].style.opacity = '0.6';
                    playerDiv[idJoueur].style.border = 'yellow solid 3px';
                    btnPlay[idJoueur].setAttribute('disabled', 'disabled');
                    btnStop[idJoueur].setAttribute('disabled', 'disabled');
                    playerDiv[idJoueur].style.pointerEvents = 'none'
                    playerStatus.style.display = 'block'
                    playerStatus.classList.add('player__stopped')
                    playerStatus.innerHTML = 'stopping !'

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
                    for (let i = 0; i < this.players.length; i++) {
                        if (i == this.currentPlayerTurn) {
                            playerDiv[i].style.opacity = '1';
                            playerDiv[i].style.pointerEvents = 'auto'
                        } else {
                            playerDiv[i].style.pointerEvents = 'none'
                        }
                    }
                    // playerDiv[this.currentPlayerTurn].style.backgroundColor = 'blue';
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
        const btnReset = document.querySelector('.btnReset');
        let playerName = document.querySelectorAll('.player__name')
        this.overlay.style.display = 'block'
        btnReset.style.display = 'block'
        btnReset.addEventListener('click', () => {
            window.location.reload();
        })

        if (stillPlayers.length == 1 && overs.length == playersLength - playersAndStoppers.length) {
            let pic = document.createElement('img')
            pic.setAttribute('class', 'playerWinner')
            pic.src = stillPlayers[0].img
            pic.alt = playerName[stillPlayers[0].id]
            this.winnerImg.appendChild(pic)
            this.scorePara.innerHTML = `Winner is ${playerName[stillPlayers[0].id].textContent} with ${stillPlayers[0].player.score} points`
        } else if (stoppers.length == 1 && overs.length == playersLength - playersAndStoppers.length) {
            let pic = document.createElement('img')
            pic.setAttribute('class', 'playerWinner')
            pic.src = stoppers[0].img
            pic.alt = playerName[stoppers[0].id]
            this.winnerImg.appendChild(pic)
            this.scorePara.innerHTML = `Winner is ${playerName[stoppers[0].id].textContent} with ${stoppers[0].player.score} points`
        } else if (playersAndStoppers.length > 1) {
            let scores = playersAndStoppers.map(plyr => plyr.player.score)
            let maxScore = Math.max(...scores)
            let winners = playersAndStoppers.filter(plyr => plyr.player.score == maxScore)
            if (winners.length == 1) {
                let pic = document.createElement('img')
                pic.setAttribute('class', 'playerWinner')
                pic.src = winners[0].img
                pic.alt = playerName[winners[0].id]
                this.winnerImg.appendChild(pic)
                this.scorePara.innerHTML = `Winner is ${playerName[winners[0].id].textContent} with ${winners[0].player.score} points`
            } else {
                let pics = winners.map(winner => {
                    let pic = document.createElement('img')
                    pic.setAttribute('class', 'playerWinner')
                    pic.src = winner.img
                    pic.alt = playerName[winner.id]
                    return pic
                })
                pics.forEach(pic => {
                    this.winnerImg.appendChild(pic)
                })

                this.scorePara.innerHTML = `Winners are ${winners.map(winner => playerName[winner.id].textContent).join(' and ')} with ${winners[0].player.score} points`
            }
        } else if (overs.length == playersLength) {
            this.scorePara.innerHTML = `No winner, all players are out of the game`
        }


    }

    loseOrWin(score, id) {
        let playerDiv = document.querySelectorAll('.player')
        let btnPlay = document.querySelectorAll('.btnPlay')
        let btnStop = document.querySelectorAll('.btnStop')
        let playerStatus = playerDiv[id].querySelector('.player__status')

        if (score > 21) {
            this.count++
            playerDiv[id].style.opacity = '0.3'
            playerDiv[id].style.border = 'red solid 3px'
            btnPlay[id].setAttribute('disabled', 'disabled')
            btnStop[id].setAttribute('disabled', 'disabled')
            this.players[id].player.isPlaying = false
            this.players[id].player.isOver = true
            playerDiv[id].style.pointerEvents = 'none'
            playerStatus.style.display = 'block'
            playerStatus.classList.add('player__over')
            playerStatus.innerHTML = 'Out of game !'
        }
    }

    createPlayers() {
        for (let i = 0; i < this.nbPlayers; i++) {
            let player = new Player(i);
            this.players.push(player);
            let playerDOM;

            if (i == 0 || i == 2) {
                playerDOM = `
                <div player-id=${i}>
                    <div class="player" data-id=${i}>
                        <img class="player__img" src="${this.players[i].img}" alt="player ${i + 1}">
                        <div class="player__status"></div>
                        <h2 class="player__name">${i == 0 ? 'John' : 'Barack'}</h2>
                        <div class="player__score">Total: 0</div>
                        <div class="buttons-wrapper">
                            <button id="btnPlay" class="btnPlay">Play</button>
                            <button id="btnStop" class="btnStop">Stop</button>
                        </div>
                    </div>
                    <ul class="player__cards"></ul>
                </div>`;

            } else {
                if (document.body.clientWidth > '1550') {
                    playerDOM = `
                    <div player-id=${i}>
                        <ul class="player__cards"></ul>
                        <div class="player" data-id=${i}>
                            <img class="player__img" src="${this.players[i].img}" alt="player ${i + 1}">
                            <div class="player__status"></div>
                            <h2 class="player__name">${i == 1 ? 'Jenny' : 'William'}</h2>
                            <div class="player__score">Total: 0</div>
                            <div class="buttons-wrapper">
                                <button id="btnPlay" class="btnPlay">Play</button>
                                <button id="btnStop" class="btnStop">Stop</button>
                            </div>
                        </div>
                    </div>`;
                } else {
                    playerDOM = `
                    <div player-id=${i}>
                        <div class="player" data-id=${i}>
                            <img class="player__img" src="${this.players[i].img}" alt="player ${i + 1}">
                            <div class="player__status"></div>
                            <h2 class="player__name">${i == 1 ? 'Jenny' : 'William'}</h2>
                            <div class="player__score">Total: 0</div>
                            <div class="buttons-wrapper">
                                <button id="btnPlay" class="btnPlay">Play</button>
                                <button id="btnStop" class="btnStop">Stop</button>
                            </div>
                        </div>
                        <ul class="player__cards"></ul>
                    </div>`;
                }
            }
            this.mainDiv.insertAdjacentHTML('beforeend', playerDOM);
        }
        if (this.players.length == 2) {
            this.mainDiv.style.gridTemplateRows = "1fr 1fr"
        } else if (this.players.length == 3) {
            this.mainDiv.style.gridTemplateRows = "1fr 1fr 1fr"
        } else {
            this.mainDiv.style.gridTemplateRows = "1fr 1fr 1fr 1fr"
        }
    }
}