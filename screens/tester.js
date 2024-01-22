import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { getDatabase, ref, get, push } from "firebase/database";

function Tester() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const handleReinforcementRequest = async () => {
        // Check if the user is authenticated
        if (user) {
            // Assuming you have a 'reinforcement-requests' node in your database
            const databaseRef = ref(getDatabase(), 'reinforcement-requests');
            
            // Push a new request to the database
            await push(databaseRef, {
                username: user.displayName,
                userId: user.uid,
                timestamp: new Date().toISOString(),
            });
    
            console.log('Reinforcement request sent successfully.');
        } else {
            console.log('User not authenticated.');
        }
    };

    return (
        <View style={styles.container}>
            <Text>User: {user ? user.displayName : 'Not logged in'}</Text>
            <TouchableOpacity style={styles.button} onPress={handleReinforcementRequest}>
                <Text style={styles.text}>
                    Send Notification
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: StatusBar.currentHeight,
    },
    button: {
        width: '90%',
        borderRadius: 9,
        marginVertical: '2%',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingVertical: '3%',
    },
    text: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
});

export default Tester;
