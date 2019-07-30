const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cmq = require('gulp-merge-media-queries'),
    terser = require('gulp-terser'), //zamiast gulp-uglify (deprecated)
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-clean-css'),
    wait = require('gulp-wait'),
    minify = require('gulp-minify'),
    eslint = require('gulp-eslint');
//sourcemaps = require('gulp-sourcemaps');

/* paths */
let path = {
    css: {
        // sciezka dla gulp watch
        dev: [
            '../_dev/scss/**/*.scss',
        ],
        scssDir: '../_dev/scss/',
        // sciezka buildu
        prod: '../assets/css/',
    },
    js: {
        // sciezka dla gulp watch
        dev: [
            '../_dev/js/**/*.js'
        ],
        src: {
            // obiekty ze sciezkami do plikow; klucze obiektów sa jednoczesnie nazwami wynikowych plików .js
            labo: [
                '../_html/_dev/js/*.js'
            ]
        },
        // sciezka buildu
        prod: '../assets/js/'
    },
};

// tutaj dodajemy core-owe pliki SCSS z importami
let scssFileNames = [
    'restapp-style'
];


let onError = (err) => {
    console.log(err);
};

function css(done) {
    scssFileNames.forEach((name) => {
        coreScss(name);
    });
    done();
    notify("CSS-y ogarnięte!").write('');
}

function cssProd(done) {
    scssFileNames.forEach((name) => {
        cssMin(name);
    });
    done();
    notify("MINIFIKACJA CSS - ogarnięte!").write('');
}

function js(done) {
    Object.keys(path.js.src).forEach((name) => {
        coreJs(path.js.src[name], name);
    });
    done();
    notify("JavaScript gotowy!").write('');
}

function jsProd(done) {
    Object.keys(path.js.src).forEach((name) => {
        jsMin(path.js.src[name], name);
    });
    done();
    notify("MINIFIAKCJA JAVASCIRPT - done!").write('');
}

function coreScss(name) {
    return gulp.src(path.css.scssDir + name + '.scss')
        .pipe(plumber({
            handleError: onError
        }))
        .pipe(wait(500))
        .pipe(sass()
            .on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: "cover 100%"
        }))
        .pipe(cmq())
        .pipe(concat(name + '.css'))
        .pipe(gulp.dest(path.css.prod))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.css.prod))
    //.pipe(notify('CSS [' + name + '.css] ... done!'));
}

function coreJs(srcPath, name) {
    return gulp.src(srcPath, name)
        .pipe(plumber({
            handleError: onError
        }))
        .pipe(wait(500))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat(name + '.js'))
        .pipe(gulp.dest(path.js.prod))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.js.prod))
    //.pipe(notify(' JS [' + name + '.js] ... done!'));

}

function cssMin(name) {
    coreScss(name)
        .pipe(gulp.dest(path.css.prod))
        .pipe(minifycss())
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(path.css.prod))
    //.pipe(notify('CSS - minify - [' + name + '.min.css] ... done!'));
}

function jsMin(srcPath, name) {
    coreJs(srcPath, name)
        .pipe(gulp.dest(path.js.prod))
        .pipe(terser({
            compress: {
                drop_console: true
            }
        }))
        .pipe(minify({
                output: {
                    comments: true
                }
            })
        )
        // .pipe(rename({
        //     suffix: '.min'
        // }))
        .pipe(gulp.dest(path.js.prod))
    //.pipe(notify(' JS - minify - [' + name + '.min.js] ... done!'));
}

gulp.task('default', gulp.parallel(css, js), done => {
    done()
});

gulp.task('prod', gulp.parallel(cssProd, jsProd), done => {
    done();
});

gulp.task('watch', done => {
    gulp.watch(path.js.dev, gulp.series(js));
    gulp.watch(path.css.dev, gulp.series(css));
    done();
});

gulp.task('test', done => {
    console.log(`
      ____       _         _  _    ___  
     / ___|_   _| |_ __   | || |  / _ \\ 
    | |  _| | | | | '_ \\  | || |_| | | |
    | |_| | |_| | | |_) | |__   _| |_| |
     \\____|\\__,_|_| .__/     |_|(_)___/ 
                  |_|                             
    `);
    done();
});