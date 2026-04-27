import { ColorPicker } from "@components/ui/ColorPicker";
import { IconPicker } from "@components/ui/IconPicker";
import { Typography } from "@components/ui/Typography";
import { useColors } from "@hooks/useColors";
import type { Category } from "@types";
import * as Icons from "lucide-react-native";
import { Check, Pencil, Trash2, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string, isDefault: boolean) => void;
  onUpdate: (id: string, name: string, color: string, icon: string) => void;
}

export function CategoryCard({
  category,
  onDelete,
  onUpdate
}: CategoryCardProps) {
  const colors = useColors();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [editedColor, setEditedColor] = useState(category.color);
  const [editedIcon, setEditedIcon] = useState(category.icon);

  useEffect(() => {
    setEditedName(category.name);
    setEditedColor(category.color);
    setEditedIcon(category.icon);
  }, [category.name, category.color, category.icon]);

  const handleConfirm = useCallback(() => {
    onUpdate(category.id, editedName.trim(), editedColor, editedIcon);
    setIsEditing(false);
  }, [category.id, editedName, editedColor, editedIcon, onUpdate]);

  const handleCancel = useCallback(() => {
    setEditedName(category.name);
    setEditedColor(category.color);
    setEditedIcon(category.icon);
    setIsEditing(false);
  }, [category.name, category.color, category.icon]);

  const Icon =
    (
      Icons as unknown as Record<
        string,
        React.ComponentType<{ size: number; color: string }>
      >
    )[category.icon] ?? Icons.MoreHorizontal;

  if (!category) return null;

  return (
    <View
      className="rounded-xl mb-2 overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border
      }}
    >
      <View className="flex-row items-center px-4 py-3">
        <View
          className="w-9 h-9 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: category.color }}
        >
          <Icon size={16} color="#FFFFFF" />
        </View>

        {isEditing ? (
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "500",
              color: colors.textPrimary,
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: colors.surfaceSecondary,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.border
            }}
            autoFocus
          />
        ) : (
          <Typography variant="body" weight="medium" style={{ flex: 1 }}>
            {category.name}
          </Typography>
        )}

        {isEditing ? (
          <View className="flex-row gap-1 ml-2">
            <TouchableOpacity onPress={handleConfirm} className="p-2">
              <Check size={16} color="#4CAF82" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} className="p-2">
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row gap-1 ml-2">
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="p-2"
            >
              <Pencil size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(category.id, category.isDefault)}
              className="p-2"
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isEditing && (
        <View
          className="px-4 pb-4 gap-3"
          style={{ borderTopWidth: 1, borderTopColor: colors.border }}
        >
          <View className="pt-3">
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            >
              Warna
            </Typography>
            <ColorPicker value={editedColor} onChange={setEditedColor} />
          </View>
          <View>
            <Typography
              variant="caption"
              weight="medium"
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            >
              Ikon
            </Typography>
            <IconPicker
              value={editedIcon}
              color={editedColor}
              onChange={setEditedIcon}
            />
          </View>
        </View>
      )}
    </View>
  );
}
