var path = require('canonical-path');
var File = require('vinyl');

/**
 * @dgProcessor outputStreamProcessor
 */
module.exports = function (log, createDocMessage) {
  return {
    $runAfter: ['writing-files'],
    $runBefore: ['files-written'],
    $process: function (docs) {
      return docs
        .filter(function (doc) {
          if (!doc.outputPath)
            log.warn(createDocMessage('Document has no output path', doc));

          return doc.outputPath
        })
        .map(function (doc) {
          return new File({
            base: doc.fileInfo && doc.fileInfo.basePath || '',
            path: doc.fileInfo && path.resolve(doc.fileInfo.basePath, doc.outputPath) || doc.outputPath,
            contents: new Buffer(doc.renderedContent)
          })
        });
    }
  };
};
