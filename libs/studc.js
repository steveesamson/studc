var XmlDocument = require('xmldoc').XmlDocument,
    fs = require('fs-extra'),
    mkdirp = require('mkdirp'),
    stud = require('stud'),
    _ = require("slicks-utils"),
    paths = require('path'),
    fw = require("slicks-fswalker");

module.exports = {
    dis: process.cwd(),
    compile: function (src, dest) {
        console.log('src: ' + src);
        var self = this;
        if (!_.isString(src) || !_.isString(dest)) return console.log("Source and destination are mandatory for studc operations");

        fw.walk(src, function (e, files) {
            if (!e) {
                _.each(files, function (i, filePath) {

                    var ext = paths.extname(filePath),
                        //fname = paths.basename(filePath, ext),
                        targetName = filePath.replace(self.dis, "").substring(1),
                        targetName = targetName.substring(targetName.indexOf('/') + 1);


                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }

                        //console.log("src:%s, file:%s, target:%s", src, filePath, targetName);



                        stud.compile(data, targetName, function (content) {
                            if (content) {
                                var filename = paths.resolve(process.cwd(), dest,targetName);
                                    filename = filename.replace(/\.\w+$/, ".js");
                                mkdirp(paths.dirname(filename), function (err) {
                                    if (err) return cb(err)
                                    fs.writeFile(filename, content, function (err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                        //console.log('File ' + filename + ' written.');
                                    });
                                });


                            }
                        });

                    });
                });
                console.log("Templates compiled and Ok.");
            }
        });
    }

};