"use strict";
// Clase principal del juego
class TicTacToe {
    constructor() {
        // Combinaciones ganadoras (índices del tablero)
        this.winningCombinations = [
            [0, 1, 2], // Fila superior
            [3, 4, 5], // Fila media
            [6, 7, 8], // Fila inferior
            [0, 3, 6], // Columna izquierda
            [1, 4, 7], // Columna media
            [2, 5, 8], // Columna derecha
            [0, 4, 8], // Diagonal principal
            [2, 4, 6] // Diagonal secundaria
        ];
        // Inicializar el estado del juego
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        // Obtener elementos del DOM
        this.statusElement = document.getElementById('status');
        this.boardElement = document.getElementById('gameBoard');
        this.restartButton = document.getElementById('restartBtn');
        // Configurar el juego
        this.initializeGame();
    }
    // Método para inicializar el juego
    initializeGame() {
        this.createBoard();
        this.updateStatus(`Turno del Jugador ${this.currentPlayer}`);
        this.restartButton.addEventListener('click', () => this.restartGame());
    }
    // Crear el tablero visual
    createBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i.toString());
            // Agregar evento click a cada celda
            cell.addEventListener('click', (event) => this.handleCellClick(event));
            this.boardElement.appendChild(cell);
        }
    }
    // Manejar click en una celda
    handleCellClick(event) {
        const target = event.target;
        const cellIndex = parseInt(target.getAttribute('data-index'));
        // Verificar si el juego está activo y la celda está vacía
        if (!this.gameActive || this.board[cellIndex] !== null) {
            return;
        }
        // Realizar la jugada
        this.makeMove(cellIndex, target);
    }
    // Realizar una jugada
    makeMove(cellIndex, cellElement) {
        // Actualizar el estado interno
        this.board[cellIndex] = this.currentPlayer;
        // Actualizar la vista
        cellElement.textContent = this.currentPlayer;
        cellElement.classList.add(this.currentPlayer.toLowerCase());
        cellElement.disabled = true;
        // Verificar si hay ganador o empate
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        }
        else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        }
        else {
            // Cambiar turno
            this.switchPlayer();
        }
    }
    // Verificar si hay un ganador
    checkWinner() {
        for (const combination of this.winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]) {
                // Resaltar celdas ganadoras
                this.highlightWinningCells(combination);
                return true;
            }
        }
        return false;
    }
    // Verificar si hay empate
    checkDraw() {
        return this.board.every(cell => cell !== null);
    }
    // Resaltar celdas ganadoras
    highlightWinningCells(winningCombination) {
        const cells = this.boardElement.querySelectorAll('.cell');
        winningCombination.forEach(index => {
            cells[index].classList.add('winner');
        });
    }
    // Cambiar jugador
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus(`Turno del Jugador ${this.currentPlayer}`);
    }
    // Manejar fin del juego
    handleGameEnd(result) {
        this.gameActive = false;
        if (result === 'win') {
            this.updateStatus(`¡Jugador ${this.currentPlayer} gana!`);
        }
        else {
            this.updateStatus('¡Empate!');
        }
        // Desabilitar todas las celdas
        const cells = this.boardElement.querySelectorAll('.cell');
        cells.forEach(cell => cell.disabled = true);
    }
    // Actualizar mensaje de estado
    updateStatus(message) {
        this.statusElement.textContent = message;
    }
    // Reiniciar el juego
    restartGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.createBoard();
        this.updateStatus(`Turno del Jugador ${this.currentPlayer}`);
    }
}
// Inicializar el juego cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
