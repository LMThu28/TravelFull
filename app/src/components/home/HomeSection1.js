import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

const HomeSection1 = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => {
          console.log('Pressed tour image');
        }}
      >
        <Image
          source={{
            uri: 'https://www.luavietours.com/wp/wp-content/uploads/2023/07/phu-quoc-tu-tren-cao.jpg'
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Khám phá Phú Quốc</Text>
            <Text style={styles.description}>Thiên đường nghỉ dưỡng</Text>
            <Text style={styles.price}>Từ 2,990,000 đ</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});

export default HomeSection1; 