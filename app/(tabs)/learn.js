import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Linking, ScrollView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import articles from '../../articles.json'; // Import articles.json
import symptomsData from '../../symptoms.json'; // Import symptoms.json
import { SettingsContext } from '../settings-context';
import Nav from "../widgets/nav";

const Learn = () => {
    const [selected, setSelected] = useState("For You");
    const [userSymptoms, setUserSymptoms] = useState([]);
    const [topCommonSymptoms, setTopCommonSymptoms] = useState([]);
    const [topSevereSymptoms, setTopSevereSymptoms] = useState([]);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
                const username = currentUser?.username || 'Unknown User';

                const allUsersData = JSON.parse(await AsyncStorage.getItem('allUsersData')) || {};
                const userData = allUsersData[username] || {};

                // Aggregate symptom data
                const symptomCounts = {};
                const symptomSeverities = {};

                Object.keys(userData).forEach((date) => {
                    const dayData = userData[date];
                    Object.keys(dayData).forEach((symptom) => {
                        if (dayData[symptom] !== "None" && dayData[symptom] !== "") {
                            // Count occurrences
                            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;

                            // Track severity (e.g., Low = 1, Medium = 2, High = 3)
                            const severityMap = { Low: 1, Medium: 2, High: 3 };
                            const severity = severityMap[dayData[symptom]] || 0;
                            symptomSeverities[symptom] = Math.max(severity, symptomSeverities[symptom] || 0);
                        }
                    });
                });

                // Find top 3 most common symptoms
                const topCommon = Object.keys(symptomCounts)
                    .sort((a, b) => symptomCounts[b] - symptomCounts[a])
                    .slice(0, 3);

                // Find top 3 most severe symptoms
                const topSevere = Object.keys(symptomSeverities)
                    .sort((a, b) => symptomSeverities[b] - symptomSeverities[a])
                    .slice(0, 3);

                    console.log("Top Common Symptoms:", topCommon);
                    console.log("Top Severe Symptoms:", topSevere);
                setTopCommonSymptoms(topCommon);
                setTopSevereSymptoms(topSevere);
                setUserSymptoms([...new Set([...topCommon, ...topSevere])]); // Combine and remove duplicates
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const TabButton = ({ text, isSelected }) => {
        return (
            <TouchableOpacity
                style={{
                    borderRadius: 0,
                    backgroundColor: settings.highContrast ? 'black' : '#f8f8f9',
                    borderBottomStyle: 'solid',
                    borderBottomColor: isSelected ? '#009688' : '#d8d8d8',
                    borderBottomWidth: isSelected ? 7 : 3,
                    margin: 0,
                    padding: 10,
                }}
                onPress={() => {
                    setSelected(text);
                }}
                testID="tabButton"
            >
                <Text
                    style={{
                        color: isSelected ? '#009688' : settings.highContrast ? 'white' : 'grey',
                        fontWeight: isSelected ? 'bolder' : 'unset',
                        fontSize: settings.largeText ? 25 : 20,
                    }}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        );
    };

    const ArticleButton = ({ title, author, url }) => {
        return (
            <TouchableOpacity
                style={[styles.articleButton, { backgroundColor: settings.highContrast ? 'rgb(57, 57, 57)' : '#f0f0f0' }]}
                onPress={() => Linking.openURL(url)}
            >
                <Text style={[styles.articleTitle, { fontSize: settings.largeText ? 21 : 16 }]}>{title}</Text>
                <Text style={[styles.articleAuthor, { fontSize: settings.largeText ? 19 : 14, color: settings.highContrast ? 'white' : '#555' }]}>By: {author}</Text>
            </TouchableOpacity>
        );
    };

    // Helper function to format symptom names
    const formatSymptomName = (symptomKey) => {
        const symptom = symptomsData.symptoms.find((item) => item.key === symptomKey);
        return symptom ? symptom.symptom : symptomKey; // Fallback to the key if no match is found
    };

    // Filter articles based on the selected tab
    const getArticlesForTab = () => {
        switch (selected) {
            case "For You":
                return Object.values(articles).filter((article) =>
                    userSymptoms.some((symptom) => article.keywords.includes(symptom))
                );
            case "Recent":
                return Object.values(articles)
                    .filter((article) => article.Date)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date));
            case "Symptom Relief":
                return Object.values(articles).filter((article) => article.keywords.includes("symptoms"));
            case "Menopause Stages":
                return Object.values(articles).filter((article) => article.keywords.includes("stages"));
            default:
                return Object.values(articles);
        }
    };

    let tabarticles = getArticlesForTab();

    return (
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: settings.highContrast ? '#000' : '#fff' }}>
            {/* Horizontal Tab Buttons */}
            <ScrollView style={[styles.headings, { backgroundColor: settings.highContrast ? 'black' : 'white' }]} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TabButton text={"For You"} isSelected={selected === "For You"} />
                <TabButton text={"Recent"} isSelected={selected === "Recent"} />
                <TabButton text={"Symptom Relief"} isSelected={selected === "Symptom Relief"} />
                <TabButton text={"Menopause Stages"} isSelected={selected === "Menopause Stages"} />
            </ScrollView>

            {/* Conditional View for "For You" Tab */}
            {selected === "For You" && (
                <View style={styles.forYouMessage}>
                    <Text style={[styles.forYouText, { fontSize: settings.largeText ? 20 : 16 }]}>
                        Because you tracked {topCommonSymptoms.map(formatSymptomName).join(", ")} frequently, and {topSevereSymptoms.map(formatSymptomName).join(", ")} severely.
                    </Text>
                </View>
            )}

            {/* Articles Section */}
            <ScrollView style={styles.articlesContainer}>
                {tabarticles.map((article, index) => (
                    <ArticleButton
                        key={index}
                        title={article.Title}
                        author={article.Author}
                        url={article.URL}
                    />
                ))}
            </ScrollView>
            <Nav />
        </View>
    );
};

const styles = StyleSheet.create({
    headings: {
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        flexGrow: 0,
    },
    forYouMessage: {
        padding: 10,
        backgroundColor: '#e0f7fa',
        marginVertical: 10,
        borderRadius: 8,
        width: '90%',
    },
    forYouText: {
        color: '#00796b',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    articlesContainer: {
        flex: 0.9,
        width: '100%',
        padding: 10,
        bottom: 20
    },
    articleButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#009688',
    },
    articleAuthor: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
});

export default Learn;