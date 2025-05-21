import React from 'react';
import { Box, Container, Flex, Heading, Text, Input, Button, Stack } from '@chakra-ui/react';

const Home4 = () => {
  return (
    <Container maxW="7xl" py={12} px={6}>
      <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }}>
        <Box width={{ base: '100%', md: '50%' }} mb={{ base: 6, md: 0 }}>
          <Heading as="h2" size="2xl" mb={4} color="black">
            Tham gia cộng đồng du lịch của chúng tôi ngay hôm nay
          </Heading>
        </Box>
        <Box width={{ base: '100%', md: '50%' }}>
          <Text mb={4} fontSize="lg" color="gray.800">
            Đăng ký nhận bản tin của chúng tôi để cập nhật những mẹo du lịch độc quyền, những ưu đãi hấp dẫn, và thông tin quan trọng nhất. Đừng bỏ lỡ bất kỳ điều gì!
          </Text>
          <Stack direction="row" spacing={4}>
            <Input placeholder="Email của bạn" size="lg" borderColor="gray.600" focusBorderColor="gray.800" />
            <Button colorScheme="blackAlpha" size="lg" _hover={{ bg: "gray.700" }}>Đăng ký</Button>
          </Stack>
          <Text fontSize="sm" color="gray.600" mt={2}>
            Bằng cách nhấp vào "Đăng ký", bạn đồng ý với điều khoản và điều kiện của chúng tôi.
          </Text>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home4;
