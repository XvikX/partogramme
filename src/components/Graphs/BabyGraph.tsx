import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
  Text,
  VictoryLegend,
} from "victory-native";
import { observer } from "mobx-react";
import {
  BabyHeartFrequencyStore,
  BabyHeartFrequency,
} from "../../store/BabyHeartFrequency/babyHeartFrequencyStore";

interface BabyGraphProps {
  babyHeartFrequencyList?: BabyHeartFrequencyStore;
}

/**
 * @brief Graph component for the baby heart frequency
 * @param babyHeartFrequencyStore - store for the baby heart frequency
 */
export const BabyGraph: React.FC<BabyGraphProps> = observer(
  ({ babyHeartFrequencyList }) => {

    const legendData = [
      { name: 'Fréquence Cardiaque du bébé', symbol: { fill: 'red' } },
    ];

    const yStartValue = 120;
    const yEndValue = 180;
    const step = 10;
    const yTickValues = Array.from(
      { length: Math.floor((yEndValue - yStartValue) / step) + 1 },
      (_, index) => yStartValue + index * step
    );

    const sortedData = babyHeartFrequencyList?.sortedBabyHeartFrequencyList;

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
      return normalizedHours;
    };

    // Create an array of data points based on the baby heart frequency store
    const data = sortedData?.map((point: BabyHeartFrequency) => {
      return {
        x:
          point.data.Rank === 0
            ? getCurrentRelativeX(
                point.partogrammeStore.partogramme.workStartDateTime
              )
            : point.data.Rank,
        y: point.data.value,
      };
    });

    // Create an array of tick values [0, 1, 2, ..., 12] for the X-axis
    const xTickValues = Array.from({ length: 13 }, (_, index) => index);

    /**
     * @brief Format the tick label for the X-axis
     * @param tick  - tick value
     * @returns  - formatted tick label
     */
    const formatTickx = (tick: number) => {
      return `${tick}h`; // Format tick label with hours
    };

    /**
     * @brief Format the tick label for the Y-axis
     * @param tick  - tick value
     * @returns  - formatted tick label
     */
    const formatTicky = (tick: number) => {
      return `${tick}bpm`; // Format tick label with hours
    };

    return (
      <View>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 12], y: [120, 180] }}
          padding={{ top: 20, bottom: 100, left: 70, right: 30 }}
          height={300}
          style={
            {
              // parent: {
              //   border: "1px solid #ccc",
              // },
            }
          }
        >
          <VictoryAxis
            // Customize the X-axis as needed
            tickValues={xTickValues}
            tickFormat={formatTickx}

            // domain={[0, 12]}
          />
          <VictoryAxis
            dependentAxis
            tickValues={yTickValues}
            // Customize the Y-axis as needed
            tickFormat={formatTicky}
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
          <VictoryLegend
            x={20}
            y={230}
            title="Légende"
            centerTitle
            orientation="horizontal"
            gutter={20}
            style={{
              border: { stroke: "black" },
              title: { fontSize: 12, fontWeight: "bold" },
            }}
            data={legendData}
          />
        </VictoryChart>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  graphStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BabyGraph;
