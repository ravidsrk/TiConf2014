// creates the "mocha" global necessary to run a test suite anywhere in your app
require('ti-mocha');
var should = require('should');

var outputFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'results.json');
outputFile.createFile();


mocha.setup({
    reporter: 'ti-json',    // the reporter to use with your tests
    outputFile: outputFile, // write results to the given Ti.Filesystem.File file
    quiet: true             // if true, suppress all console logging
});

// create the test suite
describe('ti-mocha', function() {

    describe('suite 1', function() {

        it('shows passing tests (fast)', function(){});

        it('shows passing tests (slow)', function(done){
            setTimeout(done, 1500);
        });

    });

    describe('suite 2', function() {

        it('shows pending tests');

        it('fails a test', function() {
            // should(true).ok;
            throw new Error('this shoud fail');
        });

    });

});

// run the tests
var runner = mocha.run(function() {
    // print the stats from the runner after the test completes
    console.log(JSON.stringify(runner.stats));
});
