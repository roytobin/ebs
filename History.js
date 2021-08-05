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

// Emulate the window.localStorage HTML Web Storage API
//
let store = Object.create(null);
let localStorage = {
    store,
    setItem(k,v) {this.store[k] = v; return v},
    getItem(k)   {return this.store[k]}
};

// BEGIN
class History {  // a wrapper around Web Storage API
    constructor() {
	let keystr = localStorage.getItem(History.key);  // returns string of previously gen'd books
	this.prev = keystr ? keystr.split('+') : [];  // Split into an array (if truthy)
    }

    _strRep(c) {  // STRing REPresentation, intended only for internal use
        return c ? c.toString() : "void";
    }

    isPresent(c) {
        c = this._strRep(c);  // expecting a string, but make damn sure
	return this.prev.indexOf(c) >= 0;
    }

    getHist() {
	return localStorage.getItem(History.key);
    }

    add(c) {
        c = this._strRep(c);  // expecting a string, but make damn sure
	if (this.isPresent(c))
	    return null;
	this.prev.unshift(c);
	this.prev.length = Math.min(History.limit, this.prev.length);
	return localStorage.setItem(History.key, this.prev.join('+'));
    }

}
History.limit = 600;
History.key = `dont-repeat-last-${History.limit}-random-gamebooks`;
// END

let HI_STANDALONE = 1;
if (HI_STANDALONE) {
    var hh = new History();

    let x,y,z;

    hh.add("one");
    hh.add("one");
    hh.add("two");
    hh.add("one");
    hh.add("two");
    hh.add("one");
    hh.add("two");
    hh.add("two");
    //hh.add("three");
    hh.add();

    hh.add("four");
    x = hh.getHist();
    console.log(x);
    hh.add("five");
    x = hh.getHist();
    console.log(x);

    x = hh.isPresent();
    y = hh.isPresent("nosuch");
    z = hh.isPresent("four");
    console.log(x, y, z);
    for (let e in localStorage.store) {
	console.log(e, localStorage.store[e]);
    }
}
