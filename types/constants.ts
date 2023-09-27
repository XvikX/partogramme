/**
 * @description
 * This file contains all the constants used in the application
 */
import { Database } from "../types/supabase";
import { isLiquidState } from '../src/misc/CheckTypes';

// Constants for the Tables of the graph page
export const tableTitles = [
  "Température de la mère",
  "Tension artérielle Systolique de la mère",
  "Tension artérielle Diastolique de la mère",
  "Pouls de la mère",
  "Fréquence des contractions",
  "Durée des contractions de la mère",
  "Liquide Amniotique",
]

export const liquidStates = {
  INTACT: "INTACT",
  CLAIR: "CLAIR", 
  MECONIAL: "MECONIAL",
  SANG:"SANG",
  PUREE_DE_POIS: "PURÉE DE POIS",
};

// Function to get a value based on rank
export function getValueByRank(LiquidState:any, rank:any) {
  const enumValues = Object.values(LiquidState);
  if (rank >= 0 && rank < enumValues.length) {
    return enumValues[rank];
  } else {
    return undefined; // Rank out of range
  }
}

// Function to get the enum based on a string
export function getEnumByString(LiquidState: any, inputString:any) {
  for (const enumKey in LiquidState) {
    if (LiquidState[enumKey] === inputString) {
      return enumKey;
    }
  }
  return null; // String not found in the enum
}

// Function to get the string based on an enum value
export function getStringByEnum(LiquidState: any, enumValue:any) {
  return LiquidState[enumValue] || null;
}
