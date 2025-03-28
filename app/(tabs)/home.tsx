import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import TwoWeek from '../widgets/calendar/two-week';
import LastPeriod from '../widgets/analysis/last-period';
import MostCommonSymptom from '../widgets/analysis/most-common-symptom';
import SymptomChart from '../widgets/analysis/symptom-chart';
import PeriodChart from '../widgets/analysis/period-chart';
import Nav from '../widgets/nav';
import { SettingsContext } from '../settings-context';

const Home = () => {
    const [username, setUsername] = useState('');
    const [selectedChart, setSelectedChart] = useState<'symptoms' | 'period'>('symptoms');
    const [user, setUser] = useState<any>({});
    const settingsContext = useContext(SettingsContext); // Access settings from context
    const settings = settingsContext?.settings || { largeText: false, highContrast: false }; // Provide a fallback with default largeText value

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const storedUsers = await AsyncStorage.getItem('users');
                
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUsername(parsedUser.username);
                    
                    if (storedUsers) {
                        const parsedUsers = JSON.parse(storedUsers);
                        const foundUser = parsedUsers.find((u: any) => u.username === parsedUser.username);
                        if (foundUser) {
                            setUser(foundUser);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchUserData();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: settings.highContrast ? '#000' : '#fff'}]}>
            <ScrollView style={styles.content}>
                {/* Mini Calendar View */}
                <TwoWeek />

                {/* Chart Selector */}
                <View style={styles.chartToggleContainer}>
                    <TouchableOpacity 
                        style={[styles.chartButton, selectedChart === 'symptoms' && styles.activeButton]} 
                        onPress={() => setSelectedChart('symptoms')}>
                        <Text style={[styles.buttonText, { fontSize: settings.largeText ? 20 : 15 }]}>Symptoms</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.chartButton, selectedChart === 'period' && styles.activeButton]} 
                        onPress={() => setSelectedChart('period')}>
                        <Text style={[styles.buttonText, { fontSize: settings.largeText ? 20 : 15 }]}>Period</Text>
                    </TouchableOpacity>
                </View>

                {/* Charts */}
                {selectedChart === 'period' ? <PeriodChart /> : <SymptomChart />}
                
                {/* Mini Analysis Widgets */}
                <View style={styles.analysisContainer}>
                    <LastPeriod />
                    <MostCommonSymptom />
                </View>
            </ScrollView>
            <Nav />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    content: {
        flex: 3,
        width: '98%',
        padding: 10,
        marginBottom: 20,
    },
    chartToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    chartButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#009688',
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: 'grey',
    },
    activeButton: {
        backgroundColor: '#009688',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    analysisContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        justifyContent: 'center',
    },
});

export default Home;