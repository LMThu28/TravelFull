import React from 'react';
import { Box, Image, Flex, Container } from '@chakra-ui/react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeSection1 = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
    };

    return (
        <Container maxW="7xl" p={5}>
            <Flex justify="space-between">
                <Box textAlign="center" width="70%" position="relative" height="340px">
                    <Slider {...settings}>
                        <div>
                            <Image src="https://www.luavietours.com/wp/wp-content/uploads/2023/07/phu-quoc-tu-tren-cao.jpg" alt="Promo 1" borderRadius="md" width="98%" height="335px" objectFit="cover" />
                        </div>
                        <div>
                            <Image src="https://www.luavietours.com/wp/wp-content/uploads/2023/07/dulichPhuQuoc-1649392573-9234-1649405369.jpg" alt="Promo 2" borderRadius="md" width="98%" height="335px" objectFit="cover" />
                        </div>
                        <div>
                            <Image src="https://www.luavietours.com/wp/wp-content/uploads/2023/07/Phu-Quoc-Thien-Duong-01.jpg" alt="Promo 3" borderRadius="md" width="98%" height="335px" objectFit="cover" />
                        </div>
                    </Slider>
                </Box>
                <Flex direction="column" align="center" width="30%" height="320px">
                    <Box textAlign="center" width="100%" position="relative" mb={4} height="50%">
                        <Image src="https://ik.imagekit.io/tvlk/image/imageResource/2024/11/04/1730754191116-8681ce7e269e5837c3dbee51d4a6e82f.jpeg?tr=q-75,w-427" alt="Promo 2" borderRadius="md" height="100%" />
                    </Box>
                    <Box textAlign="center" width="100%" position="relative" height="50%">
                        <Image src="https://ik.imagekit.io/tvlk/image/imageResource/2024/09/09/1725851880666-a70a72272834f6d6382a12724af28262.jpeg?tr=q-75,w-427" alt="Promo 3" borderRadius="md" height="100%" />
                    </Box>
                </Flex>
            </Flex>
        </Container>
    );
};

export default HomeSection1;
