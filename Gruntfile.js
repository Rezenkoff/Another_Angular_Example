module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-po2json');

    grunt.initConfig({
        po2json: {
            options: {
                format: 'mf',
                pretty: true,
                stringOnly: true,
                fuzzy: true,
                nodeJs:true
            },
            all: {
                src: ['src/app/translate/template/*.po'],
                dest: 'src/app/translate/template'
            }
        }
    });

    grunt.registerTask('compile_translate', ['po2json']);
};