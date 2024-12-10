import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const App = () => {
    const generateNumbers = () => {
        const numbers = Array.from({ length: 64 }, (_, i) => Math.floor(i / 2) + 1);
        return numbers.sort(() => Math.random() - 0.5);
    };

    const [numbers, setNumbers] = useState(generateNumbers());
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedIndices, setMatchedIndices] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [steps, setSteps] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    useEffect(() => {
        let timer;
        if (gameStarted) {
            timer = setInterval(() => {
                setTimeElapsed((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [gameStarted]);

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

    useEffect(() => {
        if (matchedIndices.length === numbers.length && matchedIndices.length > 0) {
            setGameStarted(false);
            setGameCompleted(true);
        }
    }, [matchedIndices, numbers.length]);

    const handlePress = (index) => {
        if (!gameStarted) setGameStarted(true);
        if (
            flippedIndices.length < 2 &&
            !flippedIndices.includes(index) &&
            !matchedIndices.includes(index) &&
            !lockBoard
        ) {
            setFlippedIndices((prev) => [...prev, index]);
            setSteps((prev) => prev + 1);
        }
    };

    const resetGame = () => {
        setNumbers(generateNumbers());
        setFlippedIndices([]);
        setMatchedIndices([]);
        setLockBoard(false);
        setGameStarted(false);
        setTimeElapsed(0);
        setSteps(0);
        setGameCompleted(false);
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
            {gameCompleted ? (
                <View style={styles.completedContainer}>
                    <Text style={styles.congratulationsText}>
                        Congratulations! You matched all pairs in {timeElapsed} seconds with {steps} steps!
                    </Text>
                    <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
                        <Text style={styles.restartButtonText}>Restart Game</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Time: {timeElapsed}s</Text>
                        <Text style={styles.infoText}>Steps: {steps}</Text>
                        <Text style={styles.infoText}>
                            Matched Pairs: {matchedIndices.length / 2}
                        </Text>
                        <Text style={styles.infoText}>
                            Total Pairs: {numbers.length / 2}
                        </Text>
                    </View>
                    <View style={styles.grid}>
                        {numbers.map((number, index) => renderCard(number, index))}
                    </View>
                    <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
                        <Text style={styles.restartButtonText}>Restart Game</Text>
                    </TouchableOpacity>
                </>
            )}
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
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
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
        color: '#fff',
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
    congratulationsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2fad51',
        marginBottom: 20,
        textAlign: 'center',
    },
    completedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;