import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import { useState, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import articles from '../../articles.json'; // Import articles.json
import { SettingsContext } from '../settings-context';

const Learn = () => {
    const [selected, setSelected] = useState("For You");
    const { settings } = useContext(SettingsContext);

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
            >
                <Text
                    style={{
                        color: isSelected ? '#009688' : settings.highContrast ? 'white' : 'grey',
                        fontWeight: isSelected ? 'bolder' : 'unset',
                        fontSize: settings.largeText ? 25 : 20, // Increase font size by 5 if largeText is enabled
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
                style={[styles.articleButton, {backgroundColor: settings.highContrast ? 'rgb(57, 57, 57)' : '#f0f0f0'}]} // Change background color based on high contrast settin
                onPress={() => Linking.openURL(url)} // Open the URL when clicked
            >
                <Text style={[styles.articleTitle, { fontSize: settings.largeText ? 21 : 16 }]}>{title}</Text>
                <Text style={[styles.articleAuthor, { fontSize: settings.largeText ? 19 : 14, color: settings.highContrast ? 'white' : '#555' }]}>By: {author}</Text>
            </TouchableOpacity>
        );
    };

    // Filter articles based on the selected tab
    const getArticlesForTab = () => {   
        switch (selected) {
            case "For You":
                return Object.values(articles);
            case "Recent":
                return Object.values(articles)
                .filter(article => article.Date) // Exclude articles without a date
                .sort((a, b) => new Date(b.Date) - new Date(a.Date));
            case "Symptom Relief":
                return Object.values(articles).filter(article => article.keywords.includes("symptoms"));
            case "Menopause Stages":
                return Object.values(articles).filter(article => article.keywords.includes("stages"));
            default:
                return Object.values(articles);
        }
    };

    let tabarticles = getArticlesForTab();

    return (
        <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: settings.highContrast ? '#000' : '#fff' }}>
            {/* Horizontal Tab Buttons */}
            <ScrollView style={[styles.headings, {backgroundColor: settings.highContrast ? 'black' : 'white'}]} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TabButton text={"For You"} isSelected={selected === "For You"} />
                <TabButton text={"Recent"} isSelected={selected === "Recent"} />
                <TabButton text={"Symptom Relief"} isSelected={selected === "Symptom Relief"} />
                <TabButton text={"Menopause Stages"} isSelected={selected === "Menopause Stages"} />
            </ScrollView>

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
        </SafeAreaView>
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
    articlesContainer: {
        flex: 0.9,
        width: '100%',
        padding: 10,
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