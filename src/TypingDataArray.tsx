import { getRoman } from './getRoman'
import { Data } from './typingData'

export const typingData = (): [string[], string, string, boolean[]] => {
  const str1: string[] = typingDataArray()[randomNumber(typingDataArray().length)]
  const str: string = str1[0]
  let i = 0;
  let res = [''];
  while (i < str.length) {
    const [pattern, count] = getRoman(str, i);
    const _res = [];
    for (let j = 0; j < pattern.length; j++)
      _res.push(...res.map(item => item + pattern[j]));
    res = _res;
    i += count;
  }
  const a: [string[], string, string, boolean[]] = [res, str, str1[1], Array(res.length).fill(true)]
  return a
}

const typingDataArray = (): any[] => {
  const a: any[] = Data()
  // [["あいう", "愛生"],
  // ["ちゃっぷりん", "チャップリン"]]
  return a
}

const randomNumber = (typingDataArray: number): number => {
  return Math.floor(Math.random() * typingDataArray)
}