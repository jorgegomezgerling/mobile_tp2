// Pantalla 2: Secure Payment
// Requerimiento 3: elegir tipo de tarjeta (Visa, Mastercard, Amex u Otra)
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import CardTypeSelector, { CardLogo, detectCardType, formatCardNumber, getCardType } from '../components/CardType';
import {
  AddressBox, Checkbox, CheckoutFooter, Field, ProductImage, SectionHeader, Separator, ShippingBanner,
} from '../components/ui';
import { colors, formatPrice } from '../theme';

function MiniItem({ item }) {
  return (
    <View style={styles.mini}>
      <ProductImage product={item.product} size={90} />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <Text style={styles.miniName} numberOfLines={1}>{item.product.name}</Text>
        <View>
          <Text style={styles.miniDetail}>Color: {item.color}</Text>
          <Text style={styles.miniDetail}>Size: {item.size}</Text>
          <View style={styles.miniBottom}>
            <Text style={styles.miniDetail}>Qty: {item.qty}</Text>
            <Text style={styles.miniPrice}>{formatPrice(item.product.price * item.qty)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function PaymentScreen({ navigation }) {
  const { items, itemCount, total, address, card, updateCard, placeOrder } = useCart();
  const cardType = getCardType(card.type);

  // Al escribir el número, si se reconoce la marca se selecciona sola
  const onNumberChange = (text) => {
    const detected = detectCardType(text);
    const type = detected ?? card.type;
    updateCard({ number: formatCardNumber(text, type), type });
  };

  // Al cambiar el tipo a mano, se reformatea el número y se ajusta el CVV
  const onTypeChange = (type) => {
    updateCard({
      type,
      number: formatCardNumber(card.number, type),
      cvv: card.cvv.slice(0, getCardType(type).cvvLength),
    });
  };

  const validate = () => {
    const errors = [];
    const digits = card.number.replace(/\D/g, '');
    const month = Number(card.month);
    if (!address) errors.push('Shipping address');
    if (!card.holder.trim()) errors.push("Card holder's name");
    if (digits.length < (card.type === 'amex' ? 15 : 13)) errors.push('Card number');
    if (!(month >= 1 && month <= 12)) errors.push('Month (01-12)');
    if (card.year.length !== 2) errors.push('Year (YY)');
    if (card.cvv.length !== cardType.cvvLength) errors.push(`Security code (${cardType.cvvLength} digits)`);
    return errors;
  };

  const onPay = () => {
    const errors = validate();
    if (errors.length) {
      Alert.alert('Check your data', 'Please complete:\n\n• ' + errors.join('\n• '));
      return;
    }
    placeOrder();
    navigation.reset({ index: 0, routes: [{ name: 'Confirmation' }] });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* SHIPPING */}
        <View style={styles.section}>
          <SectionHeader
            title="Shipping"
            action={address ? 'Add / Edit' : null}
            onAction={() => navigation.navigate('AddAddress')}
          />
          {address ? (
            <>
              <AddressBox address={address} onPress={() => navigation.navigate('AddAddress')} />
              {address.billingSame && (
                <View style={{ marginTop: 16 }}>
                  <Checkbox checked label="Billing and delivery addresses are same." onChange={() => {}} />
                </View>
              )}
            </>
          ) : (
            <Pressable style={styles.addAddress} onPress={() => navigation.navigate('AddAddress')}>
              <Ionicons name="location-outline" size={22} color={colors.text} />
              <Text style={styles.addAddressText}>Add Address</Text>
              <Ionicons name="chevron-forward" size={22} color={colors.primary} />
            </Pressable>
          )}
        </View>

        <Separator />

        {/* PAYMENT */}
        <View style={styles.section}>
          <SectionHeader title="Payment" />
          <View style={styles.cardBox}>
            <View style={styles.cardTitle}>
              <Ionicons name="card-outline" size={24} color={colors.text} />
              <Text style={styles.cardTitleText}>Add Credit / Debit Card</Text>
            </View>

            <Text style={styles.smallLabel}>Card Type</Text>
            <CardTypeSelector value={card.type} onChange={onTypeChange} />

            <Field
              label="Card Holder's Name"
              value={card.holder}
              onChangeText={(holder) => updateCard({ holder })}
              autoCapitalize="words"
              style={{ marginTop: 16 }}
            />
            <Field
              label="Card Number"
              value={card.number}
              onChangeText={onNumberChange}
              keyboardType="number-pad"
              placeholder={card.type === 'amex' ? '0000 000000 00000' : '0000 0000 0000 0000'}
              right={<CardLogo type={card.type} />}
              style={{ marginTop: 10 }}
            />

            <Text style={[styles.smallLabel, { marginTop: 18 }]}>Expire Date</Text>
            <View style={styles.row}>
              <Field
                label="Month"
                value={card.month}
                onChangeText={(t) => updateCard({ month: t.replace(/\D/g, '').slice(0, 2) })}
                keyboardType="number-pad"
                placeholder="MM"
                style={styles.half}
              />
              <Field
                label="Year"
                value={card.year}
                onChangeText={(t) => updateCard({ year: t.replace(/\D/g, '').slice(0, 2) })}
                keyboardType="number-pad"
                placeholder="YY"
                style={styles.half}
              />
            </View>
            <View style={[styles.row, { marginTop: 10, alignItems: 'center' }]}>
              <Field
                label="Security Code"
                value={card.cvv}
                onChangeText={(t) => updateCard({ cvv: t.replace(/\D/g, '').slice(0, cardType.cvvLength) })}
                keyboardType="number-pad"
                secureTextEntry
                placeholder={cardType.cvvLength === 4 ? '0000' : '000'}
                style={styles.half}
              />
              <Pressable
                hitSlop={8}
                onPress={() =>
                  Alert.alert(
                    'Security code',
                    cardType.cvvLength === 4
                      ? 'The 4 digits on the front of your card.'
                      : 'The 3 digits on the back of your card.'
                  )
                }
              >
                <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
              </Pressable>
            </View>

            <View style={{ marginTop: 16 }}>
              <Checkbox
                checked={card.remember}
                onChange={(remember) => updateCard({ remember })}
                label="Remember my card for next purchases."
              />
            </View>
          </View>
        </View>

        <Separator />

        {/* ITEMS */}
        <View style={[styles.section, { paddingRight: 0 }]}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsCount}>{itemCount} items</Text>
            <ShippingBanner compact />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 16 }}>
            {items.map((it) => (
              <MiniItem key={it.id} item={it} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <CheckoutFooter
        total={total}
        label="Pay Now"
        onPress={onPay}
        note="This is the final step, after you touching Pay Now button, the payment will be transaction"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  section: { padding: 16 },
  addAddress: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addAddressText: { flex: 1, fontSize: 15, color: colors.text },
  cardBox: { backgroundColor: colors.surface, borderRadius: 4, padding: 16 },
  cardTitle: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  cardTitleText: { fontSize: 15, color: colors.text },
  smallLabel: { fontSize: 12, color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1, maxWidth: 160 },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 16,
  },
  itemsCount: { fontSize: 13, color: colors.text },
  mini: {
    width: 290,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  miniName: { fontSize: 15, fontWeight: '500', color: colors.text },
  miniDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  miniBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniPrice: { fontSize: 15, fontWeight: '600', color: colors.text },
});
