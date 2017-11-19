
document.getElementById('compare').addEventListener('click', function(){
	run(gen).catch(function(err){
		alert(err.message);
	})
})


function *gen(){

	//get input
	const starshipsInputOne = document.getElementById('optionOne').options[optionOne.selectedIndex].getAttribute('data');
	const starshipsInputTwo = document.getElementById('optionTwo').options[optionTwo.selectedIndex].getAttribute('data');
	const starshipsArray = [starshipsInputOne, starshipsInputTwo];
	const tableRows = document.getElementsByTagName('tr');
	const starshipValues = ['name', 'cost_in_credits', 'max_atmosphering_speed', 'cargo_capacity', 'passengers'];
	//fetch starships
	


	for( var i = 1; i < tableRows.length; i++){
		const vals = starshipValues[i-1],
		cells = tableRows[i].children;

		

		for( var j = 0; j < starshipsArray.length; j++){
			cells[j+1].style.backgroundColor = "white";
			const starshipResponse = yield fetch('https://swapi.co/api/starships/' + starshipsArray[j]);
			const starship = yield starshipResponse.json();
			cells[j+1].innerHTML = starship[vals];
		}

	//compare values

		if( i > 1 && (cells[2].innerHTML - cells[1].innerHTML) != 0){
			cells[2].innerHTML - cells[1].innerHTML > 0 ?
			cells[2].style.backgroundColor = 'red':
			cells[1].style.backgroundColor = 'red';
		}

	}

	
	
}


function run(genFunc) {
	const genObject = genFunc(); //create a generator object

	function iterate(iteration){ //recursive function to iterate through promises
		if(iteration.done){ //stop iterating when done and return final value wrapped in a a Promise
			return Promise.resolve(iteration.value);
		}
		return Promise.resolve(iteration.value) //returns a promise with its  then and catch methods filled
		.then( x => iterate(genObject.next(x))) // calls recursive function on the next value to be iterated
		.catch( x => iterate(genObject.throw(x))); //throws an error if a rejection is encountered
	}

	try {
		return iterate(genObject.next()); // starts a recursive loop
	} catch (ex){
		return Promise.reject(ex); // returns a rejected promise if an exception is caught
	}
}
