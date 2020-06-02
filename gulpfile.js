let progect_folder = "dist";
let source_folder = "#src";
let path = {
    build:{
        html: progect_folder + "/",
        css: progect_folder + "/css/",
        js: progect_folder + "/js/",
        img: progect_folder + "/img/",
        fonts: progect_folder + "/fonts/"
    },
    src:{
        html: source_folder + "/*.html",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf"
    },
    watch:{
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + progect_folder + "/"
};
let fs = require('fs');
let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create();
    fileinclude = require('gulp-file-include');
    del = require('del');
    scss = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
    group_media = require('gulp-group-css-media-queries');
    clean_css = require('gulp-clean-css');
    rename = require('gulp-rename');
    imagemin = require('gulp-imagemin');
    webp = require('gulp-webp');
    webphtml = require('gulp-webp-html');
    webpcss = require('gulp-webpcss');
    svgSprite = require('gulp-svg-sprite');

function browserSync(params){
    browsersync.init({
        server:{
            baseDir: "./" + progect_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js)
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images(){
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
                imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    interlaced: true,
                    optimizationLevel: 3
                })
            )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts(){
    src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}


function watchFiles(params){
    gulp.watch([path.watch.html],html);
    gulp.watch([path.watch.css],css);
    gulp.watch([path.watch.js],js);
    gulp.watch([path.watch.img],images);
}

function clean(params){
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.watch = watch;
exports.build = build;
exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.js = js;
exports.default = watch;
exports.css = css;