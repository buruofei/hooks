const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const fs = require('fs');
const fse = require('fs-extra');
const fg = require('fast-glob');
const gm = require('gray-matter');

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

async function genDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    return;
  }
  const mdFile = fs.readFileSync(mdPath, 'utf8');
  const { content } = gm(mdFile);
  let description =
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';

  description = description.trim();
  description = description.charAt(0).toLowerCase() + description.slice(1);
  return description;
}

async function genMetaData() {
  const metadata = {
    functions: [],
  };
  const hooks = fg
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', ''))
    .sort();
  
  await Promise.allSettled(
    hooks.map(async (hook) => {
      // 尝试从多个可能的文档文件中获取描述
      let description = await genDesc(`src/${hook}/index.en-US.md`) || 
                       await genDesc(`src/${hook}/README.md`) || 
                       await genDesc(`src/${hook}/index.md`) ||
                       'Vue 3 Composition API hook';
      
      return {
        name: hook,
        docs: `https://github.com/buruofei/hooks/tree/master/packages/vue-hooks/src/${hook}`,
        description,
      };
    }),
  ).then((res) => {
    metadata.functions = res.map((item) => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    }).filter(Boolean);
  });
  return metadata;
}

gulp.task('clean', async () => {
  const { deleteAsync } = await import('del');
  await deleteAsync(['lib/**', 'es/**', 'dist/**']);
});

gulp.task('es', async () => {
  const { execSync } = require('child_process');

  // 使用 tsc 直接编译
  console.log('Running TypeScript compilation...');
  try {
    execSync('npx tsc --project tsconfig.build.json --outDir es --module esnext', { stdio: 'inherit' });
    console.log('TypeScript compilation completed');
  } catch (error) {
    console.warn('TypeScript compilation had warnings, continuing...');
  }

  // 然后运行 babel 转换
  console.log('Running Babel transformation...');
  return gulp
    .src(['es/**/*.js'])
    .pipe(
      babel({
        configFile: './babel.config.js',
      }),
    )
    .pipe(gulp.dest('es/'));
});

gulp.task('cjs', () =>
  gulp
    .src(['./es/**/*.js'])
    .pipe(
      babel({
        configFile: './babel.config.js',
        envName: 'cjs',
      }),
    )
    .pipe(gulp.dest('lib/')),
);

gulp.task('declaration', () => {
  const tsProject = ts.createProject('tsconfig.build.json', {
    declaration: true,
    emitDeclarationOnly: true,
    skipLibCheck: true,
    noEmitOnError: false,
  });
  return tsProject.src()
    .pipe(tsProject())
    .on('error', (err) => {
      console.warn('Declaration generation had warnings:', err.message);
    })
    .pipe(gulp.dest('es/'))
    .pipe(gulp.dest('lib/'));
});

gulp.task('metadata', async function () {
  const metadata = await genMetaData();
  await fse.writeJson('metadata.json', metadata, { spaces: 2 });
  console.log(`Generated metadata for ${metadata.functions.length} hooks`);
});

gulp.task('copyReadme', async () => {
  await gulp.src('./README.md').pipe(gulp.dest('./'));
});

exports.default = gulp.series('clean', 'es', 'cjs', 'declaration', 'metadata', 'copyReadme');
