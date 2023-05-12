import React from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { DataPoint } from '../../types/types';

interface BabyGraphProps {
  data1: DataPoint[];
  data2: DataPoint[];
}

const BabyGraph: React.FC<BabyGraphProps> = ({ data1, data2 }) => {
  return (
    <View>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryAxis
          // Customize the X-axis as needed
        />
        <VictoryAxis
          dependentAxis
          // Customize the Y-axis as needed
        />
        <VictoryLine
          data={data1}
          // Customize the line for data1 as needed
        />
        <VictoryLine
          data={data2}
          // Customize the line for data2 as needed
        />
      </VictoryChart>
    </View>
  );
};

export default BabyGraph;