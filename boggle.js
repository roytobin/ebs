#! /usr/bin/jsc

"use strict"

var console = {
    log: function (...rest) { print(rest) }
}

function getline() {   // readln gets
    let l = readline();
    if (l) return l; 
    quit();
}

// BEGIN
function boggle(myrand) { // argument 'myrand' must be a PRNG function in interval [0,1)

    let die = [];
    die[ 0] = "IHNUMQ";
    die[ 1] = "EOTSSI";
    die[ 2] = "HNLNZR";
    die[ 3] = "AWTOOT";
    die[ 4] = "EEHNWG";
    die[ 5] = "EEGNAA";
    die[ 6] = "ERLIXD";
    die[ 7] = "EYTLRT";
    die[ 8] = "CMUOIT";
    die[ 9] = "AHSPOC";
    die[10] = "DRYVLE";
    die[11] = "ERWTVH";
    die[12] = "ABBOOJ";
    die[13] = "ASPFKF";
    die[14] = "EEUSIN";
    die[15] = "DTYTIS";

    function fisheryates(a) {  // shuffle (permute) the passed array in place
        for (let idx = a.length; --idx;) {
	    let j = Math.floor((idx+1)*myrand());
	    let t = a[j];
	    a[j] = a[idx];
	    a[idx] = t;
	}
	return a;
    }
    return function () { 
        let dice = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        let perm = fisheryates(dice);  // permute the order

	//console.log(perm);  // debugging

        let game = '';
	for(let idx = 0; idx < 16; ++idx) {
	    game = game + die[ perm[idx] ][ Math.floor(6*myrand()) ];
	}
	return game;
    }
}
// END

let BO_STANDALONE = 1;
if (BO_STANDALONE) {
    //boggle(Math.random);
    var kk = boggle(Math.random);   // return a game-generating function

    console.log(kk());
    console.log(kk());
    console.log(kk());
    console.log(kk());
    console.log(kk());
    console.log(kk());
    console.log(kk());
    console.log(kk());
}
