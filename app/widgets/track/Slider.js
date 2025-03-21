import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
const SliderComponent = ({ sliderText, onChange, value }) => {
    const [sliderValue, setSliderValue] = useState(value);

    useEffect(() => {
        setSliderValue(value);
    }, [value]);

    const handleChange = (newValue) => {
        setSliderValue(newValue);
        onChange(newValue);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sliderText}>{sliderText}</Text>
            <View style={styles.sliderWrapper}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={3}
                    step={1}
                    value={sliderValue}
                    onValueChange={handleChange}
                    minimumTrackTintColor="#009688"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#009688"
                />
                <View style={styles.levels}>
                    <Text style={styles.levelText}>None</Text>
                    <Text style={styles.levelText}>Low</Text>
                    <Text style={styles.levelText}>Medium</Text>
                    <Text style={styles.levelText}>High</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    sliderText: {
        marginRight: 10,
        minWidth: 100,
    },
    sliderWrapper: {
        flex: 1,
        maxWidth: '80%',
    },
    slider: {
        width: '100%',
    },
    levels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    levelText: {
        fontSize: 12,
        color: '#555',
    },
});

export default SliderComponent;
