import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Card,
    CardBody,
    Image,
    Stack,
    Text,
    Badge,
    Button,
    Spinner,
    Alert,
    AlertIcon,
    Flex,
    Tag,
    useColorModeValue,
    Center,
    VStack,
    Divider,
    Select,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    FormLabel
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import tourApi from '../apis/tourApi';
import Pagination from '../components/Pagination';

// --- Constants for Filters (adjust ranges as needed) ---
const MAX_PRICE = 50000000; // Example max price (50 million VND)
const PRICE_STEP = 100000; // Example step (100k VND)
const MAX_DURATION = 30; // Example max duration (30 days)
const ITEMS_PER_PAGE = 8; // How many tours per page (frontend pagination)
const FETCH_LIMIT = 100; // How many tours to fetch initially for filtering
// -----------------------------------------------------

const Tours = () => {
    const [allTours, setAllTours] = useState([]); // Holds all fetched tours
    const [filteredTours, setFilteredTours] = useState([]); // Tours after filtering
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]); // State for categories

    // --- Frontend Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    // -------------------------------

    // --- Filter State ---
    const [selectedCategory, setSelectedCategory] = useState(''); // Category ID
    const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
    const [durationRange, setDurationRange] = useState([1, MAX_DURATION]);
    // No activeFilters state needed as filtering happens directly
    // --------------------

    const cardBg = useColorModeValue('white', 'gray.800');
    const priceColor = useColorModeValue('blue.600', 'blue.300');
    const sidebarBg = useColorModeValue('gray.50', 'gray.700');

    // --- Initial Data Fetch (Categories and Large Batch of Tours) ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch Categories
                const catResponse = await tourApi.getAllTourCategories();
                // Check response structure based on your API
                if (catResponse.data && catResponse.data) {
                    setCategories(catResponse.data || []);
                } else if (Array.isArray(catResponse.data)) {
                     setCategories(catResponse.data);
                } else {
                     console.error("Unexpected category response structure:", catResponse);
                     setCategories([]);
                }

                // Fetch large batch of tours for filtering
                const tourResponse = await tourApi.getAllTours(1, FETCH_LIMIT);

                console.log(tourResponse);
                // Check response structure
                if (tourResponse.data ) {
                    setAllTours(tourResponse.data.tours || []);
                }

            } catch (err) {
                setError(err.message || 'Failed to load initial data');
                console.error("Error fetching initial data:", err);
                setAllTours([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []); // Run only once on mount
    // -----------------------------------------------------------

    // --- Frontend Filtering Logic ---
    useEffect(() => {
        let tempFiltered = [...allTours];

        // Apply Category Filter
        if (selectedCategory) {
            tempFiltered = tempFiltered.filter(tour => tour.category_id === parseInt(selectedCategory));
        }

        // Apply Price Filter
        tempFiltered = tempFiltered.filter(tour => {
            const price = parseFloat(tour.price);
            if (isNaN(price)) return false; // Exclude tours with invalid price
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Apply Duration Filter
        tempFiltered = tempFiltered.filter(tour => {
            const duration = parseInt(tour.duration);
            if (isNaN(duration)) return false; // Exclude tours with invalid duration
            return duration >= durationRange[0] && duration <= durationRange[1];
        });

        setFilteredTours(tempFiltered);
        setCurrentPage(1); // Reset to page 1 when filters change

    }, [allTours, selectedCategory, priceRange, durationRange]);
    // -------------------------------

    // --- Frontend Pagination Calculations ---
    const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);
    const displayedTours = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredTours.slice(startIndex, endIndex);
    }, [filteredTours, currentPage]);
    // -------------------------------------

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
             setCurrentPage(newPage);
        }
    };

    const formatPrice = (price) => {
         const numericPrice = parseFloat(price);
         if (isNaN(numericPrice)) return 'N/A';
         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
    };

    // --- Filter Reset Handler ---
    const handleResetFilters = () => {
        setSelectedCategory('');
        setPriceRange([0, MAX_PRICE]);
        setDurationRange([1, MAX_DURATION]);
        // No need to call API, filtering useEffect will re-run
    };
    // ---------------------------

    // --- Sidebar Component ---
    const FilterSidebar = () => (
        <Box
            w={{ base: 'full', md: '280px' }}
            bg={sidebarBg}
            p={5}
            borderRadius="lg"
            shadow="sm"
            alignSelf="flex-start"
            position={{ base: 'relative', md: 'sticky' }}
            top={{ base: 'auto', md: '80px' }}
            h="fit-content"
        >
            <Heading size="md" mb={4}>Bộ Lọc</Heading>
            <VStack spacing={6} align="stretch">
                {/* Category Filter */}
                <Box>
                    <FormLabel htmlFor="category-select">Danh Mục Tour</FormLabel>
                    <Select
                        id="category-select"
                        placeholder="Tất cả danh mục"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        size="sm"
                    >
                        {categories.map(cat => (
                            // Ensure cat.id and cat.name exist based on your API response
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </Select>
                </Box>
                <Divider />
                {/* Price Filter */}
                <Box>
                    <FormLabel>Khoảng Giá</FormLabel>
                    <RangeSlider
                        aria-label={['min', 'max']}
                        min={0}
                        max={MAX_PRICE}
                        step={PRICE_STEP}
                        value={priceRange}
                        onChange={(val) => setPriceRange(val)}
                    >
                        <RangeSliderTrack><RangeSliderFilledTrack /></RangeSliderTrack>
                        <RangeSliderThumb index={0} />
                        <RangeSliderThumb index={1} />
                    </RangeSlider>
                    <Flex justify="space-between" mt={2}>
                        <Text fontSize="xs">{formatPrice(priceRange[0])}</Text>
                        <Text fontSize="xs">{formatPrice(priceRange[1])}</Text>
                    </Flex>
                </Box>
                <Divider />
                {/* Duration Filter */}
                 <Box>
                    <FormLabel>Thời Gian (ngày)</FormLabel>
                    <RangeSlider
                        aria-label={['min', 'max']}
                        min={1}
                        max={MAX_DURATION}
                        step={1}
                        value={durationRange}
                        onChange={(val) => setDurationRange(val)}
                    >
                        <RangeSliderTrack><RangeSliderFilledTrack /></RangeSliderTrack>
                        <RangeSliderThumb index={0} />
                        <RangeSliderThumb index={1} />
                    </RangeSlider>
                    <Flex justify="space-between" mt={2}>
                        <Text fontSize="xs">{durationRange[0]} ngày</Text>
                        <Text fontSize="xs">{durationRange[1]} ngày</Text>
                    </Flex>
                </Box>
                <Divider />
                {/* Reset Button */}
                {/* Apply button removed as filtering is now reactive */}
                <Button variant="outline" onClick={handleResetFilters} size="sm">Xóa Bộ Lọc</Button>
            </VStack>
        </Box>
    );
    // -----------------------

    return (
        <Container maxW="container.xl" py={10}>
            <Heading as="h1" size="xl" mb={8} textAlign="center">
                Khám Phá Các Tour Du Lịch Hấp Dẫn
            </Heading>

            <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
                {/* Sidebar */}
                <FilterSidebar />

                {/* Main Content Area */}
                <Box flex="1">
                    {loading && (
                        <Center h="40vh">
                            <Spinner size="xl" />
                        </Center>
                    )}

                    {error && (
                        <Alert status="error" borderRadius="md">
                            <AlertIcon />
                            {error}
                        </Alert>
                    )}

                    {!loading && !error && displayedTours.length === 0 && (
                         <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            Không tìm thấy tour nào phù hợp.
                        </Alert>
                    )}

                    {!loading && !error && displayedTours.length > 0 && (
                        <>
                            <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing={6} mb={10}>
                                {displayedTours.map((tour) => (
                                    <Card key={tour.id} bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}>
                                        <Image
                                            src={tour.image || 'https://via.placeholder.com/400x250?text=Tour+Image'}
                                            alt={tour.name}
                                            objectFit="cover"
                                            h="200px"
                                            w="100%"
                                        />
                                        <CardBody>
                                            <Stack spacing="3">
                                                <Flex justify="space-between" align="center">
                                                    <Heading size="md" noOfLines={2}>{tour.name}</Heading>
                                                    {tour.category_name && <Tag size="sm" colorScheme="teal">{tour.category_name}</Tag>}
                                                </Flex>
                                                <Text color="gray.600" fontSize="sm">
                                                    {tour.duration} ngày | {tour.start_location ? `Từ ${tour.start_location}` : ''}
                                                </Text>
                                                <Text color={priceColor} fontSize="xl" fontWeight="bold">
                                                    {formatPrice(tour.price)}
                                                </Text>
                                                <Button
                                                    as={RouterLink}
                                                    to={`/tour/${tour.id}`}
                                                    variant="solid"
                                                    colorScheme="blue"
                                                    size="sm"
                                                    mt={2}
                                                >
                                                    Xem Chi Tiết
                                                </Button>
                                            </Stack>
                                        </CardBody>
                                    </Card>
                                ))}
                            </SimpleGrid>

                            {/* Frontend Pagination */}
                            {totalPages > 1 && (
                                <Center>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </Center>
                            )}
                        </>
                    )}
                </Box> {/* End Main Content Area */}
            </Flex> {/* End Layout Flex */}
        </Container>
    );
};

export default Tours; 