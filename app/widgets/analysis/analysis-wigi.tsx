import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingsContext } from '../../settings-context'; 

type AnalysisWigiProps = {
    title: string;
    value: string | null;
    altMsg: string;
};

// used for last period date, most common symptom, cycle length, and period length
const AnalysisWigi: React.FC<AnalysisWigiProps> = ({ title, value, altMsg }) => {
    const context = useContext(SettingsContext); 

    if (!context || !context.settings) {
        throw new Error('SettingsContext is not properly provided.');
    }

    const { settings } = context;

    if(!altMsg || altMsg === '') {
        altMsg = 'No data available';
    }

    if(value === null || value === '') {
        value = altMsg;
    }

    return (
        <View style={[styles.container, {backgroundColor: settings.highContrast ? '#555' : '#f4f3f3'}]}>

            {value !== null ? (
                <View>

                    <Text style={[styles.title, { fontSize: settings.largeText ? 23 : 18, color: settings.highContrast ? 'white' : 'black' }]}>{title}</Text>
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