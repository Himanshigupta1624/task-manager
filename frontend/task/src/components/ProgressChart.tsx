import React from "react";
import {View,Dimensions} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import { TaskStats } from "@/types";
import { colors } from "@/styles/colors";


interface ProgressChartProps{
    stats:TaskStats;
}
export const ProgressChart : React.FC<ProgressChartProps> =({ stats})=>{
    const screenwidth =Dimensions.get('window').width;

    const data=[
        {
            name:'Completed',
            population: stats.completed_tasks,
            color:colors.success,
            legendFontColor:colors.text,
            legendFontize:14,
        },
        {
            name: 'Incomplete',
            population: stats.incomplete_tasks,
            color: colors.error,
            legendFontColor: colors.text,
            legendFontSize: 14,
        },
    ];
    const chartConfig={
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
    };
    return (
        <View style={{ alignItems: 'center' }}>
      <PieChart
        data={data}
        width={screenwidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />
    </View>
    );
};