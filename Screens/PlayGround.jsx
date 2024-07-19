import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  FlatList,
  PanResponder,
} from "react-native";
import { StoreContext } from "../Context";
import { generateId } from "../Utils";
import { useNavigation } from "@react-navigation/native";

const PlayGround = () => {
  const { height, width } = Dimensions.get("screen");

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const {
    spirits,
    actions,
    activeSpirit,
    setSpirits,
    activitSpiritSetter,
    setSpiritPosition,
    getRandomSmileyEmoji,
    deleteSpirit,
  } = useContext(StoreContext);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const animation = Animated.sequence([
    Animated.delay(1000),
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]),
  ]);

  const [ani, setAni] = useState([]);
  const calculateAnimation = () => {
    if (!actions || !spirits) {
      console.error("Actions or spirits are not initialized");
      return;
    }

    const spiritIds = Object.keys(actions);

    let finalObj = {};

    const currentPositions = spirits.reduce((acc, spirit) => {
      const x = pans?.[spirit?.id]?.x?.__getValue();
      const y = pans?.[spirit?.id]?.y?.__getValue();
      acc[spirit.id] = { x, y };
      return acc;
    }, {});

    spiritIds?.forEach((id) => {
      let actionCssArray = [];

      const spiritActions = actions?.[id] || [];
      if (Array?.isArray(spiritActions)) {
        if (spiritActions?.length > 0) {
          spiritActions?.forEach((action) => {
            if (action.key == "mx50") {
              const translateX = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.x,
                  currentPositions[id]?.x + 50,
                ],
              });
              actionCssArray.push({ translateX: translateX });
            } else if (action.key == "my50") {
              const translateY = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.y,
                  currentPositions[id]?.y + 50,
                ],
              });
              actionCssArray.push({ translateY: translateY });
            } else if (action.key == "rt360") {
              const rotate = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              });
              actionCssArray.push({ rotate: rotate });
            } else if (action.key == "gt00") {
              const translateX = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.x,
                  currentPositions[id]?.x + 50,
                ],
              });

              const translateY = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.y,
                  currentPositions[id]?.y + 50,
                ],
              });

              actionCssArray.push({ translateX: translateX });
              actionCssArray.push({ translateY: translateY });
            } else if (action.key == "x50y50") {
              const translateX = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.x,
                  currentPositions[id]?.x + 50,
                ],
              });

              const translateY = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.y,
                  currentPositions[id]?.y + 50,
                ],
              });

              actionCssArray.push({ translateX: translateX });
              actionCssArray.push({ translateY: translateY });
            } else if (action.key == "random") {
              const randomX = Math.floor(Math.random() * 50);
              const randomY = Math.floor(Math.random() * 50);

              const translateX = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.x,
                  currentPositions[id]?.x + randomX,
                ],
              });

              const translateY = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  currentPositions[id]?.y,
                  currentPositions[id]?.y + randomY,
                ],
              });

              actionCssArray.push({ translateX: translateX });
              actionCssArray.push({ translateY: translateY });
            } else if (action.key == "inc") {
              const scale = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.5], // Scale from 1 to 2
              });

              actionCssArray.push({ scale: scale });
            } else if (action.key == "dec") {
              const scale = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5], // Scale from 1 to 2
              });
              actionCssArray.push({ scale: scale });
            } else if (action.key == "rpt") {
              const copyActionCssArray = actionCssArray;
              copyActionCssArray?.forEach((item) => {
                actionCssArray?.push(item);
              });
            }
          });
        }
      }

      finalObj[id] = actionCssArray;
    });

    setAni(finalObj);

    animation.start();
  };

  // Create state for pan values
  const [pans, setPans] = useState(
    spirits.reduce((acc, spirit) => {
      acc[spirit.id] = new Animated.ValueXY();
      return acc;
    }, {})
  );

  useEffect(() => {
    setPans(
      spirits.reduce((acc, spirit) => {
        acc[spirit.id] = new Animated.ValueXY();
        return acc;
      }, {})
    );
  }, [spirits]);

  const panResponders = spirits.reduce((acc, spirit) => {
    acc[spirit.id] = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pans[spirit?.id]?.x, dy: pans[spirit?.id]?.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        setAni([]);
        setPosition({ x: gestureState.moveX, y: gestureState.moveY });
        setSpiritPosition(gestureState, spirit.id);
        activitSpiritSetter(spirit?.id);
        pans[spirit.id].flattenOffset();
      },
    });
    return acc;
  }, {});

  const resetPosition = () => {
    animatedValue.setValue(0);
    setAni([]);
    setPosition({ x: 0, y: 0 });
    Object.values(pans)?.forEach((pan) => {
      pan.setValue({ x: 0, y: 0 });
    });
  };

  const AddSpiritFunction = () => {
    const spiritDetails = {
      name: getRandomSmileyEmoji(),
      position: {
        x: 0,
        y: 0,
      },
    };
    const newId = generateId(4);

    const newSpirit = { id: newId, spirit: spiritDetails };
    setSpirits([...spirits, newSpirit]);

    setPans((prevPans) => ({
      ...prevPans,
      [newId]: new Animated.ValueXY(),
    }));
  };

  useEffect(() => {
    if (activeSpirit) {
      const currentSpiritObj = spirits?.find(
        (spirit) => spirit?.id == activeSpirit
      );
    }
  }, [panResponders]);

  const currentPosition = () => {
    const spirit = spirits?.find((spirit) => spirit.id == activeSpirit);

    return spirit;
  };

  const navigateToActions = () => {
    navigation.navigate("Actions");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        { height: height, width: width },
        styles.pcontainer,
      ]}
    >
      <View style={styles.playgroundContainer}>
        <View style={styles.container}>
          {spirits?.map((spirit) => (
            <Animated.View
              key={spirit.id}
              {...panResponders?.[spirit?.id]?.panHandlers}
              style={[
                styles.box,
                {
                  transform:
                    ani?.length == 0
                      ? [
                          { translateX: pans?.[spirit.id]?.x },
                          { translateY: pans?.[spirit.id]?.y },
                        ]
                      : ani?.[spirit?.id],
                },
              ]}
            >
              <Animated.View style={styles.boxContent}>
                <Text style={{ fontSize: 60 }}>{spirit?.spirit?.name}</Text>
              </Animated.View>
            </Animated.View>
          ))}
        </View>
      </View>
      <View style={styles.configurationsContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>Spirit id :- </Text>
          <Text>{currentPosition()?.id}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>X :- </Text>
          <Text>{Math.floor(currentPosition()?.spirit?.position?.x || 0)}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.boldText}>Y :- </Text>
          <Text>{Math.floor(currentPosition()?.spirit?.position?.y || 0)}</Text>
        </View>
      </View>
      <View style={styles.spiritsContainer}>
        {spirits?.length > 0 ? (
          <FlatList
            horizontal
            data={spirits}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item }) => (
              <Pressable
                style={styles.box}
                onPress={() => activitSpiritSetter(item?.id)}
              >
                <Pressable
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 64,
                    backgroundColor: "red",
                    paddingHorizontal: 6,
                    borderRadius: 10,
                  }}
                  onPress={() => deleteSpirit(item?.id)}
                >
                  <Text style={{ color: "white" }}>X</Text>
                </Pressable>
                <Text style={{ fontSize: 60 }}>{item?.spirit?.name}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ width: "100%" }}
          />
        ) : (
          <Text style={styles.magicText}>Add a Spirit to see the MAGIC!</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            calculateAnimation();
          }}
          style={styles.button}
        >
          <Text style={styles.itemText}>Play</Text>
        </Pressable>
        <Pressable onPress={AddSpiritFunction} style={styles.button}>
          <Text style={styles.itemText}>Add Spirit</Text>
        </Pressable>
        <Pressable onPress={resetPosition} style={styles.button}>
          <Text style={styles.itemText}>Reset</Text>
        </Pressable>
      </View>

      <Pressable onPress={navigateToActions} style={styles.button}>
        <Text style={styles.itemText}>Go to Actions</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    position: "relative",
    zIndex: -2,
    overflow: "hidden",
  },

  box: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    position: "relative",
  },
  boxContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  positionContainer: {
    marginTop: 20,
  },
  pcontainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 10,
  },
  playgroundContainer: {
    height: "50%",
    width: "100%",
  },
  configurationsContainer: {
    height: "10%",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  spiritsContainer: {
    height: "14%",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#40B5AD",
    borderRadius: 10,
    alignItems: "center",
  },
  itemText: {
    color: "white",
  },
  magicText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
  },
  boldText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PlayGround;
