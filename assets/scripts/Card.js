export default class Card {
    constructor() {
        this.figures = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Valet", "Reine", "Roi", "Ace"];
        this.colors = ["Coeur", "Carreau", "Trèfle", "Pique"];
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
        return {
            cardFigure,
            cardColor,
            valeurFigure
        }
    }

    getCardValue(cardFigure) {
        let value = 0;
        if (cardFigure == 'Ace') {
            value = 11;
        } else if ((cardFigure == 'Valet') || (cardFigure == 'Reine') || (cardFigure == 'Roi')) {
            value = 10;
        } else (
            value = parseInt(cardFigure)
        )
        return value;
    }

}