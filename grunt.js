/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '1.0.1',
            banner: '/*\n' +
                    '===============================================================================\n' +
                    '    Author:     Eric M. Barnard - @ericmbarnard                                \n' +
                    '    License:    MIT (http://opensource.org/licenses/mit-license.php)           \n' +
                    '                                                                               \n' +
                    '    Description: Validation Library for KnockoutJS                             \n' +
                    '===============================================================================\n' +
                    '*/',
            prefix: '(function(){',
            postfix: '}());'
        },
        lint: {
            files: ['grunt.js']
        },
        qunit: {
            files: ['tests/test-runner.htm']
        },
        concat: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<banner:meta.prefix>',
                    '<file_strip_banner:src/Namespace.js>',
                    '<file_strip_banner:src/Constants.js>',
                    '<file_strip_banner:src/Labels.js>',
                    '<file_strip_banner:src/Utils.js>',
                    '<file_strip_banner:src/Templates/GridTemplate.js>',
                    '<file_strip_banner:src/Templates/HeaderTemplate.js>',
                    '<file_strip_banner:src/Templates/HeaderCellTemplate.js>',
                    '<file_strip_banner:src/Templates/RowTemplate.js>',
                    '<file_strip_banner:src/Templates/FooterTemplate.js>',
                    '<file_strip_banner:src/Templates/TemplateManager.js>',
                    '<file_strip_banner:src/GridClasses/Dimension.js>',
                    '<file_strip_banner:src/GridClasses/Cell.js>',
                    '<file_strip_banner:src/GridClasses/Column.js>',
                    '<file_strip_banner:src/GridClasses/ColumnCollection.js>',
                    '<file_strip_banner:src/GridClasses/Row.js>',
                    '<file_strip_banner:src/GridClasses/Range.js>',
                    '<file_strip_banner:src/GridClasses/CellFactory.js>',
                    '<file_strip_banner:src/GridClasses/HeaderCell.js>',
                    '<file_strip_banner:src/GridClasses/HeaderRow.js>',
                    '<file_strip_banner:src/GridClasses/RowManager.js>',
                    '<file_strip_banner:src/GridClasses/Footer.js>',
                    '<file_strip_banner:src/GridClasses/FilterManager.js>',
                    '<file_strip_banner:src/GridClasses/SortManager.js>',
                    '<file_strip_banner:src/GridClasses/SelectionManager.js>',
                    '<file_strip_banner:src/GridManager.js>',
                    '<file_strip_banner:src/Grid.js>',
                    '<file_strip_banner:src/DomManipulation/CssBuilder.js>',
                    '<file_strip_banner:src/DomManipulation/DomUtility.js>',
                    '<file_strip_banner:src/BindingHandlers/kgWith.js>',
                    '<file_strip_banner:src/BindingHandlers/koGrid.js>',
                    '<file_strip_banner:src/BindingHandlers/kgRows.js>',
                    '<file_strip_banner:src/BindingHandlers/kgRow.js>',
                    '<file_strip_banner:src/BindingHandlers/kgCell.js>',
                    '<file_strip_banner:src/BindingHandlers/kgHeaderRow.js>',
                    '<file_strip_banner:src/BindingHandlers/kgHeaderCell.js>',
                    '<file_strip_banner:src/BindingHandlers/kgFooter.js>',
                    '<file_strip_banner:src/BindingHandlers/kgSize.js>',
                    '<banner:meta.postfix>'
                ],
                dest: 'dist/koGrid.debug.js'
            }
        },
        min: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<config:concat.dist.dest>'
                ],
                dest: 'dist/koGrid.min.js'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true
            }
        },
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

};
