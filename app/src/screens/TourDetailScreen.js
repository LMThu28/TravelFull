import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import tourApi from '../apis/tourApi';

const TourDetailScreen = ({ route }) => {
  const { tourId } = route.params;
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await tourApi.getTourById(tourId);
        setTour(response.data);
      } catch (error) {
        console.error('Failed to fetch tour details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [tourId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!tour) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin tour</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: tour.image || 'https://via.placeholder.com/400x300' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{tour.name}</Text>
        <Text style={styles.price}>{tour.price?.toLocaleString('vi-VN')} VNĐ</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Thời gian:</Text>
            <Text style={styles.value}>{tour.duration} ngày</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Điểm khởi hành:</Text>
            <Text style={styles.value}>{tour.start_location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Điểm kết thúc:</Text>
            <Text style={styles.value}>{tour.end_location}</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.description}>{tour.description}</Text>
        </View>

        {tour.included_services && (
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Dịch vụ bao gồm</Text>
            <Text style={styles.services}>{tour.included_services}</Text>
          </View>
        )}

        {tour.excluded_services && (
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Dịch vụ không bao gồm</Text>
            <Text style={styles.services}>{tour.excluded_services}</Text>
          </View>
        )}

        {tour.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Lưu ý</Text>
            <Text style={styles.notes}>{tour.notes}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Đặt tour</Text>
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
  price: {
    fontSize: 20,
    color: '#2B6CB0',
    fontWeight: '600',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1A202C',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#4A5568',
  },
  value: {
    flex: 2,
    fontSize: 16,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
  },
  servicesSection: {
    marginBottom: 24,
  },
  services: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
  },
  notesSection: {
    marginBottom: 24,
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2D3748',
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

export default TourDetailScreen; 