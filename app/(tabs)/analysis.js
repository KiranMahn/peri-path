import React, {useContext} from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Nav from "../widgets/nav";

import CycleLength from "../widgets/analysis/cycle-length";
import PeriodLength from "../widgets/analysis/period-length";
import LastPeriod from "../widgets/analysis/last-period";
import MostCommonSymptom from "../widgets/analysis/most-common-symptom";
import SymptomChart from "../widgets/analysis/symptom-chart";
import PeriodChart from "../widgets/analysis/period-chart";
import { SettingsContext } from '../settings-context';
const Analysis = () => {
    const navigation = useNavigation();
    const { settings } = useContext(SettingsContext);
    return (
        <View style={[styles.container, { backgroundColor: settings.highContrast ? 'black' : 'white' }]}>
            <ScrollView style={styles.content} testID='analysis-container'>
                <SymptomChart />
                {/* <ChartLoadingWidget /> */}
                
                <View style={styles.row}>
                    <CycleLength />
                    <PeriodLength />
                </View>
                <View style={styles.row}>
                    <LastPeriod />
                    <MostCommonSymptom />
                </View>
                <PeriodChart />
    
            </ScrollView>

            <Nav navigate={navigation.navigate} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 0.5,
        top: 0,
        width: '100%',
        backgroundColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerButtonContainer: {
        alignSelf: 'flex-end',
        marginTop: 10,
        marginRight: 15,
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 3,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
});

export default Analysis;
