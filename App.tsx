import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import FeedScreen from './src/FeedScreen';
import NewPostScreen from './src/NewPostScreen';
import GarageScreen from './src/GarageScreen';
import ProfileScreen from './src/ProfileScreen';
import { uid, usePersistentState } from './src/storage';
import { colors } from './src/theme';
import { Car, Post, Profile } from './src/types';

type Tab = 'feed' | 'new' | 'garage' | 'profile';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: { key: Tab; on: IconName; off: IconName }[] = [
  { key: 'feed', on: 'home', off: 'home-outline' },
  { key: 'garage', on: 'car-sport', off: 'car-sport-outline' },
  { key: 'new', on: 'add-circle', off: 'add-circle-outline' },
  { key: 'profile', on: 'person-circle', off: 'person-circle-outline' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('feed');
  const [posts, setPosts] = usePersistentState<Post[]>('posts', []);
  const [cars, setCars] = usePersistentState<Car[]>('cars', []);
  const [profile, setProfile] = usePersistentState<Profile>('profile', { name: 'haydovchi', bio: '' });

  const addPost = (photo: string, caption: string, carLabel: string) => {
    setPosts((p) => [
      { id: uid(), author: profile.name || 'haydovchi', photo, caption, carLabel, likes: 0, liked: false, comments: [], createdAt: Date.now() },
      ...p,
    ]);
    setTab('feed');
  };

  const like = (id: string) =>
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p)));

  const comment = (id: string, text: string) =>
    setPosts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, comments: [...p.comments, { id: uid(), author: profile.name || 'haydovchi', text }] } : p)),
    );

  return (
    <SafeAreaProvider>
    <SafeAreaView style={s.root}>
      <StatusBar style="dark" />
      <View style={s.topBar}>
        <Text style={s.logo}>Autogram</Text>
        <View style={s.topIcons}>
          <Ionicons name="heart-outline" size={27} color={colors.text} />
          <Ionicons name="paper-plane-outline" size={26} color={colors.text} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {tab === 'feed' && <FeedScreen posts={posts} cars={cars} userName={profile.name} onLike={like} onComment={comment} onAddCar={() => setTab('garage')} />}
        {tab === 'new' && <NewPostScreen cars={cars} onSubmit={addPost} />}
        {tab === 'garage' && (
          <GarageScreen
            cars={cars}
            onAdd={(c) => setCars((cs) => [...cs, { ...c, id: uid() }])}
            onRemove={(id) => setCars((cs) => cs.filter((c) => c.id !== id))}
          />
        )}
        {tab === 'profile' && <ProfileScreen profile={profile} onChange={setProfile} posts={posts} cars={cars} />}
      </View>
      <View style={s.tabs}>
        {TABS.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={s.tab} hitSlop={6}>
            <Ionicons name={tab === t.key ? t.on : t.off} size={t.key === 'new' ? 32 : 28} color={colors.text} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  logo: { color: colors.text, fontSize: 28, fontWeight: '800', fontStyle: 'italic', letterSpacing: -0.5 },
  topIcons: { flexDirection: 'row', gap: 18 },
  tabs: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border, backgroundColor: colors.bg },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
