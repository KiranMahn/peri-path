import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingsContext } from '../../settings-context'; // Import SettingsContext

type AnalysisWigiProps = {
    title: string;
    value: string | null;
    altMsg: string;
};

const AnalysisWigi: React.FC<AnalysisWigiProps> = ({ title, value, altMsg }) => {
    const context = useContext(SettingsContext); // Access settings from context
    if (!context || !context.settings) {
        throw new Error('SettingsContext is not properly provided.');
    }
    const { settings } = context;

    return (
        <View style={styles.container}>
            {value !== null ? (
                <View>
                    <Text style={[styles.title, { fontSize: settings.largeText ? 23 : 18 }]}>{title}</Text>
                    <Text style={[styles.value, { fontSize: settings.largeText ? 27 : 22 }]}>{value}</Text>
                </View>
            ) : (
                <Text style={[styles.altMsg, { fontSize: settings.largeText ? 25 : 20 }]}>{altMsg}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '40%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f3f3',
        borderRadius: 25,
        margin: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    value: {
        fontSize: 22,
        color: '#009688',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    altMsg: {
        fontSize: 20,
        textAlign: 'center',
    },
});

export default AnalysisWigi;