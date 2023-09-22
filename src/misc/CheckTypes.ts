import { Database } from '../../types/supabase';
import { BabyDescent } from '../store/GraphData/BabyDescent/babyDescentStore';
import { BabyHeartFrequency } from '../store/GraphData/BabyHeartFrequency/babyHeartFrequencyStore';
import { Dilation } from '../store/GraphData/Dilatation/dilatationStore';
import { AmnioticLiquid } from '../store/TableData/AmnioticLiquid/amnioticLiquidStore';
import { MotherBloodPressure } from '../store/TableData/MotherBloodPressure/motherBloodPressureStore';
import { MotherContractionsFrequency } from '../store/TableData/MotherContractionsFrequency/motherContractionsFrequencyStore';
import { MotherHeartFrequency } from '../store/TableData/MotherHeartFrequency/motherHeartFrequencyStore';
import { MotherTemperature } from '../store/TableData/MotherTemperature/motherTemperatureStore';
import { data_t } from '../store/partogramme/partogrammeStore';
/**
 *Contain fuynction that can valiudates types
 */
export const isTableData = (obj: data_t) => {
  if ((obj instanceof MotherBloodPressure) ||
    (obj instanceof MotherContractionsFrequency) ||
    (obj instanceof MotherHeartFrequency) ||
    (obj instanceof MotherTemperature) ||
    (obj instanceof AmnioticLiquid)
    ) {
    return true;
  } else {
    return false;
  }
};

export const isGraphData = (obj: data_t) => {
  if ((obj instanceof BabyDescent) ||
    (obj instanceof BabyHeartFrequency) ||
    (obj instanceof Dilation)
    ) {
    return true;
  } else {
    return false;
  }
};

export function isLiquidState(input: string): input is Database['public']['Enums']['LiquidState'] {
  return (
    input === 'INTACT' ||
    input === 'CLAIR' ||
    input === 'MECONIAL' ||
    input === 'SANG'
  );
}