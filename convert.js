const fs = require('fs')
const { parse } = require('csv-parse/sync')
const { randomUUID } = require('crypto')

const data = fs.readFileSync('./public/books.csv')

const d = parse(data, {columns:true})

const formattedData = d.map((row) => {
    return {
        id: randomUUID(),
        title: row.title,
        author: row.author,
        publisher: row.publisher,
        isbn: row.isbn,
        readDate: row.readDate,
        thumnailImage: row.thumnailImage.replace(/\?.*$/,"")
    }
})

console.log(formattedData)

const json = JSON.stringify(formattedData, null, 2);

fs.writeFileSync('export.json', json);
