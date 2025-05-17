import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Image,
  Stack,
  Badge,
  Flex,
  Divider,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';
import categoryApi from '../apis/categoryApi';
import serviceApi from '../apis/serviceApi';

function Services() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('teal.500', 'teal.300');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await categoryApi.getListCategory();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const response = await serviceApi.getServicesByCategoryId(categoryId);
      setServices(response);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service);
    onOpen();
  };

  return (
    <Box p={8} maxW="1400px" mx="auto">
      <Heading mb={8} textAlign="center" color={headingColor}>
        Danh Mục
      </Heading>

      {/* Categories Section */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {categories.map((category) => (
          <Box
            key={category.id}
            p={6}
            shadow="lg"
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
            transition="all 0.3s"
            _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
          >
            <Heading fontSize="xl" mb={4} color={textColor}>
              {category.name}
            </Heading>
            <Divider mb={4} />
            <Button colorScheme="teal" onClick={() => handleCategoryClick(category.id)} width="full">
              Xem dịch vụ
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {/* Services Section */}
      {selectedCategory && (
        <Box mt={12}>
          <Heading size="lg" mb={6} textAlign="center" color={headingColor}>
            Địa điểm của danh mục
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {services.map((service) => (
              <Box
                key={service.id}
                p={6}
                shadow="lg"
                borderWidth="1px"
                borderRadius="lg"
                bg={bgColor}
                transition="all 0.3s"
                _hover={{ transform: 'scale(1.05)', shadow: '2xl' }}
              >
                <Stack spacing={4}>
                  <Image src={service.image} alt={service.name} borderRadius="lg" objectFit="cover" />
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                      {service.name}
                    </Text>
                    <Badge colorScheme="purple">New</Badge>
                  </Flex>
                  <Text color={descriptionColor} noOfLines={3}>
                    {service.description}
                  </Text>
                  <Button colorScheme="blue" mt={3} width="full" onClick={() => handleServiceClick(service)}>
                    Xem ngay
                  </Button>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Modal for Service Details */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedService?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedService?.image} alt={selectedService?.name} borderRadius="lg" mb={4} />
            <Text>{selectedService?.description}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Services;
