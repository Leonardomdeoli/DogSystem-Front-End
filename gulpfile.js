/**
 * @author Leonardo Mendes 24-02-2018
 */

//Dependencias gulp
var gulp = require('gulp')
  , inject = require('gulp-inject') // injetar css e js na index.html
  , imagemin = require('gulp-imagemin') //Mimificar imagens
  , clean = require('gulp-clean') // apgar diretorios
  , htmlReplace = require('gulp-html-replace') //Atualziar fonte html
  , concat = require('gulp-concat') //Contacatenar fontes
  , uglify = require('gulp-uglify') //Mimificar arquivos
  , jshint = require('gulp-jshint') // Encontrar falhas js
  , jshintStylish = require('jshint-stylish') // Template
  , csslint = require('gulp-csslint') // Encontrar falhas css
  , csslintStylish = require('csslint-stylish') // Encontrar falhas css
  , browserSync = require('browser-sync').create()// browser-sync
  , less = require('gulp-less')// Compilar less
  , connect = require('gulp-connect')
  , gulpDocs = require('gulp-ngdocs');// Servidor


// coando gulp ou npm run gulp
gulp.task('default', ['gulp-inject', 'browser-sync', 'watch']);

// Importa as dependencias para o projeto apos npm install
gulp.task('gulp-import', ['lib-js', 'lib-css', 'lib-font']);

//Gerando documentação
gulp.task('doc', function () {
  var gulpDocs = require('gulp-ngdocs');
  return gulp.src('app/src/**/*.js')
    .pipe(gulpDocs.process())
    .pipe(gulp.dest('./docs'));
});

//Servidor documentação
gulp.task('connect_doc', function () {
  connect.server({
    root: 'docs',
    livereload: false,
    fallback: 'docs/index.html',
    port: 8083
  });

  gulp.watch('./docs/*').on('change', connect.reload);
});

var port = process.env.PORT || 5000;

gulp.task('serveprod', function() {
  connect.server({
    root: 'app',
    port: process.env.PORT || 5000, // localhost:5000
    livereload: false
  });
});

//Apagando conteudo da pasta
gulp.task('clean', function () {
  return gulp.src('dist').pipe(clean());
});

//Copiando arquivos do projeto
gulp.task('copy', ['clean'], function () {
  return gulp.src('app/**/*').pipe(gulp.dest('dist'));
});

//Mimificando de imagens
gulp.task('gulp-image-min', function () {
  gulp.src('dist/img/**/*').pipe(imagemin()).pipe(gulp.dest('dist/img'));
});

//Concatenando os js em unico arquivo
gulp.task('gulp-concat-js', function () {
  gulp.src(['dist/assets/**/*.js', 'dist/src/index.js', 'dist/src/**/*.js']).pipe(concat('all.js')).pipe(gulp.dest('dist/js'));
});

////Concatenando os cs em unico arquivo
gulp.task('gulp-concat-css', function () {
  gulp.src(['dist/assets/**/*.css', 'dist/**/*.css']).pipe(concat('all.css')).pipe(gulp.dest('dist/css'));
});

//inserindo import css e js no index
gulp.task('gulp-html-replace', function () {
  gulp.src('dist/index.html').pipe(htmlReplace({ js: 'js/all.js', css: 'css/all.css' })).pipe(gulp.dest('dist'));
});

//Injeção de depencias
gulp.task('gulp-inject', function () {
  return gulp.src('app/index.html').pipe(inject(gulp.src(
    ['app/assets/**/*.js', 'app/src/index.js', 'app/src/**/*.js', 'app/assets/**/*.css', 'app/**/*.css'],
    { read: false }), { relative: true })).pipe(gulp.dest('app/'));
});

// https://browsersync.io/docs/options#option-socket
// Servidor local
gulp.task('browser-sync', function () {
  browserSync.init({ port: 8081, ui: false, notify: false, reloadDebounce: 2000, server: { baseDir: './app' } });
});

// Criação de listerner para escultar alterações
gulp.task('watch', function () {

  //Executando o reload no servidor quando houver mudança
  gulp.watch('app/src/**/*').on('change', browserSync.reload);

  // Valiando alteração js
  gulp.watch('app/src/**/*.js').on('change', function (event) { gulp.src(event.path).pipe(jshint()).pipe(jshint.reporter(jshintStylish)); });

  // Valiando alteração css
  gulp.watch('app/src/css/*.css').on('change', function (event) { gulp.src(event.path).pipe(csslint()).pipe(csslint.formatter(csslintStylish)); });

  // Compilando less
  gulp.watch('app/src/less/*.less').on('change', function (event) {
    var stream = gulp.src(event.path).pipe(less().on('error', function (erro) {
      console.log('LESS, erro compilação: ' + erro.filename);
      console.log(erro.message);
    })).pipe(gulp.dest('app/src/css'));
  });
});


gulp.task('gulp-less', function () {
  var stream = gulp.src('app/src/less/*.less').pipe(less().on('error', function (erro) {
    console.log('LESS, erro compilação: ' + erro.filename);
    console.log(erro.message);
  })).pipe(gulp.dest('app/src/css'));
});

// Copiando dependencias projeto
gulp.task('lib-js', function () {
  gulp.src([
    'angular.js',
    'angular-messages.js',
    'ng-notify.min.js',
    'angular-route.js',
    'angular-cookies.min.js',
    'angular-animate.min.js',
    'angular-sanitize.js',
    'ngStorage.min.js',
    'angular-input-masks-standalone.min.js',
    'ui-bootstrap-tpls.js',
    'angular-base64-upload.min.js',
    'ag-grid.js',
    'jquery.min.js',
    'bootstrap.min.js',
    'checklist-model.js',
  ].map(function (e) { return 'node_modules/**/'.concat(e); })).pipe(gulp.dest('app/assets/lib'));
});

// Copiando dependencias projeto
gulp.task('lib-css', function () {
  gulp.src(['font-awesome.css', 'bootstrap.css',].map(function (e) { return 'node_modules/**/'.concat(e); })).pipe(gulp.dest('app/assets/css'));
});

// Copiando dependencias projeto
gulp.task('lib-font', function () {
  gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest('app/assets/css/font-awesome/fonts'));
  gulp.src('node_modules/bootstrap/fonts/*').pipe(gulp.dest('app/assets/css/bootstrap/fonts'));
});

//Apagando conteudo da pasta
gulp.task('clean-assets', function () { return gulp.src('app/assets').pipe(clean()); });
