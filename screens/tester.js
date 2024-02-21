
import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Tester = props => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Huh</Text>

    </View>
  );
};
 
const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 100,
    paddingTop: 40,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    color: "white",
    fontSize: 20
  }
});
 
export default Tester;
