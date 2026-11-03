import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
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
    <ScrollView>
      <View style={s.top}>
        <Avatar name={profile.name} size={86} ring />
        <View style={s.stats}>
          <View style={s.statBox}><Text style={s.stat}>{mine.length}</Text><Text style={s.statLabel}>post</Text></View>
          <View style={s.statBox}><Text style={s.stat}>{cars.length}</Text><Text style={s.statLabel}>mashina</Text></View>
          <View style={s.statBox}><Text style={s.stat}>0</Text><Text style={s.statLabel}>obunachi</Text></View>
        </View>
      </View>

      <View style={s.fields}>
        <TextInput value={profile.name} onChangeText={(name) => onChange({ ...profile, name })} placeholder="Ismingiz" placeholderTextColor={colors.muted} style={[s.input, { fontWeight: '700' }]} />
        <TextInput value={profile.bio} onChangeText={(bio) => onChange({ ...profile, bio })} placeholder="O'zingiz haqingizda" placeholderTextColor={colors.muted} style={s.input} />
      </View>

      <View style={s.gridTab}>
        <Ionicons name="grid-outline" size={22} color={colors.text} />
      </View>

      <View style={s.grid}>
        {mine.map((p) => (
          <Image key={p.id} source={{ uri: p.photo }} style={s.tile} />
        ))}
      </View>
      {mine.length === 0 && <Text style={s.empty}>Hali postlar yo'q</Text>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 20, padding: 16 },
  stats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  stat: { color: colors.text, fontWeight: '800', fontSize: 18 },
  statLabel: { color: colors.text, fontSize: 13 },
  fields: { paddingHorizontal: 16, gap: 6 },
  input: { color: colors.text, paddingVertical: 6, fontSize: 14, borderBottomWidth: 1, borderColor: colors.border },
  gridTab: { alignItems: 'center', paddingVertical: 10, marginTop: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 2 },
  tile: { width: '33%', aspectRatio: 1, backgroundColor: colors.card },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 30 },
});
