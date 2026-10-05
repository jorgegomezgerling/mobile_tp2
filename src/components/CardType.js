// Requerimiento 3: tipos de tarjeta (Visa, Mastercard y otras)
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export const CARD_TYPES = [
  { id: 'visa', label: 'Visa', cvvLength: 3 },
  { id: 'mastercard', label: 'Mastercard', cvvLength: 3 },
  { id: 'amex', label: 'Amex', cvvLength: 4 },
  { id: 'other', label: 'Otra', cvvLength: 3 },
];

export const getCardType = (id) => CARD_TYPES.find((c) => c.id === id) ?? CARD_TYPES[3];

// Detecta la marca por los primeros dígitos (BIN) del número
export function detectCardType(number) {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  return null;
}

// "5470000400030002" -> "5470 0004 0003 0002" (Amex: 4-6-5)
export function formatCardNumber(value, type) {
  const digits = value.replace(/\D/g, '').slice(0, type === 'amex' ? 15 : 16);
  if (type === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(' ');
  }
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

// Logos dibujados con Views (no hacen falta imágenes)
export function CardLogo({ type, size = 1 }) {
  if (type === 'visa') {
    return <Text style={[styles.visa, { fontSize: 15 * size }]}>VISA</Text>;
  }
  if (type === 'mastercard') {
    const d = 18 * size;
    return (
      <View style={{ flexDirection: 'row', width: d * 1.6, height: d }}>
        <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: '#EB001B' }} />
        <View
          style={{
            width: d,
            height: d,
            borderRadius: d / 2,
            backgroundColor: '#F79E1B',
            marginLeft: -d * 0.4,
            opacity: 0.9,
          }}
        />
      </View>
    );
  }
  if (type === 'amex') {
    return (
      <View style={[styles.amex, { paddingHorizontal: 4 * size, paddingVertical: 2 * size }]}>
        <Text style={[styles.amexText, { fontSize: 10 * size }]}>AMEX</Text>
      </View>
    );
  }
  return <Ionicons name="card-outline" size={22 * size} color={colors.textSecondary} />;
}

export default function CardTypeSelector({ value, onChange }) {
  return (
    <View style={styles.row}>
      {CARD_TYPES.map((t) => {
        const selected = value === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View style={styles.logoBox}>
              <CardLogo type={t.id} size={0.85} />
            </View>
            <Text style={[styles.chipText, selected && { color: colors.primary, fontWeight: '600' }]}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 70,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#EEF6FC' },
  logoBox: { height: 22, justifyContent: 'center' },
  chipText: { fontSize: 12, color: colors.text },
  visa: { color: '#1A1F71', fontWeight: '900', fontStyle: 'italic', letterSpacing: 0.5 },
  amex: { backgroundColor: '#2E77BC', borderRadius: 3 },
  amexText: { color: '#fff', fontWeight: '800' },
});
