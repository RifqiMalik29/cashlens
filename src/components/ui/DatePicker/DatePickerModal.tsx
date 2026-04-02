import { useCallback, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { colors, spacing } from "@/constants/theme";

import { DatePickerContent } from "./DatePickerContent";

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}

export function DatePickerModal({
  visible,
  selectedDate,
  onDateSelect,
  onClose
}: DatePickerModalProps) {
  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  const handleOpen = useCallback(() => {
    translateY.value = withTiming(0, { duration: 300 });
    backdropOpacity.value = withTiming(1, { duration: 300 });
  }, [translateY, backdropOpacity]);

  const handleClose = useCallback(() => {
    translateY.value = withTiming(1000, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: 300 });
  }, [translateY, backdropOpacity, onClose]);

  const handleDateSelect = useCallback(
    (date: Date) => {
      onDateSelect(date);
      handleClose();
    },
    [onDateSelect, handleClose]
  );

  useEffect(() => {
    if (visible) {
      handleOpen();
    }
  }, [visible, handleOpen]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[styles.modalContent, modalAnimatedStyle]}
          pointerEvents="box-none"
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <DatePickerContent
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing[8]
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: spacing[3],
    paddingBottom: spacing[2]
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2
  }
});
