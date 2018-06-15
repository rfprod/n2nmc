'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const util = require('gulp-util');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const tslint = require('gulp-tslint');
const plumber = require('gulp-plumber');
const mocha = require('gulp-mocha');
const karmaServer = require('karma').Server;
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const systemjsBuilder = require('gulp-systemjs-builder');
const hashsum = require('gulp-hashsum');
const crypto = require('crypto');
const fs = require('fs');
const spawn = require('child_process').spawn;

let node;
let mongo;
let tsc;

/*
*	hashsum identifies build
*
*	after build SHA1SUMS.json is generated with sha1 sums for different files
*	then sha256 is calculated using stringified file contents
*/
gulp.task('hashsum', () => {
	return gulp.src(['./public/*', '!./public/SHA1SUMS.json', './public/app/views/**', './public/css/**', './public/fonts/**', './public/img/**', './public/js/**'])
		.pipe(hashsum({ filename: 'public/SHA1SUMS.json', hash: 'sha1', json: true }));
});

function setEnvBuildHash(env, done) {
	fs.readFile('./public/SHA1SUMS.json', (err, data) => {
		if (err) throw err;
		const hash = crypto.createHmac('sha256', data.toString()).digest('hex');
		console.log('BUILD_HASH', hash);
		env += 'BUILD_HASH=' + hash + '\n';
		fs.writeFile('./.env', env, (err) => {
			if (err) throw err;
			console.log('# > ENV > .env file was updated');
			done();
		});
	});
}

gulp.task('set-build-hash', (done) => {
	fs.readFile('./.env', (err, data) => {
		let env = '';
		if (err) {
			console.log('./.env does not exist');
			setEnvBuildHash(env, done);
		} else {
			env = data.toString().replace(/BUILD_HASH=.+\n/, '');
			console.log('./.env exists, updated env', env);
			setEnvBuildHash(env, done);
		}
	});
});

gulp.task('database', (done) => {
	if (mongo) mongo.kill();
	mongo = spawn('npm', ['run','mongo-start'], {stdio: 'inherit'});
	mongo.on('close', (code) => {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		}
	});
	done();
});

gulp.task('server', (done) => {
	if (node) node.kill();
	node = spawn('node', ['server.js'], {stdio: 'inherit'});
	node.on('close', (code) => {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		}
	});
	done();
});

gulp.task('tsc', (done) => {
	if (tsc) tsc.kill();
	tsc = spawn('tsc', [], {stdio: 'inherit'});
	tsc.on('close', (code) => {
		if (code === 8) {
			console.log('Error detected, waiting for changes...');
		} else {
			done();
		}
	});
});

gulp.task('server-test', () => {
	return gulp.src(['./test/server/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', util.log);
});

gulp.task('client-unit-test', (done) => {
	const server = new karmaServer({
		configFile: require('path').resolve('test/karma.conf.js'),
		singleRun: false
	});

	server.on('browser_error', (browser, err) => {
		console.log('=====\nKarma > Run Failed\n=====\n', err);
		throw err;
	});

	server.on('run_complete', (browsers, results) => {
		if (results.failed) {
			throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
		}
		console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
		done();
	});

	server.start();
});

gulp.task('client-unit-test-single-run', (done) => {
	const server = new karmaServer({
		configFile: require('path').resolve('test/karma.conf.js'),
		singleRun: true
	});

	server.on('browser_error', (browser, err) => {
		console.log('=====\nKarma > Run Failed\n=====\n', err);
		throw err;
	});

	server.on('run_complete', (browsers, results) => {
		if (results.failed) {
			throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
		}
		console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
		done();
	});

	server.start();
});

gulp.task('build-system-js', () => {
	/*
	*	this task builds angular application
	*	components, angular modules, and some dependencies
	*
	*	nonangular components related to design, styling, data visualization etc.
	*	are built by another task
	*/
	return systemjsBuilder('/','./systemjs.config.js')
		.buildStatic('app', 'bundle.min.js', {
			minify: true,
			mangle: true
		})
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-js', () => {
	/*
	*	nonangular js bundle
	*	components related to design, styling, data visualization etc.
	*/
	return gulp.src([
		// sequence is essential
		'./node_modules/jquery/dist/jquery.js',
		'./node_modules/bootstrap/dist/js/bootstrap.js',
		'./node_modules/d3/d3.js',
		'./node_modules/nvd3/build/nv.d3.js',
		// angular dependencies start here
		'./node_modules/zone.js/dist/zone.min.js',
		'./node_modules/reflect-metadata/Reflect.js',
		'./node_modules/web-animations-js/web-animations.min.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-css', () => {
	return gulp.src([
		/*
		*	add paths to required third party css files
		*/
		'./node_modules/nvd3/build/nv.d3.css',
		'./node_modules/components-font-awesome/css/fontawesome-all.css',
		/*
		*	Angular material theme should be chosen and loaded here
		*/
		'./node_modules/@angular/material/prebuilt-themes/deeppurple-amber.css'
		//'./node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
		//'./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css'
		//'./node_modules/@angular/material/prebuilt-themes/purple-green.css'
	])
		.pipe(plumber())
		.pipe(concat('vendor-bundle.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-bundle.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('move-vendor-fonts', () => {
	return gulp.src([
		'./node_modules/components-font-awesome/webfonts/*.*',
		// material design icons
		'./node_modules/material-design-icon-fonts/iconfont/*.eot',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff2',
		'./node_modules/material-design-icon-fonts/iconfont/*.woff',
		'./node_modules/material-design-icon-fonts/iconfont/*.ttf'
	])
		.pipe(gulp.dest('./public/webfonts'));
});

gulp.task('sass-autoprefix-minify-css', () => {
	return gulp.src('./public/app/scss/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('bundle.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('eslint', () => {
	return gulp.src(['./app/**', './public/js/*.js', './*.js']) // uses ignore list from .eslintignore
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('tslint', () => {
	return gulp.src(['./public/app/*.ts', './public/app/**/*.ts'])
		.pipe(tslint({
			formatter: 'verbose' // 'verbose' - extended info | 'prose' - brief info
		}))
		.pipe(tslint.report({
			emitError: false
		}));
});

gulp.task('watch', () => {
	gulp.watch(['./server.js', './app/**/*.js'], ['server']);
	gulp.watch(['./test/server/test.js'], ['server-test']);
	gulp.watch(['./server.js', './app/models/*.js'], ['database']);
	gulp.watch(['./gulpfile.js'], ['pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts']);
	gulp.watch('./public/app/scss/*.scss', ['sass-autoprefix-minify-css']);
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './test/client/**/*.ts', './tslint.json'], ['spawn-rebuild-app']);
	gulp.watch(['./app/**', './public/js/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['eslint']);
});

gulp.task('watch-and-lint', () => {
	gulp.watch(['./app/**', './public/js/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['eslint']); // watch files to be linted or eslint config files and lint on change
	gulp.watch(['./public/app/*.ts', './public/app/**/*.ts', './tslint.json'], ['tslint']); // watch files to be linted or eslint config files and lint on change
});

gulp.task('watch-client-and-test', () => {
	gulp.watch(['./public/app/*.ts','./test/client/*.ts'], ['tsc']); //watch unit test changes and run tests
	gulp.watch(['./public/app/*.js','./test/client/*.js','./test/karma.conf.js','./test/karma.test-shim.js'], ['client-unit-test']); //watch unit test changes and run tests
});

gulp.task('build', (done) => {
	runSequence('build-system-js', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', 'sass-autoprefix-minify-css', 'hashsum', 'set-build-hash', done);
});

gulp.task('compile-and-build', (done) => {
	runSequence('tsc', 'build', done);
});

gulp.task('rebuild-app', (done) => { // should be used in watcher to rebuild the app on *.ts file changes
	runSequence('tslint', 'compile-and-build', done);
});

let rebuildApp;
gulp.task('spawn-rebuild-app', (done) => {
	if (rebuildApp) rebuildApp.kill();
	rebuildApp = spawn('gulp', ['rebuild-app'], {stdio: 'inherit'});
	rebuildApp.on('close', (code) => {
		console.log(`rebuildApp closed with code ${code}`);
	});
	done();
});

gulp.task('lint', (done) => {
	runSequence('eslint', 'tslint', done);
});

gulp.task('default', (done) => {
	runSequence('lint', 'compile-and-build', 'database', 'server', 'watch', done);
});

process.on('exit', (code) => {
	console.log(`PROCESS EXIT CODE ${code}`);
});
