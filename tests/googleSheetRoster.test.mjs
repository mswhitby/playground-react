import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSheetColumns,parseSheetLink,sheetColumnIndices} from '../src/lib/googleSheetRoster.js';

test('Google Sheet parser accepts live roster columns and optional second period',()=>{
 const headers=['Class Period','First Name','Last Name','GitHub Username','Class Period 2'];
 assert.deepEqual(sheetColumnIndices(headers),[0,1,2,3,4]);
 const rows=parseSheetColumns(headers,[['1'],['Ada'],['Lovelace'],['@ada-code'],['6']]);
 assert.deepEqual(rows,[{github:'ada-code',period:'1',periods:['1','6'],firstName:'Ada',lastName:'Lovelace',name:'Ada Lovelace',row:2}]);
});

test('saved Google Sheet URLs use the selected gid',()=>{
 assert.deepEqual(parseSheetLink('https://docs.google.com/spreadsheets/d/abc_123/edit#gid=42'),{id:'abc_123',gid:42});
});
