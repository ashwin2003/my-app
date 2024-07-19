import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { StoreContext } from "../Context";

const HomeScreen = () => {
  const navigation = useNavigation();

  const { count } = useContext(StoreContext);
  console.log("first", count);

  const NavigateToActions = () => {
    navigation.navigate("Actions");
  };

  const NavigateToPlayGround = () => {
    navigation.navigate("PlayGround");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={NavigateToActions} style={styles.button}>
          <Text style={styles.buttonText}>Actions</Text>
        </Pressable>
        <Pressable
          onPress={NavigateToPlayGround}
          style={[styles.button, styles.greenButton]}
        >
          <Text style={styles.buttonText}>PlayGround</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 70,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 60,
  },

  button: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 12,
    backgroundColor: "#0068b1",
    alignItems: "center",
  },

  greenButton: {
    backgroundColor: "#00ce00",
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "500",
    color: "white",
  },
});

export default HomeScreen;
