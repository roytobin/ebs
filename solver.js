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
function mk_solver() {
    const Move = [];
    Move[0]  = [1, 5, 4];
    Move[1]  = [0, 2, 6, 5, 4];
    Move[2]  = [1, 3, 7, 6, 5];
    Move[3]  = [2, 6, 7];
    Move[4]  = [0, 1, 5, 9, 8];
    Move[5]  = [1, 2, 6, 10, 9, 8, 4, 0];
    Move[6]  = [2, 3, 7, 11, 10, 9, 5, 1];
    Move[7]  = [3, 11, 10, 6, 2];
    Move[8]  = [4, 5, 9, 13, 12];
    Move[9]  = [5, 6, 10, 14, 13, 12, 8, 4];
    Move[10] = [6, 7, 11, 15, 14, 13, 9, 5];
    Move[11] = [7, 15, 14, 10, 6];
    Move[12] = [8, 9, 13];
    Move[13] = [9, 10, 14, 12, 8];
    Move[14] = [10, 11, 15, 13, 9];
    Move[15] = [11, 14, 10];
    const STlead = Symbol();
    const STgap = Symbol();
    const ST1 = Symbol();
    const ST2 = Symbol();
    const ST3 = Symbol();
    const STerr = Symbol();
    const Term_mask = 2**31;
    const ord_of_A = 'A'.charCodeAt(0);
    const ord_of_U = 'U'.charCodeAt(0);
    let ready = false
    let Dict = [];
    let Game = '';
    let All_found = {};

    let deadman = 0;
    function traverse(base, word) {
	let ref, off;
	const alpha = 'abcdefghijklmnopqrstuvwxyz';
	if (deadman > 50)  // only do a few, in case running browser
	    return;
	for (let off = 0; off < 26; ++off) {
	    ref = Dict[base+off];
	    
	    if ( undefined === ref )
		continue;
	    if ( ref >= Term_mask) {
		console.log(word + alpha[off]);  // concatenation
		ref = ref - Term_mask;  // clear bit arithmetically
		++deadman;
	    }
	    if (0 !== ref)
		traverse(ref, word + alpha[off]);  // recur after concatenation
	}
    }
    function insert(i, n) {
	Dict[i] = n;
	//console.log("insert ", i, n);
    }
    function init() {
        let septet;  // a group of 7 bits, encoded as a single ASCII character
	let term, j, n;
	let offset;  // offset is the index increment to the next defined reference
	let state = STlead;
        let index = 0;
	//console.log("init 5");	// debugging
	for (j=0; j < encDict.length; ++j) {
	    septet = encDict.charCodeAt(j);
	    //console.log("septet", septet);
	    switch(state) {
	    case STlead:
		// The msb of the septet indicates if this ref is word termination
		if (septet < 64) {
		    term = false;
		}
		else {
		    term = true;
		    septet = septet - 64;  // clear the msb arithmetically
		}

		if (septet < 52) {
		    n = 0;
		    offset = septet;
		    state = ST1;
		}
		else if (septet < 61) {
		    console.log("error: bad lead-in of", septet);
		    state = STerr;
		}
		else {
		    n = (64-septet) * 128**3;
		    //gap (actually index offset) is determined in the "gap" state
		    state = STgap;
		}
		continue;
	    case STgap:
		offset = septet;
		state = ST1;
		continue;
	    case ST1:
		n +=+ septet * 128**2;
		state = ST2;
		continue;
	    case ST2:
		n += septet * 128**1;
		state = ST3;
		continue;
	    case ST3:
		n += septet * 128**0;
		n += (term) ? Term_mask : 0;
		insert(index, n);
		index += offset;
		state = STlead;
		continue;
	    case STerr:
		// Stay in this state until the end of processing since there
		// is no way to resynchronize.
	        alert("A syncing error occurred decoding the dictionary used to find words");
		continue;
	    }
	}
    }
    function detect (word) {
	if (All_found[word]) return;
        All_found[word] = 1;
    }
    function wordfind (base, pos, word, verboten) {
        let letter = Game[pos];
	let off = letter.charCodeAt(0) - ord_of_A;
	let ref = Dict[base+off];

	/*
	If the letter is Q, then need to inject or intercede a U because the
	boggle die side is labeled "Qu."  Thus, no non-Qu words are permitted.
	Out, for example, are words "qat" and "qiviut."    Debatable if
	any non-Qu words are common US English.
	*/
	/* perl comment: Begin a BLOCK here that may possibly be redo'd to accommodate the
	# "QU" digraph.  This technique is employed to have the code for the
	# "detect" and recursion-ending statements written only once in one
	# place.  The redo works here because in perl a BLOCK is semantically
	# equivalent to a loop that executes once.
	// javascript comment: hack to simulate a redo
	*/
	{let once=1;
	while (once) {
	    if ( undefined === ref ) return;

	    if ( ref >= Term_mask) {
	        detect(word+letter);
		ref = ref - Term_mask;
	    }

	    if (0 === ref) return;

	    if ('Q' === letter) {
	        ref = Dict[ref + ord_of_U - ord_of_A];
		letter = letter + 'U';
	        continue;  // surrogate "redo"
	    }
	    --once;
	}}
	verboten = verboten | (1<<pos);
	for (let next_move of Move[pos]) {
	    if (verboten & (1<<next_move))
	        continue;
	    wordfind(ref, next_move, word+letter, verboten);  // recur
	}
    }
    return function(game) {
        Game = game;
        if (!ready) {
	    init();
            ready = true;
	}
	//traverse(0, "");  // debugging

	All_found = {};
	for (let pos = 0; pos < 16; ++pos) {
	    wordfind(0, pos, "", 0);
	}
        return Object.keys(All_found).sort();
    }
}
// END

let SO_STANDALONE = 1;
if (SO_STANDALONE) {
    let start, mid, stop;
    let list = [];
    let puzzle = ["liosysdasertaaga",
    "adqejilluketysbc",
    "ieearcltbtcuivrs",
    "toapyausizeynggy",
    "eyleseeaovtiitqg",
    "toapyausizeynggy",
    "nhwsifbywzehomen",
    "efdtybmwlstvivsm",
    "oeattdmjdcnrofvi",
    "trsentolienaoaam",
    "uhfewsburertdcmn",
    "ejluteifwygtheoe",
    "totaeqaddivyzter",
    "lsloeuweofildstv",
    "asnepufrthwluqds",
    "reynairtetojeton",
    "soigelniiiunstfq",
    "soigelniiiunstfq",
    "edmuetgirxaweesa",
    "nesnimlrnauigaga",
    "qwerasdfzxcvtegb",
    "unxjrkqotzetzdcv",
    "tkjyxqsetzzklmng",
    "awerasdfzxcvtegb",
    "ohgolxsmieseiocl",
    "togsnskiraoasrlr",
    "oikrgsrietihychd",
    ];

    load("encdict.js");
    start = Date.now();
    let solve = mk_solver();
    for (let idx = 0; idx < puzzle.length; ++idx) {
	let gg = puzzle[idx].toUpperCase();
	let res = gg.split(/(\w{4})/);
	console.log ( [res[1], res[3], res[5], res[7]].join("\n"));
	list[idx] = solve(gg);
	if (mid) ; else {mid = (new Date()).getTime()}
    }
    stop = Date.now();
   
    for (let idx = 0; idx < puzzle.length; ++idx) {
	console.log(list.length,mid-start, stop-start,list[idx]);
    }
}
