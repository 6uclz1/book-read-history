const fs = require("fs");
const { parse } = require("csv-parse/sync");
const { createHash } = require("crypto");

console.log("📚 本データの変換を開始します...");

function convertIsbn13ToAsin(isbn13) {
  if (!isbn13 || !isbn13.startsWith("978")) {
    return null;
  }

  const isbn10 = isbn13.substring(3, 12);
  let checksum = 0;
  for (let i = 0; i < 9; i++) {
    checksum += parseInt(isbn10[i]) * (i + 1);
  }
  checksum %= 11;

  return isbn10 + (checksum === 10 ? "X" : checksum);
}

function normalizeTitle(title) {
  if (!title) {
    return "";
  }
  return title.toLowerCase().replace(/[　\s]/g, "");
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

try {
  // CSVファイルを読み込み
  const booksData = fs.readFileSync("./public/books.csv");
  console.log("✅ books.csv を読み込みました");
  const highlightsData = fs.readFileSync("./public/highlights.csv");
  console.log("✅ highlights.csv を読み込みました");

  // 先頭にヘッダー行を追加
  const booksHeader =
    "title,_0,author,_,publisher,isbn,readDate,_1,_2,thumnailImage,_3,_4,_5,_6\n";
  const booksDataWithHeader = booksHeader + booksData;

  // CSVをパース
  const booksD = parse(booksDataWithHeader, { columns: true });
  console.log(`📖 ${booksD.length}件の本データを処理中...`);
  const highlightsD = parse(highlightsData, {
    columns: ["Book", "ASIN", "Section", "Location", "Highlight", "Note"],
    record_delimiter: ["\r\n", "\r"],
  });
  console.log(`📝 ${highlightsD.length}件のハイライトデータを処理中...`);

  // ハイライトをISBNとタイトルでグループ化
  const highlightsByIsbn = highlightsD.reduce((acc, highlight) => {
    const isbn = highlight.ASIN;
    if (isbn && !acc[isbn]) {
      acc[isbn] = [];
    }
    if (isbn) {
      acc[isbn].push({
        text: highlight.Highlight,
        location: highlight.Location,
      });
    }
    return acc;
  }, {});

  const highlightsByTitle = highlightsD.reduce((acc, highlight) => {
    const title = normalizeTitle(highlight.Book);
    if (title && !acc[title]) {
      acc[title] = [];
    }
    if (title) {
      acc[title].push({
        text: highlight.Highlight,
        location: highlight.Location,
      });
    }
    return acc;
  }, {});

  // データを整形
  const formattedData = booksD.map((row, index) => {
    const idSource = `${row.title}${row.author}`;
    const id = createHash("sha256").update(idSource).digest("hex");
    const asin = convertIsbn13ToAsin(row.isbn);
    let highlights = highlightsByIsbn[asin] || [];
    if (highlights.length === 0 && row.title) {
      try {
        const bookTitleRegex = new RegExp(
          escapeRegExp(normalizeTitle(row.title)),
        );
        let matchedHighlights = [];
        for (const hTitle in highlightsByTitle) {
          if (bookTitleRegex.test(hTitle)) {
            matchedHighlights = matchedHighlights.concat(
              highlightsByTitle[hTitle],
            );
          }
        }
        highlights = [...new Set(matchedHighlights)];
      } catch (e) {
        console.error(`Invalid regex for title: ${row.title}`, e);
      }
    }

    if (highlights.length > 0) {
      console.log(
        `[OK] ${row.title} (ISBN13: ${row.isbn}, ASIN: ${asin}) - ${highlights.length}件のハイライトが見つかりました`,
      );
    } else {
      // console.log(`[NG] ${row.title} (ISBN13: ${row.isbn}, ASIN: ${asin}) - ハイライトが見つかりませんでした`);
    }

    if ((index + 1) % 50 === 0) {
      console.log(`   処理中: ${index + 1}/${booksD.length}件`);
    }

    return {
      id: id,
      title: row.title,
      author: row.author,
      publisher: row.publisher,
      isbn: row.isbn,
      asin: asin,
      readDate: row.readDate,
      thumnailImage: row.thumnailImage.replace(/\?.*$/, ""),
      highlights: highlights,
    };
  });

  // TypeScript形式で出力
  const tsContent = `export const books = ${JSON.stringify(formattedData, null, 2)};
`;

  // books.tsファイルを直接更新
  fs.writeFileSync("./public/books.ts", tsContent);
  console.log("✅ public/books.ts を更新しました");

  // 後方互換性のためexport.jsonも生成
  const json = JSON.stringify(formattedData, null, 2);
  fs.writeFileSync("export.json", json);
  console.log("✅ export.json を生成しました");

  console.log(
    `🎉 変換完了！ ${formattedData.length}件の本データを処理しました`,
  );
} catch (error) {
  console.error("❌ エラーが発生しました:", error.message);
  process.exit(1);
}
