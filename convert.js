// import fs from 'fs'
// import { parse } from 'csv-parse/sync'

const fs = require('fs')
const { parse } = require('csv-parse/sync')

const data = fs.readFileSync('../public/books.csv')
const d = parse(data, {columns:true})

console.log(d)