import React, { useEffect, useState } from 'react';
import { Box, Image, Text, Flex, Container, Badge } from '@chakra-ui/react';
import Slider from 'react-slick';
import tourApi from '../../apis/tourApi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const TourList = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await tourApi.getAllTours(1, 8); // Lấy 8 tours cho slider
                setTours(response.data.tours);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu tours:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    if (loading) {
        return (
            <Container maxW="7xl" p={5}>
                <Text>Đang tải...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="7xl" p={5}>
            <Text fontSize="2xl" fontWeight="bold" mb={5}>Tour Du Lịch Nổi Bật</Text>
            <Slider {...settings}>
                {tours.map((tour) => (
                    <Box
                        key={tour.id}
                        p={4}
                        bg="white"
                        boxShadow="lg"
                        borderRadius="lg"
                        height="450px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        onClick={() => navigate(`/tour/${tour.id}`)}
                        cursor="pointer"
                        m={2}
                        _hover={{
                            transform: 'translateY(-5px)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Box position="relative" height="250px" overflow="hidden" borderRadius="md">
                            <Image 
                                src={tour.image} 
                                alt={tour.name}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                            />
                            <Badge
                                position="absolute"
                                top={2}
                                right={2}
                                colorScheme="green"
                                fontSize="sm"
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                {tour.category_name}
                            </Badge>
                        </Box>
                        
                        <Box p={2}>
                            <Text 
                                fontWeight="bold" 
                                fontSize="lg" 
                                noOfLines={2}
                                height="60px"
                            >
                                {tour.name}
                            </Text>
                            
                            <Flex justify="space-between" align="center" mt={2}>
                                <Box>
                                    <Text fontSize="sm" color="gray.600">
                                        Thời gian: {tour.duration} ngày
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Khởi hành: {tour.start_location}
                                    </Text>
                                </Box>
                                <Box textAlign="right">
                                    <Text fontSize="sm" color="gray.500">Từ</Text>
                                    <Text 
                                        fontSize="lg" 
                                        fontWeight="bold" 
                                        color="blue.600"
                                    >
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(tour.price)}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Container>
    );
};

export default TourList; 