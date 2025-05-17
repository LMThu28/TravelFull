import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Image, Text, Container, Badge, Link, Grid, GridItem, VStack, HStack, Divider, Button, Icon, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Stack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaBed, FaUser, FaMoneyBillWave, FaWifi, FaSnowflake } from 'react-icons/fa';
import hotelsApiService from '../services/hotelsApiService';
import roomTypesApiService from '../services/roomTypesApiService';
import reservationsApiService from '../services/reservationsApiService';
import reviewsApiService from '../services/reviewsApiService';
import userApiService from '../services/userApiService';
import paypalApiService from '../services/paypalApiService';

const HotelDetail = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [averagePrice, setAveragePrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [newReviewContent, setNewReviewContent] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(1);
    const [user, setUser] = useState(null);
    const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0 });
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const userId = loggedInUser ? loggedInUser.id : null;
    const toast = useToast();

    const fetchUser = async () => {
        if (userId) {
            try {
                const allUsers = await userApiService.fetchUser();
                const userData = allUsers.find(user => user.id === userId);
                setUser(userData);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await reviewsApiService.getAllReviews();
            const filteredReviews = data.filter(review => Number(review.hotel_id) === Number(id));
            setReviews(filteredReviews);
        } catch (error) {
            console.error('Lỗi khi lấy reviews:', error);
        }
    };

    const fetchReviewStats = async () => {
        try {
            const stats = await reviewsApiService.getHotelReviewsStats(id);
            setReviewStats(stats);
        } catch (error) {
            console.error('Lỗi khi lấy thống kê đánh giá:', error);
        }
    };

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const data = await hotelsApiService.getHotelById(id);
                setHotel(data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết khách sạn:', error);
            }
        };

        const fetchRoomTypes = async () => {
            try {
                const data = await roomTypesApiService.getAllRoomTypes();
                const filteredRoomTypes = data.filter(roomType => Number(roomType.hotel_id) === Number(id));
                setRoomTypes(filteredRoomTypes);

                // Calculate average price
                const total = filteredRoomTypes.reduce((sum, roomType) => sum + parseFloat(roomType.price_per_night), 0);
                const average = total / filteredRoomTypes.length;
                setAveragePrice(average);
            } catch (error) {
                console.error('Lỗi khi lấy loại phòng:', error);
            }
        };

        fetchHotel();
        fetchRoomTypes();
        fetchReviews();
        fetchUser();
        fetchReviewStats();
    }, [id]);

    const handleRoomTypeSelect = (roomType) => {
        setSelectedRoomType(roomType);
        setTotalPrice(roomType.price_per_night);
        setIsModalOpen(true);
    };

    const calculateTotalPrice = () => {
        if (checkInDate && checkOutDate && selectedRoomType) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const today = new Date();
            
            // Check if check-in or check-out date is in the past
            if (checkIn < today || checkOut < today) {
                setTotalPrice(0);
                return;
            }

            const timeDifference = checkOut - checkIn;
            const days = timeDifference / (1000 * 3600 * 24);
            if (days > 0) {
                setTotalPrice(days * selectedRoomType.price_per_night);
            } else {
                setTotalPrice(0);
            }
        } else {
            setTotalPrice(0);
        }
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [checkInDate, checkOutDate, selectedRoomType]);

    const handleReservation = async () => {
        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Check if check-in date is in the past
        if (checkIn < today) {
            toast({
                title: "Ngày không hợp lệ",
                description: "Ngày nhận phòng không thể trong quá khứ.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Check if check-out date is before check-in date
        if (checkOut < checkIn) {
            toast({
                title: "Ngày không hợp lệ",
                description: "Ngày trả phòng không thể nhỏ hơn ngày nhận phòng.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Check if check-out date is in the past
        if (checkOut < today) {
            toast({
                title: "Ngày không hợp lệ",
                description: "Ngày trả phòng không thể trong quá khứ.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!userId) {
            toast({
                title: "Cần đăng nhập",
                description: "Bạn cần phải đăng nhập để đặt phòng.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const reservationData = {
                user_id: userId,
                room_id: selectedRoomType.room_type_id,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                total_price: totalPrice,
                status: 'confirmed',
            };

            const reservationResponse = await reservationsApiService.createReservation(reservationData);

            if (reservationResponse.message === "Room is already booked for the selected dates") {
                toast({
                    title: "Phòng đã được đặt",
                    description: "Phòng đã được đặt cho các ngày đã chọn.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Define return and cancel URLs
            const returnUrl = `${window.location.origin}/hotel-success`;
            const cancelUrl = `${window.location.origin}/hotel-cancel`;

            // Call PayPal payment API here
            const paymentResponse = await paypalApiService.makePayment({
                price: Math.max(Math.floor(totalPrice / 24000) * 2, 1),
                description: `Reservation for ${hotel.name}`,
                return_url: returnUrl,
                cancel_url: cancelUrl,
            });

            window.location.href = paymentResponse.approvalUrl;
        } catch (error) {
            console.error('Error creating reservation or processing payment:', error);
        }
    };

    const handleAddReview = async () => {
        // Add validation for rating
        if (newReviewRating < 1 || newReviewRating > 5) {
            toast({
                title: "Đánh giá không hợp lệ",
                description: "Đánh giá phải từ 1 đến 5 sao.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        try {
            const reviewData = {
                hotel_id: id,
                user_id: userId,
                content: newReviewContent,
                rating: newReviewRating,
            };

            await reviewsApiService.addReview(reviewData);
            setNewReviewContent('');
            setNewReviewRating(1);
            setIsReviewModalOpen(false);
            fetchReviews();
            fetchReviewStats();
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    if (!hotel) {
        return <Text>Đang tải...</Text>;
    }

    return (
        <Container maxW="7xl" p={5}>
            <VStack spacing={8} align="stretch">
                <Breadcrumb fontWeight="medium" fontSize="sm" mb={4}>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={RouterLink} to="/">Trang chủ</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={RouterLink} to="/hotels">Khách sạn</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>{hotel.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Grid templateColumns="2fr 1fr" gap={6}>
                    <GridItem>
                        <Image
                            src={hotel.image}
                            alt={hotel.name}
                            borderRadius="lg"
                            boxShadow="lg"
                            w="100%"
                            h="500px"
                            objectFit="cover"
                        />
                    </GridItem>
                    <GridItem>
                        <VStack align="start" spacing={4}>
                            <Heading as="h1" size="xl" color="teal.600">{hotel.name}</Heading>
                            <HStack>
                                <Icon as={FaMapMarkerAlt} color="gray.600" />
                                <Text fontSize="lg" color="gray.600">{hotel.address}, {hotel.city}</Text>
                            </HStack>
                            <Text fontSize="2xl" color="blue.600" fontWeight="bold">{averagePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                            <HStack>
                                <Badge colorScheme="green" fontSize="lg">{reviewStats.averageRating.toFixed(1)} ★</Badge>
                                <Text fontSize="lg" color="gray.700">{reviewStats.totalReviews} reviews</Text>
                            </HStack>
                            <Divider />
                            <Text fontSize="md" color="gray.700">{hotel.description}</Text>
                            <Text fontSize="md" color="gray.700">Tiện nghi: {hotel.amenities}</Text>
                            <HStack>
                                <Icon as={FaPhone} color="gray.600" />
                                <Text fontSize="md" color="gray.700">{hotel.phone_number}</Text>
                            </HStack>
                            <HStack>
                                <Icon as={FaEnvelope} color="gray.600" />
                                <Text fontSize="md" color="gray.700">
                                    <Link href={`mailto:${hotel.email}`} color="blue.500">{hotel.email}</Link>
                                </Text>
                            </HStack>
                            <HStack>
                                <Icon as={FaGlobe} color="gray.600" />
                                <Text fontSize="md" color="gray.700">
                                    <Link href={hotel.website} color="blue.500" isExternal>{hotel.website}</Link>
                                </Text>
                            </HStack>
                        </VStack>
                    </GridItem>
                </Grid>
                <Divider />
                <Box mt={2}>
                    <Heading as="h2" size="lg" mb={4} color="teal.600">Loại Phòng</Heading>
                    <Stack spacing={4}>
                        {roomTypes.map(roomType => (
                            <Box key={roomType.room_type_id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md" onClick={() => handleRoomTypeSelect(roomType)}>
                                <Text fontWeight="bold" fontSize="xl" color="teal.700">{roomType.type_name}</Text>
                                <Text fontSize="md" color="gray.700">{roomType.description}</Text>
                                <HStack spacing={3} mt={2}>
                                    <Icon as={FaBed} color="gray.600" />
                                    <Text fontSize="md" color="gray.700">Giường: {roomType.bed_type}</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={FaUser} color="gray.600" />
                                    <Text fontSize="md" color="gray.700">Số người: {roomType.occupancy}</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={FaMoneyBillWave} color="gray.600" />
                                    <Text fontSize="md" color="gray.700">Giá mỗi đêm: {Number(roomType.price_per_night).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                                </HStack>
                                <HStack spacing={3}>
                                    <Icon as={FaWifi} color="gray.600" />
                                    <Icon as={FaSnowflake} color="gray.600" />
                                    <Text fontSize="md" color="gray.700">Tiện nghi: {roomType.amenities}</Text>
                                </HStack>
                                <Button colorScheme="teal" size="md" mt={4} onClick={() => handleRoomTypeSelect(roomType)}>Đặt ngay</Button>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                <Divider />
                <Box mt={2}>
                    <Heading as="h2" size="lg" mb={4} color="teal.600">Đánh Giá Khách Sạn</Heading>
                    <Button colorScheme="teal" onClick={() => setIsReviewModalOpen(true)} mb={4} isDisabled={!userId}>Thêm Đánh Giá</Button>
                    <Stack spacing={4}>
                        {reviews.length > 0 ? (
                            reviews.map(review => (
                                <Box key={review.review_id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
                                    <Text fontWeight="bold">{review.content}</Text>
                                    <Text fontSize="sm" color="gray.600">Rating: {review.rating} ★</Text>
                                    <Text fontSize="sm" color="gray.500">Người dùng: {user ? user.username : 'Không xác định'}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text>Chưa có đánh giá nào cho khách sạn này.</Text>
                        )}
                    </Stack>
                </Box>
                <Divider />
            </VStack>

            {/* Modal for adding review */}
            <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Thêm Đánh Giá</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nội dung đánh giá</FormLabel>
                            <Input
                                value={newReviewContent}
                                onChange={(e) => setNewReviewContent(e.target.value)}
                                placeholder="Nhập nội dung đánh giá"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Đánh giá (1-5)</FormLabel>
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                value={newReviewRating}
                                onChange={(e) => setNewReviewRating(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleAddReview}>Gửi Đánh Giá</Button>
                        <Button ml={3} onClick={() => setIsReviewModalOpen(false)}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal for reservation */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Đặt Phòng</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Ngày nhận phòng</FormLabel>
                            <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Ngày trả phòng</FormLabel>
                            <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
                        </FormControl>
                        <Text mt={4}>Tổng giá: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleReservation}>Xác nhận đặt phòng</Button>
                        <Button ml={3} onClick={() => setIsModalOpen(false)}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default HotelDetail; 