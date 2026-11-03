import React, { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FeedScreen from './src/FeedScreen';
import NewPostScreen from './src/NewPostScreen';
import GarageScreen from './src/GarageScreen';
import ProfileScreen from './src/ProfileScreen';
import { uid, usePersistentState } from './src/storage';
import { colors } from './src/theme';
import { Car, Post, Profile } from './src/types';

type Tab = 'feed' | 'new' | 'garage' | 'profile';

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'feed', icon: '🏠', label: 'Lenta' },
  { key: 'new', icon: '➕', label: 'Yangi' },
  { key: 'garage', icon: '🚗', label: 'Garaj' },
  { key: 'profile', icon: '👤', label: 'Profil' },
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
    <SafeAreaView style={s.root}>
      <StatusBar style="light" />
      <Text style={s.logo}>Autogram</Text>
      <View style={{ flex: 1 }}>
        {tab === 'feed' && <FeedScreen posts={posts} onLike={like} onComment={comment} />}
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
          <Pressable key={t.key} onPress={() => setTab(t.key)} style={s.tab}>
            <Text style={[s.tabIcon, tab !== t.key && { opacity: 0.45 }]}>{t.icon}</Text>
            <Text style={[s.tabLabel, tab === t.key && { color: colors.accent }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  logo: { color: colors.text, fontSize: 24, fontWeight: '800', paddingHorizontal: 16, paddingTop: 36, paddingBottom: 8 },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderColor: colors.border, paddingBottom: 12 },
  tab: { flex: 1, alignItems: 'center', paddingTop: 8 },
  tabIcon: { fontSize: 22 },
  tabLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
});
