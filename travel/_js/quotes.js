var quotes = [{"quote":"A good traveler has no fixed plans, and is not intent on arriving","author":"Lao Tzu"},
{"quote":"The world is a book and those who do not travel read only one page", "author": "St. Augustine"},
{"quote":"One's destination is never a place, but a new way of seeing things.", "author": "Henry Miller"},
{"quote":"A journey of a thousand miles must begin with a single step.", "author": "Lao Tzu"},
{"quote":"A journey is best measured in friends, rather than miles.", "author": "Tim Cahill"},
{"quote":"Not all those who wander are lost.", "author": "J. R. R. Tolkein"},
{"quote":"It is better to travel than to arrive.", "author": "Buddha"},
{"quote":"To travel is to discover that everyone is wrong about other countries.", "author": "Aldous Huxley"},
{"quote":"Travel and change of place impart new vigor to the mind.", "author": "Seneca"}
]

var cur_quote;
function change_quote(){
	var r = Math.floor(Math.random()*quotes.length);
	while(r == cur_quote)
		var r = Math.floor(Math.random()*quotes.length);

	var q = $('span.quote');
	q.html('"' + quotes[r].quote + '" <span> - ' + quotes[r].author + '</span>');
	q.fadeIn(2000);
}

$(document).ready(function(){
		change_quote();
		setInterval(function(){ $('span.quote').fadeOut(2000,change_quote); },40000);
});
