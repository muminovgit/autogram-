import React, { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import { colors } from './theme';
import { Car, Post } from './types';

type Props = {
  posts: Post[];
  cars: Car[];
  userName: string;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
  onAddCar: () => void;
};

function Stories({ cars, userName, onAddCar }: Pick<Props, 'cars' | 'userName' | 'onAddCar'>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.stories}>
      <Pressable onPress={onAddCar} style={s.story}>
        <View>
          <Avatar name={userName} size={68} />
          <View style={s.plus}>
            <Ionicons name="add" size={14} color="#fff" />
          </View>
        </View>
        <Text style={s.storyName} numberOfLines={1}>Sizning mashina</Text>
      </Pressable>
      {cars.map((c) => (
        <View key={c.id} style={s.story}>
          <Avatar name={c.brand} uri={c.photo} size={68} ring />
          <Text style={s.storyName} numberOfLines={1}>{c.brand} {c.model}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function PostCard({ post, onLike, onComment }: { post: Post } & Pick<Props, 'onLike' | 'onComment'>) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [text, setText] = useState('');

  return (
    <View style={s.card}>
      <View style={s.header}>
        <Avatar name={post.author} size={38} ring />
        <View style={{ flex: 1 }}>
          <Text style={s.author}>{post.author}</Text>
          {!!post.carLabel && <Text style={s.car}>{post.carLabel}</Text>}
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.text} />
      </View>

      <Pressable onPress={() => !post.liked && onLike(post.id)}>
        <Image source={{ uri: post.photo }} style={s.photo} />
      </Pressable>

      <View style={s.actions}>
        <Pressable onPress={() => onLike(post.id)} hitSlop={8}>
          <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={28} color={post.liked ? colors.like : colors.text} />
        </Pressable>
        <Pressable onPress={() => setOpen(!open)} hitSlop={8}>
          <Ionicons name="chatbubble-outline" size={26} color={colors.text} />
        </Pressable>
        <Ionicons name="paper-plane-outline" size={26} color={colors.text} />
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => setSaved(!saved)} hitSlop={8}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={26} color={colors.text} />
        </Pressable>
      </View>

      <View style={s.body}>
        {post.likes > 0 && <Text style={s.bold}>{post.likes} ta yoqdi</Text>}
        {!!post.caption && (
          <Text style={s.text}>
            <Text style={s.bold}>{post.author} </Text>
            {post.caption}
          </Text>
        )}
        {post.comments.length > 0 && !open && (
          <Pressable onPress={() => setOpen(true)}>
            <Text style={s.muted}>Barcha {post.comments.length} ta izohni ko'rish</Text>
          </Pressable>
        )}
        {open && post.comments.map((c) => (
          <Text key={c.id} style={s.text}>
            <Text style={s.bold}>{c.author} </Text>
            {c.text}
          </Text>
        ))}
        {open && (
          <View style={s.commentRow}>
            <TextInput value={text} onChangeText={setText} placeholder="Izoh qo'shing..." placeholderTextColor={colors.muted} style={s.input} />
            <Pressable
              onPress={() => {
                if (text.trim()) {
                  onComment(post.id, text.trim());
                  setText('');
                }
              }}
            >
              <Text style={s.send}>Joylash</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export default function FeedScreen({ posts, cars, userName, onLike, onComment, onAddCar }: Props) {
  return (
    <FlatList
      data={posts}
      keyExtractor={(p) => p.id}
      ListHeaderComponent={<Stories cars={cars} userName={userName} onAddCar={onAddCar} />}
      ListEmptyComponent={
        <View style={s.emptyBox}>
          <Ionicons name="camera-outline" size={64} color={colors.text} />
          <Text style={s.emptyTitle}>Hali postlar yo'q</Text>
          <Text style={s.muted}>Pastdagi "+" tugmasi orqali birinchi mashinangizni joylang.</Text>
        </View>
      }
      renderItem={({ item }) => <PostCard post={item} onLike={onLike} onComment={onComment} />}
    />
  );
}

const s = StyleSheet.create({
  stories: { paddingHorizontal: 12, paddingVertical: 10, gap: 14 },
  story: { width: 76, alignItems: 'center', gap: 4 },
  storyName: { color: colors.text, fontSize: 12, maxWidth: 76 },
  plus: { position: 'absolute', right: 0, bottom: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  card: { marginBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 10 },
  author: { color: colors.text, fontWeight: '700', fontSize: 14 },
  car: { color: colors.muted, fontSize: 12 },
  photo: { width: '100%', aspectRatio: 1, backgroundColor: colors.card },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 12, paddingTop: 10 },
  body: { paddingHorizontal: 12, paddingTop: 6, gap: 3 },
  bold: { color: colors.text, fontWeight: '700' },
  text: { color: colors.text, fontSize: 14, lineHeight: 19 },
  muted: { color: colors.muted, fontSize: 14 },
  commentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  input: { flex: 1, color: colors.text, backgroundColor: colors.card, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  send: { color: colors.accent, fontWeight: '700' },
  emptyBox: { alignItems: 'center', gap: 8, paddingHorizontal: 40, marginTop: 70 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
});
