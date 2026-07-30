import type { Book } from "@/types/book";
import { books as generatedBooks } from "../../public/books";

// 生成物をそのまま re-export すると、CSV の列がずれても型エラーにならない。
// ここで Book[] として受け直し、変換スクリプトの出力を型検査の対象にする。
export const books: Book[] = generatedBooks;
