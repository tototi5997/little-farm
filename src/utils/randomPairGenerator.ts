import seedrandom from "seedrandom";

export function generateDeterministicPair(n: number, inputString: string, date: Date): [number, number] {
  const seed = hashString(`${inputString}-${date.toISOString().split("T")[0]}`);
  const randomGen = seedrandom(seed.toString()); // 创建一个基于种子的随机生成器

  const randomA = Math.floor(randomGen() * n);
  let randomB = Math.floor(randomGen() * n);

  // 确保两个数字不相同
  if (randomA === randomB) {
    randomB = (randomB + 1) % n;
  }

  return [randomA, randomB];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const selectPairFromList = (pair: number[], list: unknown[]) => {
  const res = [];
  const restList = [];
  for (let i = 0; i < list.length; i++) {
    if (pair.includes(i)) {
      res.push(list[i]);
    } else {
      restList.push(list[i]);
    }
  }
  return [res, restList];
};
