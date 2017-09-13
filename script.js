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

	$('.box').on('click', (e) => {
		console.log($(e.target));
		console.log($(e.target).next());
		console.log($(e.target).prev());
	})



})

function createBoard(min, rows, columns, parentDiv) {
	let html  = '';
	let mines = 0;
	for (let i=0; i<rows;i++) {
		for (let j=0;j<columns;j++) {
			if(Math.random() < 0.25) {
				html += '<div class="box bomb"></div>'
				mines++;
			} else {
				html += '<div class="box"></div>' 
			}
			
		}
	}
	console.log("mines " + mines);
	parentDiv.html('<div class="board"></div>');
	$('.board').html(html);
}
