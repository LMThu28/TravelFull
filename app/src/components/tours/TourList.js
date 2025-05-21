import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TourList = ({ tours, isLoading }) => {
  const navigation = useNavigation();

  const renderTourItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.tourCard}
      onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
        style={styles.tourImage}
        resizeMode="cover"
      />
      <View style={styles.tourInfo}>
        <Text style={styles.tourName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.tourLocation}>{item.start_location}</Text>
        <Text style={styles.tourPrice}>
          {item.price?.toLocaleString('vi-VN')} VNĐ
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tours nổi bật</Text>
      <FlatList
        data={tours}
        renderItem={renderTourItem}
        keyExtractor={item => item.id?.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Đang tải tours...' : 'Không có tours nào.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  tourCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tourImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tourInfo: {
    padding: 12,
  },
  tourName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tourLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tourPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6CB0',
  },
  emptyContainer: {
    width: width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TourList; 