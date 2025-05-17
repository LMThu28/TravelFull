import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import hotelApi from '../apis/hotelApi';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 2 columns with 16px padding on each side and 16px gap

const HotelsScreen = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelApi.getAllHotels({ page: 1, limit: 20 });
        if (response.success && response.data) {
          setHotels(response.data);
        } else {
          console.error("Invalid hotels response format:", response);
          setHotels([]);
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const renderHotelCard = ({ item }) => (
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
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>{item.city}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || '4.5'}</Text>
          <Text style={styles.reviewCount}>({item.review_count || '0'})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2B6CB0" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Khách sạn</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Lọc 🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Sắp xếp ↓</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={hotels}
        renderItem={renderHotelCard}
        keyExtractor={(item) => item.hotel_id?.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4A5568',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hotelCard: {
    width: COLUMN_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: COLUMN_WIDTH * 0.8,
  },
  hotelInfo: {
    padding: 12,
  },
  hotelName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D3748',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F6B100',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#718096',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6CB0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HotelsScreen; 