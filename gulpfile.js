const gulp = require('gulp'); 
const scss = require("gulp-sass")(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const spritesmith = require('gulp.spritesmith');
const fs = require('fs');
const path = require('path');
const rename = require('gulp-rename');
const handlebars = require('gulp-compile-handlebars');


const paths = { 
    dist_scss: 'src/css',
    scss : 'src/scss/*.scss', 
    html_path: 'src/',
    sprite_path: 'src/sprites/**' 
};

const scssOptions = {
    outputStyle: 'expanded',
    indexType: 'tab'
  }

gulp.task('scss', () => {
    return gulp.src(paths.scss) 
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions).on('error', scss.logError)) 
    .pipe(autoprefixer())
    .pipe(sourcemaps.write({addComment: false}))  
    .pipe(gulp.dest(paths.dist_scss)) 
});

gulp.task('runBrowserSync', () => {
    const options = {
        browserSync: {
        port: 3333,
        server: {
            baseDir: paths.html_path,
            directory: true
        },
        open: 'external',
        },
    };
    browserSync.init(options.browserSync);
    gulp.watch('./src/*.html').on('change',browserSync.reload);
    gulp.watch('./src/scss/**/*.scss').on('change',browserSync.reload);
});

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isDirectory());
}

gulp.task('makeSprite', () => {
  var stream_arr = [];
  var options = {
    spritesmith: function(folder) {
      return {
        imgPath: path.posix.relative('src/css', path.posix.join('src/img', 'sp_' + folder + '.png')),
        imgName: 'sp_' + folder + '.png',
        cssName: '_sp_' + folder + '.scss',
        cssFormat: 'scss',
        padding: 4,
        cssTemplate: './gulpconf/sprite_template.hbs',
        cssSpritesheetName: 'sp_' + folder
      }
    }
  };

  getFolders('src/sprites').map(folder => {
    var spriteData = gulp.src(path.join('src/sprites', folder, '*.png'))
      .pipe(spritesmith(options.spritesmith(folder)));
      stream_arr.push(new Promise(function(resolve) {
        spriteData.img
          .pipe(gulp.dest('src/img'))
          .on('end',resolve);
      }));
      stream_arr.push(new Promise(function(resolve) {
        spriteData.css
          .pipe(gulp.dest(path.join('src/scss', 'sprite')))
          .on('end', resolve);
      }));
    });
  return Promise.all(stream_arr);
});

gulp.task('makeSpriteMap', () => {
  return gulp.src('gulpconf/sprite_maps_template.hbs')
  .pipe(handlebars({
    prefix: 'sp_',
    path: path.posix.relative(path.posix.join('src/scss', 'sprite'),//
    path.posix.join('src/scss', 'sprite')),
    import: getFolders('src/sprites'),
    ratio: 2
  }))
  .pipe(rename('_sprite_maps.scss'))
  .pipe(gulp.dest(path.join('src/scss', 'sprite')));//
});

gulp.task('watch', () => {
    gulp.watch(paths.scss, gulp.series('scss'));
    gulp.watch(paths.sprite_path, gulp.series('makeSprite', 'makeSpriteMap'));
});

gulp.task('default', gulp.series('runBrowserSync', 'scss', 'watch','makeSprite', 'makeSpriteMap'));
gulp.task('sprite', gulp.series('makeSprite', 'makeSpriteMap'));