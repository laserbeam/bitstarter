#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var rest = require('restler')
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = 'index.html';
var CHECKSFILE_DEFAULT = 'checks.json';

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log('%s does not exist. Exiting.', instr);
		process.exit(1);
	}
	return instr;
};

// var cheerioHtmlFile = function(htmlfile) {
// 	return cheerio.load(fs.readFileSync(htmlfile));
// };

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlstring, checksfile) {
	$ = cheerio.load(htmlstring);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var i in checks) {
		var present = $(checks[i]).length > 0;
		out[checks[i]] = present;
	}
	return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
	return fn.bind({});
};

var outputResult = function(checkJson) {
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
};

if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url <html_file>', 'URL to file')
		.parse(process.argv);
	var htmlstring;
	var checkJson;
	if(program.url) {
		htmlstring = rest.get(program.url).on('complete', function(result, response){
			if (result instanceof Error) {
	            console.error('Error: ' + util.format(response.message));
	        } else {
	        	checkJson = checkHtmlFile(result, program.checks);
	            outputResult(checkJson);
	        }
		});
	} else {
		htmlstring = fs.readFileSync(program.file);
		checkJson = checkHtmlFile(htmlstring, program.checks);
		outputResult(checkJson);	
	}
} else {
	exports.checkHtmlFile = checkHtmlFile;
};





