#! /usr/bin/jsc

"use strict"

var console = {
    log: function (...rest) { print(rest) }
}

// BEGIN
// A generator function that produces
// a [0,1) prng function using 'code' as seed
//
function mk_prng(code) {
    // From https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    // which references http://pracrand.sourceforge.net/
    //
    // [tobin] beware!  experiments show that after seeding the first few values
    // returned are all very close to zero, which is not randomness.  Perhaps
    // the function needs to be called several times after seeding to start
    // to get pseudo-random sequence.
    // [update 7/16/2021: now believe above trouble is due to poor seeding.
    //  Updated to use xmur3() to harvest reasonable seed numbers]
    //
    function sfc32(a, b, c, d) {
	return function() {
	  a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
	  var t = (a + b) | 0;
	  a = b ^ b >>> 9;
	  b = c + (c << 3) | 0;
	  c = (c << 21 | c >>> 11);
	  d = d + 1 | 0;
	  t = t + d | 0;
	  c = c + t | 0;
	  return (t >>> 0) / 4294967296;
	}
    }
    function xmur3(str) {
	for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
	    h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
	    h = h << 13 | h >>> 19;
	return function() {
	    h = Math.imul(h ^ h >>> 16, 2246822507),
	    h = Math.imul(h ^ h >>> 13, 3266489909);
	    return (h ^= h >>> 16) >>> 0;
	}
    }
    // Here, use a hash function to generate better quality seeds.
    // Reference https://github.com/bryc/code/blob/master/jshash/\
    //	PRNGs.md#addendum-a-seed-generating-functions
    //
    var sgf = xmur3(code);   // sgf() == seedGeneratingFunction
    return sfc32(sgf(), sgf(), sgf(), sgf());
}
// END

let PR_STANDALONE = 1;   // pr -> PseudoRandom
if (PR_STANDALONE) {
    var idx, e, f;

let myrand = mk_prng("peace");
//let myrand = mk_prng("lovey");
//let myrand = mk_prng("harlo");
//let myrand = mk_prng("years");
    idx = 20;
    while (idx--) {
	e = myrand();
	console.log(e);
	continue;
	e = e * 2**50;
	f = Math.trunc(e);
	console.log(e);
	if ( f !== e) {
	    console.log("different");
	}
    }
}
