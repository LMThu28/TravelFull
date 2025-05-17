import React from 'react';
import { Box, Container, Heading, Text, Stack, Image, Divider } from '@chakra-ui/react';

const About = () => {
  return (
    <Box bg="gray.50" color="gray.700" py={10}>
      <Container maxW="6xl">
        <Stack spacing={8} align="center">
          <Heading as="h1" size="2xl" textAlign="center" color="blue.600">
            Giới thiệu về Travelfull 
          </Heading>
          <Image
            src="https://khamphaphuquoctravel.com/wp-content/uploads/2021/12/3.jpg"
            alt="TravelSphere"
            borderRadius="md"
            boxShadow="lg"
            maxW="80%"
          />
          <Divider borderColor="gray.300" />
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Chào mừng bạn đến với Travelfull, trang web đặt phòng khách sạn và vé máy bay hàng đầu. Chúng tôi cung cấp một loạt các lựa chọn từ tour du lịch và khách sạn giá rẻ, giúp bạn có những trải nghiệm du lịch tuyệt vời nhất.
          </Text>
          <Text fontSize="lg" textAlign="center" maxW="3xl">
            Tại Travelfull, chúng tôi tin rằng du lịch là cách tuyệt vời để khám phá thế giới và tạo ra những kỷ niệm đáng nhớ. Hãy cùng chúng tôi lên kế hoạch cho chuyến đi tiếp theo của bạn và tìm kiếm những ưu đãi tốt nhất.
          </Text>
          <Divider borderColor="gray.300" />
          <Text fontSize="md" textAlign="center" color="gray.500">
            "Du lịch là cách duy nhất để mua được hạnh phúc." - G. Whittier
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default About; 