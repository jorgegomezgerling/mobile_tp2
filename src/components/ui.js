// Componentes chicos reutilizados en varias pantallas
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, formatPrice } from '../theme';

// Foto del producto (o un ícono si todavía no agregaste las imágenes)
export function ProductImage({ product, size = 94, style }) {
  return (
    <View style={[ui.imageBox, { width: size, height: size * 0.96 }, style]}>
      {product.image ? (
        <Image source={product.image} style={ui.image} resizeMode="contain" />
      ) : (
        <Ionicons name={product.icon} size={size * 0.4} color={colors.textSecondary} />
      )}
    </View>
  );
}

// Franja amarilla "Arrives by ..."
export function ShippingBanner({ style, compact }) {
  return (
    <View style={[ui.banner, compact && ui.bannerCompact, style]}>
      <Ionicons name="car-outline" size={compact ? 16 : 22} color={colors.text} />
      <Text style={[ui.bannerText, compact && { fontSize: 12 }]}>Arrives by April 3 to April 9th</Text>
    </View>
  );
}

// Precio con el precio anterior tachado si hay descuento
export function Price({ product, qty = 1, align = 'flex-end' }) {
  return (
    <View style={{ alignItems: align }}>
      {product.oldPrice ? (
        <Text style={ui.oldPrice}>{formatPrice(product.oldPrice * qty)}</Text>
      ) : null}
      <Text style={ui.price}>{formatPrice(product.price * qty)}</Text>
    </View>
  );
}

// Barra inferior fija: Total + botón azul
export function CheckoutFooter({ total, label, onPress, disabled, note }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[ui.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={ui.footerRow}>
        <View>
          <Text style={ui.footerLabel}>Total</Text>
          <Text style={ui.footerTotal}>{formatPrice(total)}</Text>
        </View>
        <PrimaryButton label={label} onPress={onPress} disabled={disabled} style={{ flex: 1, maxWidth: 180 }} />
      </View>
      {note ? <Text style={ui.footerNote}>{note}</Text> : null}
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled, style, outline }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        ui.button,
        outline && ui.buttonOutline,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        style,
      ]}
    >
      <Text style={[ui.buttonText, outline && { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

// Input con etiqueta chica arriba, como en el Figma
export function Field({ label, style, right, ...inputProps }) {
  return (
    <View style={[ui.field, style]}>
      <View style={{ flex: 1 }}>
        <Text style={ui.fieldLabel}>{label}</Text>
        <TextInput
          style={ui.fieldInput}
          placeholderTextColor="#B5B5BA"
          {...inputProps}
        />
      </View>
      {right}
    </View>
  );
}

export function Checkbox({ checked, onChange, label }) {
  return (
    <Pressable style={ui.checkRow} onPress={() => onChange(!checked)} hitSlop={6}>
      <View style={[ui.checkbox, checked && ui.checkboxOn]}>
        {checked && <Ionicons name="checkmark" size={18} color="#fff" />}
      </View>
      <Text style={ui.checkLabel}>{label}</Text>
    </Pressable>
  );
}

export function Radio({ selected, onPress, label }) {
  return (
    <Pressable style={ui.checkRow} onPress={onPress} hitSlop={6}>
      <View style={[ui.radio, selected && { borderColor: colors.primary }]}>
        {selected && <View style={ui.radioDot} />}
      </View>
      <Text style={ui.checkLabel}>{label}</Text>
    </Pressable>
  );
}

// Encabezado de sección: "Shipping ............ Add / Edit"
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={ui.sectionHeader}>
      <Text style={ui.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={ui.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const Separator = () => <View style={ui.separator} />;

// Tarjeta gris con los datos de la dirección
export function AddressBox({ address, onPress }) {
  const content = (
    <View style={{ flex: 1 }}>
      <Text style={ui.addrName}>{address.name}</Text>
      <Text style={ui.addrText}>{address.email}</Text>
      <Text style={ui.addrText}>
        {address.phoneCode} {address.phone}
      </Text>
      <Text style={[ui.addrText, { marginTop: 8 }]}>
        {address.street}
        {address.street2 ? `, ${address.street2}` : ''}
      </Text>
      <Text style={ui.addrText}>
        {address.city}, {address.country}
      </Text>
    </View>
  );
  if (!onPress) return <View style={ui.grayBox}>{content}</View>;
  return (
    <Pressable style={ui.grayBox} onPress={onPress}>
      {content}
      <Ionicons name="chevron-forward" size={22} color={colors.primary} />
    </Pressable>
  );
}

export const ui = StyleSheet.create({
  imageBox: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  banner: {
    backgroundColor: colors.banner,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  bannerCompact: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 2, gap: 6 },
  bannerText: { fontSize: 13, color: colors.text },
  oldPrice: { fontSize: 12, color: colors.textSecondary, textDecorationLine: 'line-through' },
  price: { fontSize: 17, fontWeight: '600', color: colors.text },
  footer: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  footerLabel: { fontSize: 13, color: colors.text },
  footerTotal: { fontSize: 19, fontWeight: '700', color: colors.text },
  footerNote: { fontSize: 11, color: colors.textSecondary, marginTop: 10 },
  button: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  field: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: { fontSize: 11, color: colors.textSecondary },
  fieldInput: { fontSize: 15, color: colors.text, paddingVertical: 2, marginTop: 2 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 4 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#9A9AA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkLabel: { fontSize: 14, color: colors.text, flexShrink: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '500', color: colors.text },
  link: { fontSize: 14, color: colors.primary },
  separator: { height: 8, backgroundColor: colors.separator },
  grayBox: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addrName: { fontSize: 14, color: colors.text, marginBottom: 8 },
  addrText: { fontSize: 13, color: colors.text, lineHeight: 18 },
});
