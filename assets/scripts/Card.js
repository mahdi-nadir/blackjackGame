export default class Card {
    constructor() {
        this.figures = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];
        this.colors = ["hearts", "diamonds", "clubs", "spades"];
        this.card = this.createCard();
        this.deck = []
    }

    createCard() {
        let figure = this.figures[Math.floor(Math.random() * this.figures.length)];
        let color = this.colors[Math.floor(Math.random() * this.colors.length)];
        return {
            figure,
            color
        }
    }

    getCard() {
        let cardFigure = this.card.figure;
        let cardColor = this.card.color;
        let valeurFigure = this.getCardValue(cardFigure);
        let img = `assets/image/cards/${cardFigure}_of_${cardColor}.png`;

        return {
            cardFigure,
            cardColor,
            valeurFigure,
            img
        }
    }

    getCardValue(cardFigure) {
        let value = 0;
        if (cardFigure == 'ace') {
            value = 11;
        } else if ((cardFigure == 'jack') || (cardFigure == 'queen') || (cardFigure == 'king')) {
            value = 10;
        } else (
            value = parseInt(cardFigure)
        )
        return value;
    }

}