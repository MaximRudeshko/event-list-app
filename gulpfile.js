"use strict";

const gulp = require("gulp");
const sass = require('gulp-sass');
const browsersync = require("browser-sync");
const autoprefixer = require('gulp-autoprefixer');
const webpack = require("webpack-stream");
const { notify } = require("browser-sync");


const dist = "./dist/";

gulp.task("copy-html", () => {
    return gulp.src("./src/index.html")
                .pipe(gulp.dest(dist))
                .pipe(browsersync.stream())
                .on('end', browsersync.reload)
});

gulp.task("compille-sass", () => {
  return gulp.src('./src/assets/sass/*.scss')
              .pipe(sass())
              .pipe(autoprefixer({
                cascade:false
              }))
              .pipe(gulp.dest('./src/assets/css'))
              .on('end', browsersync.reload)
})

gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")
                .pipe(gulp.dest(dist + "/assets"))
                .on("end", browsersync.reload);
});

 gulp.task("build-js", () => {
  return gulp.src("./src/js/*.js")
              .pipe(webpack({
                  mode: 'development',
                  output: {
                      filename: 'script.js'
                  },
                  watch: false,
                  devtool: "source-map",
                  module: {
                      rules: [
                        {
                          test: /\.m?js$/,
                          exclude: /(node_modules|bower_components)/,
                          use: {
                            loader: 'babel-loader',
                            options: {
                              presets: [['@babel/preset-env', {
                                  debug: true,
                                  corejs: 3,
                                  useBuiltIns: "usage"
                              }]]
                            }
                          }
                        }
                      ]
                    }
              }))
              .pipe(gulp.dest(dist + '/js'))
              .on("end", browsersync.reload);
}); 

gulp.task("watch", () => {
    browsersync.init({
		server: "./dist/",
    port: 4002,
    notify: false
    });
    
    gulp.watch("./src/index.html", gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/assets/sass/*.scss", gulp.parallel("compille-sass"));
    gulp.watch('./src/js/*.*', gulp.parallel('build-js'))
});

gulp.task('build-styles', gulp.series("compille-sass", "copy-assets" ))

gulp.task("build", gulp.parallel("copy-html", 'build-styles', 'build-js'));

gulp.task("default", gulp.parallel("watch", "build"));
