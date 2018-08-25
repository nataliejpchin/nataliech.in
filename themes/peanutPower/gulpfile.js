// package vars
let pkg = require('./package.json');

// gulp
let gulp = require('gulp');


// load all plugins in "devDependencies" into the variable $
let $ = require('gulp-load-plugins')({
    pattern: ['*'],
    scope: ['devDependencies']
});

let browserSync = require('browser-sync').create();


function customPlumber(errTitle) {
    return $.plumber({
        errorHandler: $.notify.onError({
            // Customizing error title
            title: errTitle || 'Error running Gulp',
            message: 'Error: <%= error.message %>',
            sound: 'Pop'
        })
    });
}

let banner = [
    '/**',
    ' * @project        <%= pkg.name %>',
    ' * @author         <%= pkg.author %>',
    ` * @copyright      Copyright (c) ${ $.moment().format('YYYY') }, <%= pkg.copyright %>`,
    ' *',
    ' */',
    ''
].join('\n');


/* ----------------- */
/* SCREEN CSS GULP TASKS
/* ----------------- */

// scss - build the scss to the build folder, including the required paths, and writing out a sourcemap
gulp.task('screenScss', () => {
    $.fancyLog(`-> Compiling screen scss: ${ pkg.paths.build.css }${pkg.vars.scssName}`);
    return gulp.src(`${pkg.paths.src.scss }main.scss`)
        .pipe(customPlumber('Error Running Sass'))
        .pipe($.sassGlob())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.sass({
                includePaths: [
                    `${__dirname }/node_modules/modularscale-sass/stylesheets`
                ]
            })
            .on('error', $.sass.logError))
        .pipe($.cached('sass_compile'))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.build.css));
});

// css task - combine & minimize any vendor CSS into the public css folder
gulp.task('screenCss', ['screenScss'], () => {
    $.fancyLog('-> Building screen css');
    return gulp.src(pkg.globs.distCss)
        .pipe(customPlumber('Error Running Sass'))
        .pipe($.newer({
            dest: pkg.paths.dist.css + pkg.vars.siteCssName
        }))
        .pipe($.print())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.postcss([require(`${__dirname}/node_modules/postcss-normalize`)({
            forceImport: true
        })]))
        .pipe($.concat(pkg.vars.siteCssName))
        .pipe($.cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe($.header(banner, {
            pkg: pkg
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter('**/*.css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* ----------------- */
/* PRINT CSS GULP TASKS
/* ----------------- */

// scss - build the scss to the build folder, including the required paths, and writing out a sourcemap
gulp.task('printScss', () => {
    $.fancyLog(`-> Compiling print scss into ${ pkg.paths.build.css }`);
    return gulp.src(`${pkg.paths.src.scss }print.scss`)
        .pipe(customPlumber('Error Running Sass'))
        .pipe($.sassGlob())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.sass()
            .on('error', $.sass.logError))
        .pipe($.cached('sass_compile'))
        .pipe($.autoprefixer())
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.build.css));
});

// css task - combine & minimize any vendor CSS into the public css folder
gulp.task('printCss', ['printScss'], () => {
    $.fancyLog('-> Building print css');
    return gulp.src(`${pkg.globs.distPrintCss }`)
        .pipe(customPlumber('Error Running Sass'))
        .pipe($.newer({
            dest: pkg.paths.dist.css
        }))
        .pipe($.print())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.postcss([require(`${__dirname}/node_modules/postcss-normalize`)({
            forceImport: true
        })]))
        .pipe($.concat(pkg.vars.printCssName))
        .pipe($.cssnano({
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }))
        .pipe($.header(banner, {
            pkg: pkg
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.dist.css))
        .pipe($.filter('**/*.css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* ----------------- */
/* JS GULP TASKS
/* ----------------- */
gulp.task('eslint', () => {
    $.fancyLog('-> Linting Javascript via eslint...');
    return gulp.src(pkg.globs.babelJs)
        // default: use local linting config
        .pipe($.eslint({
            // Load a specific ESLint config
            configFile: '.eslintrc.json'
        }))
        // format ESLint results and print them to the console
        .pipe($.eslint.format());
});

gulp.task('cached-lint', () => {
    $.fancyLog('-> Linting Javascript via eslint...');
    gulp.src([`${pkg.paths.src.js }**/*.js`, `!${pkg.paths.src.js}/vendor/**/*.js`])
        .pipe($.cached('eslint'))
        // Only uncached and changed files past this point
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.result((result) => {
            if (result.warningCount > 0 || result.errorCount > 0) {
                // If a file has errors/warnings remove uncache it
                delete $.cached.caches.eslint[$.path.resolve(result.filePath)];
            }
        }));
});

// babel js task - transpile our Javascript into the build directory
gulp.task('js-babel', () => {
    $.fancyLog('-> Transpiling Javascript via Babel...');
    return gulp.src(pkg.globs.babelJs)
        .pipe(customPlumber('Error Running js-babel'))
        .pipe($.newer({
            dest: pkg.paths.build.js
        }))
        // .pipe($.concat(pkg.vars.buildJsName))
        .pipe($.babel({
            presets: ['env']
        }))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.build.js));
});

// js task - minimize any distribution Javascript into the public js folder, and add our banner to it
gulp.task('js', ['js-babel'], () => {
    $.fancyLog('-> Building js');
    return gulp.src(pkg.globs.distJs)
        .pipe(customPlumber('Error Running js'))
        .pipe($.if(['*.js', '!*.min.js'],
            $.newer({
                dest: pkg.paths.dist.js,
                ext: '.min.js'
            }),
            $.newer({
                dest: pkg.paths.dist.js
            })
        ))
        .pipe($.concat(pkg.vars.jsName))
        .pipe($.if(['*.js', '!*.min.js'],
            $.uglify()
        ))
        .pipe($.if(['*.js', '!*.min.js'],
            $.rename({
                suffix: '.min'
            })
        ))
        .pipe($.header(banner, {
            pkg: pkg
        }))
        .pipe($.size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(pkg.paths.dist.js))
        .pipe($.filter('**/*.js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

/* ----------------- */
/* MISC GULP TASKS
/* ----------------- */

// imagemin task
gulp.task('imagemin', () => gulp.src(`${pkg.paths.dist.img }**/*.{png,jpg,jpeg,gif,svg}`)
    .pipe($.imagemin({
        progressive: true,
        interlaced: true,
        optimizationLevel: 7,
        svgoPlugins: [{
            removeViewBox: false
        }],
        verbose: true,
        use: []
    }))
    .pipe(gulp.dest(pkg.paths.dist.img)));

// task to convert svg to data uri
gulp.task('sassvg', () => gulp.src(`${pkg.paths.src.svg }/**/*.svg`)
    .pipe(sassvg({
        outputFolder: pkg.paths.dist.svg, // IMPORTANT: this folder needs to exist
        optimizeSvg: true // true (default) means about 25% reduction of generated file size, but 3x time for generating the _icons.scss file
    })));

// output plugin names in terminal
gulp.task('pluginOutput', () => {
    console.log($);
});

// Copy fonts
gulp.task('fonts', () => gulp.src(pkg.paths.src.fonts)
    .pipe(gulp.dest(pkg.paths.dist.fonts)));

// Copy fonts
gulp.task('img', () => gulp.src(pkg.paths.src.img)
    .pipe(gulp.dest(pkg.paths.dist.img)));


gulp.task('browsersync', () => {
    // to close browser tab when browserSync disconnects
    browserSync.use({
        plugin: function () { /* noop */ },
        hooks: {
            'client:js': require('fs').readFileSync('./closer.js', 'utf-8')
        }
    });

    browserSync.init({
        // server: "./",
        port: '8080',
        proxy: 'localhost/', // We need to use a proxy instead of the built-in server because Drupal has to do some server-side rendering for the theme to work
        // Open the site in Chrome & Firefox
        browser: ['google chrome']
    });
});


/* ----------------- */
/* Run TASKS
/* ----------------- */

// Default task
gulp.task('default', ['screenScss', 'printCss', 'cached-lint', 'js', 'fonts', 'img', 'browsersync'], () => {
    gulp.watch([`${pkg.paths.src.scss }**/*.scss`, '!print.scss'], ['screenCss']);
    gulp.watch([`${pkg.paths.src.scss }print.scss`], ['printCss']);
    gulp.watch([`${pkg.paths.src.js }**/*.js`], ['cached-lint'], event => {
        if (event.type === 'deleted' && $.cached.caches.eslint) {
            // remove deleted files from cache
            delete $.cached.caches.eslint[event.path];
        }
    });
    gulp.watch([`${pkg.paths.src.js }**/*.js`], ['js']);
    gulp.watch([pkg.paths.templates], () => {
        gulp.src(pkg.paths.templates)
            .pipe(customPlumber('Error Running Browsersync Template'))
            .pipe(browserSync.reload({
                stream: true
            }));
    });
    gulp.watch([pkg.paths.src.fonts], ['fonts']);
});

// Production build
gulp.task('build', ['screenCss', 'printCss', 'js', 'fonts', 'img']);