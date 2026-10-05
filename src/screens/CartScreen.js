// Pantalla 1: Shopping Cart
// Requerimientos 1 (Color, Size, Qty) y 2 (eliminar productos)
import { useLayoutEffect } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import OptionPicker from '../components/OptionPicker';
import { CheckoutFooter, Price, ProductImage, Separator, ShippingBanner } from '../components/ui';
import { colors, formatPrice } from '../theme';
import { MAX_QTY } from '../data/products';

function QtyControl({ item, onRemove }) {
  const { increment, decrement } = useCart();
  const isOne = item.qty === 1;
  const atMax = item.qty >= MAX_QTY;

  return (
    <View style={styles.qtyBox}>
      {/* Con cantidad 1 el botón izquierdo es el tacho (como en el Figma) */}
      <Pressable
        hitSlop={8}
        onPress={isOne ? onRemove : () => decrement(item.id)}
        accessibilityLabel={isOne ? 'Eliminar producto' : 'Restar uno'}
      >
        <Ionicons
          name={isOne ? 'trash-outline' : 'remove'}
          size={18}
          color={isOne ? colors.danger : colors.primary}
        />
      </Pressable>
      <Text style={styles.qtyText}>{item.qty}</Text>
      <Pressable hitSlop={8} onPress={() => increment(item.id)} disabled={atMax} accessibilityLabel="Sumar uno">
        <Ionicons name="add" size={20} color={atMax ? colors.border : colors.primary} />
      </Pressable>
    </View>
  );
}

function CartItem({ item }) {
  const { updateItem, removeItem } = useCart();
  const { product } = item;

  const confirmRemove = () =>
    Alert.alert('Remove product', `Do you want to remove ${product.name} from your cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
    ]);

  return (
    <View style={styles.item}>
      <View style={styles.itemTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>
          <Pressable onPress={confirmRemove} hitSlop={6} style={styles.removeLink}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
        <Price product={product} qty={item.qty} />
      </View>

      <View style={styles.itemBody}>
        <ProductImage product={product} size={150} style={styles.image} />
        <View style={styles.options}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Color</Text>
            <OptionPicker
              title="Color"
              value={item.color}
              options={product.colors}
              onChange={(color) => updateItem(item.id, { color })}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Size</Text>
            <OptionPicker
              title="Size"
              value={item.size}
              options={product.sizes}
              onChange={(size) => updateItem(item.id, { size })}
            />
          </View>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Qty</Text>
            <QtyControl item={item} onRemove={confirmRemove} />
          </View>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, itemCount, total } = useCart();

  // Título con subtítulo "2 items - Total $147,45"
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} - Total {formatPrice(total)}
          </Text>
        </View>
      ),
    });
  }, [navigation, itemCount, total]);

  return (
    <View style={styles.screen}>
      <ShippingBanner />
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <CartItem item={item} />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={56} color={colors.border} />
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        }
      />
      <CheckoutFooter
        total={total}
        label="Checkout"
        disabled={items.length === 0}
        onPress={() => navigation.navigate('Payment')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  headerSubtitle: { fontSize: 11, color: colors.text },
  item: { padding: 16, paddingBottom: 20 },
  itemTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  name: { fontSize: 15, fontWeight: '500', color: colors.text },
  subtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 4 },
  removeLink: { alignSelf: 'flex-start', marginTop: 6 },
  removeText: { fontSize: 12, color: colors.danger },
  itemBody: { flexDirection: 'row', gap: 16 },
  image: { flexShrink: 1 },
  options: { flex: 1, justifyContent: 'space-between', gap: 12 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  optionLabel: { fontSize: 15, fontWeight: '500', color: colors.text },
  qtyBox: {
    height: 36,
    width: 99,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  qtyText: { fontSize: 14, color: colors.text },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyText: { fontSize: 15, color: colors.textSecondary },
});
