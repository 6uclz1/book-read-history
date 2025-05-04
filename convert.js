const fs = require('fs')
const { parse } = require('csv-parse/sync')
const { createHash } = require('crypto')

const data = fs.readFileSync('./public/books.csv')

// 先頭にヘッダー行を追加
const header = 'title,_0,author,_,publisher,isbn,readDate,_1,_2,thumnailImage,_3,_4,_5,_6\n'
const dataWithHeader = header + data

const d = parse(dataWithHeader, {columns:true})

const formattedData = d.map((row) => {
    console.log(row)
    const idSource = `${row.title}${row.author}`;
    const id = createHash('sha256').update(idSource).digest('hex');
    return {
        id: id,
        title: row.title,
        author: row.author,
        publisher: row.publisher,
        isbn: row.isbn,
        readDate: row.readDate,
        thumnailImage: row.thumnailImage.replace(/\?.*$/,"")
    }
})

const json = JSON.stringify(formattedData, null, 2);

fs.writeFileSync('export.json', json);
