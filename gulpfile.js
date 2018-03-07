let gulp = require('gulp'),
    maps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
  rename = require('gulp-rename'),
    csso = require('gulp-csso'),
imagemin = require('gulp-imagemin'),
     del = require('del'),
 connect = require('gulp-connect'),
  concat = require('gulp-concat');

const options =  {dist: 'dist'};

/*
  Task to concatenate all javascript files to all.js and to generate the source map
  all.js.map
 */

gulp.task('concatScripts',() => {
  return gulp.src(['js/circle/*.js', 'js/*.js'])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));

});

/*
  Task to minify the javascript file to all.min.js and place it in the folder dist/scripts
*/

gulp.task('scripts', ['concatScripts'], () => {
  return gulp.src('js/all.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest(options.dist + '/scripts'));

});

/*
  Task to compile sass to all.css and generate the source map
*/

gulp.task('compileSass', () => {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(rename('all.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'))
});

/*
  Task to minify the css file to all.min.css and place it in the folder dist/styles.
  Also reloads the page when the css changes.
*/

gulp.task('styles', ['compileSass'], () => {
  return gulp.src('css/all.css')
    .pipe(csso())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(options.dist + '/styles'))
    .pipe(connect.reload());

});

/*
  Task to optimize the image files and place it in the folder dist/contents
*/

gulp.task('images', () => {
  return gulp.src(['images/*.jpg','images/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest(options.dist + '/contents'));

});

/* Gulp task to delete the dist folder.
*/

gulp.task('clean', () => {
    return del(options.dist);
});

/*
  Task to watch the changes in sass files and to start the styles task.
*/

gulp.task('watchFiles', () => {
  gulp.watch('sass/**/*.scss',['styles']);
});


/*
  task to run the 'Scripts', 'styles' and images tasks and copy the index.html and the
  icons folder to the dist folder.
*/
gulp.task('distribute', ['scripts','styles','images'], () => {
  return gulp.src(['index.html', './icons*/**/*.*' ])
    .pipe(gulp.dest(options.dist), {base: './'});
});

/*
  Build task which do the buld process once the clean task is complete.
*/
gulp.task('build', ['clean'], () => {
  gulp.start('distribute');
});

/*
  Task to start the server with livereload option. It also starts the build and watchFiles
  tasks
*/

gulp.task('connect', ['build','watchFiles'], () => {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

/*
  Default task which starts the connect task.
*/

gulp.task('default', ['connect'] );
