/**
 * @module tools
 * @description
 * Tools for string manipulation
 * @see {@link module:tools}
 * @requires module:tools
 */

export const formatDateString = (date: string | null): string => {
  if (!date) return "Aucune date";
  return new Date(date as string)
                .toLocaleString()
                .replace(",", "");
}

