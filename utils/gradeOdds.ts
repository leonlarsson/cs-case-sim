import { ItemGrade } from "@/types";

type GradeOddsType = {
  [grade in ItemGrade]: number;
};

// Define drop rates - taken from https://www.csgo.com.cn/news/gamebroad/20170911/206155.shtml
export const gradeOddsCase = {
  // "Rare Special Item": 1,
  "Mil-Spec Grade": 0.79923,
  Restricted: 0.15985,
  Classified: 0.03197,
  Covert: 0.00639,
  "Rare Special Item": 0.00256,
} as GradeOddsType;

export const gradeOddsSouvenir = {
  // "Covert" : 1,
  "Consumer Grade": 0.79872,
  "Industrial Grade": 0.15974,
  "Mil-Spec Grade": 0.03328,
  Restricted: 0.00666,
  Classified: 0.00133,
  Covert: 0.00027,
} as GradeOddsType;
