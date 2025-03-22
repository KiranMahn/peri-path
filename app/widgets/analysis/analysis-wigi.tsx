import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AnalysisWigiProps = {
    title: string;
    value: string | null;
    altMsg: string;
};

const AnalysisWigi: React.FC<AnalysisWigiProps> = ({ title, value, altMsg }) => {
    return (
        <View style={styles.container}>
            {value !== null ? (
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.value}>{value}</Text>
                </View>
            ) : (
                <Text style={styles.altMsg}>{altMsg}</Text>
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
