# gulp-dgeni

> Build extensible documentation with [dgeni](https://github.com/angular/dgeni).

## Install

Install gulp-dgeni using NPM:

    $ npm install --save-dev gulp-dgeni

## Usage

```javascript
var dgeni = require('gulp-dgeni');
var ngdoc = require('dgeni-packages/ngdoc');

gulp.task('docs', function () {
  return gulp.src(['docs/**/*.ngdoc'])
    .pipe(dgeni({packages: [ngdoc]}))
    .pipe(gulp.dest('build/docs');
});
```

## API

### dgeni([options])

#### options

##### packages

Type: `Array`
  
An array of dgeni packages that form the documenation pipeline.

##### logLevel

Type: `string`
Default: `error`

The level of logging output that dgeni should generate (one of `debug`, `info`, `warning`, `error`).
