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
	$('.bomb').on('click', (e) => {
		console.log("BOOM");
		$(e.target).removeClass('box');
		$(e.target).addClass('box-text');
		$(e.target).html('X');
	});

	// muiden ruutujen klikkaaminen
	$('.box').on('click', bombsNearby);



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

function bombsNearby(e) {
	if($(e.target).hasClass('bomb')) {
		return;
	}
	const minID = 1;
	const maxID = rows * columns;
	const current = e.target;
	const id = parseInt(current.id,10);
	let topID = id - columns;
	let botID = id + columns;
	let bombs = 0;

	let adjacent = [];

	// klikatun yläpuolella oleva rivi
	if(topID >= minID) {
		let topLeft = topID - 1;
		let topRight = topID + 1;
		if ((topLeft % columns) > 0) {
			adjacent.push(topLeft);
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

	$.each(adjacent, function(index, id) {
		if($('#'+id).hasClass('bomb')) {
			bombs++;
		}
	})
	console.log(adjacent);
	console.log("bombs " + bombs);
	$(current).removeClass('box');
	$(current).addClass('box-text');
	$(current).html(bombs);
}

})