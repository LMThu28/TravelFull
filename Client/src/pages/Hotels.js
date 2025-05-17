import React, { useEffect, useState } from 'react';
import { Box, Text, Spinner, Input, Select, Button, Grid, GridItem, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import hotelsApiService from '../services/hotelsApiService';
import reviewsApiService from '../services/reviewsApiService';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hotelsPerPage] = useState(5); // Số khách sạn mỗi trang
    const [filters, setFilters] = useState({
        city: '',
        rating: '',
        name: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await hotelsApiService.getAllHotels();
                setHotels(data);

                // Fetch review stats for each hotel
                const updatedHotels = await Promise.all(data.map(async (hotel) => {
                    const stats = await reviewsApiService.getHotelReviewsStats(hotel.hotel_id); // Assuming hotel.id is the correct identifier
                    return { ...hotel, totalReviews: stats.totalReviews, averageRating: stats.averageRating };
                }));

                setHotels(updatedHotels);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khách sạn:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleHotelClick = (hotelId) => {
        navigate(`/hotel/${hotelId}`);
    };

    const filteredHotels = hotels.filter(hotel => {
        return (
            (filters.city === '' || hotel.city.toLowerCase().includes(filters.city.toLowerCase())) &&
            (filters.rating === '' || hotel.averageRating === parseInt(filters.rating)) &&
            (filters.name === '' || hotel.name.toLowerCase().includes(filters.name.toLowerCase()))
        );
    });

    const indexOfLastHotel = currentPage * hotelsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
    const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
    const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Box p={8}>
            <Grid templateColumns="1fr 3fr" gap={6}>
                <GridItem>
                    <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                        <Text fontSize="xl" mb={4}>Bộ lọc</Text>
                        <Input
                            placeholder="Tên khách sạn"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            mb={4}
                        />
                        <Input
                            placeholder="Thành phố"
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            mb={4}
                        />
                        <Select
                            placeholder="Xếp hạng"
                            name="rating"
                            value={filters.rating}
                            onChange={handleFilterChange}
                            mb={4}
                        >
                            <option value="1">1 Sao</option>
                            <option value="2">2 Sao</option>
                            <option value="3">3 Sao</option>
                            <option value="4">4 Sao</option>
                            <option value="5">5 Sao</option>
                        </Select>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box>
                        <Text fontSize="2xl" mb={4}>Danh sách khách sạn</Text>
                        {currentHotels.map(hotel => (
                            <Box
                                key={hotel.id}
                                p={4}
                                borderWidth={1}
                                borderRadius="md"
                                mb={4}
                                display="flex"
                                alignItems="center"
                                boxShadow="md"
                                cursor="pointer"
                                onClick={() => handleHotelClick(hotel.hotel_id)}
                                _hover={{ bg: 'gray.100' }}
                            >
                                <Image src={hotel.image} alt={hotel.name} boxSize="100px" borderRadius="md" mr={4} />
                                <Box>
                                    <Text fontSize="xl" fontWeight="bold">{hotel.name}</Text>
                                    <Text>{hotel.description}</Text>
                                    <Text>Địa chỉ: {hotel.address}, {hotel.city}</Text>
                                    <Text>Xếp hạng: {hotel.averageRating > 0 ? `${hotel.averageRating} Sao` : 'Chưa có xếp hạng'}</Text>
                                    <Text>Tiện nghi: {hotel.amenities}</Text>
                                </Box>
                            </Box>
                        ))}
                        <Box mt={4} display="flex" justifyContent="space-between">
                            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                Trước
                            </Button>
                            <Text>Trang {currentPage} của {totalPages}</Text>
                            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Tiếp theo
                            </Button>
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Hotels; 