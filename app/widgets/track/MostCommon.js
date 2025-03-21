import React, { useState, useEffect } from 'react';
import { View, Text, Slider, StyleSheet } from 'react-native';

const CustomSlider = ({ sliderText, onChange, value }) => {
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
            <Text style={styles.label}>{sliderText}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={3}
                step={1}
                value={sliderValue}
                onValueChange={handleChange}
                minimumTrackTintColor="#009688"
                maximumTrackTintColor="#f0f0f0"
                thumbTintColor="#009688"
            />
            <View style={styles.levelsContainer}>
                <Text style={styles.levelText}>None</Text>
                <Text style={styles.levelText}>Low</Text>
                <Text style={styles.levelText}>Medium</Text>
                <Text style={styles.levelText}>High</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        width: '100%',
        alignItems: 'center',
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
    },
    slider: {
        width: '80%',
    },
    levelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    levelText: {
        fontSize: 12,
    },
});

export default CustomSlider;
