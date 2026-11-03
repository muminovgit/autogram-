import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from './theme';
import { Car, Post, Profile } from './types';

type Props = {
  profile: Profile;
  onChange: (p: Profile) => void;
  posts: Post[];
  cars: Car[];
};

export default function ProfileScreen({ profile, onChange, posts, cars }: Props) {
  const mine = posts.filter((p) => p.author === profile.name);
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={s.top}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(profile.name || '?').slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={s.stats}>
          <Text style={s.stat}>{mine.length}{'\n'}<Text style={s.statLabel}>post</Text></Text>
          <Text style={s.stat}>{cars.length}{'\n'}<Text style={s.statLabel}>mashina</Text></Text>
        </View>
      </View>
      <TextInput value={profile.name} onChangeText={(name) => onChange({ ...profile, name })} placeholder="Ismingiz" placeholderTextColor={colors.muted} style={s.input} />
      <TextInput value={profile.bio} onChangeText={(bio) => onChange({ ...profile, bio })} placeholder="O'zingiz haqingizda" placeholderTextColor={colors.muted} style={s.input} />
      <View style={s.grid}>
        {mine.map((p) => (
          <Image key={p.id} source={{ uri: p.photo }} style={s.tile} />
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  stats: { flexDirection: 'row', gap: 30 },
  stat: { color: colors.text, fontWeight: '800', fontSize: 18, textAlign: 'center' },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '400' },
  input: { color: colors.text, backgroundColor: colors.card, borderRadius: 8, padding: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  tile: { width: '32.6%', aspectRatio: 1, backgroundColor: colors.card },
});
