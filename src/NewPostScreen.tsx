import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './theme';
import { Car } from './types';

type Props = {
  cars: Car[];
  onSubmit: (photo: string, caption: string, carLabel: string) => void;
};

export default function NewPostScreen({ cars, onSubmit }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [carId, setCarId] = useState<string | null>(null);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const submit = () => {
    if (!photo) return Alert.alert('Rasm tanlang', 'Avval mashina rasmini tanlang.');
    const car = cars.find((c) => c.id === carId);
    onSubmit(photo, caption.trim(), car ? `${car.brand} ${car.model} ${car.year}`.trim() : '');
    setPhoto(null);
    setCaption('');
    setCarId(null);
  };

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Pressable onPress={pick} style={s.picker}>
        {photo ? (
          <Image source={{ uri: photo }} style={s.preview} />
        ) : (
          <View style={s.pickerInner}>
            <Ionicons name="images-outline" size={56} color={colors.muted} />
            <Text style={s.pickerText}>Galereyadan rasm tanlang</Text>
          </View>
        )}
      </Pressable>

      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="Izoh yozing..."
        placeholderTextColor={colors.muted}
        multiline
        style={s.input}
      />

      {cars.length > 0 && <Text style={s.label}>Qaysi mashina?</Text>}
      {cars.map((c) => (
        <Pressable key={c.id} onPress={() => setCarId(carId === c.id ? null : c.id)} style={[s.chip, carId === c.id && s.chipOn]}>
          <Ionicons name="car-sport-outline" size={22} color={carId === c.id ? colors.accent : colors.text} />
          <Text style={s.chipText}>{c.brand} {c.model} {c.year}</Text>
          {carId === c.id && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
        </Pressable>
      ))}

      <Pressable onPress={submit} style={s.button}>
        <Text style={s.buttonText}>Ulashish</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  picker: { aspectRatio: 1, backgroundColor: colors.card, borderRadius: 4, overflow: 'hidden' },
  pickerInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  pickerText: { color: colors.muted, fontSize: 16 },
  preview: { width: '100%', height: '100%' },
  input: { color: colors.text, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10, minHeight: 60, fontSize: 15 },
  label: { color: colors.muted, fontWeight: '600' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.border },
  chipOn: { borderColor: colors.accent },
  chipText: { color: colors.text, flex: 1 },
  button: { backgroundColor: colors.accent, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
