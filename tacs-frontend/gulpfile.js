var gulp = require('gulp'),
  less = require('gulp-less'),
  path = require('path'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create();

// Static server
// Tarea: compilar
// Correr un server local para la interfaz grafica. Si se modifica algun script, estilo o html, recarga el browser automaticamente.
gulp.task('compilar', ['concat', 'less'], function() {
  browserSync.init({
    server: {
      baseDir: "./dev"
    }
  });
  gulp.watch('dev/src/**/*.js', ['concat']).on('change', browserSync.reload);
  gulp.watch('dev/styles/**/*.less', ['less']).on('change', browserSync.reload);
  gulp.watch("dev/**/*.html").on('change', browserSync.reload);
});

// Tarea: concat
// Archivos: Todos los js en directorio y subdirectorios de /dev/src/
// Generar un solo archivo js de todos los archivos encontrados
// Destino: dev/bundle.js
gulp.task('concat', function() {
  gulp.src('dev/src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dev'));
});

// Tarea: less
// Archivos: dev/styles/mainStyle.less
// Generar un solo archivo css del archivo en cuestion y sus importados
// Destino: dev/style.css
gulp.task('less', function() {
  return gulp.src('dev/styles/mainStyle.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('dev'));
});
