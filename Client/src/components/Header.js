import React from 'react';
import { Box, Flex, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = () => {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")) || {};

    return (
        <Box bg="white.500" color="white" px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Flex alignItems={'center'}>
                    <img src="https://i.ibb.co/svgGvrj/Logo.png" alt="Logo Fahasa" style={{ height: '40px', marginRight: '8px' }} />
                    <Flex display={{ base: 'none', md: 'flex' }} ml={4}>
                        <Link to="/">
                            <Button variant="link" color="black" ml={2}>Trang chủ</Button>
                        </Link>
                        <Link to="/hotels">
                            <Button variant="link" color="black" ml={4}>Khách sạn</Button>
                        </Link>
                        <Link to="/tours">
                            <Button variant="link" color="black" ml={4}>Tours</Button>
                        </Link>
                        <Link to="/services">
                            <Button variant="link" color="black" ml={4}>Địa điểm</Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="link" color="black" ml={4}>Liên hệ</Button>
                        </Link>
                        <Link to="/recommendations">
                            <Button variant="link" color="black" ml={4}>Gợi ý</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="link" color="black" ml={4}>Giới thiệu</Button>
                        </Link>
                    </Flex>
                </Flex>
                <Flex alignItems={'center'}>
                    {isAuthenticated ? (
                        <Menu>
                            <MenuButton as={Button} variant="link" color="black" display="flex" alignItems="center" h="100%">
                                <Avatar color="black" size="sm" name={user.name} src={user.avatar} mr={2} />
                                <span color="black">{user.username}</span> 
                            </MenuButton>
                            <MenuList>
                                <MenuItem color="black" onClick={() => navigate('/profile')}>Hồ sơ</MenuItem>
                                <MenuItem color="black" onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    navigate('/');
                                    window.location.reload();
                                }}>Đăng xuất</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Link to="/login">
                            <Button variant="link" color="black">Đăng nhập</Button>
                        </Link>
                    )}
                    <IconButton
                        aria-label="Open Menu"
                        icon={<HamburgerIcon />}
                        display={{ md: 'none' }}
                        onClick={() => {
                            // Logic to open a mobile menu can be added here
                        }}
                        ml={2}
                    />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;