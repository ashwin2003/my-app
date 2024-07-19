import { createContext, useEffect, useState } from "react";
import { generateId } from "../Utils";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const smileyEmojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
  ];

  const actionsConstant = [
    { key: "mx50", label: "Move X by 50", css: [{ translateX: 50 }] },
    { key: "my50", label: "Move y by 50", css: [{ translateY: 50 }] },
    { key: "rt360", label: "Rotate 360", css: [{ rotate: "90deg" }] },
    { key: "gt00", label: "Go to (0,0)" },
    {
      key: "x50y50",
      label: "Move X=50, Y=50",
      css: [{ translateX: 50 }, { translateY: 50 }],
    },
    {
      key: "random",
      label: "Go to random position",
      css: [{ translateX: randomX }, { translateY: randomY }],
    },
    { key: "inc", label: "Increase Size", css: [{ scale: 2 }] },
    { key: "dec", label: "Decrease size", css: [{ scale: 0.5 }] },
    { key: "rpt", label: "Repeat" },
  ];

  const [spirits, setSpirits] = useState([]);
  const [actions, setActions] = useState({});
  const [activeSpirit, setActiveSpirit] = useState("");
  const [styleProps, setStyleProps] = useState({});

  const getRandomPosition = () => {
    const randomX = Math.floor(Math.random() * 50);
    const randomY = Math.floor(Math.random() * 50);
    return { randomX, randomY };
  };

  const { randomX, randomY } = getRandomPosition();

  const playAnimation = () => {
    let cssProps = [];

    actions?.[activeSpirit]?.forEach((action) => {
      action?.css?.forEach((cssItem) => {
        cssProps.push(cssItem);
      });
    });

    setStyleProps({ transform: cssProps });
  };

  useEffect(() => {
    if (spirits.length === 1) {
      setActiveSpirit(spirits[0].id);
    }
  }, [spirits]);

  const addSpirit = (newSpirit) => {
    const newId = generateId(4);
    setSpirits((prev) => [...prev, { id: newId, spirit: newSpirit }]);
  };

  const deleteSpirit = (deletingSpirit) => {
    const newSpirits = spirits.filter((spirit) => spirit.id !== deletingSpirit);
    setSpirits(newSpirits);

    const newActions = { ...actions };
    delete newActions[deletingSpirit];
    setActions(newActions);
  };

  const addAction = (newAction) => {
    const newId = generateId(5);
    newAction.id = newId;

    const newActions =
      actions?.[activeSpirit]?.length > 0
        ? [...actions[activeSpirit], newAction]
        : [newAction];

    setActions((prev) => ({
      ...prev,
      [activeSpirit]: newActions,
    }));
  };

  const deleteAction = (id) => {
    const newActions = actions?.[activeSpirit]?.filter(
      (item) => item.id !== id
    );
    setActions((prev) => ({
      ...prev,
      [activeSpirit]: newActions,
    }));
  };

  const activitSpiritSetter = (id) => {
    setActiveSpirit(id);
  };

  const reset = () => {
    setStyleProps({});
  };

  const setSpiritPosition = (pan, activeSpirit) => {
    const movedSpiritObj = spirits.find((spirit) => spirit.id === activeSpirit);

    if (movedSpiritObj) {
      movedSpiritObj.spirit.position.x = pan.moveX;
      movedSpiritObj.spirit.position.y = pan.moveY;
    }

    const newSpiritArr = spirits.filter((spirit) => spirit.id !== activeSpirit);
    newSpiritArr.push(movedSpiritObj);
  };

  const getRandomSmileyEmoji = () => {
    const randomIndex = Math.floor(Math.random() * smileyEmojis.length);
    return smileyEmojis[randomIndex];
  };

  return (
    <StoreContext.Provider
      value={{
        spirits,
        actions,
        activeSpirit,
        actionsConstant,
        styleProps,
        setSpirits,
        addAction,
        activitSpiritSetter,
        addSpirit,
        deleteSpirit,
        deleteAction,
        playAnimation,
        reset,
        setSpiritPosition,
        getRandomSmileyEmoji,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
