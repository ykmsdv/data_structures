const fs = require('fs');
const cheerio = require('cheerio');


// load the text file
const content = fs.readFileSync('data/aa-3.txt', 'utf-8');

// load `content` into a cheerio object
const $ = cheerio.load(content);


let addresses = '';
$('form + table tbody tr > td:first-child').each(function(i, elem) {
    
    let $el = $(elem);

    let address = $el.find("b + br").get(0).nextSibling.nodeValue;
    address = address.split(",")[0];
    address = address.split("- ")[0];
    address = address.replace(/(\r\n|\n|\t|\r)/gm, "");
    console.log(address);

    addresses += address + '\n';
});

console.log(typeof(addresses));

fs.writeFileSync('data/addresses-03.txt', addresses);
