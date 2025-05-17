import React from 'react';
import { Box, Image, Text, Button, Flex, Container, Heading, Stack } from '@chakra-ui/react';

const PromotionalSection = () => {
    return (
        <Container maxW="7xl" p={8} >
            <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }}>
                <Box width={{ base: '100%', md: '50%' }} mb={{ base: 6, md: 0 }}>
                    <Text fontSize="sm" color="black" mb={2}>Khám phá</Text>
                    <Heading as="h2" size="2xl" mb={4} color="black">
                        Người bạn đồng hành hoạch định chuyến du lịch tối ưu của bạn
                    </Heading>
                    <Text fontSize="lg" mb={6} color="black">
                        Khám phá niềm vui của việc lên kế hoạch du lịch liền mạch với trang web của chúng tôi. Tận hưởng những hành trình được cá nhân hóa, phù hợp riêng cho bạn.
                    </Text>
                    <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} mb={6}>
                        <Box>
                            <Heading as="h3" size="md" color="black">Hành trình tùy chỉnh</Heading>
                            <Text color="black">Thiết kế hành trình hoàn hảo của bạn với các lựa chọn linh hoạt và hành trình chi tiết.</Text>
                        </Box>
                        <Box>
                            <Heading as="h3" size="md" color="black">Giá tốt nhất</Heading>
                            <Text color="black">Thiết kế hành trình hoàn hảo của bạn với các lựa chọn linh hoạt và hành trình chi tiết.</Text>
                        </Box>
                    </Stack>
                </Box>
                <Box width={{ base: '100%', md: '45%' }}>
                    <Image src="https://khamphaphuquoctravel.com/wp-content/uploads/2021/12/3.jpg" alt="Travel" borderRadius="lg" boxShadow="lg" />
                </Box>
            </Flex>
        </Container>
    );
};

export default PromotionalSection;
