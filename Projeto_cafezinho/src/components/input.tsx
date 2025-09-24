import { TextInput, TextInputProps } from "react-native";

export function Input({ ...rest }: TextInputProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor="#94a3b8"
      style={{
        height: 128,
        backgroundColor: '#1e293b',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: 'white'
      }}
      {...rest}
    />
  );
}
