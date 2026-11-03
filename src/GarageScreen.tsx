import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './theme';
import { Car } from './types';

type Props = {
  cars: Car[];
  onAdd: (car: Omit<Car, 'id'>) => void;
  onRemove: (id: string) => void;
};

export default function GarageScreen({ cars, onAdd, onRemove }: Props) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [photo, setPhoto] = useState<string | undefined>();

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const add = () => {
    if (!brand.trim() || !model.trim()) return;
    onAdd({ brand: brand.trim(), model: model.trim(), year: year.trim(), photo });
    setBrand('');
    setModel('');
    setYear('');
    setPhoto(undefined);
  };

  return (
    <FlatList
      data={cars}
      keyExtractor={(c) => c.id}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      ListHeaderComponent={
        <View style={s.form}>
          <Text style={s.title}>Mashina qo'shish</Text>
          <TextInput value={brand} onChangeText={setBrand} placeholder="Marka (masalan, Chevrolet)" placeholderTextColor={colors.muted} style={s.input} />
          <TextInput value={model} onChangeText={setModel} placeholder="Model (masalan, Malibu)" placeholderTextColor={colors.muted} style={s.input} />
          <TextInput value={year} onChangeText={setYear} placeholder="Yil" keyboardType="number-pad" placeholderTextColor={colors.muted} style={s.input} />
          <Pressable onPress={pick} style={s.secondary}>
            <Text style={s.secondaryText}>{photo ? '✅ Rasm tanlandi' : '📷 Rasm tanlash (ixtiyoriy)'}</Text>
          </Pressable>
          <Pressable onPress={add} style={s.button}>
            <Text style={s.buttonText}>Garajga qo'shish</Text>
          </Pressable>
          <Text style={[s.title, { marginTop: 16 }]}>Mening garajim</Text>
        </View>
      }
      ListEmptyComponent={<Text style={s.empty}>Garaj bo'sh. Birinchi mashinangizni qo'shing.</Text>}
      renderItem={({ item }) => (
        <View style={s.car}>
          {item.photo ? <Image source={{ uri: item.photo }} style={s.carPhoto} /> : <View style={[s.carPhoto, s.noPhoto]}><Text style={{ fontSize: 28 }}>🚗</Text></View>}
          <View style={{ flex: 1 }}>
            <Text style={s.carName}>{item.brand} {item.model}</Text>
            <Text style={s.empty2}>{item.year}</Text>
          </View>
          <Pressable onPress={() => onRemove(item.id)}>
            <Text style={{ color: colors.muted, fontSize: 18 }}>🗑</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const s = StyleSheet.create({
  form: { gap: 10 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  input: { color: colors.text, backgroundColor: colors.card, borderRadius: 8, padding: 12 },
  secondary: { backgroundColor: colors.card, borderRadius: 8, padding: 12, alignItems: 'center' },
  secondaryText: { color: colors.text },
  button: { backgroundColor: colors.accent, borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  car: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 12, padding: 10 },
  carPhoto: { width: 64, height: 64, borderRadius: 8 },
  noPhoto: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  carName: { color: colors.text, fontWeight: '700', fontSize: 16 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 20 },
  empty2: { color: colors.muted },
});
