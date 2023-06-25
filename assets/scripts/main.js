import Board from './Board.js'

let inputNbPlayers = document.querySelector('#nbPlayers')
let btnPlay = document.querySelector('#startPlaying')
let main = document.querySelector('main')
let setPlayersForm = document.querySelector('.setPlayers')
let error = document.querySelector('#error')

btnPlay.addEventListener('click', (e) => {
    e.preventDefault();
    let nbPlayers = inputNbPlayers.value
    if (nbPlayers == '') {
        error.innerHTML = 'The filed is empty'
        return
    } else if (nbPlayers != '' && nbPlayers < 2 || nbPlayers > 4) {
        error.innerHTML = 'You have to enter a number between 2 and 4'
        return
    }
    let board = new Board(nbPlayers)
    setPlayersForm.classList.add('hidden')
})