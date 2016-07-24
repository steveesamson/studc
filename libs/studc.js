var XmlDocument = require('xmldoc').XmlDocument,
    fs = require('fs'),
    stud = require('stud'),
    _ = require("slicks-utils"),
    paths = require('path'),
    fw = require("slicks-fswalker");
module.exports = {
    compile: function (src, dest) {
        if (!_.isString(src) || !_.isString(dest)) return console.log("Source and destination are mandatory for studc operations");

        fw.walk(src, function (e, files) {
            if (!e) {
                _.each(files, function(i, filePath){

                    var ext = paths.extname(filePath),
                        fname = paths.basename(filePath, ext);

                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        // Parse the XML
                        var templates = new XmlDocument(data);

                        var templates = templates.childrenNamed("template"),
                            sb = require('strbuilder')("");
                        _.each(templates, function () {
                            var name = this.attr.id;
                            var cnt = this.firstChild.toString({trimmed: true, compressed: true});
                            cnt = cnt.replace(/"/g, "'");
                            stud.compile(cnt, name, function (done) {
                                sb.append(done);
                            });
                        });
                        if (sb.length){
                            var filename = paths.resolve(process.cwd(), dest);

                            if (fs.statSync(filename).isDirectory()) {
                                filename = paths.join(filename, fname) + ".js";
                            } else {
                                filename = filename.replace(/\.\w+$/, ".js");
                            }

                            fs.writeFile(filename, sb.toString(), 'utf8', function (e) {
                                if (e) console.log(e);
                            });
                        }

                    });
                });
                console.log("Templates compiled and Ok.");
            }
        });
    }

};