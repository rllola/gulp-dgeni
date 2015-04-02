var through = require('through2');
var _ = require('lodash');

var Dgeni = require('dgeni');
var Package = Dgeni.Package;

var base = require('dgeni-packages/base');

var inputStreamProcessor = require('./processors/input-stream');
var outputStreamProcessor = require('./processors/output-stream');

module.exports = function (options) {
  _.assign({
    logLevel: 'error',
    packages: [base]
  }, options);

  var files = [];

  return through.obj(queue, finish);

  function queue (chunk, encoding, callback) {
    files.push(chunk);

    callback();
  }

  function finish (callback) {
    var pkg = new Package('gulp', options.packages);
    var stream = this;

    pkg
      .processor('inputStreamProcessor', inputStreamProcessor)
      .processor('outputStreamProcessor', outputStreamProcessor)
      .config(function (log) {
        log.level = options.logLevel;
      })
      // Disable original file handlers
      .config(function (readFilesProcessor, writeFilesProcessor) {
        readFilesProcessor.$enabled = false;
        writeFilesProcessor.$enabled = false;
      })
      .config(function (inputStreamProcessor) {
        inputStreamProcessor.inputFiles = files;
      });

    var dgeni = new Dgeni([pkg]);

    dgeni.generate().then(function (docs) {
      docs.forEach(function (doc) {
        stream.push(doc);
      });

      callback();
    });
  }
};
