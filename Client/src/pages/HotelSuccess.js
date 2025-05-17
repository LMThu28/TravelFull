import React from 'react';
import { Container, Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@chakra-ui/icons';

const HotelSuccess = () => {
    return (
        <Container maxW="container.xl" centerContent py={10}>
            <Box textAlign="center" py={10} px={6}>
                <Icon as={CheckCircleIcon} boxSize={16} color="teal.500" />
                <Heading as="h1" size="2xl" mt={6} mb={2} color="teal.600">
                    Đặt phòng thành công!
                </Heading>
                <Text fontSize="lg" color="gray.600" mt={4}>
                    Cảm ơn bạn đã đặt phòng với chúng tôi. Một email xác nhận đã được gửi đến hộp thư của bạn.
                </Text>
                <Button mt={8} colorScheme="teal" size="lg">
                    <Link to="/">Quay lại trang chủ</Link>
                </Button>
            </Box>
        </Container>
    );
};

export default HotelSuccess;