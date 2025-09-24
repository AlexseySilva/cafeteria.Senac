import { Image, View, Text, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Link } from "expo-router";

type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
};

export function Header({ title, cartQuantityItem }: HeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 20, marginHorizontal: 20 }}>
      <View style={{ flex: 1 }}>
        {/* <Image source={require("@/assets/logo.png")} style={{ height: 24, width: 128 }} /> */}
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 8 }}>{title}</Text>
      </View>

      {cartQuantityItem! > 0 && (
        <Link href={"/cart"} asChild>
          <TouchableOpacity style={{ position: 'relative' }}>
            <View style={{ backgroundColor: '#bef264', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 8, zIndex: 10, right: -14 }}>
              <Text style={{ color: '#0f172a', fontWeight: 'bold', fontSize: 12 }}>
                {cartQuantityItem}
              </Text>
            </View>
            <Feather name="shopping-bag" color="white" size={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}
