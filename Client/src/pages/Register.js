import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    useToast
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import userApi from '../apis/userApi';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.target);
            const values = Object.fromEntries(formData.entries());
            values.role = 'isClient';
            values.status = 'active'
            const response = await userApi.register(values);
            if (response === 'Email is exist') {
                toast({ title: 'Email đã tồn tại', status: 'error', duration: 3000, isClosable: true });
                setLoading(false);
                return;
            } else if (response === 'Phone number is exist') {
                toast({ title: 'Số điện thoại đã tồn tại', status: 'error', duration: 3000, isClosable: true });
                setLoading(false);
                return;
            }
            toast({ title: 'Đăng ký thành công', status: 'success', duration: 3000, isClosable: true });
            navigate('/login');
        } catch (error) {
            toast({ title: 'Đăng ký thất bại', description: error.message, status: 'error', duration: 3000, isClosable: true });
        }
        setLoading(false);
    };

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Đăng ký
                    </Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        để tận hưởng tất cả các tính năng thú vị của chúng tôi ✌️
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4} as="form" onSubmit={handleRegister}>
                        <HStack>
                            <Box>
                                <FormControl id="username" isRequired>
                                    <FormLabel>Tên đăng nhập</FormLabel>
                                    <Input name="username" type="text" />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl id="email" isRequired>
                                    <FormLabel>Địa chỉ email</FormLabel>
                                    <Input name="email" type="email" />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl id="password" isRequired>
                            <FormLabel>Mật khẩu</FormLabel>
                            <InputGroup>
                                <Input name="password" type={showPassword ? 'text' : 'password'} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="phone" isRequired>
                            <FormLabel>Số điện thoại</FormLabel>
                            <Input name="phone" type="text" />
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                type="submit"
                                loadingText="Đang gửi"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                isLoading={loading}>
                                Đăng ký
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Đã có tài khoản? <Link to="/login" style={{ color: 'blue.400' }}>Đăng nhập</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Register; 