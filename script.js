window.onload = function() {
	const body = document.querySelector('body');
	const cellSize = getComputedStyle(body).getPropertyValue('--size');
	const easyBtn = document.querySelector('.easy');
	const medBtn = document.querySelector('.medium');
	const hardBtn = document.querySelector('.hard');
	
	
	initBoard(10, 10, 0.15);
	easyBtn.addEventListener('click', () => {
		initBoard(10, 10, 0.15);
	})

	medBtn.addEventListener('click', () => {
		initBoard(15, 15, 0.20);
	})

	hardBtn.addEventListener('click', () => {
		initBoard(20, 20, 0.30);
	})

	
}

// makes a new board
function initBoard(rows, columns, bombChance) {
	parentElement = document.querySelector('main');
	parentElement.innerHTML = '';
	const board = document.createElement("table");
	board.classList.add('board');
	const cells = [];
	for(let i=0;i<rows;i++) {
		const row = document.createElement("tr");
		for(let j=0;j<columns;j++) {
			const cell = document.createElement("td");
			const bomb = Math.random() < bombChance; //bomb chance
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
			if(e.target.classList.contains('box-opened')) return;
			
			if (cells[i].disabled) {
				const flagIsSet = cells[i].element.firstChild.tagName;
				if(flagIsSet) {
					cells[i].element.textContent = "?";
				} else {
					cells[i].element.textContent = "";
					cells[i].disabled = false;
				}
			} else {
				e.target.innerHTML = "<img src='minesweepericons/flag.svg'>";
				console.log(cells[i].element.firstChild);
				console.log("else");
				cells[i].disabled = true;
			}
		});
	}
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
	const alreadyOpen = cell.element.classList.contains('box-opened');
	const adjacentNotOpen = adjacentCells.filter(cell => !alreadyOpen);
	const adjacentBombs = calcBombs(adjacentNotOpen);
	cell.element.classList.add('box-opened');
	if(cell.isBomb) {
		cell.element.innerHTML = '<img src="minesweepericons/bomb.svg">';
	} else if(adjacentBombs === 0) {
		adjacentNotOpen.forEach(cell => {
			openCell(cell,cells);	
		});
	} else {
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
