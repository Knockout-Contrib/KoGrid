'use strict';

module.exports = function (config) {
    config.set({
        basePath: '../../',
        autoWatch: true,
        singleRun: false,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        logLevel: config.LOG_ERROR,
        files: [
            'lib/jquery-1.8.2.js',
            'lib/knockout-latest.debug.js',
            'build/KoGrid.debug.js',
            'tests/fixtures/*.js',
            'tests/specs/*.js'
        ],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            'build/*.js': ['coverage']
        }
    })
};
