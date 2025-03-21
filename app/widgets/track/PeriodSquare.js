import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PeriodSquare = ({ level, onTrack, selected }) => {
    return (
        <TouchableOpacity onPress={() => onTrack(level)} style={[styles.square, selected && styles.selected]}>
            <Text style={[styles.text, selected && styles.selectedText]}>{level}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    square: {
        flex: 1,
        height: 90,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    selected: {
        backgroundColor: '#ea5688',
    },
    text: {
        color: '#009668',
        fontWeight: 'bold',
    },
    selectedText: {
        color: 'white',
    },
});

export default PeriodSquare;
