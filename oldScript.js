$(document).ready(function() {
	let size = parseInt($('.board').css('--size'), 10);
	let rows = 10;
	let columns = 10;
	const minMines = 15;

	let boardSize = 12 * size;
	$('.board').css('height', boardSize + 'px');
	$('.board').css('width', boardSize + 'px');
	$('.board').css('padding', size/2 + 'px');

	const container = $('.centered');

	createBoard(minMines, rows, columns, container);

	// pommin klikkaaminen
	$('.bomb').on('click', gameOver);

	// muiden ruutujen klikkaaminen
	$('.box').on('click', (e) => {
		const clickedBox = e.target;
		if($(clickedBox).hasClass('bomb')) {
			return;
		}
		const adjacent = getAdjacent(clickedBox);
		let bombs = calcBombs(adjacent);
		open(clickedBox, bombs);
		if(bombs === 0) {		
			let outerBombs = openAdjacent(adjacent);
			console.log(outerBombs);
			if(outerBombs.length > 0) {
				openAdjacent(getAdjacent(outerBombs));
			}
			
		}

	});

function openAdjacent(adjacent) {
	console.log(adjacent);
	let noBombs = [];
	$.each(adjacent, function(index, id) { 
		const outer = $('#'+id)[0];		
		const outerAdjacent = getAdjacent(outer);
		const bombs = calcBombs(outerAdjacent);
		open(outer, bombs);	
		if(bombs == 0) {
			noBombs.push(id);
		}	
	})
	return noBombs;
}

function createBoard(min, rows, columns, parentDiv) {
	let html  = '';
	let mines = 0;
	let id = 1;
	for (let i=0; i<rows;i++) {
		for (let j=0;j<columns;j++) {
			if(Math.random() < 0.25) {
				html += '<div id=' + id + ' class="box bomb"></div>'
				mines++;
			} else {
				html += '<div id=' + id + ' class="box"></div>' 
			}
			id++;
		}
	}
	// console.log("mines " + mines);
	parentDiv.html('<div class="board"></div>');
	$('.board').html(html);
}

function gameOver(e) {
	console.log("BOOM");
	$('.bomb').each(function(i, element) {
		console.log(element);
		$(element).removeClass('box');
		$(element).addClass('box-opened');
		$(element).html('x');
	})
}

function getAdjacent(box) {
	const minID = 1;
	const maxID = rows * columns;
	const current = box;
	const id = parseInt(current.id,10);
	let topID = id - columns;
	let botID = id + columns;

	let adjacent = [];

	// klikatun yläpuolella oleva rivi
	if(topID >= minID) {
		let topLeft = topID - 1;
		let topRight = topID + 1;
		if ((topLeft % columns) > 0) {
			adjacent.push($('#'+topLeft)[0]);
		}
		adjacent.push(topID);
		if ((topRight % columns) != 1) {
			adjacent.push(topRight);
		}
	}  

	// klikatun viereiset palikat
	if((id - 1) % columns > 0) {
		adjacent.push(id-1);
	}
	if((id + 1) % columns != 1) {
		adjacent.push(id+1);
	}

	// klikatun alapuolella oleva rivi
	if(botID <= maxID) {
		let botLeft = botID - 1;
		let botRight = botID + 1;
		if ((botLeft % columns) > 0) {
			adjacent.push(botLeft);
		}
		adjacent.push(botID);
		if ((botRight % columns) != 1) {
			adjacent.push(botRight);
		}
	}
	return adjacent;
}

function calcBombs(adjacent) {
	let bombs = 0;
	$.each(adjacent, function(index, id) {
		console.log(adjacent[index]);
		if(adjacent.hasClass('bomb')) {
			console.log("WOKRDS");
			bombs++;
		}
	})
	return bombs;
}

function open(box, bombs) {
	$(box).removeClass('box');
	$(box).addClass('box-opened');
	if(bombs === 0) {
		$(box).html('');
	} else {
		$(box).html(bombs);
	}
}

})