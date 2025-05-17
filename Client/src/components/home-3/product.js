import React, { useEffect, useState } from 'react';
import { Box, Image, Text, Flex, Container, Progress, Link, Badge } from '@chakra-ui/react';
import Slider from 'react-slick';
import hotelsApiService from '../../services/hotelsApiService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await hotelsApiService.getAllHotels();
                setHotels(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu khách sạn:', error);
            }
        };

        fetchHotels();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
    };

    return (
        <Container maxW="7xl" p={5}>
            <Slider {...settings}>
                {hotels.map((hotel) => (
                    <Box
                        key={hotel.id}
                        p={5}
                        bg="white"
                        boxShadow="md"
                        height="440px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        onClick={() => navigate(`/hotel/${hotel.hotel_id}`)}
                        cursor="pointer"
                    >
                        <Image src={hotel.image} alt={hotel.name} />
                        <Text mt={2} fontWeight="bold" height="50px">{hotel.name}</Text>
                        <Text>{hotel.address}, {hotel.city}</Text>
                        <Text>Đánh giá: <Badge colorScheme="green">{hotel.rating}</Badge></Text>
                    </Box>
                ))}
            </Slider>
        </Container>
    );
};

export default Product;
