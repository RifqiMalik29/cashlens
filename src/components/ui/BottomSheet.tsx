import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { useColors } from "@hooks/useColors";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef
} from "react";
import { View } from "react-native";

export interface BottomSheetHandle {
  open: () => void;
  close: () => void;
}

interface BottomSheetProps {
  snapPoints?: (string | number)[];
  onClose?: () => void;
  children: React.ReactNode;
  enableDynamicSizing?: boolean;
}

export const BottomSheet = forwardRef<BottomSheetHandle, BottomSheetProps>(
  ({ snapPoints, onClose, children, enableDynamicSizing = true }, ref) => {
    const colors = useColors();
    const sheetRef = useRef<GorhomBottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close()
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <GorhomBottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onClose={onClose}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
        backgroundStyle={{
          backgroundColor: colors.background,
          borderRadius: 24
        }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView>
          <View className="px-6 pt-2 pb-8">{children}</View>
        </BottomSheetView>
      </GorhomBottomSheet>
    );
  }
);

BottomSheet.displayName = "BottomSheet";
