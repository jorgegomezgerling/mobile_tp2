// Selector desplegable (Color / Size) que abre una hoja desde abajo.
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

/**
 * options: array de strings, o de objetos { name, hex } para colores
 */
export default function OptionPicker({ title, value, options, onChange, style }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const label = (opt) => (typeof opt === 'string' ? opt : opt.name);
  const selected = options.find((o) => label(o) === value);

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.box, style, pressed && { opacity: 0.6 }]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${value}. Tocar para cambiar`}
      >
        {selected && selected.hex ? <View style={[styles.swatch, { backgroundColor: selected.hex }]} /> : null}
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.primary} />
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Select {title.toLowerCase()}</Text>
          <FlatList
            data={options}
            keyExtractor={label}
            renderItem={({ item }) => {
              const isSel = label(item) === value;
              return (
                <Pressable
                  style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.surface }]}
                  onPress={() => {
                    onChange(label(item));
                    setOpen(false);
                  }}
                >
                  {item.hex ? <View style={[styles.swatch, { backgroundColor: item.hex }]} /> : null}
                  <Text style={[styles.optionText, isSel && { color: colors.primary, fontWeight: '600' }]}>
                    {label(item)}
                  </Text>
                  {isSel && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 36,
    minWidth: 99,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  value: { fontSize: 13, color: colors.text, flexShrink: 1 },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    maxHeight: '60%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  sheetTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 20, marginBottom: 8, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionText: { fontSize: 15, color: colors.text, flex: 1 },
});
