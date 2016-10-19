var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imageop = require('gulp-image-optimization');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');


// Optimização de Imagens
gulp.task('images', function(cb) {
    gulp.src(['img/*.png','img/*.jpg','img/*.gif','img/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});

gulp.task('minify-js', function() {
  gulp.src('js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
    }))
    .pipe(gulp.dest('dist/js'))
});

// SASS
gulp.task('sass', function(){
	return gulp.src('css/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('css/components'));
});

// Autoprefixer
gulp.task('autoprefixer', function() {
    gulp.src('css/components/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Firefox > 20', '> 5%'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
});

// Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});


// Browser Sync
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Watch
gulp.task('watch', function() {
	gulp.watch('css/components/*.scss', ['sass']);
	gulp.watch('css/components/style.css', ['autoprefixer']);
    gulp.watch('css/style.css', ['minify-css']);
	gulp.watch("css/style.css").on('change', browserSync.reload);
    gulp.watch("./*.html").on('change', browserSync.reload);

});


gulp.task('default', ['minify-css', 'watch', 'sass', 'serve', 'images', 'minify-js', 'autoprefixer']);