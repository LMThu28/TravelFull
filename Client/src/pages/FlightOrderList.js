'use client'

import {
    Badge,
    Box,
    Divider,
    Flex,
    Heading,
    HStack,
    Stack,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import bookingsApiService from '../services/bookingsApiService';

export default function FlightOrderList() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: '',
    });

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserData({
                username: user.username || '',
                email: user.email || '',
                password: '',
                avatar: user.image || 'https://bit.ly/sage-adebayo',
            });

            bookingsApiService.getBookingsByUserId(user.id)
                .then((data) => setBookings(data))
                .catch((error) => console.error('Error fetching bookings:', error));
        }
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const boxBgColor = useColorModeValue('gray.100', 'gray.600');

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={8}
                w={'full'}
                maxW={'6xl'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Stack spacing={4} w={'full'}>
                    <Heading size="md" mt={6}>Lịch sử đặt vé máy bay</Heading>
                    <Divider />
                    <Stack spacing={4}>
                        {bookings.map((booking) => (
                            <Box key={booking.booking_id} p={5} shadow="lg" borderWidth="1px" rounded="lg" bg={boxBgColor} position="relative">
                                <HStack justify="space-between" align="center" mb={3}>
                                    <Text fontWeight="bold" fontSize="lg">Mã Đặt Vé: {booking.booking_id}</Text>
                                    <span>
                                        {booking.status === "pending" ? <Badge colorScheme="blue">Đang chờ</Badge> :
                                            booking.status === "confirmed" ? <Badge colorScheme="green">Đã xác nhận</Badge> :
                                                booking.status === "cancelled" ? <Badge colorScheme="red">Đã hủy</Badge> :
                                                    <Badge colorScheme="gray">Không xác định</Badge>}
                                    </span>
                                </HStack>
                                <Divider borderColor="gray.400" />
                                <Stack spacing={2} mt={3}>
                                    <Text>Ngày Đặt: {new Date(booking.booking_date).toLocaleDateString('vi-VN')}</Text>
                                    <Text fontWeight="bold" color="green.500" mt={2}>Tổng Giá: {formatPrice(booking.total_price)}</Text>
                                    <Text fontWeight="bold" color="blue.500" mt={2}>Hình Thức Thanh Toán: PayPal</Text>
                                </Stack>
                                <Box position="absolute" top="50%" left="-10px" transform="translateY(-50%)" bg="gray.300" w="20px" h="20px" rounded="full" />
                                <Box position="absolute" top="50%" right="-10px" transform="translateY(-50%)" bg="gray.300" w="20px" h="20px" rounded="full" />
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </Stack>
        </Flex>
    );
} 