import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, Dimensions, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tourApi from '../apis/tourApi';
import hotelApi from '../apis/hotelApi';
import newsApi from '../apis/newsApi';
import HomeSection1 from '../components/home/HomeSection1';
import TourList from '../components/tours/TourList';
import HotelList from '../components/hotels/HotelList';

// Placeholder components (you will need to create these or adapt from your web project)
// These can be developed into more complex components in separate files later.
const HomeSection3 = () => <View style={styles.placeholder}><Text>Product/Hotel Section</Text></View>;
const News = () => <View style={styles.placeholder}><Text>News Section</Text></View>;

// Re-creating Testimonial components with React Native equivalents
const Testimonial = ({ children }) => {
    return <View style={styles.testimonialContainer}>{children}</View>;
};

const TestimonialContent = ({ children }) => {
    // The arrow _after style is complex for React Native's StyleSheet.
    // For now, it's a simple styled box. You might need a library or custom drawing for the arrow.
    return (
        <View style={styles.testimonialContentContainer}>
            {children}
            <View style={styles.testimonialPointer} />
        </View>
    );
};

const TestimonialHeading = ({ children }) => {
    return (
        <Text style={styles.testimonialHeading}>{children}</Text>
    );
};

const TestimonialText = ({ children }) => {
    return (
        <Text style={styles.testimonialText}>{children}</Text>
    );
};

const TestimonialAvatar = ({ src, name, title }) => {
    return (
        <View style={styles.testimonialAvatarContainer}>
            <Image source={{ uri: src }} style={styles.avatar} />
            <View style={styles.avatarTextContainer}>
                <Text style={styles.avatarName}>{name}</Text>
                <Text style={styles.avatarTitle}>{title}</Text>
            </View>
        </View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const [tours, setTours] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [news, setNews] = useState([]);
    const [loadingTours, setLoadingTours] = useState(true);
    const [loadingHotels, setLoadingHotels] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await tourApi.getAllTours({ page: 1, limit: 10 });
                setTours(response.data?.tours || response.data || []);
            } catch (error) {
                console.error("Failed to fetch tours:", error);
                setTours([]);
            } finally {
                setLoadingTours(false);
            }
        };

        const fetchHotels = async () => {
            try {
                const response = await hotelApi.getAllHotels({ page: 1, limit: 10 });
                console.log('Hotels response:', response);
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
                setLoadingHotels(false);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await newsApi.getListNews({ page: 1, limit: 5 });
                setNews(response.data?.news || response.data || []);
            } catch (error) {
                console.error("Failed to fetch news:", error);
                setNews([]);
            } finally {
                setLoadingNews(false);
            }
        };

        fetchTours();
        fetchHotels();
        fetchNews();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollViewContainer}>
                
                {/* Placeholder for Header/Welcome message if needed */}
                {/* <Text style={styles.header}>Welcome to StayBooker App!</Text> */}

                <HomeSection1 />
                
                <View style={styles.containerPadding}>
                    <View style={styles.flashSaleContainer}>
                        <Text style={styles.flashSaleTitle}>FLASH SALE</Text>
                        <Text style={styles.flashSaleSubtitle}>Kết thúc trong 00:02:09</Text>
                    </View>
                </View>
            
                <View style={styles.sectionContainer}>
                    <TourList tours={tours} isLoading={loadingTours} />
                </View>

                <View style={styles.sectionContainer}>
                    <HotelList hotels={hotels} isLoading={loadingHotels} />
                </View>


                <View style={[styles.containerPadding, styles.customerReviewsSection]}>
                    <View style={styles.customerReviewsHeaderContainer}>
                        <Text style={styles.customerReviewsTitle}>Đánh giá từ khách hàng</Text>
                        <Text style={styles.customerReviewsSubtitle}>Chúng tôi đã nhận được nhiều phản hồi tích cực từ khách hàng về dịch vụ đặt phòng khách sạn và vé máy bay</Text>
                    </View>
                    <View style={styles.testimonialsRow}>
                        <Testimonial>
                            <TestimonialContent>
                                <TestimonialHeading>Trải nghiệm tuyệt vời</TestimonialHeading>
                                <TestimonialText>
                                    Dịch vụ đặt phòng khách sạn rất nhanh chóng và tiện lợi. Tôi đã có một kỳ nghỉ tuyệt vời nhờ vào sự hỗ trợ tận tình của đội ngũ nhân viên.
                                </TestimonialText>
                            </TestimonialContent>
                            <TestimonialAvatar
                                src={'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'}
                                name={'Nguyễn Văn A'}
                                title={'Khách hàng'}
                            />
                        </Testimonial>
                        <Testimonial>
                            <TestimonialContent>
                                <TestimonialHeading>Giao diện thân thiện</TestimonialHeading>
                                <TestimonialText>
                                    Giao diện website rất dễ sử dụng, tôi có thể tìm kiếm và đặt vé máy bay một cách dễ dàng và nhanh chóng.
                                </TestimonialText>
                            </TestimonialContent>
                            <TestimonialAvatar
                                src={'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'}
                                name={'Trần Thị B'}
                                title={'Khách hàng'}
                            />
                        </Testimonial>
                        <Testimonial>
                            <TestimonialContent>
                                <TestimonialHeading>Dịch vụ khách hàng xuất sắc</TestimonialHeading>
                                <TestimonialText>
                                    Tôi rất hài lòng với dịch vụ chăm sóc khách hàng khi đặt vé máy bay và phòng khách sạn. Nhân viên rất nhiệt tình và hỗ trợ kịp thời.
                                </TestimonialText>
                            </TestimonialContent>
                            <TestimonialAvatar
                                src={'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'}
                                name={'Lê Văn C'}
                                title={'Khách hàng'}
                            />
                        </Testimonial>
                    </View>
                </View>


            </ScrollView>
        </SafeAreaView>
    );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f2f5', // chakra gray.100 / gray.700 (dark)
    },
    scrollViewContainer: {
        flex: 1,
    },
    containerPadding: {
        paddingHorizontal: 16, // Simulating Container maxW="7xl" padding
    },
    sectionContainer: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        marginVertical: 8,
    },
    placeholder: {
        minHeight: 150, // Use minHeight for flexible content
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 8,
        padding: 10,
        marginHorizontal: 16, // Default margin for sections
    },
    flashSaleContainer: {
        backgroundColor: '#FED7D7', // chakra red.100
        padding: 16,
        borderRadius: 8,
        marginBottom: 8, // chakra mb={2}
        // For Container maxW="7xl" - we use paddingHorizontal on parent
    },
    flashSaleTitle: {
        fontSize: 20, // chakra 2xl is ~24px, using 20px for RN
        fontWeight: 'bold',
        color: '#C53030', // chakra red.600
    },
    flashSaleSubtitle: {
        fontSize: 14, // chakra sm is ~14px
        color: '#718096', // chakra gray.600
    },
    customerReviewsSection: {
        paddingVertical: 64, // chakra py={16}
        alignItems: 'center', // chakra as={Stack} spacing={12} align={'center'}
    },
    customerReviewsHeaderContainer: {
        alignItems: 'center',
        marginBottom: 48, // chakra spacing={0} and then spacing={12} for parent stack
    },
    customerReviewsTitle: {
        fontSize: 24, // Chakra Heading default size
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    customerReviewsSubtitle: {
        textAlign: 'center',
        color: '#4A5568', // chakra gray.600 / gray.400 (dark)
        fontSize: 16,
        paddingHorizontal: 20, // To keep text from spanning full width
    },
    testimonialsRow: {
        // For web: direction={{ base: 'column', md: 'row' }}
        // For RN, we might use a FlatList with horizontal={true} for md screens or simply stack vertically
        // For simplicity, stacking vertically by default here. Adapt with Dimensions API for responsiveness.
        width: '100%',
    },
    testimonialContainer: {
        marginBottom: 40, // chakra spacing={{ base: 10, md: 4, lg: 10 }}
        width: screenWidth - 32, // Full width minus padding
        alignSelf: 'center',
    },
    testimonialContentContainer: {
        backgroundColor: 'white', // chakra white / gray.800 (dark)
        padding: 32, // chakra p={8}
        borderRadius: 12, // chakra rounded={'xl'}
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25, // chakra boxShadow={'lg'}
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    testimonialPointer: {
        width: 0,
        height: 0,
        borderLeftWidth: 16,
        borderRightWidth: 16,
        borderTopWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
        position: 'absolute',
        bottom: -15,
        left: '50%',
        transform: [{ translateX: -16 }],
    },
    testimonialHeading: {
        fontSize: 20, // chakra xl is ~20px
        fontWeight: 'bold',
        marginBottom: 8,
    },
    testimonialText: {
        textAlign: 'center',
        color: '#4A5568', // chakra gray.600 / gray.400 (dark)
        fontSize: 14, // chakra sm
    },
    testimonialAvatarContainer: {
        alignItems: 'center',
        marginTop: 32, // chakra mt={8}
    },
    avatar: {
        width: 80, // chakra Avatar default size is md (48px), using a bit larger
        height: 80,
        borderRadius: 40, // make it circle
        marginBottom: 8, // chakra mb={2}
    },
    avatarTextContainer: {
        alignItems: 'center',
    },
    avatarName: {
        fontWeight: '600',
        fontSize: 16,
    },
    avatarTitle: {
        fontSize: 14,
        color: '#718096', // chakra gray.600 / gray.400 (dark)
    },
    tourItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tourItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    tourItemInfo: {
        flex: 1,
    },
    tourItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tourItemPrice: {
        fontSize: 16,
        color: '#C53030',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#F6B100',
        marginRight: 4,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    newsItemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    newsItemTitle: {
        fontSize: 18,
    },
});

export default HomeScreen; 