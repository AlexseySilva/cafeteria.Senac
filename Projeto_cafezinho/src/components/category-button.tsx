import { Text, Pressable, PressableProps } from "react-native";

import { clsx } from "clsx";

type CategoryProps = PressableProps & {
  title: string;
  isSelected?: boolean;
};

export function CategoryButton({ title, isSelected, ...rest }: CategoryProps) {
  return (
    <Pressable
      style={{
        backgroundColor: isSelected ? '#f97316' : '#1e293b',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 6,
        height: 40,
        borderWidth: isSelected ? 1 : 0,
        borderColor: isSelected ? '#bef264' : 'transparent'
      }}
      {...rest}
    >
      <Text style={{ color: '#f1f5f9', fontWeight: '500', fontSize: 14 }}>{title}</Text>
    </Pressable>
  );
}
