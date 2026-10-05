// Pantalla 4: Order Confirmation
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { CardLogo, getCardType } from '../components/CardType';
import { AddressBox, Price, PrimaryButton, ProductImage, ShippingBanner } from '../components/ui';
import { colors, formatPrice } from '../theme';

const pad = (n) => String(n).padStart(2, '0');
const formatDate = (d) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

function SummaryRow({ label, value, big }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={big ? styles.totalLabel : styles.summaryLabel}>{label}</Text>
      <Text style={big ? styles.totalValue : styles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function ConfirmationScreen({ navigation }) {
  const { lastOrder: order, resetCheckout } = useCart();
  const insets = useSafeAreaInsets();

  if (!order) return null;

  const backToShopping = () => {
    resetCheckout();
    navigation.reset({ index: 0, routes: [{ name: 'Cart' }] });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
    >
      <View style={styles.thanks}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={36} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.thanksTitle}>Thank you!</Text>
          <Text style={styles.thanksText}>Your order #{order.number} has been placed.</Text>
        </View>
      </View>

      <Text style={styles.text}>
        We sent an email to <Text style={{ fontWeight: '600' }}>{order.address.email}</Text> with your order
        confirmation and bill.
      </Text>
      <Text style={[styles.text, { marginTop: 16 }]}>Time placed: {formatDate(order.date)}</Text>

      <Text style={styles.section}>Shipping</Text>
      <AddressBox address={order.address} />

      <Text style={styles.section}>Billing</Text>
      {order.address.billingSame ? (
        <AddressBox address={order.address} />
      ) : (
        <View style={styles.grayNote}>
          <Text style={styles.text}>Billing address will be requested by email.</Text>
        </View>
      )}

      <Text style={styles.section}>Payment</Text>
      <View style={styles.payment}>
        <CardLogo type={order.card.type} />
        <Text style={styles.text}>
          {getCardType(order.card.type).label} •••• {order.card.last4}
        </Text>
      </View>

      <Text style={styles.section}>Order Items</Text>
      <ShippingBanner style={{ marginBottom: 16 }} />
      {order.items.map((it) => (
        <View key={it.id} style={styles.item}>
          <ProductImage product={it.product} size={94} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemName}>{it.product.name}</Text>
            <Text style={styles.itemDetail}>Color: {it.color}</Text>
            <Text style={styles.itemDetail}>Size: {it.size}</Text>
            <Text style={styles.itemDetail}>Qty: {it.qty}</Text>
          </View>
          <View style={{ justifyContent: 'flex-end' }}>
            <Price product={it.product} qty={it.qty} />
          </View>
        </View>
      ))}

      <Text style={styles.section}>Order Summary</Text>
      <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
      <SummaryRow label="Shipping" value={formatPrice(order.shipping)} />
      <View style={styles.divider} />
      <SummaryRow label="Total" value={formatPrice(order.total)} big />

      <PrimaryButton label="Back to Shopping" outline onPress={backToShopping} style={{ marginTop: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  thanks: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 24 },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thanksTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
  thanksText: { fontSize: 15, color: colors.text, marginTop: 4 },
  text: { fontSize: 13, color: colors.text, lineHeight: 18 },
  section: { fontSize: 15, fontWeight: '500', color: colors.text, marginTop: 24, marginBottom: 14 },
  grayNote: { backgroundColor: colors.surface, borderRadius: 4, padding: 16 },
  payment: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  item: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  itemName: { fontSize: 15, fontWeight: '500', color: colors.text, marginBottom: 6 },
  itemDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: colors.text },
  summaryValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 12 },
  totalLabel: { fontSize: 16, color: colors.text },
  totalValue: { fontSize: 19, fontWeight: '700', color: colors.text },
});
