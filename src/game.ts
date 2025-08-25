// Definimos tipos personalizados para mayor claridad
type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];

// Clase principal del juego
class TicTacToe {
    // Propiedades privadas (solo accesibles dentro de la clase)
    private board: Board;
    private currentPlayer: Player;
    private gameActive: boolean;
    private statusElement: HTMLElement;
    private boardElement: HTMLElement;
    private restartButton: HTMLElement;
    
    // Combinaciones ganadoras (índices del tablero)
    private readonly winningCombinations: number[][] = [
        [0, 1, 2], // Fila superior
        [3, 4, 5], // Fila media
        [6, 7, 8], // Fila inferior
        [0, 3, 6], // Columna izquierda
        [1, 4, 7], // Columna media
        [2, 5, 8], // Columna derecha
        [0, 4, 8], // Diagonal principal
        [2, 4, 6]  // Diagonal secundaria
    ];

    constructor() {
        // Inicializar el estado del juego
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        // Obtener elementos del DOM
        this.statusElement = document.getElementById('status')!;
        this.boardElement = document.getElementById('gameBoard')!;
        this.restartButton = document.getElementById('restartBtn')!;
        
        // Configurar el juego
        this.initializeGame();
    }

    // Método para inicializar el juego
    private initializeGame(): void {
        this.createBoard();
        this.updateStatus(`Turno del Jugador ${this.currentPlayer}`);
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    // Crear el tablero visual
    private createBoard(): void {
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
    private handleCellClick(event: Event): void {
        const target = event.target as HTMLButtonElement;
        const cellIndex = parseInt(target.getAttribute('data-index')!);
        
        // Verificar si el juego está activo y la celda está vacía
        if (!this.gameActive || this.board[cellIndex] !== null) {
            return;
        }
        
        // Realizar la jugada
        this.makeMove(cellIndex, target);
    }

    // Realizar una jugada
    private makeMove(cellIndex: number, cellElement: HTMLButtonElement): void {
        // Actualizar el estado interno
        this.board[cellIndex] = this.currentPlayer;
        
        // Actualizar la vista
        cellElement.textContent = this.currentPlayer;
        cellElement.classList.add(this.currentPlayer.toLowerCase());
        cellElement.disabled = true;
        
        // Verificar si hay ganador o empate
        if (this.checkWinner()) {
            this.handleGameEnd('win');
        } else if (this.checkDraw()) {
            this.handleGameEnd('draw');
        } else {
            // Cambiar turno
            this.switchPlayer();
        }
    }

    // Verificar si hay un ganador
    private checkWinner(): boolean {
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
    private checkDraw(): boolean {
        return this.board.every(cell => cell !== null);
    }

    // Resaltar celdas ganadoras
    private highlightWinningCells(winningCombination: number[]): void {
        const cells = this.boardElement.querySelectorAll('.cell');
        winningCombination.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    // Cambiar jugador
    private switchPlayer(): void {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus(`Turno del Jugador ${this.currentPlayer}`);
    }

    // Manejar fin del juego
    private handleGameEnd(result: 'win' | 'draw'): void {
        this.gameActive = false;
        
        if (result === 'win') {
            this.updateStatus(`¡Jugador ${this.currentPlayer} gana!`);
        } else {
            this.updateStatus('¡Empate!');
        }
        
        // Desabilitar todas las celdas
        const cells = this.boardElement.querySelectorAll('.cell') as NodeListOf<HTMLButtonElement>;
        cells.forEach(cell => cell.disabled = true);
    }

    // Actualizar mensaje de estado
    private updateStatus(message: string): void {
        this.statusElement.textContent = message;
    }

    // Reiniciar el juego
    private restartGame(): void {
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