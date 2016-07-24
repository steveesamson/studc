#!/usr/bin/env node

var stuc = require('./libs/studc'),
    args = process.argv.slice(2),
    help = function () {
        console.error("usage: studc  <source> -o  <distination>");
        process.exit();
    };

if (args.length < 3) {
    help();
}

//console.log(args);

var src = args[0].trim(),
    operation = args[1].trim(),
    dest = args[2].trim();


switch (operation) {
    case '-o':
        if (!src || !dest) help();
        else stuc.compile(src, dest);
        break;
    default:
        help();

}

