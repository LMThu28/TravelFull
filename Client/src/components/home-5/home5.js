import React, { useState, useEffect } from 'react';
import { Box, Text, Container, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, useDisclosure, Flex, Heading } from '@chakra-ui/react';
import Slider from 'react-slick';
import newsApi from '../../apis/newsApi';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const News = () => {
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await newsApi.getListNews();
                setNewsList(response.data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };
        fetchNews();
    }, []);

    const handleNewsClick = (news) => {
        setSelectedNews(news);
        onOpen();
    };

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
            <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.500">
                Danh Sách Tin Tức
            </Heading>
            <Slider {...settings}>
                {newsList.map((news) => (
                    <Box
                        key={news.id}
                        p={5}
                        bg="white"
                        overflow="hidden"
                        onClick={() => handleNewsClick(news)}
                        cursor="pointer"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
                    >
                        <Box height="200px" width="100%" overflow="hidden" borderRadius="md">
                            <Image src={news.image} alt={news.name} objectFit="cover" width="100%" height="100%" />
                        </Box>
                        <Text mt={3} fontWeight="bold" fontSize="lg" color="teal.600">{news.name}</Text>
                    </Box>
                ))}
            </Slider>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedNews?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center">
                            <Image src={selectedNews?.image} alt={selectedNews?.name} mb={4} borderRadius="md" />
                            <Text fontSize="md" color="gray.700">{selectedNews?.description}</Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default News;
