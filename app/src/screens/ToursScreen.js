import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tourApi from '../apis/tourApi';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 2 columns with 16px padding on each side and 16px gap

const ToursScreen = () => {
  const navigation = useNavigation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await tourApi.getAllTours({ page: 1, limit: 20 });
        setTours(response.data?.tours || response.data || []);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const renderTourCard = ({ item }) => (
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
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>
            {item.start_location} - {item.end_location}
          </Text>
        </View>
        <View style={styles.durationContainer}>
          <Text style={styles.durationIcon}>📅</Text>
          <Text style={styles.duration}>{item.duration} ngày</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || '4.5'}</Text>
          <Text style={styles.reviewCount}>({item.review_count || '0'})</Text>
        </View>
        <Text style={styles.price}>{item.price?.toLocaleString() || '0'} đ</Text>
      </View>
      {item.is_sale && (
        <View style={styles.saleTag}>
          <Text style={styles.saleText}>Sale</Text>
        </View>
      )}
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
        <Text style={styles.title}>Tour du lịch</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Điểm đến 🗺️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Thời gian 📅</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={tours}
        renderItem={renderTourCard}
        keyExtractor={(item) => item.id?.toString()}
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
  tourCard: {
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
  tourImage: {
    width: '100%',
    height: COLUMN_WIDTH * 0.8,
  },
  tourInfo: {
    padding: 12,
  },
  tourName: {
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
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  durationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  duration: {
    fontSize: 12,
    color: '#718096',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  saleTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
    marginTop: 4,
  },
});

export default ToursScreen; 