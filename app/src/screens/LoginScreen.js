import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import userApi from '../apis/userApi';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await userApi.login(formData);
      if (response.user.status !== "active") {
        alert('Tài khoản chưa được kích hoạt! Vui lòng liên hệ để được kích hoạt tài khoản');
        setLoading(false);
        return;
      }
      alert('Đăng nhập thành công');
      navigation.navigate('Home');
    } catch (error) {
      alert('Đăng nhập thất bại: ' + error.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    try {
      await userApi.forgotPassword({ email: forgotEmail });
      alert('Email đặt lại mật khẩu đã được gửi');
      setShowForgotPassword(false);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng nhập vào tài khoản của bạn</Text>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                />
              </View>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => setShowForgotPassword(true)}
              >
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerText}>
                  Bạn chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>

      <Modal
        visible={showForgotPassword}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quên mật khẩu</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={handleForgotPassword}
              >
                <Text style={styles.modalButtonText}>Gửi</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowForgotPassword(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Hủy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#3182CE',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3182CE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerTextBold: {
    color: '#3182CE',
    fontWeight: '600',
  },
  backgroundImage: {
    flex: 1,
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#3182CE',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
  },
});

export default LoginScreen; 