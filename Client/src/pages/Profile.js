'use client'

import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  Text,
  Divider,
  Badge,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { SmallCloseIcon, DeleteIcon } from '@chakra-ui/icons';
import reservationApi from '../services/reservationsApiService';
import passengersApi from '../services/passengersApiService';
import reservationsApi from '../services/reservationsApiService';



export default function UserProfileEdit() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: '',
  });

  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [tempPassenger, setTempPassenger] = useState({
    name: '',
    email: '',
    phone_number: '',
    nationality: '',
    passport_number: '',
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        avatar: user.image || 'https://bit.ly/sage-adebayo',
      });

      reservationApi.getReservationsByUserId(user.id)
        .then((data) => setBookings(data))
        .catch((error) => console.error('Error fetching bookings:', error));

      passengersApi.getPassengersByUserId(user.id)
        .then((data) => setPassengers(data))
        .catch((error) => console.error('Error fetching passengers:', error));
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const boxBgColor = useColorModeValue('gray.100', 'gray.600');

  const handleCreatePassenger = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      await passengersApi.createPassenger({ ...tempPassenger, user_id: user.id });
      setPassengers([...passengers, { ...tempPassenger, passenger_id: Date.now() }]);
      onClose();
      setTempPassenger({ name: '', email: '', phone_number: '', nationality: '', passport_number: '' });
    } catch (error) {
      console.error('Error creating passenger:', error);
    }
  };

  const handleDeletePassenger = async (passengerId) => {
    try {
      await passengersApi.deletePassenger(passengerId);
      setPassengers(passengers.filter(passenger => passenger.passenger_id !== passengerId));
    } catch (error) {
      console.error('Error deleting passenger:', error);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
        await reservationsApi.updateReservationStatus(reservationId, { status: 'cancelled' });
        // Update the bookings state to reflect the cancelled reservation
        setBookings(bookings.map(booking => 
            booking.reservation_id === reservationId ? { ...booking, status: 'cancelled' } : booking
        ));
    } catch (error) {
        console.error('Error canceling reservation:', error);
    }
  };

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
        <Stack spacing={4} w={'sm'}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            Hồ sơ người dùng
          </Heading>
          <FormControl id="userName">
            <FormLabel>Biểu tượng người dùng</FormLabel>
            <HStack spacing={6}>
              <Center>
                <Avatar size="xl" src={userData.avatar}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                  />
                </Avatar>
              </Center>
            </HStack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>Tên người dùng</FormLabel>
            <Input
              placeholder="Tên người dùng"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              readOnly
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Địa chỉ email</FormLabel>
            <Input
              placeholder="email@example.com"
              _placeholder={{ color: 'gray.500' }}
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              readOnly
            />
          </FormControl>
         
        </Stack>
        
        <Button onClick={onOpen}>Thêm Hành Khách</Button>
        <Stack spacing={4}>
          {passengers.map((passenger) => (
            <Box key={passenger.passenger_id} p={5} shadow="lg" borderWidth="1px" rounded="lg">
              <Text>Tên: {passenger.name}</Text>
              <Text>Email: {passenger.email}</Text>
              <Text>Số điện thoại: {passenger.phone_number}</Text>
              <Text>Quốc tịch: {passenger.nationality}</Text>
              <Text>Số hộ chiếu: {passenger.passport_number}</Text>
              <HStack justify="space-between" mt={4}>
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  aria-label="Xóa hành khách"
                  onClick={() => handleDeletePassenger(passenger.passenger_id)}
                />
              </HStack>
            </Box>
          ))}
        </Stack>
        <Divider my={6} />
        <Stack spacing={4} w={'full'}>
          <Heading size="md" mt={6}>Lịch sử đặt hotel của bạn</Heading>
          <Divider />
          <Stack spacing={4}>
            {bookings.map((booking) => (
              <Box key={booking.reservation_id} p={5} shadow="lg" borderWidth="1px" rounded="lg" bg={boxBgColor} position="relative">
                <HStack justify="space-between" align="center" mb={3}>
                  <Text fontWeight="bold" fontSize="lg">Mã Đặt Phòng: {booking.reservation_id}</Text>
                  <span>
                    {booking.status === "pending" ? <Badge colorScheme="blue">Đang chờ</Badge> :
                      booking.status === "confirmed" ? <Badge colorScheme="green">Đã xác nhận</Badge> :
                        booking.status === "cancelled" ? <Badge colorScheme="red">Đã hủy</Badge> :
                          <Badge colorScheme="gray">Không xác định</Badge>}
                  </span>
                </HStack>
                <Divider borderColor="gray.400" />
                <Stack spacing={2} mt={3}>
                  <Text>Mã Phòng: {booking.room_id}</Text>
                  <Text>Ngày Nhận Phòng: {new Date(booking.check_in_date).toLocaleDateString('vi-VN')}</Text>
                  <Text>Ngày Trả Phòng: {new Date(booking.check_out_date).toLocaleDateString('vi-VN')}</Text>
                  <Text fontWeight="bold" color="green.500" mt={2}>Tổng Giá: {formatPrice(booking.total_price)}</Text>
                  <Text fontWeight="bold" color="blue.500" mt={2}>Hình Thức Thanh Toán: PayPal</Text>
                </Stack>
                <HStack justify="space-between" mt={4}>
                  {booking.status !== "cancelled" && (
                    <Button colorScheme="red" onClick={() => handleCancelReservation(booking.reservation_id)}>
                      Hủy Phòng
                    </Button>
                  )}
                </HStack>
                <Box position="absolute" top="50%" left="-10px" transform="translateY(-50%)" bg="gray.300" w="20px" h="20px" rounded="full" />
                <Box position="absolute" top="50%" right="-10px" transform="translateY(-50%)" bg="gray.300" w="20px" h="20px" rounded="full" />
              </Box>
            ))}
          </Stack>
        </Stack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Thêm Hành Khách</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Tên</FormLabel>
                <Input
                  value={tempPassenger.name}
                  onChange={(e) => setTempPassenger({ ...tempPassenger, name: e.target.value })}
                />
                <FormLabel>Email</FormLabel>
                <Input
                  value={tempPassenger.email}
                  onChange={(e) => setTempPassenger({ ...tempPassenger, email: e.target.value })}
                />
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  value={tempPassenger.phone_number}
                  onChange={(e) => setTempPassenger({ ...tempPassenger, phone_number: e.target.value })}
                />
                <FormLabel>Quốc tịch</FormLabel>
                <Input
                  value={tempPassenger.nationality}
                  onChange={(e) => setTempPassenger({ ...tempPassenger, nationality: e.target.value })}
                />
                <FormLabel>Số hộ chiếu</FormLabel>
                <Input
                  value={tempPassenger.passport_number}
                  onChange={(e) => setTempPassenger({ ...tempPassenger, passport_number: e.target.value })}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleCreatePassenger}>
                Tạo
              </Button>
              <Button onClick={onClose} ml={3}>
                Hủy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Flex>
  );
} 