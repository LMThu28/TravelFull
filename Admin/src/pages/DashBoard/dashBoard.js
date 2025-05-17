import React, { useEffect, useState } from 'react';
import {
    Card,
    Col,
    Row,
    Spin,
    Statistic,
    Radio,
    Modal
} from 'antd';
import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import airportsApiService from '../../services/airportsApiService';
import bookingsApiService from '../../services/bookingsApiService';
import categoriesApiService from '../../services/categoriesApiService';
import flightsApiService from '../../services/flightsApiService';
import hotelsApiService from '../../services/hotelsApiService';
import newsApiService from '../../services/newsApiService';
import passengersApiService from '../../services/passengersApiService';
import reservationsApiService from '../../services/reservationsApiService';
import roomsApiService from '../../services/roomsApiService';
import roomTypesApiService from '../../services/roomTypesApiService';
import tourApiService from '../../services/tourApiService';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        airports: 0,
        bookings: 0,
        categories: 0,
        flights: 0,
        hotels: 0,
        news: 0,
        passengers: 0,
        rooms: 0,
        roomTypes: 0,
    });
    const [tourStats, setTourStats] = useState({
        totalTours: 0,
        totalConfirmedBookings: 0,
        totalRevenue: '0',
    });
    const [reservationStats, setReservationStats] = useState({
        totalReservations: 0,
        statusCounts: {},
        totalConfirmedRevenue: '0',
    });
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [revenueType, setRevenueType] = useState('tours'); // 'tours' or 'reservations'
    const [revenuePeriod, setRevenuePeriod] = useState('month');
    const [revenueData, setRevenueData] = useState([]);

    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            try {
                const [
                    categories,
                    hotels,
                    news,
                    rooms,
                    roomTypes,
                    fetchedTourStats,
                    fetchedReservationStats
                ] = await Promise.all([
                    categoriesApiService.getAllCategories(),
                    hotelsApiService.getAllHotels(),
                    newsApiService.getAllNews(),
                    roomsApiService.getAllRooms(),
                    roomTypesApiService.getAllRoomTypes(),
                    tourApiService.getTourStats(),
                    reservationsApiService.getReservationStats()
                ]);

                setCounts({
                    categories: categories.length,
                    hotels: hotels.length,
                    news: news.length,
                    rooms: rooms.length,
                    roomTypes: roomTypes.length,
                });

                if (fetchedTourStats) {
                    setTourStats(fetchedTourStats);
                }
                
                if (fetchedReservationStats) {
                    setReservationStats({
                        ...fetchedReservationStats,
                        totalConfirmedRevenue: String(fetchedReservationStats.totalConfirmedRevenue || '0')
                    });
                }

            } catch (error) {
                console.error('Error fetching counts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    const fetchRevenueData = async () => {
        try {
            setLoading(true);
            let response;
            if (revenueType === 'tours') {
                response = await tourApiService.getTourRevenueStats(revenuePeriod);
            } else {
                response = await reservationsApiService.getReservationRevenueStats(revenuePeriod);
            }
            
            if (response?.data?.stats) {
                // Format the data for the chart
                const formattedData = response.data.stats.map(item => ({
                    ...item,
                    period: revenuePeriod === 'month' 
                        ? formatMonthYear(item.period)
                        : item.period.toString(),
                    revenue: parseFloat(item.revenue)
                }));

                // If there's only one data point or no data, add placeholder points
                if (formattedData.length <= 1) {
                    if (revenuePeriod === 'month') {
                        // Add previous months if data is missing
                        const today = new Date();
                        for (let i = 2; i >= 0; i--) {
                            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                            const exists = formattedData.find(item => item.period === formatMonthYear(monthYear));
                            if (!exists) {
                                formattedData.push({
                                    period: formatMonthYear(monthYear),
                                    revenue: 0,
                                    confirmed_reservations: 0
                                });
                            }
                        }
                    } else {
                        // Add previous years if data is missing
                        const currentYear = new Date().getFullYear();
                        for (let year = currentYear - 2; year <= currentYear; year++) {
                            const exists = formattedData.find(item => parseInt(item.period) === year);
                            if (!exists) {
                                formattedData.push({
                                    period: year.toString(),
                                    revenue: 0,
                                    confirmed_reservations: 0
                                });
                            }
                        }
                    }
                }

                // Sort data by period
                formattedData.sort((a, b) => {
                    if (revenuePeriod === 'month') {
                        return new Date(a.period) - new Date(b.period);
                    }
                    return parseInt(a.period) - parseInt(b.period);
                });

                setRevenueData(formattedData);
            }
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showRevenueModal) {
            fetchRevenueData();
        }
    }, [revenueType, revenuePeriod, showRevenueModal]);

    // Helper to format currency
    const formatCurrency = (value) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) {
            return '0 ₫';
        }
        return `${numberValue.toLocaleString('vi-VN')} ₫`;
    };

    // Helper function to format month-year
    const formatMonthYear = (period) => {
        const [year, month] = period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    };

    const handleShowRevenue = (type) => {
        setRevenueType(type);
        setShowRevenueModal(true);
    };

    const RevenueChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="period"
                    tick={{ fontSize: 12 }}
                    interval={0}
                />
                <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value).replace(' ₫', '')}
                />
                <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Thời gian: ${label}`}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );

    return (
        <Spin spinning={loading}>
            <div className="dashboard-container" style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Danh mục (khách sạn)" value={counts.categories} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Khách sạn" value={counts.hotels} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Phòng" value={counts.rooms} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Loại phòng" value={counts.roomTypes} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Tin tức" value={counts.news} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Tổng Đặt phòng (KS)" value={reservationStats.totalReservations} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Đặt phòng KS - Pending" value={reservationStats.statusCounts?.pending || 0} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Đặt phòng KS - Confirmed" value={reservationStats.statusCounts?.confirmed || 0} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Đặt phòng KS - Cancelled" value={(reservationStats.statusCounts?.cancelled || 0) + (reservationStats.statusCounts?.canceled || 0)} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                            style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
                            onClick={() => handleShowRevenue('reservations')}
                        >
                            <Statistic
                                title="Doanh thu Đặt phòng KS (Confirmed)"
                                value={reservationStats.totalConfirmedRevenue}
                                formatter={formatCurrency}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Tổng số Tours" value={tourStats.totalTours} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Statistic title="Đặt Tour (Đã xác nhận)" value={tourStats.totalConfirmedBookings} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card 
                            style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
                            onClick={() => handleShowRevenue('tours')}
                        >
                            <Statistic
                                title="Doanh thu Tour (Confirmed)"
                                value={tourStats.totalRevenue}
                                formatter={formatCurrency}
                            />
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title={`Biểu đồ doanh thu ${revenueType === 'tours' ? 'Tours' : 'Đặt phòng'}`}
                    open={showRevenueModal}
                    onCancel={() => setShowRevenueModal(false)}
                    width={900}
                    footer={null}
                    bodyStyle={{ padding: '20px' }}
                >
                    <div style={{ marginBottom: 20 }}>
                        <Radio.Group
                            value={revenuePeriod}
                            onChange={(e) => setRevenuePeriod(e.target.value)}
                            style={{ marginBottom: 16 }}
                        >
                            <Radio.Button value="month">3 tháng gần nhất</Radio.Button>
                            <Radio.Button value="year">Theo năm</Radio.Button>
                        </Radio.Group>
                        <div style={{ marginTop: 10, fontSize: '16px', color: '#666' }}>
                            {revenueType === 'tours' ? 'Doanh thu từ đặt Tour' : 'Doanh thu từ đặt phòng khách sạn'}
                        </div>
                    </div>
                    <RevenueChart />
                    <div style={{ marginTop: 20 }}>
                        <h3>Thống kê chi tiết:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {revenueData.map((item, index) => (
                                <li key={index} style={{ margin: '10px 0', fontSize: '14px' }}>
                                    <strong>{item.period}:</strong>
                                    <div style={{ marginLeft: 20 }}>
                                        - Doanh thu: {formatCurrency(item.revenue)}
                                        <br />
                                        - Số lượng đặt {revenueType === 'tours' ? 'tour' : 'phòng'} đã xác nhận: {item.confirmed_reservations || item.confirmed_bookings || 0}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Modal>
            </div>
        </Spin>
    );
};

export default Dashboard;