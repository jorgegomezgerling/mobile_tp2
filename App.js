// TP2 - Flujo checkout tienda
// Cart → Secure Payment (→ Add Address) → Order Confirmation
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { CartProvider } from "./src/context/CartContext";
import CartScreen from "./src/screens/CartScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import AddAddressScreen from "./src/screens/AddAddressScreen";
import ConfirmationScreen from "./src/screens/ConfirmationScreen";
import { colors } from "./src/theme";

const Stack = createNativeStackNavigator();

// Sello "SECURE" de la esquina superior derecha del Figma
function SecureBadge() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      <Ionicons name="shield-checkmark" size={22} color={colors.success} />
      <View>
        <Text style={{ fontSize: 11, fontWeight: "800", color: colors.text }}>
          SECURE
        </Text>
        <Text style={{ fontSize: 6, color: colors.textSecondary }}>
          SSL ENCRYPTION
        </Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTintColor: colors.primary, // color de la flecha "atrás"
              headerTitleStyle: {
                color: colors.text,
                fontWeight: "600",
                fontSize: 17,
              },
              headerBackButtonDisplayMode: "minimal", // solo la flecha, sin texto (iOS)
              headerShadowVisible: true,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{ title: "Shopping Cart" }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                title: "Secure Payment",
                headerRight: () => <SecureBadge />,
              }}
            />
            <Stack.Screen
              name="AddAddress"
              component={AddAddressScreen}
              options={{ title: "Add Address" }}
            />
            <Stack.Screen
              name="Confirmation"
              component={ConfirmationScreen}
              options={{
                title: "Order Confirmation",
                headerBackVisible: false,
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
