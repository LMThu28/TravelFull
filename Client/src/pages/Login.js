import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Text,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useToast,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import userApi from '../apis/userApi';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(event.target);
            const values = Object.fromEntries(formData.entries());
            const response = await userApi.login(values);
            if (response.data.user.status !== "active") {
                toast({ title: 'Tài khoản chưa được kích hoạt! Vui lòng liên hệ để được kích hoạt tài khoản', status: 'error', duration: 3000, isClosable: true });
                setLoading(false);
                return;
            }
            toast({ title: 'Đăng nhập thành công', status: 'success', duration: 3000, isClosable: true });
            navigate('/');
        } catch (error) {
            toast({ title: 'Đăng nhập thất bại', description: error.message, status: 'error', duration: 3000, isClosable: true });
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        try {
            await userApi.forgotPassword({ email });
            toast({ title: 'Email đặt lại mật khẩu đã được gửi', status: 'success', duration: 3000, isClosable: true });
            onClose();
        } catch (error) {
            toast({ title: 'Lỗi', description: error.message, status: 'error', duration: 3000, isClosable: true });
        }
    };

    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Đăng nhập vào tài khoản của bạn</Heading>
                    <form onSubmit={handleLogin}>
                        <FormControl id="email" mb="4" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input name="email" type="email" placeholder="Email" />
                        </FormControl>
                        <FormControl id="password" mb="4" isRequired>
                            <FormLabel>Mật khẩu</FormLabel>
                            <InputGroup>
                                <Input 
                                    name="password" 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder="Mật khẩu" 
                                />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((prev) => !prev)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={6}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Text color={'blue.500'} onClick={onOpen} cursor="pointer">Quên mật khẩu?</Text>
                            </Stack>
                            <Button type="submit" colorScheme={'blue'} variant={'solid'} isLoading={loading}>
                                Đăng nhập
                            </Button>
                        </Stack>
                    </form>
                    <Text align={'center'}>
                        Bạn chưa có tài khoản? <Link to="/register" style={{ color: 'blue.500' }}>Đăng ký</Link>
                    </Text>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    alt={'Hình ảnh đăng nhập'}
                    objectFit={'cover'}
                    src={
                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                    }
                />
            </Flex>

            {/* Forgot Password Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Quên mật khẩu</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="forgot-email" isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleForgotPassword}>
                            Gửi
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Hủy</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
    );
};

export default Login; 