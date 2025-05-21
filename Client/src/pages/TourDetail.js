import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    List,
    ListItem,
    Badge,
    useColorModeValue,
    Spinner,
    useToast,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Textarea,
    Select
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import tourApi from '../apis/tourApi';
import paypalApiService from '../services/paypalApiService';

const TourDetail = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const toast = useToast();
    
    // State cho thông tin booking
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [specialRequests, setSpecialRequests] = useState('');
    const [selectedScheduleId, setSelectedScheduleId] = useState('');
    
    // Move all useColorModeValue hooks to the top
    const dividerColor = useColorModeValue('gray.200', 'gray.600');
    const buttonBg = useColorModeValue('gray.900', 'gray.50');
    const buttonColor = useColorModeValue('white', 'gray.900');

    useEffect(() => {
        const fetchTourDetail = async () => {
            try {
                const response = await tourApi.getTourById(id);
                setTour(response.data);
                if (response.data?.schedules?.length > 0) {
                    setSelectedScheduleId(response.data.schedules[0].id);
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết tour:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTourDetail();
    }, [id]);

    const handleBooking = async () => {
        if (!tour || !selectedScheduleId) {
             toast({ title: "Lỗi", description: "Vui lòng chọn ngày khởi hành.", status: "warning", duration: 3000, isClosable: true });
             setBookingLoading(false);
             return;
        }
        setBookingLoading(true);

        const user = localStorage.getItem('user');
        if (!user) {
             toast({ title: "Lỗi", description: "Vui lòng đăng nhập để đặt tour.", status: "error", duration: 3000, isClosable: true });
             setBookingLoading(false);
             // Có thể thêm điều hướng đến trang login: navigate('/login');
             return;
        }

        // --- Lưu thông tin booking vào localStorage ---
        const selectedSchedule = tour.schedules.find(s => s.id === selectedScheduleId);
        const basePrice = selectedSchedule?.price || tour.price; // Get the actual price used

        const bookingInfo = {
            tourId: tour.id, // Add tourId
            scheduleId: selectedScheduleId,
            price: basePrice, // Use the actual basePrice
            numAdults: numAdults,
            numChildren: numChildren,
            specialRequests: specialRequests
        };
        localStorage.setItem('pendingTourBooking', JSON.stringify(bookingInfo));

        try {
            const exchangeRate = 25000;
            // const selectedSchedule = tour.schedules.find(s => s.id === selectedScheduleId); // Already calculated above
            // const basePrice = selectedSchedule?.price || tour.price; // Already calculated above

            const totalPriceVND = basePrice * numAdults;
            const priceInUSD = (totalPriceVND / exchangeRate).toFixed(2);

            if (priceInUSD <= 0) {
                toast({ title: "Lỗi", description: "Giá tour không hợp lệ để thanh toán.", status: "error", duration: 3000, isClosable: true });
                localStorage.removeItem('pendingTourBooking');
                setBookingLoading(false);
                return;
            }

            const paymentData = {
                price: priceInUSD,
                description: `Booking for tour: ${tour.name} - Schedule ID: ${selectedScheduleId} (${numAdults} adults, ${numChildren} children)`,
                return_url: `${window.location.origin}/tour-booking/success`, 
                cancel_url: `${window.location.origin}/tour-booking/cancel`,
            };

            const response = await paypalApiService.makePayment(paymentData);

            if (response && response.approvalUrl) {
                window.location.href = response.approvalUrl;
            } else {
                localStorage.removeItem('pendingTourBooking');
                throw new Error("Không nhận được approvalUrl từ PayPal.");
            }

        } catch (error) {
            localStorage.removeItem('pendingTourBooking');
            console.error("Lỗi khi tạo thanh toán PayPal:", error);
            toast({
                title: "Lỗi Đặt Tour",
                description: error.message || "Không thể khởi tạo thanh toán PayPal. Vui lòng thử lại.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <Container maxW={'7xl'} centerContent py={12}>
                <Spinner size="xl" />
            </Container>
        );
    }

    if (!tour) {
        return (
            <Container maxW={'7xl'} centerContent py={12}>
                <Text>Không tìm thấy thông tin tour</Text>
            </Container>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    return (
        <Container maxW={'7xl'}>
            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 18, md: 24 }}>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={tour.name}
                        src={tour.image}
                        fit={'cover'}
                        align={'center'}
                        w={'100%'}
                        h={{ base: '100%', sm: '400px', lg: '500px' }}
                    />
                </Flex>
                <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={'header'}>
                        <Heading
                            lineHeight={1.1}
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                            {tour.name}
                        </Heading>
                        <Badge 
                            colorScheme="green" 
                            fontSize="md" 
                            mt={4}
                        >
                            {tour.category_name}
                        </Badge>
                    </Box>

                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={<StackDivider borderColor={dividerColor} />}>
                        
                        <VStack spacing={{ base: 4, sm: 6 }}>
                            <Text fontSize={'lg'}>
                                {tour.description}
                            </Text>
                        </VStack>

                        <Box>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Chi tiết Tour
                            </Text>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                <List spacing={2}>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Thời gian:
                                        </Text>{' '}
                                        {tour.duration} ngày
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Điểm khởi hành:
                                        </Text>{' '}
                                        {tour.start_location}
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Điểm kết thúc:
                                        </Text>{' '}
                                        {tour.end_location}
                                    </ListItem>
                                </List>
                                <List spacing={2}>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Giá từ:
                                        </Text>{' '}
                                        <Text
                                            as={'span'}
                                            color={'blue.600'}
                                            fontWeight={'bold'}
                                            fontSize={'xl'}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(tour.price)}
                                        </Text>
                                    </ListItem>
                                </List>
                            </SimpleGrid>
                        </Box>

                        <Box>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Dịch vụ bao gồm
                            </Text>
                            <List spacing={2}>
                                {tour.included_services?.split('\n').map((service, index) => (
                                    <ListItem key={index}>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            ✓
                                        </Text>{' '}
                                        {service}
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        {tour.excluded_services && (
                            <Box>
                                <Text
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    fontWeight={'500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Dịch vụ không bao gồm
                                </Text>
                                <List spacing={2}>
                                    {tour.excluded_services.split('\n').map((service, index) => (
                                        <ListItem key={index}>
                                            <Text as={'span'} fontWeight={'bold'}>
                                                ✗
                                            </Text>{' '}
                                            {service}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {tour.notes && (
                            <Box>
                                <Text
                                    fontSize={{ base: '16px', lg: '18px' }}
                                    fontWeight={'500'}
                                    textTransform={'uppercase'}
                                    mb={'4'}>
                                    Lưu ý
                                </Text>
                                <Text>{tour.notes}</Text>
                            </Box>
                        )}

                        {/* --- Form Nhập Thông Tin Booking --- */}
                        <Box>
                             <Heading size='md' textTransform='uppercase' mb={4}>Thông tin đặt tour</Heading>
                             <Stack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='schedule'>Chọn ngày khởi hành</FormLabel>
                                    <Select 
                                        id='schedule' 
                                        placeholder='Chọn lịch trình' 
                                        value={selectedScheduleId}
                                        onChange={(e) => setSelectedScheduleId(parseInt(e.target.value))}
                                    >
                                        {tour?.schedules?.length > 0 ? (
                                            tour.schedules.map((schedule) => (
                                                <option key={schedule.id} value={schedule.id}>
                                                    {`Từ ${formatDate(schedule.start_date)} đến ${formatDate(schedule.end_date)}`}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Không có lịch trình nào</option>
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel htmlFor='numAdults'>Số người lớn</FormLabel>
                                    <NumberInput 
                                        id='numAdults' 
                                        min={1} 
                                        value={numAdults} 
                                        onChange={(valueString) => setNumAdults(parseInt(valueString) || 1)}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='numChildren'>Số trẻ em</FormLabel>
                                     <NumberInput 
                                        id='numChildren' 
                                        min={0} 
                                        value={numChildren} 
                                        onChange={(valueString) => setNumChildren(parseInt(valueString) || 0)}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor='specialRequests'>Yêu cầu đặc biệt (nếu có)</FormLabel>
                                    <Textarea 
                                        id='specialRequests'
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        placeholder='Ví dụ: ăn chay, phòng tầng cao...'
                                    />
                                </FormControl>
                             </Stack>
                        </Box>
                    </Stack>

                    <Button
                        rounded={'none'}
                        w={'full'}
                        mt={8}
                        size={'lg'}
                        py={'7'}
                        bg={buttonBg}
                        color={buttonColor}
                        textTransform={'uppercase'}
                        _hover={{
                            transform: 'translateY(2px)',
                            boxShadow: 'lg',
                        }}
                        onClick={handleBooking}
                        isLoading={bookingLoading}
                        loadingText="Đang xử lý..."
                        isDisabled={!tour?.schedules?.length > 0}
                    >
                        Đặt Tour Qua PayPal
                    </Button>
                </Stack>
            </SimpleGrid>
        </Container>
    );
}

export default TourDetail; 