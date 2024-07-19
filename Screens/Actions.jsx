import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import React, { useContext } from "react";
import { StoreContext } from "../Context";
import { useNavigation } from "@react-navigation/native";
import colors from "../Utils/colors";

const Actions = () => {
  const {
    spirits,
    actions,
    addAction,
    activeSpirit,
    actionsConstant,
    activitSpiritSetter,
    deleteAction,
  } = useContext(StoreContext);
  const navigation = useNavigation();

  console.log("spirits ", spirits);
  console.log("actions ", actions);
  console.log("activeSpirit =>> ", activeSpirit);

  const renderActions = ({ item }) => {
    return (
      <Pressable onPress={() => addAction(item)} style={styles.actionContainer}>
        <Text style={styles.itemText}>{item?.label}</Text>
      </Pressable>
    );
  };

  const renderSpirits = ({ item, index }) => {
    return (
      <Pressable
        style={[
          styles.spiritItem,
          item?.id == activeSpirit ? { backgroundColor: "green" } : {},
        ]}
        onPress={() => activitSpiritSetter(item?.id)}
      >
        <Text style={styles.itemText}>Action {index + 1}</Text>
      </Pressable>
    );
  };

  const navigateToPlayground = () => {
    navigation.navigate("PlayGround");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.columnContainer}>
          <Text style={styles.columnHeader}>Code</Text>
          <FlatList
            data={actionsConstant}
            renderItem={renderActions}
            ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
          />
        </View>

        <View style={styles.columnContainer}>
          <Text style={styles.columnHeader}>Actions</Text>
          <FlatList
            horizontal
            data={spirits}
            renderItem={renderSpirits}
            ItemSeparatorComponent={() => <View style={{ width: 0 }} />}
            contentContainerStyle={styles.spiritContainer}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            data={actions?.[activeSpirit]}
            renderItem={({ item, index }) => (
              <Pressable style={styles.rightActionContainer}>
                <Text style={styles.itemText}>{item?.label}</Text>
                <Pressable
                  style={{
                    backgroundColor: "red",
                    borderRadius: 10,
                    paddingHorizontal: 4,
                  }}
                  onPress={() => deleteAction(item?.id)}
                >
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    X
                  </Text>
                </Pressable>
              </Pressable>
            )}
            contentContainerStyle={styles.rightColumContainer}
            ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
          />
        </View>
      </ScrollView>
      <Pressable onPress={navigateToPlayground} style={styles.bottomButton}>
        <Text style={styles.itemText}>Go to Playground</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  columnContainer: {
    width: "48%",
    height: "100%",
  },
  rightColumContainer: {
    height: "100%",
    marginTop: 20,
  },
  columnHeader: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.blueGray,
    borderRadius: 8,
    paddingVertical: 6,
  },
  actionContainer: {
    padding: 10,
    backgroundColor: "#00abff",
    borderRadius: 2,
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  rightActionContainer: {
    padding: 10,
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0081ff",
    position: "relative",
    alignItems: "center",
  },
  spiritContainer: {
    backgroundColor: "#B6D0E2",
    height: 40,
    color: "white",
    padding: 0,
  },
  spiritItem: {
    height: 80,
    padding: 10,
    borderRadius: 2,
    marginHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  itemSeperator: {
    height: 12,
  },
  itemText: {
    color: "white",
  },
  bottomButton: {
    backgroundColor: "#00233b",
    height: 40,
    margin: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Actions;
