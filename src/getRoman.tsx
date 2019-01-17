const isSmallChar = (next: string) => [...'ぁぃぅぇぉゃゅょ'].includes(next);
const add = (n: string) => (item: string) => n + item;
const romanTable: any = {
  'を': 'wo',
  'しゃ': 'sya,sha,sixya,shixya', 'しゅ': 'syu,shu,sixyu,shixyu',
  'しぇ': 'sye,she,sixye,shixye', 'しょ': 'syo,sho,sixyo,shixyo',
  'ちゃ': 'tya,cha,tixya,chixya', 'ちゅ': 'tyu,chu,tixyu,chixyu',
  'ちぇ': 'tye,che,tixye,chixye', 'ちょ': 'tyo,cho,tixyo,chixyo',
  'じゃ': 'ja,zya,jixya,zixya', 'じゅ': 'ju,zyu,jixyu,zixyu',
  'じぇ': 'je,zye,jixe,zixe', 'じょ': 'jo,zyo,jixyo,zixyo',
  'てぃ': 'thi,texi', 'てぇ': 'the,texe', 'ふぁ': 'fa,fuxa,huxa',
  'ふぃ': 'fi,fuxi,huxi', 'ふぇ': 'fe,fuxe,huxe',
  'ふぉ': 'fo,fuxo,huxo', 'ゔぁ': 'va,vuxa',
  'ゔぃ': 'vi,vuxi', 'ゔ': 'vu', 'ゔぇ': 've,vuxe', 'ゔぉ': 'vo,vuxo',
  'うぁ': 'uxa,wha', 'うぃ': 'wi,uxi,whi', 'うぇ': 'we,uxe,whe',
  'うぉ': 'uxo,who',
  'くぁ': 'kwa,kuxa',
  'ぐぁ': 'gwa,guxa', 'ぐぃ': 'gwi,guxi',
  'ぐぅ': 'gwu,guxu', 'ぐぇ': 'gwe,guxe',
  'ぐぉ': 'gwo,guxo',
  'つぁ': 'tsa,tuxa,tsuxa', 'つぃ': 'tsi,tuxi,tsuxi',
  'つぇ': 'tse,tuxe,tsuxe', 'つぉ': 'tso,tuxo,tsuxo',
  'とぁ': 'twa,toxa', 'とぃ': 'twi,toxi',
  'とぅ': 'twu,toxu', 'とぇ': 'twe,toxe',
  'とぉ': 'two,toxo',
  'でぃ': 'dhi,dexi', 'でゅ': 'dhu,dexyu', 'どぅ': 'dwu,doxu',
  'ゐ': 'wyi', 'ゑ': 'wye',
  'ー': '-', '。': '.'
};

for (const key of Object.keys(romanTable)) romanTable[key] = romanTable[key].split(',');
for (const val of 'abcdefghijklmnopqrstuvwxyz0123456789- ,:(){}.・!&%') {
  romanTable[val] = [val];
  romanTable[val.toUpperCase()] = [val.toUpperCase()];
}
romanTable['ヴぁ'] = romanTable['ゔぁ']; romanTable['ヴぃ'] = romanTable['ゔぃ'];
romanTable['ヴ'] = romanTable['ゔ']; romanTable['ヴぇ'] = romanTable['ゔぇ'];
romanTable['ヴぉ'] = romanTable['ゔぉ'];

const consonant: any = {
  'し': 's,sh', 'ち': 't,ch',
  'つ': 't,ts', 'ふ': 'h,f',
  'じ': 'z,j',
};
// 基本的なローマ字表を構築する
for (const [hiraganas, cons] of [
  ['あいうえお', ''], ['かきくけこ', 'k'],
  ['さしすせそ', 's'], ['たちつてと', 't'],
  ['なにぬねの', 'n'], ['はひふへほ', 'h'],
  ['まみむめも', 'm'], ['やゆよ', 'y'],
  ['らりるれろ', 'r'], ['わ', 'w'],
  ['がぎぐげご', 'g'], ['ざじずぜぞ', 'z'],
  ['だぢづでど', 'd'], ['ばびぶべぼ', 'b'],
  ['ぱぴぷぺぽ', 'p']]) {
  for (let i = 0, _i = hiraganas.length; i < _i; i++) {
    const hiragana = hiraganas[i];
    if (!consonant[hiragana]) consonant[hiragana] = cons;
    romanTable[hiragana] = consonant[hiragana].split(',').map((c: string) => c + 'aiueo'[i]);
  }
}
romanTable['ゆ'] = ['yu'];
romanTable['よ'] = ['yo'];

export const getRoman = (furigana: any, targetPos: number): any => {
  // ローマ字の取得
  // furiganaのtargetPosの位置を取得
  // 結果は配列の形式で返す
  // [[ローマ字], 変換対象となる文字数]
  furigana = [...furigana];
  let result = [];
  const nowChar: any = furigana[targetPos],
    nextChar = furigana[targetPos + 1] || '';
  if (isSmallChar(nextChar) && romanTable[nowChar + nextChar]) result = [romanTable[nowChar + nextChar].concat(), 2]; // 「じゃ」 などromanTableに登録されている場合
  else if (isSmallChar(nowChar)) {
    // 拗音単独の場合
    result = [['x' + [...'aiueo', 'ya', 'yu', 'yo'][[...'ぁぃぅぇぉゃゅょ'].indexOf(nowChar)]], 1];
  } else if ([...'ぃぇゃゅょ'].includes(nextChar)) {
    // 次が拗音の場合
    const smallChar = {
      'ぃ': ['yi', 'ixi'],
      'ぇ': ['ye', 'ixe'],
      'ゃ': ['ya', 'ixya'],
      'ゅ': ['yu', 'ixyu'],
      'ょ': ['yo', 'ixyo']
    }[nextChar];
    for (const cons of consonant[nowChar].split(',')) result.push(cons + smallChar[0], cons + smallChar[1]);
    romanTable[nowChar + nextChar] = result.concat();
    result = [result, 2];
  } else if (nowChar === 'ん') {
    // 今の文字が「ん」の場合
    // 必要最低限のnで返す
    result = ['nn'];
    if (nextChar !== '' && (consonant[nextChar] === undefined || !['n', '', 'y'].includes(consonant[nextChar])))
      result = ['n']; // 「んな」「んや」「んあ」でない、または後ろが記号のケース
    result = [result, 1];
  } else if (nowChar === 'っ') {
    // いまの文字が「っ」の場合
    result = [['xtu', 'xtsu'], 1]; // 「女神さまっ」や「女神さまっ2」のように、後ろが存在しないか記号のケース
    if (nextChar !== '' && consonant[nextChar] !== undefined) {
      const [_res, count] = getRoman(furigana, targetPos + 1);
      result = [[..._res.map((item: any) => item[0] + item), ..._res.map(add('xtu')), ..._res.map(add('xtsu'))], count + 1];
    }
  } else result = [romanTable[nowChar].concat(), 1]; // 普通のとき
  if (furigana[targetPos - 1] === 'ん' && !['n', '', 'y'].includes(consonant[nowChar])) {
    // ここはnを足す処理
    // たとえば「しんくろにしてぃーん」で「shin」と入力したとき、次はnでもよいし、sでもよい。
    // ただ、「ん」のほうにnを付け加えるより、うしろの「く」を便宜上「'ku'でも'nku'でもよい」としたほうが便利。
    // このnを足す処理を行う
    result[0] = result[0].concat(result[0].map(add('n')));
  }
  return [result[0], result[1]];
};
// console.log(getRoman('ちゃっぷりん', 0));

