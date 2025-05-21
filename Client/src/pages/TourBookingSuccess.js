import React, { useEffect, useState } from 'react';
import {
    Container,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
    Box,
    useToast,
    Link
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import paypalApiService from '../services/paypalApiService';
import tourApi from '../apis/tourApi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const TourBookingSuccess = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const toast = useToast();
    const [status, setStatus] = useState('processing'); // processing, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null); // State to store booking details

    useEffect(() => {
        const executeAndCreateBooking = async () => {
            const paymentId = query.get('paymentId');
            const token = query.get('token'); // Token từ PayPal
            const PayerID = query.get('PayerID');

            // Lấy thông tin booking đã lưu từ localStorage
            const pendingBookingRaw = localStorage.getItem('pendingTourBooking');
            // Lấy thông tin user từ localStorage
            const userRaw = localStorage.getItem('user');

            // Xóa ngay lập tức để tránh sử dụng lại
            localStorage.removeItem('pendingTourBooking');


            const pendingBooking = JSON.parse(pendingBookingRaw);
            const user = JSON.parse(userRaw);
            const userId = user?.id; // Lấy userId từ object user

            if (!userId) {
                setErrorMsg('Không thể xác định người dùng. Vui lòng đăng nhập lại.');
                setStatus('error');
                return;
            }


            console.log("Pending Booking Data from localStorage:", pendingBooking);
            const bookingData = {
                user_id: userId,
                tour_id: pendingBooking?.tourId, // Use tourId from localStorage
                tour_schedule_id: pendingBooking?.scheduleId, // Add scheduleId from localStorage
                number_of_adults: pendingBooking?.numAdults,
                number_of_children: pendingBooking?.numChildren,
                total_price: pendingBooking?.price * pendingBooking?.numAdults, // Use correct price
                special_requests: pendingBooking?.specialRequests,
                payment_status: 'paid', // Assuming payment is confirmed
                // Add payment details if needed by backend, e.g.:
                // paypal_payment_id: paymentId,
                // paypal_payer_id: PayerID,
                // paypal_token: token
            };
            console.log("Data being sent to createTourBooking:", bookingData);

            try {
                const createBookingResponse = await tourApi.createTourBooking(bookingData);

                console.log("Create Booking Response:", createBookingResponse);
                // Check the actual success status from the API
                if (createBookingResponse && createBookingResponse.success) {
                    setStatus('success');
                    setBookingDetails(createBookingResponse.data); // Store details only on success
                    console.log("Booking created successfully on backend:", createBookingResponse.data);
                } else {
                    // Set error status and use the message from the backend
                    setErrorMsg(createBookingResponse?.message || 'Không thể tạo booking trong hệ thống sau khi thanh toán.');
                    setStatus('error');
                    console.error("Backend failed to create booking:", createBookingResponse?.message || 'Unknown backend error');
                }
            } catch (bookingError) {
                // Handle API call errors
                console.error("Error calling createTourBooking API:", bookingError);
                setErrorMsg('Lỗi hệ thống khi tạo booking sau khi thanh toán.');
                setStatus('error');
            }

        };

        executeAndCreateBooking();
    }, []);

    return (
        <Container maxW="container.md" centerContent py={10}>
            {status === 'processing' && (
                <Box textAlign="center">
                    <Spinner size="xl" mb={4} />
                    <Heading size="md">Đang xử lý thanh toán và đặt tour...</Heading>
                    <Text>Vui lòng không đóng cửa sổ này.</Text>
                </Box>
            )}

            {status === 'success' && (
                <Alert
                    status="success"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="auto"
                    minHeight="200px"
                    p={6}
                    borderRadius="md"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Thanh Toán Hoàn Tất!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        Cảm ơn bạn đã hoàn tất thanh toán. <br />
                        {bookingDetails ? (
                            <>
                                Mã đặt tour của bạn là: <strong>{bookingDetails.id}</strong><br />
                                Số người lớn: {bookingDetails.number_of_adults} - Số trẻ em: {bookingDetails.number_of_children}<br />
                                Tổng giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingDetails.total_price)}<br />
                                Chúng tôi sẽ xử lý đơn hàng và liên hệ sớm.
                            </>
                        ) : (
                            'Thông tin chi tiết đặt tour đang được xử lý. Chúng tôi sẽ liên hệ với bạn sớm.'
                        )}
                        <Button colorScheme="teal" variant="link" display="block" mx="auto" mt={4} onClick={() => navigate('/profile')}>
                            Xem lịch sử đặt tour
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {status === 'error' && (
                <Alert
                    status="error"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    height="200px"
                    borderRadius="md"
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Đặt Tour Thất Bại!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        {errorMsg || 'Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại hoặc liên hệ hỗ trợ.'}
                        <Button colorScheme="red" variant="link" display="block" mx="auto" mt={4} onClick={() => navigate('/')}>
                            Quay về trang chủ
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
        </Container>
    );
};

export default TourBookingSuccess; 