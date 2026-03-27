import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  pathname: string;
};

type Variant = {
  first: string;
  second: string;
  third: string;
};

const pickVariant = (pathname: string): Variant => {
  if (pathname.startsWith("/auth")) {
    return {
      first: "rgba(108, 92, 231, 0.26)",
      second: "rgba(0, 210, 255, 0.22)",
      third: "rgba(255, 60, 172, 0.2)",
    };
  }

  if (pathname.startsWith("/game")) {
    return {
      first: "rgba(255, 60, 172, 0.24)",
      second: "rgba(0, 210, 255, 0.26)",
      third: "rgba(0, 255, 171, 0.18)",
    };
  }

  if (pathname.startsWith("/settings") || pathname.startsWith("/info")) {
    return {
      first: "rgba(0, 210, 255, 0.22)",
      second: "rgba(0, 255, 171, 0.2)",
      third: "rgba(108, 92, 231, 0.22)",
    };
  }

  if (pathname.startsWith("/welcome")) {
    return {
      first: "rgba(255, 60, 172, 0.22)",
      second: "rgba(108, 92, 231, 0.28)",
      third: "rgba(0, 210, 255, 0.24)",
    };
  }

  return {
    first: "rgba(108, 92, 231, 0.2)",
    second: "rgba(0, 210, 255, 0.2)",
    third: "rgba(255, 60, 172, 0.16)",
  };
};

export default function AppBackgroundTransition({ pathname }: Props) {
  const drift = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const breath = useRef(new Animated.Value(0)).current;

  const variant = useMemo(() => pickVariant(pathname), [pathname]);

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(drift, {
            toValue: 1,
            duration: 7500,
            useNativeDriver: true,
          }),
          Animated.timing(drift, {
            toValue: 0,
            duration: 7500,
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.timing(orbit, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(breath, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: true,
          }),
          Animated.timing(breath, {
            toValue: 0,
            duration: 2800,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [breath, drift, orbit]);

  const driftX = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 24],
  });

  const driftY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -14],
  });

  const orbitRotate = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const orbitRotateReverse = orbit.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const bloom = breath.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View
        style={[
          styles.blob,
          styles.blobOne,
          {
            backgroundColor: variant.first,
            transform: [{ translateX: driftX }, { scale: bloom }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.blob,
          styles.blobTwo,
          {
            backgroundColor: variant.second,
            transform: [{ translateY: driftY }, { scale: bloom }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.blob,
          styles.blobThree,
          {
            backgroundColor: variant.third,
            transform: [
              { translateX: driftY },
              { translateY: driftX },
              { scale: bloom },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.ring,
          styles.ringA,
          {
            borderColor: variant.second,
            transform: [
              { perspective: 900 },
              { rotateZ: orbitRotate },
              { rotateX: "68deg" },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.ring,
          styles.ringB,
          {
            borderColor: variant.first,
            transform: [
              { perspective: 900 },
              { rotateZ: orbitRotateReverse },
              { rotateY: "24deg" },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 0,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobOne: {
    width: 280,
    height: 280,
    left: -90,
    top: 30,
  },
  blobTwo: {
    width: 240,
    height: 240,
    right: -60,
    top: 220,
  },
  blobThree: {
    width: 260,
    height: 260,
    left: 30,
    bottom: -80,
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
    opacity: 0.3,
  },
  ringA: {
    width: 300,
    height: 300,
    top: -90,
    right: -70,
  },
  ringB: {
    width: 240,
    height: 240,
    bottom: -40,
    left: -60,
  },
});
