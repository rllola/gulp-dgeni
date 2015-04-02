var path = require('canonical-path');
var _ = require('lodash');

/**
 * @dgProcessor inputStreamProcessor
 */
module.exports = function (log, readFilesProcessor) {
  return {
    $validate: {
      inputFiles: { presence: true }
    },
    $runAfter: ['reading-files'],
    $runBefore: ['files-read'],
    $process: function () {
      var readers = readFilesProcessor.fileReaders;

      return this.inputFiles
        .filter(function (file) {
          return !file.isDirectory();
        })
        .map(function (file) {
          var fileReader = matchFileReader(readers, file.path);
          var fileInfo = createFileInfo(file, fileReader);

          var docs = fileReader.getDocs(fileInfo);

          docs.forEach(function (doc) {
            doc.fileInfo = fileInfo;
          });

          return docs;
        })
        .reduce(function (docs, additionalDocs) {
          return docs.concat(additionalDocs);
        });
    }
  };
};

function createFileInfo (file, fileReader) {
  return {
    fileReader: fileReader.name,
    filePath: file.path,
    baseName: path.basename(file.path, path.extname(file.path)),
    extension: path.extname(file.path).replace(/^\./, ''),
    basePath: file.base,
    relativePath: file.relative,
    projectRelativePath: path.relative(file.cwd, file.path),
    content: file.isBuffer() ? file.contents.toString() : ''
  };
}

function matchFileReader (fileReaders, file) {
  var found = _.find(fileReaders, function (fileReader) {
    return !fileReader.defaultPattern || fileReader.defaultPattern.test(file);
  });

  if (!found) {
    throw new Error('No file reader found for ' + file);
  }

  return found;
}

