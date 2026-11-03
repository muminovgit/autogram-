import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from './theme';
import { Post } from './types';

type Props = {
  posts: Post[];
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
};

function PostCard({ post, onLike, onComment }: { post: Post } & Omit<Props, 'posts'>) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{post.author.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={s.author}>{post.author}</Text>
          {!!post.carLabel && <Text style={s.car}>🚗 {post.carLabel}</Text>}
        </View>
      </View>
      <Image source={{ uri: post.photo }} style={s.photo} />
      <View style={s.actions}>
        <Pressable onPress={() => onLike(post.id)}>
          <Text style={s.action}>{post.liked ? '❤️' : '🤍'} {post.likes}</Text>
        </Pressable>
        <Pressable onPress={() => setOpen(!open)}>
          <Text style={s.action}>💬 {post.comments.length}</Text>
        </Pressable>
      </View>
      {!!post.caption && (
        <Text style={s.caption}>
          <Text style={s.author}>{post.author} </Text>
          {post.caption}
        </Text>
      )}
      {open && (
        <View style={s.comments}>
          {post.comments.map((c) => (
            <Text key={c.id} style={s.comment}>
              <Text style={s.author}>{c.author} </Text>
              {c.text}
            </Text>
          ))}
          <View style={s.commentRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Izoh yozing..."
              placeholderTextColor={colors.muted}
              style={s.input}
            />
            <Pressable
              onPress={() => {
                if (text.trim()) {
                  onComment(post.id, text.trim());
                  setText('');
                }
              }}
            >
              <Text style={s.send}>Yuborish</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default function FeedScreen({ posts, onLike, onComment }: Props) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      contentContainerStyle={{ paddingBottom: 24 }}
      ListEmptyComponent={
        <Text style={s.empty}>Hali postlar yo'q.{'\n'}"+" tugmasi orqali birinchi mashinangizni joylang!</Text>
      }
      renderItem={({ item }) => <PostCard post={item} onLike={onLike} onComment={onComment} />}
    />
  );
}

const s = StyleSheet.create({
  card: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 12, marginBottom: 8 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  author: { color: colors.text, fontWeight: '700' },
  car: { color: colors.muted, fontSize: 12 },
  photo: { width: '100%', aspectRatio: 1, backgroundColor: colors.card },
  actions: { flexDirection: 'row', gap: 18, padding: 12 },
  action: { color: colors.text, fontSize: 16 },
  caption: { color: colors.text, paddingHorizontal: 12 },
  comments: { paddingHorizontal: 12, paddingTop: 8, gap: 4 },
  comment: { color: colors.text },
  commentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  input: { flex: 1, color: colors.text, backgroundColor: colors.card, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  send: { color: colors.accent, fontWeight: '700' },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 80, lineHeight: 22 },
});
