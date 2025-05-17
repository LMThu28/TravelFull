import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HotelList = ({ hotels, isLoading }) => {
  const navigation = useNavigation();

  const renderHotelItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => {
        console.log('Navigating to hotel with ID:', item.hotel_id);
        navigation.navigate('HotelDetail', { hotelId: item.hotel_id });
      }}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
        style={styles.hotelImage}
        resizeMode="cover"
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || '4.5'}</Text>
          <Text style={styles.reviewCount}>({item.review_count || '0'})</Text>
        </View>
        <Text style={styles.location}>{item.address}, {item.city}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Khách sạn nổi bật</Text>
      <FlatList
        data={hotels}
        renderItem={renderHotelItem}
        keyExtractor={(item) => item.hotel_id?.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  hotelCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hotelImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hotelInfo: {
    padding: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F6B100',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6CB0',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});

export default HotelList; 