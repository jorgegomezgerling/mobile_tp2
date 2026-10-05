// Pantalla 3: Add Address (se abre desde Secure Payment)
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import OptionPicker from '../components/OptionPicker';
import { Checkbox, Field, PrimaryButton, Radio } from '../components/ui';
import { colors } from '../theme';

const PHONE_CODES = ['🇦🇷 +54', '🇺🇾 +598', '🇧🇷 +55', '🇪🇸 +34', '🇩🇪 +49', '🇺🇸 +1'];
const fullCode = (code) => PHONE_CODES.find((c) => c.endsWith(' ' + code)) ?? PHONE_CODES[0];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Step({ n, title }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{n}</Text>
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
    </View>
  );
}

const Hint = ({ children }) => <Text style={styles.hint}>{children}</Text>;

export default function AddAddressScreen({ navigation }) {
  const { address, setAddress } = useCart();
  const insets = useSafeAreaInsets();

  // Si ya había una dirección, se edita; si no, el formulario arranca vacío
  const [form, setForm] = useState({
    name: address?.name ?? '',
    phoneCode: fullCode(address?.phoneCode ?? '+54'),
    phone: address?.phone ?? '',
    email: address?.email ?? '',
    title: address?.title ?? '',
    street: address?.street ?? '',
    street2: address?.street2 ?? '',
    city: address?.city ?? '',
    country: address?.country ?? '',
    billingSame: address?.billingSame ?? true,
    billingType: address?.billingType ?? 'personal',
  });
  const [showStreet2, setShowStreet2] = useState(Boolean(address?.street2));

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSave = () => {
    const missing = [];
    if (!form.name.trim()) missing.push('Name and Surname');
    if (!form.phone.trim()) missing.push('Phone Number');
    if (!EMAIL_RE.test(form.email.trim())) missing.push('E-mail Address (valid)');
    if (!form.street.trim()) missing.push('Address');
    if (!form.city.trim()) missing.push('City');
    if (!form.country.trim()) missing.push('Country');
    if (missing.length) {
      Alert.alert('Required fields', 'Please complete:\n\n• ' + missing.join('\n• '));
      return;
    }
    const clean = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    );
    setAddress({ ...clean, phoneCode: form.phoneCode.split(' ').pop() });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      >
        <Text style={styles.required}>*Required fields.</Text>

        <Step n={1} title="Recipents Information" />
        <Field label="Name and Surname*" value={form.name} onChangeText={set('name')} autoCapitalize="words" />
        <View style={[styles.row, { marginTop: 8 }]}>
          <View style={styles.codeBox}>
            <OptionPicker title="Country code" value={form.phoneCode} options={PHONE_CODES} onChange={set('phoneCode')} style={styles.codePicker} />
          </View>
          <Field
            label="Phone Number*"
            value={form.phone}
            onChangeText={set('phone')}
            keyboardType="phone-pad"
            style={{ flex: 1 }}
          />
        </View>
        <Hint>For shipping related questions only.</Hint>
        <Field
          label="E-mail Address*"
          value={form.email}
          onChangeText={set('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ marginTop: 16 }}
        />
        <Hint>This address will be used to send you order and bill details.</Hint>

        <Step n={2} title="Shipping Address" />
        <Field label="Address Title (Optional)" value={form.title} onChangeText={set('title')} placeholder="Home" />
        <Hint>For estimating if the place is opened or closed on the weekends.</Hint>
        <Field
          label="Address*"
          value={form.street}
          onChangeText={set('street')}
          placeholder="Street, apartment name etc."
          style={{ marginTop: 16 }}
        />
        {showStreet2 ? (
          <Field
            label="Street Address 2 (Optional)"
            value={form.street2}
            onChangeText={set('street2')}
            style={{ marginTop: 8 }}
          />
        ) : (
          <Pressable style={styles.addLine} onPress={() => setShowStreet2(true)}>
            <Ionicons name="add" size={18} color={colors.primary} />
            <Text style={styles.link}>Street Address 2 (Optional)</Text>
          </Pressable>
        )}
        <Field label="City*" value={form.city} onChangeText={set('city')} style={{ marginTop: 16 }} />
        <Field label="Country*" value={form.country} onChangeText={set('country')} style={{ marginTop: 8 }} />

        <Step n={3} title="Billing Information" />
        <Text style={styles.label}>Billing Address*</Text>
        <Checkbox checked={form.billingSame} onChange={set('billingSame')} label="Same as delivery address." />
        <Text style={[styles.label, { marginTop: 20 }]}>Billing Type*</Text>
        <View style={[styles.row, { gap: 60 }]}>
          <Radio label="Personal" selected={form.billingType === 'personal'} onPress={() => set('billingType')('personal')} />
          <Radio label="Commercial" selected={form.billingType === 'commercial'} onPress={() => set('billingType')('commercial')} />
        </View>

        <View style={[styles.row, { marginTop: 32 }]}>
          <PrimaryButton label="Cancel" outline onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <PrimaryButton label="Save" onPress={onSave} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  required: { fontSize: 11, color: colors.textSecondary },
  step: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 24, marginBottom: 16 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  stepTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  row: { flexDirection: 'row', gap: 8 },
  codeBox: { width: 112 },
  codePicker: { height: 56, justifyContent: 'space-between', paddingHorizontal: 14 },
  hint: { fontSize: 11, color: colors.textSecondary, marginTop: 8 },
  addLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'flex-start' },
  link: { fontSize: 14, color: colors.primary },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 12 },
});
