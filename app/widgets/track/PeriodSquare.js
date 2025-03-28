import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext

const PeriodSquare = ({ level, onTrack, selected }) => {
    const { settings } = useContext(SettingsContext); // Access settings from context

    return (
        <TouchableOpacity onPress={() => onTrack(level)} style={[styles.square, selected && styles.selected, { backgroundColor: (selected && styles.selected) ? '#ea5688' : settings.highContrast ? '#555' : '#f4f3f3'}]}>
            <Text style={[styles.text, selected && styles.selectedText, { fontSize : settings.largeText ? 17 : 15, color: (selected && styles.selected) ? 'white' : settings.highContrast ? 'white' : '#009668'}]}>{level}</Text>
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
