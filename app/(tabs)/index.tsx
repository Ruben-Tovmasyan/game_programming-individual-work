import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';

const App = () => {
    const generateNumbers = () => {
        const numbers = Array.from({ length: 64 }, (_, i) => Math.floor(i / 2) + 1);
        return numbers.sort(() => Math.random() - 0.5);
    };

    const [numbers, setNumbers] = useState(generateNumbers());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            setLockBoard(true);
            const [firstIndex, secondIndex] = flippedIndices;

            if (numbers[firstIndex] === numbers[secondIndex]) {
                setMatchedIndices((prev) => [...prev, firstIndex, secondIndex]);
            }

            setTimeout(() => {
                setFlippedIndices([]);
                setLockBoard(false);
            }, 1000);
        }
    }, [flippedIndices]);

    const handlePress = (index) => {
        if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !matchedIndices.includes(index) && !lockBoard) {
            setFlippedIndices((prev) => [...prev, index]);
        }
    };

    const resetGame = () => {
        setNumbers(generateNumbers());
        setFlippedIndices([]);
        setMatchedIndices([]);
        setLockBoard(false);
    };

    const renderCard = (number, index) => {
        const isFlipped = flippedIndices.includes(index) || matchedIndices.includes(index);
        return (
            <TouchableOpacity
                key={index}
                style={[styles.card, isFlipped ? styles.flipped : styles.unflipped]}
                onPress={() => handlePress(index)}
            >
                <Text style={styles.cardText}>{isFlipped ? number : '?'}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.grid}>
                {numbers.map((number, index) => renderCard(number, index))}
            </View>
            {matchedIndices.length === numbers.length && Alert.alert('Congratulations!', 'You matched all pairs!')}
            <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
                <Text style={styles.restartButtonText}>Restart Game</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#000',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 500,
        height: 500,
    },
    card: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    flipped: {
        backgroundColor: '#2fad51',
    },
    unflipped: {
        backgroundColor: '#000',
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    restartButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#d2e625',
    },
    restartButtonText: {
        color: '#d2e625',
        fontSize: 16,
    },
});

export default App;
