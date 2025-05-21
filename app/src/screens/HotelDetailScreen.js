import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import hotelApi from '../apis/hotelApi';

const HotelDetailScreen = ({ route }) => {
  const { hotelId } = route.params;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetail = async () => {
      if (!hotelId) {
        setError('Hotel ID is missing');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching hotel with ID:', hotelId);
        const response = await hotelApi.getHotelById(hotelId);
        console.log('Hotel detail response:', response);
        
        if (response && response.success && response.data) {
          setHotel(response.data);
          setError(null);
        } else {
          setError(response?.message || 'Failed to load hotel details');
          setHotel(null);
        }
      } catch (error) {
        console.error('Failed to fetch hotel details:', error);
        setError(error?.message || 'An error occurred while fetching hotel details');
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [hotelId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!hotel) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin khách sạn</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: hotel.image || 'https://via.placeholder.com/400x300' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{hotel.name}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {hotel.rating || '4.5'}</Text>
          <Text style={styles.reviewCount}>({hotel.reviewCount || '100'} đánh giá)</Text>
        </View>

        <Text style={styles.price}>{hotel.price?.toLocaleString('vi-VN')} VNĐ/đêm</Text>
        
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Địa điểm</Text>
          <Text style={styles.location}>{hotel.address}, {hotel.city}</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{hotel.description}</Text>
        </View>

        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Tiện nghi</Text>
          {hotel.amenities?.split(',').map((amenity, index) => (
            <Text key={index} style={styles.amenity}>• {amenity.trim()}</Text>
          ))}
        </View>

        <View style={styles.policiesSection}>
          <Text style={styles.sectionTitle}>Liên hệ</Text>
          <View style={styles.policyRow}>
            <Text style={styles.policyLabel}>Điện thoại:</Text>
            <Text style={styles.policyValue}>{hotel.phone_number}</Text>
          </View>
          <View style={styles.policyRow}>
            <Text style={styles.policyLabel}>Email:</Text>
            <Text style={styles.policyValue}>{hotel.email}</Text>
          </View>
          <View style={styles.policyRow}>
            <Text style={styles.policyLabel}>Website:</Text>
            <Text style={styles.policyValue}>{hotel.website}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt phòng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F6B100',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 20,
    color: '#2B6CB0',
    fontWeight: '600',
    marginBottom: 16,
  },
  locationSection: {
    marginBottom: 24,
  },
  location: {
    fontSize: 16,
    color: '#4A5568',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A202C',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
  },
  amenitiesSection: {
    marginBottom: 24,
  },
  amenity: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
    marginBottom: 4,
  },
  policiesSection: {
    marginBottom: 24,
  },
  policyRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  policyLabel: {
    flex: 1,
    fontSize: 16,
    color: '#4A5568',
  },
  policyValue: {
    flex: 2,
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: '#2B6CB0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HotelDetailScreen; 