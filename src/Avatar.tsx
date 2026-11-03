import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, storyGradient } from './theme';

type Props = {
  name: string;
  uri?: string;
  size?: number;
  ring?: boolean;
};

// Dumaloq avatar; ring=true bo'lsa Instagram hikoyasidagi gradient halqa chiqadi.
export default function Avatar({ name, uri, size = 36, ring = false }: Props) {
  const inner = ring ? size - 8 : size;
  const body = (
    <View style={[s.circle, { width: inner, height: inner, borderRadius: inner / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: inner, height: inner, borderRadius: inner / 2 }} />
      ) : (
        <Text style={[s.letter, { fontSize: inner * 0.4 }]}>{(name || '?').slice(0, 1).toUpperCase()}</Text>
      )}
    </View>
  );

  if (!ring) return body;
  return (
    <LinearGradient
      colors={storyGradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      <View style={{ width: size - 4, height: size - 4, borderRadius: (size - 4) / 2, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        {body}
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  circle: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  letter: { color: colors.muted, fontWeight: '700' },
});
