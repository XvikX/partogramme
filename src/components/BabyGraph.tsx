import React, { useState } from "react";
import { View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
  Text,
} from "victory-native";
import { observer } from "mobx-react";
import reactotron from "reactotron-react-native";
import { BabyHeartFrequencyStore, BabyHeartFrequency } from "../store/BabyHeartFrequency/babyHeartFrequencyStore";

interface BabyGraphProps {
  babyHeartFrequencyList?: BabyHeartFrequencyStore;
}

/**
 * @brief Graph component for the baby heart frequency
 * @param babyHeartFrequencyStore - store for the baby heart frequency
 */
export const BabyGraph: React.FC<BabyGraphProps> = observer(({babyHeartFrequencyList}) => {
  // Create an array of tick values [120, 130, 140, ..., 180] for the Y-axis
  const [graphData, setGraphData] = useState<{ x: number; y: number }[]>([]);

  const yStartValue = 120;
  const yEndValue = 180;
  const step = 10;
  const yTickValues = Array.from(
    { length: Math.floor((yEndValue - yStartValue) / step) + 1 },
    (_, index) => yStartValue + index * step
  );

  const sortedData = babyHeartFrequencyList?.sortedBabyHeartFrequencyList;

  reactotron.onCustomCommand({
    command: "Show sorted graph data",
    handler: () => {
      reactotron.display({
        name: "SORTED DATA of BABY HEART FREQUENCY",
        value: {
          sortedData: sortedData,
          printedData: data,
        },
      });
    },
  });

  /**
   * @brief Get the current relative X value for the Graph (0 to 12) base on the created date
   * @param createdDate  - date of the data point
   * @returns  - current relative X value
   */
  const getCurrentRelativeX = (createdDate: string): number => {
    const now = new Date();
    const createdTime = new Date(createdDate);
    const deltaTime = now.getTime() - createdTime.getTime();
    const hours = deltaTime / (1000 * 60 * 60); // Calculate hours difference
    const normalizedHours = hours % 12; // Normalize hours to 12
    console.log("Normalized hours: " + normalizedHours);
    return normalizedHours;
  };

  // Create an array of data points based on the baby heart frequency store
  const data = sortedData?.map((point: BabyHeartFrequency) => {
    console.log("Partogramme Point : " + point.partogrammeStore.partogramme)
    return {
      x:
        point.babyHeartFrequency.Rank === 0
          ? getCurrentRelativeX(point.partogrammeStore.partogramme.workStartDateTime)
          : point.babyHeartFrequency.Rank,
      y: point.babyHeartFrequency.babyFc,
    };
  });

  // Create an array of tick values [0, 1, 2, ..., 12] for the X-axis
  const xTickValues = Array.from({ length: 13 }, (_, index) => index);

  /**
   * @brief Format the tick label for the X-axis
   * @param tick  - tick value
   * @returns  - formatted tick label
   */
  const formatTick = (tick: number) => {
    return `${tick}h`; // Format tick label with hours
  };

  // Function to render graph title
  const renderTitle = () => {
    return (
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 10,
        }}
      >
        Fréquence cardiaque du bébé
      </Text>
    );
  };

  return (
    <View>
      <VictoryChart 
        theme={VictoryTheme.material}
        domain={{ x: [0, 12], y: [120, 180] }}
        >
        <VictoryAxis
          // Customize the X-axis as needed
          tickValues={xTickValues}
          tickFormat={formatTick}
          // domain={[0, 12]}
        />
        <VictoryAxis
          dependentAxis
          tickValues={yTickValues}
          // Customize the Y-axis as needed
        />
        <VictoryLine
          data={data}
          // Customize the line for data as needed
        />
        <VictoryScatter
          style={{ data: { fill: "#c43a31" } }}
          size={4}
          data={data}
        />
      </VictoryChart>
    </View>
  );
});

export default BabyGraph;
