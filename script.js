window.onload = function() {
	const parentElement = document.querySelector('.centered');
	const body = document.querySelector('body');
	const cellSize = getComputedStyle(body).getPropertyValue('--size');
	
	let rows = 10;
	let columns = 10;
	const cells = initBoard(rows, columns, parentElement);

	for(let i=0;i<cells.length;i++) {
		const cellElement = cells[i].element;

		//left click
		cellElement.addEventListener('click', () => {
			if(cells[i].disabled) return;
				
			if(cells[i].isBomb) {
				gameOver(cells);
				return;
			}
			openCell(cells[i], cells);
		});

		// right click
		cellElement.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			if(!e.target.classList.contains('box-opened')) {
				if(cells[i].disabled) {
					e.target.textContent = "";
					cells[i].disabled = false;
				} else {
					e.target.textContent = "?";
					cells[i].disabled = true;
				}
			}
		});
	}
}

// makes a new board
function initBoard(rows, columns, parentElement) {
	parentElement.innerHTML = '';
	const board = document.createElement("table");
	board.classList.add('board');
	const cells = [];
	for(let i=0;i<rows;i++) {
		const row = document.createElement("tr");
		for(let j=0;j<columns;j++) {
			const cell = document.createElement("td");
			const bomb = Math.random() < 0.2;
			cell.classList.add('box');
			cells.push({
				element: cell,
				pos: {
					row: i,
					col: j
				},
				isBomb: bomb,
				disabled: false
			});
			if(cells[cells.length-1].isBomb) {
				cell.classList.add('bomb');
			}
			row.appendChild(cell);
		}
		board.appendChild(row);
	}
	parentElement.appendChild(board);	
	return cells;
}

// return up to 8 cells next to the clicked one
function getAdjacent(cells, pos) {
	const positions = [
		{row: pos.row-1, col: pos.col-1},
		{row: pos.row-1, col: pos.col},
		{row: pos.row-1, col: pos.col+1},
		{row: pos.row, col: pos.col-1},
		{row: pos.row, col: pos.col+1},
		{row: pos.row+1, col: pos.col-1},
		{row: pos.row+1, col: pos.col},
		{row: pos.row+1, col: pos.col+1},	
	];
	const adjacent = cells.filter(cell => {
		for(let i=0;i<positions.length;i++) {
			if(positions[i].row === cell.pos.row && positions[i].col === cell.pos.col) {
				return cell;
			}
		}
	})
	return adjacent;	
} 

// returns number of bombs next to the clicked cell
function calcBombs(adjacent) {
	let bombs = 0;
	adjacent.forEach(cell => {
		bombs += cell.isBomb ? 1 : 0;
	});
	return bombs;
}

// opens cell and if it's empty -> opens all the adjacent empty cells too
function openCell(cell, cells) {
	const pos = cell.pos;
	const adjacentCells = getAdjacent(cells, pos);
	const adjacentNotOpen = adjacentCells.filter(cell => !cell.element.classList.contains('box-opened'));
	const adjacentBombs = calcBombs(adjacentNotOpen);
	if(cell.isBomb) {
		cell.element.classList.add('box-opened','bomb');
		cell.element.textContent = "X";
	} else if(adjacentBombs === 0) {
		adjacentNotOpen.forEach(cell => {
			cell.element.classList.add('box-opened');
			openCell(cell,cells);	
		});
	} else {
		cell.element.classList.add('box-opened');
		cell.element.textContent = adjacentBombs;
	}
}

// player clicks on a bomb
function gameOver(cells) {
	console.log("Game over!");
	cells.forEach(cell => {
		cell.element.classList.add('box-opened');
		openCell(cell, cells);
	});
}
