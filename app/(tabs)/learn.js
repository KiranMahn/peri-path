import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import articles from '../../articles.json'; // Import articles.json

const Learn = () => {
    const [selected, setSelected] = useState("For You");

    const TabButton = ({ text, isSelected }) => {
        return (
            <TouchableOpacity
                style={{
                    borderRadius: 0,
                    backgroundColor: '#f8f8f9',
                    borderBottomStyle: 'solid',
                    borderBottomColor: isSelected ? '#009688' : '#d8d8d8',
                    borderBottomWidth: isSelected ? 7 : 3,
                    margin: 0,
                    padding: 10,
                    // height: 'min-content',
                }}
            >
                <Text
                    style={{
                        color: isSelected ? '#009688' : 'grey',
                        fontWeight: isSelected ? 'bolder' : 'unset',
                        fontSize: 20,
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
                style={styles.articleButton}
                onPress={() => Linking.openURL(url)} // Open the URL when clicked
            >
                <Text style={styles.articleTitle}>{title}</Text>
                <Text style={styles.articleAuthor}>By: {author}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Horizontal Tab Buttons */}
            <ScrollView style={styles.headings} horizontal={true} showsHorizontalScrollIndicator={false}>
                <TabButton text={"For You"} isSelected={selected === "For You"} />
                <TabButton text={"Trending"} isSelected={selected === "Trending"} />
                <TabButton text={"Recent"} isSelected={selected === "Recent"} />
                <TabButton text={"Symptom Relief"} isSelected={selected === "Symptom Relief"} />
                <TabButton text={"Menopause Stages"} isSelected={selected === "Menopause Stages"} />
            </ScrollView>

            {/* Articles Section */}
            <ScrollView style={styles.articlesContainer}>
                {Object.values(articles).map((article, index) => (
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