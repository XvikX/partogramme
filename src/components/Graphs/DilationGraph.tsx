import React from "react";
import { View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryScatter,
  VictoryArea,
  VictoryLegend,
} from "victory-native";
import { observer } from "mobx-react";
import {
  Dilation,
  DilationStore,
} from "../../store/Dilatation/dilatationStore";
import { BabyDescentStore } from "../../store/BabyDescent/babyDescentStore";

interface DilationGraphProps {
  dilationStore?: DilationStore;
  babyDescentStore?: BabyDescentStore;
}

/**
 * @brief Component to display the dilation graph
 * @param dilationStore  - dilation store
 * @returns  - dilation graph component
 * @note  - The graph is based on the data points from the dilation store
 *
 *
 * @example
 * ```tsx
 * <DilationGraph dilationStore={dilationStore} />
 * ```
 * @
 * @see dilationStore
 * @see Dilation
 * @see DilationStore
 * @see DilationGraphProps
 * @see DilationGraph
 */
export const DilationGraph: React.FC<DilationGraphProps> = observer(
  ({ dilationStore, babyDescentStore }) => {
    const alertLineArea = [
      { x: 0, y: 10, y0: 4 },
      { x: 6, y: 10, y0: 10 },
    ];

    const actionLineArea = [
      { x: 4, y: 4, y0: 4 },
      { x: 12, y: 12, y0: 4 },
    ];

    const normalLineArea = [
      { x: 0, y: 4, y0: 4 },
      { x: 4, y: 8, y0: 4 },
      { x: 6, y: 10, y0: 6 },
      { x: 10, y: 10, y0: 10 },
    ];

    const legendData = [
      { name: "Dilatation", symbol: { fill: "red" } },
      { name: "Descente du bébé", symbol: { fill: "blue" } },
    ];

    const yStartValue = 0;
    const yEndValue = 10;
    const step = 1;
    const yTickValues = Array.from(
      { length: Math.floor((yEndValue - yStartValue) / step) + 1 },
      (_, index) => yStartValue + index * step
    );

    // Get the sorted list of data points from dilation store
    const sortedData = dilationStore?.sortedDilationList;
    // Get the sorted list of data points from baby descent store
    const sortedBabyDescentData = babyDescentStore?.sortedBabyDescentList;

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

    // Create an array of data points based on the dilation store
    const dataDilation = sortedData?.map((point: Dilation) => {
      return {
        x:
          point.dilation.Rank === 0
            ? getCurrentRelativeX(
                point.partogrammeStore.partogramme.workStartDateTime
              )
            : point.dilation.Rank,
        y: point.dilation.dilation,
      };
    });

    // Create an array of data points based on the baby descent store
    const dataBabyDescent = sortedBabyDescentData?.map((point) => {
      return {
        x:
          point.babyDescent.Rank === 0
            ? getCurrentRelativeX(
                point.partogrammeStore.partogramme.workStartDateTime
              )
            : point.babyDescent.Rank,
        y: point.babyDescent.babydescent,
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
     * @brief Format the tick label for the X-axis
     * @param tick  - tick value
     * @returns  - formatted tick label
     */
    const formatTicky = (tick: number) => {
      return `${tick}cm`; // Format tick label with hours
    };

    return (
      <View>
        <VictoryChart
          theme={VictoryTheme.material}
          domain={{ x: [0, 12], y: [0, 10] }}
          padding={{ top: 20, bottom: 100, left: 60, right: 20 }}
          height={400}
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
            tickFormat={formatTicky}
            // Customize the Y-axis as needed
          />
          {/* Line for dilation data */}
          <VictoryLine
            data={dataDilation}
            // Customize the line for data as needed
          />
          <VictoryScatter
            style={{ data: { fill: "#c43a31" } }}
            size={4}
            data={dataDilation}
          />
          {/* Line for baby descent data */}
          <VictoryLine
            data={dataBabyDescent}
            // Customize the line for data as needed
          />
          <VictoryScatter
            style={{ data: { fill: 'blue' } }}
            size={4}
            data={dataBabyDescent}
          />
          <VictoryArea
            data={alertLineArea}
            style={{
              data: {
                fill: "rgba(6, 189, 37, 0.3)",
              },
            }}
          />
          <VictoryArea
            data={normalLineArea}
            style={{
              data: {
                fill: "rgba(255, 255, 51, 0.3)",
              },
            }}
          />
          <VictoryArea
            data={actionLineArea}
            style={{
              data: {
                fill: "rgba(255, 0, 0, 0.3)",
              },
            }}
          />
          <VictoryLegend
            x={20}
            y={335}
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

export default DilationGraph;
