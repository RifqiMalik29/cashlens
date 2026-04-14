import { Typography } from "@components/ui/Typography";
import type { Category } from "@types";
import { Check, Pencil, Trash2, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, TextInput, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  category: Category;
  onDelete: (id: string, isDefault: boolean) => void;
  onUpdate: (id: string, newName: string) => void;
}

export function CategoryCard({
  category,
  onDelete,
  onUpdate
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category?.name || "");
  const [inputWidth, setInputWidth] = useState(100);

  // Sync editedName when category.name changes from parent (after sync)
  useEffect(() => {
    if (category?.name) {
      setEditedName(category.name);
    }
  }, [category?.name]);

  useEffect(() => {
    if (isEditing) {
      const estimatedWidth = Math.max(editedName.length * 8 + 32, 60);
      setInputWidth(estimatedWidth);
    }
  }, [isEditing, editedName]);

  const handleTextChange = useCallback((text: string) => {
    setEditedName(text);
    const estimatedWidth = Math.max(text.length * 8 + 32, 60);
    setInputWidth(estimatedWidth);
  }, []);

  // Guard against undefined category
  if (!category) {
    return null;
  }

  return (
    <View className="flex-row items-center bg-white border border-border rounded-lg pl-3 pr-2 py-2">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mr-2"
        style={{ backgroundColor: category.color }}
      >
        <Typography variant="caption" weight="bold" color="#FFFFFF">
          {category.name.charAt(0)}
        </Typography>
      </View>
      {isEditing ? (
        <View
          style={{
            minWidth: 60,
            maxWidth: Dimensions.get("window").width - 160
          }}
        >
          <TextInput
            value={editedName}
            onChangeText={handleTextChange}
            onBlur={() => {
              if (editedName.trim() !== category.name) {
                onUpdate(category.id, editedName.trim());
              }
              setIsEditing(false);
            }}
            style={{
              width: inputWidth,
              fontSize: 12,
              fontWeight: "500",
              color: "#1F2937",
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: "#F9FAFB",
              borderWidth: 1,
              borderColor: "#D1D5DB",
              borderRadius: 6
            }}
            autoFocus
          />
        </View>
      ) : (
        <Typography variant="caption" weight="medium" numberOfLines={1}>
          {category.name}
        </Typography>
      )}

      {isEditing ? (
        <>
          <TouchableOpacity
            onPress={() => {
              if (editedName.trim() !== category.name) {
                onUpdate(category.id, editedName.trim());
              }
              setIsEditing(false);
            }}
            className="ml-2 p-1"
          >
            <Check size={14} color="#4CAF82" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEditedName(category.name);
              setIsEditing(false);
            }}
            className="p-1"
          >
            <X size={14} color="#EF4444" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          className="ml-2 p-1"
        >
          <Pencil size={14} color="#9CA3AF" />
        </TouchableOpacity>
      )}

      {!category.isDefault && (
        <TouchableOpacity
          onPress={() => onDelete(category.id, category.isDefault)}
          className="p-1"
        >
          <Trash2 size={14} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}
