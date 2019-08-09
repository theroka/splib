const gulp = require("gulp");
const ts = require("gulp-typescript");

let project = ts.createProject("tsconfig.json");

// transpile Ts to ES5 / CommonJS
gulp.task("build", function() {
  return project.src()
    .pipe(project())
    .js.pipe(gulp.dest("dist"))
});

// copy static assets to dist folder
gulp.task("types", function() {
  return gulp.src([
    "types.d.ts"
  ])
    .pipe(gulp.dest("dist"))
})

gulp.task("default", gulp.parallel("build", "types"));
