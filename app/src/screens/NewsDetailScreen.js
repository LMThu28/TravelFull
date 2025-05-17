import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const NewsDetailScreen = ({ route }) => {
  const { newsId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Chi tiết tin tức</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default NewsDetailScreen; 