import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const WeightScreen = () => {
  const totalDays = 60;

  // Labels every 10 days
  const labels = [];
  for (let i = 0; i <= totalDays; i += 10) {
    labels.push(`Day ${i}`);
  }

  // Generate weights for every day
  const allWeights = [];
  for (let i = 0; i <= totalDays; i++) {
    allWeights.push(80 + (10 * i) / totalDays);
  }

  // Select weights for the labels
  const dataWeights = [];
  for (let i = 0; i <= totalDays; i += 10) {
    dataWeights.push(allWeights[i]);
  }

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginVertical: 10 }}>
        Weight Progress Over 2 Months
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: dataWeights,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            },
          ],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisMin={78}   // set minimum y-axis value a bit below start weight
        yAxisMax={92}   // set maximum y-axis value a bit above end weight
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 8,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '1',
            stroke: '#0000ff',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 8,
          alignSelf: 'center',
        }}
        fromZero={false} // important, otherwise overrides yAxisMin
        yAxisSuffix="kg"
        yAxisInterval={1}
      />
    </View>
  );
};

export default WeightScreen;
