IW = {};
require("./dictionary4.js");
IW.cleanDictionary = [];
for (var i = 0; i < IW.dictionary.length; i++) {
	if(IW.dictionary[i] !== 1) {
		IW.cleanDictionary.push(0);
	} else {
		IW.cleanDictionary.push(1);
	}
}

function compareArrays(array2) {
		console.log(IW.dictionary.length);
		console.log(array2.length);
	for(i =0; i < array2.length; i++) {
		var origValue, newValue,correct;

		correct = true;
		origValue = IW.dictionary[i];
		newValue = array2[i];

		if(origValue == undefined) {origValue = 0;}//no else

		if(origValue !== newValue) {
			console.log("Value mismatch at index " + i);
			correct = false;
		}
	}
	return correct
}

var correct = compareArrays(IW.cleanDictionary);
console.log(correct);

IW.stringConvert = "";
var startIndex = 0;
//compress the array;
for (i=0; i< IW.cleanDictionary.length; i += 6) {
	var ones,twos,fours,eights,sixteens,thirtytwos,charcode;
	ones = IW.cleanDictionary[i];
	twos = IW.cleanDictionary[i+1];
	fours = IW.cleanDictionary[i+2];
	eights = IW.cleanDictionary[i+3];
	sixteens = IW.cleanDictionary[i+4];
	thirtytwos = IW.cleanDictionary[i+5];

	charcode = 33; //avoid blank spaces
	charcode += ones;
	charcode += twos * 2;
	charcode += fours * 4;
	charcode += eights * 8;
	charcode += sixteens * 16;
	charcode += thirtytwos * 32;

	IW.stringConvert += String.fromCharCode(charcode);
}

var compressedArray = IW.stringConvert.split("");
IW.compressConversion = [];
for(i=0; i< compressedArray.length; i++) {
	var ones,twos,fours,eights,sixteens,thirtytwos,character,value,temp;
	character = compressedArray[i];
	value = character.charCodeAt() - 33;
	temp = value;
	thirtytwos = Math.floor(value/32);
	temp -= thirtytwos * 32;
	sixteens = Math.floor(temp/16);
	temp -= sixteens * 16;
	eights = Math.floor(temp/8);
	temp -= eights * 8;
	fours = Math.floor(temp/4);
	temp -= fours * 4;
	twos = Math.floor(temp/2);
	temp -= twos * 2;
	ones = temp;
	IW.compressConversion.push(ones,twos,fours,eights,sixteens,thirtytwos);
}

console.log(compareArrays(IW.compressConversion));