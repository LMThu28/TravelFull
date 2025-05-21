import React from 'react';
import {
    Container,
    Heading,
    Text,
    Button,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const TourBookingCancel = () => {
    const navigate = useNavigate();

    return (
        <Container maxW="container.md" centerContent py={10}>
            <Alert
                status="warning"
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
                    Thanh Toán Đã Bị Hủy
                </AlertTitle>
                <AlertDescription maxWidth="sm">
                    Bạn đã hủy quá trình thanh toán. Đặt tour của bạn chưa được hoàn tất.
                    <Button colorScheme="blue" variant="link" mt={4} onClick={() => navigate('/')}>
                        Quay về trang chủ
                    </Button>
                </AlertDescription>
            </Alert>
        </Container>
    );
};

export default TourBookingCancel; 