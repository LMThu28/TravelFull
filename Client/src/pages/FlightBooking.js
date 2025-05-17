import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    Button,
    Container,
    useToast,
    List,
    ListItem,
    HStack,
    Text,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
} from '@chakra-ui/react';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import airportsApiService from '../services/airportsApiService';
import flightsApiService from '../services/flightsApiService';
import passengersApiService from '../services/passengersApiService';
import bookingsApiService from '../services/bookingsApiService';
import { useDisclosure } from '@chakra-ui/react';

function FlightBooking() {
    const [bookingData, setBookingData] = useState({
        from: '',
        to: '',
        date: '',
        seatClass: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [stations, setStations] = useState([]);
    const [flights, setFlights] = useState([]);
    const toast = useToast();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [passengers, setPassengers] = useState([]);
    const [selectedPassengerId, setSelectedPassengerId] = useState('');
    const [ticketCount, setTicketCount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedFlight, setSelectedFlight] = useState(null);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const fetchedStations = await airportsApiService.getAllAirports();
                setStations(fetchedStations);
            } catch (error) {
                console.error('Error fetching stations:', error);
                toast({
                    title: "Error fetching stations.",
                    description: "Could not load stations. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchStations();
    }, []);

    useEffect(() => {
        const fetchPassengers = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user ? user.id : null;

            try {
                const fetchedPassengers = await passengersApiService.getPassengersByUserId(userId);
                setPassengers(fetchedPassengers);
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        };

        fetchPassengers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearchFlights = async () => {
        setIsLoading(true);
        
        // New validation check for past dates
        const selectedDate = new Date(bookingData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

        if (selectedDate < today) {
            toast({
                title: "Ngày không hợp lệ.",
                description: "Bạn không thể đặt vé cho chuyến bay trong quá khứ.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return; // Exit the function if the date is in the past
        }

        try {
            const result = await flightsApiService.searchFlightsByCriteria(
                bookingData.from,
                bookingData.to,
                bookingData.date
            );
            if (!result.success || result.data.length === 0) {
                toast({
                    title: "Không có chuyến bay.",
                    description: "Không tìm thấy chuyến bay cho ngày đã chọn.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
            }
                
            const flightsWithAirports = await Promise.all(result.data.map(async flight => {
                const departureAirport = await airportsApiService.getAirportById(flight.departure_airport_id);
                const arrivalAirport = await airportsApiService.getAirportById(flight.arrival_airport_id);
                return {
                    ...flight,
                    departureAirportName: departureAirport.name,
                    arrivalAirportName: arrivalAirport.name,
                };
            }));
            setFlights(flightsWithAirports);
        } catch (error) {
            if (!error.success) {
               return toast({
                    title: "Không có chuyến bay.",
                    description: "Không tìm thấy chuyến bay cho ngày đã chọn.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
            }
            console.error('Error searching flights:', error);
            toast({
                title: "Error searching flights.",
                description: "Could not load flights. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearchFlights();
    };

    const handleBookTicket = (flight) => {
        setSelectedFlight(flight);
        setTotalPrice(ticketCount * flight.price);
        onOpen();
    };

    const handleConfirmBooking = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast({
                title: "Chưa đăng nhập.",
                description: "Bạn cần đăng nhập để đặt vé.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return; // Thoát hàm nếu người dùng chưa đăng nhập
        }

        if (!selectedPassengerId) { // Kiểm tra nếu không có hành khách được chọn
            toast({
                title: "Chưa chọn hành khách.",
                description: "Bạn cần chọn một hành khách để tiếp tục.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return; // Thoát hàm nếu không có hành khách được chọn
        }

        const bookingData = {
            flight_id: selectedFlight.flight_id,
            passenger_id: selectedPassengerId,
            booking_date: new Date().toISOString().split('T')[0],
            status: 'confirmed',
            total_price: selectedFlight?.price,
        };

        try {
            const response = await bookingsApiService.createBooking(bookingData);
            toast({
                title: "Đặt vé thành công.",
                description: "Vé của bạn đã được đặt thành công.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            onClose();
        } catch (error) {
            toast({
                title: "Đặt vé thất bại.",
                description: "Không thể đặt vé. Vui lòng thử lại sau.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <VStack spacing={6}>
                <Heading>Đặt Vé Máy Bay</Heading>
                <Box as="form" onSubmit={handleSubmit} width="100%">
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Điểm đi</FormLabel>
                            <Select
                                name="from"
                                value={bookingData.from}
                                onChange={handleInputChange}
                                placeholder="Chọn sân bay"
                                isDisabled={isLoading}
                            >
                                {stations.map((station) => (
                                    <option
                                        key={station.airport_id}
                                        value={station.airport_id}
                                    >
                                        {station.name} - {station.code}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Điểm đến</FormLabel>
                            <Select
                                name="to"
                                value={bookingData.to}
                                onChange={handleInputChange}
                                placeholder="Chọn sân bay"
                                isDisabled={isLoading}
                            >
                                {stations.map((station) => (
                                    <option
                                        key={station.airport_id}
                                        value={station.airport_id}
                                        disabled={station.airport_id === parseInt(bookingData.from)}
                                    >
                                        {station.name} - {station.code}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Ngày bay</FormLabel>
                            <Input
                                type="date"
                                name="date"
                                value={bookingData.date}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            width="100%"
                            mt={4}
                            isLoading={isLoading}
                        >
                            Tìm chuyến bay
                        </Button>
                    </VStack>
                </Box>

                {flights.length > 0 && (
                    <Box mt={6} width="100%">
                        <Heading size="md">Kết quả tìm kiếm:</Heading>
                        <List spacing={3} mt={5}>
                            {flights.map(flight => (
                                <ListItem key={flight.flight_id} borderWidth="1px" borderRadius="lg" p={4}>
                                    <HStack spacing={4}>
                                        <Icon as={FaPlaneDeparture} boxSize={6} color="blue.500" />
                                        <Text fontWeight="bold">{flight.flight_number}</Text>
                                        <Text>{flight.departureAirportName} ({new Date(flight.departure_time).toLocaleString('vi-VN', { timeZone: 'UTC' })})</Text>
                                        <Text>→</Text>
                                        <Text>{flight.arrivalAirportName} ({new Date(flight.arrival_time).toLocaleString('vi-VN', { timeZone: 'UTC' })})</Text>
                                        <Icon as={FaPlaneArrival} boxSize={6} color="green.500" />
                                    </HStack>
                                    <Text mt={2}>Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(flight?.price)}</Text>
                                    <Button 
                                        mt={2} 
                                        colorScheme="teal" 
                                        onClick={() => handleBookTicket(flight)}
                                    >
                                        Đặt Vé
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Book Ticket</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Hành khách</FormLabel>
                            <Select
                                value={selectedPassengerId}
                                onChange={(e) => setSelectedPassengerId(e.target.value)}
                                placeholder="Chọn hành khách"
                            >
                                {passengers.map(passenger => (
                                    <option key={passenger.passenger_id} value={passenger.passenger_id}>
                                        {passenger.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl isRequired mt={4}>
                            {/* Remove the ticket count input */}
                            {/* <FormLabel>Số vé</FormLabel>
                            <Input
                                type="number"
                                value={ticketCount}
                                onChange={(e) => {
                                    const count = Math.max(1, e.target.value);
                                    setTicketCount(count);
                                    setTotalPrice(count * selectedFlight.price);
                                }}
                                min={1}
                            /> */}
                        </FormControl>
                        <Text mt={4}>Tổng giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedFlight?.price)}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleConfirmBooking}>
                            Xác nhận
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
}

export default FlightBooking; 