import { Colors, Gradients } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface DropSphereLogoProps {
  width?: number;
  style?: StyleProp<ViewStyle>;
}

function DropSphereLogo({ width = 180, style }: DropSphereLogoProps) {
  const iconSize = Math.max(34, Math.round(width * 0.22));

  return (
    <View style={[styles.container, { width }, style]}>
      <View style={[styles.iconWrap, { width: iconSize, height: iconSize }]}>
        <LinearGradient
          colors={Gradients.ball}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.innerRing} />
          <View style={styles.highlight} />
        </LinearGradient>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.dropText}>Drop</Text>
        <Text style={styles.sphereText}>Sphere</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  iconWrap: {
    borderRadius: 999,
    marginRight: 10,
    shadowColor: Colors.glow.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  iconGradient: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  innerRing: {
    width: "60%",
    height: "60%",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.82)",
  },
  highlight: {
    position: "absolute",
    width: "25%",
    height: "25%",
    borderRadius: 999,
    top: "20%",
    left: "18%",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },
  textWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  dropText: {
    color: Colors.text.primary,
    fontWeight: "800",
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 0.4,
  },
  sphereText: {
    color: Colors.secondary,
    fontWeight: "800",
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 0.2,
  },
});

export default memo(DropSphereLogo);
