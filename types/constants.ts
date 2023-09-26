/**
 * @description
 * This file contains all the constants used in the application
 */
import { Database } from "../types/supabase";

// Constants for the Tables of the graph page
export const tableTitles = [
  "Température de la mère",
  "Tension artérielle Systolique de la mère",
  "Tension artérielle Diastolique de la mère",
  "Pouls de la mère",
  "Fréquence des contractions",
  "Liquide Amniotique",
]

export const liquidStates = [
  "INTACT",
  "CLAIR", 
  "MECONIAL",
  "SANG"
]