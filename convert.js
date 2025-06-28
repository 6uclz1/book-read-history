const fs = require('fs')
const { parse } = require('csv-parse/sync')
const { createHash } = require('crypto')

console.log('📚 本データの変換を開始します...')

try {
    // CSVファイルを読み込み
    const data = fs.readFileSync('./public/books.csv')
    console.log('✅ books.csv を読み込みました')

    // 先頭にヘッダー行を追加
    const header = 'title,_0,author,_,publisher,isbn,readDate,_1,_2,thumnailImage,_3,_4,_5,_6\n'
    const dataWithHeader = header + data

    // CSVをパース
    const d = parse(dataWithHeader, {columns:true})
    console.log(`📖 ${d.length}件の本データを処理中...`)

    // データを整形
    const formattedData = d.map((row, index) => {
        const idSource = `${row.title}${row.author}`;
        const id = createHash('sha256').update(idSource).digest('hex');
        
        if ((index + 1) % 50 === 0) {
            console.log(`   処理中: ${index + 1}/${d.length}件`)
        }
        
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

    // TypeScript形式で出力
    const tsContent = `export const books = ${JSON.stringify(formattedData, null, 2)};
`

    // books.tsファイルを直接更新
    fs.writeFileSync('./public/books.ts', tsContent);
    console.log('✅ public/books.ts を更新しました')

    // 後方互換性のためexport.jsonも生成
    const json = JSON.stringify(formattedData, null, 2);
    fs.writeFileSync('export.json', json);
    console.log('✅ export.json を生成しました')

    console.log(`🎉 変換完了！ ${formattedData.length}件の本データを処理しました`)

} catch (error) {
    console.error('❌ エラーが発生しました:', error.message)
    process.exit(1)
}
