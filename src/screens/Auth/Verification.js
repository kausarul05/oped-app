import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/GradientButton';
import {
    ThemedText,
    ThemedView
} from '../../components/ThemedComponents';
import { useTheme } from '../../hooks/useTheme';

export default function Verification() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59); // 59 seconds
  const [canResend, setCanResend] = useState(false);
  const navigation = useNavigation();
  
  const inputRefs = useRef([]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      setTimer(59);
      setCanResend(false);
      // Here you would trigger the resend API
    }
  };

  const handleVerify = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Header with Logo */}
          <View style={styles.headerContainer}>
            <Image
              source={require('../../../assets/images/brand.png')}
              style={styles.logo}
            />
          </View>

          {/* Title */}
          <ThemedText style={styles.title}>Verification Code</ThemedText>
          
          {/* Description */}
          <ThemedText style={styles.description}>
            Enter the verification code that we have sent to your email.
          </ThemedText>

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  {
                    borderColor: code[index] ? colors.primary : colors.border,
                    color: colors.text,
                    backgroundColor: colors.inputBackground,
                  }
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend Links Container */}
          <View style={styles.resendContainer}>
            <View style={styles.resendRow}>
              <ThemedText style={styles.resendText}>
                Didn't receive the code?{' '}
              </ThemedText>
              <TouchableOpacity 
                onPress={handleResendCode}
                disabled={!canResend}
              >
                <ThemedText 
                  style={[
                    styles.resendLink,
                    { 
                      color: canResend ? '#EE1F24' : colors.textTertiary,
                      opacity: canResend ? 1 : 0.5
                    }
                  ]}
                >
                  Resend code
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Timer */}
            {!canResend && (
              <ThemedText style={styles.timerText}>
                Resend code at 00:{timer.toString().padStart(2, '0')}
              </ThemedText>
            )}
          </View>

          {/* Continue Button */}
          <GradientButton
            title="Continue"
            onPress={handleVerify}
            loading={loading}
            variant="PRIMARY"
            size="LARGE"
            fullWidth={true}
            style={styles.continueButton}
            disabled={code.some(digit => digit === '')} // Disable if any digit is empty
          />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 70,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 12,
    fontFamily: 'CoFoRaffineBold',
    textAlign: 'center',
    letterSpacing: 2
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
    fontFamily: 'tenez',
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 1
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 12,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'CoFoRaffineBold',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'tenez',
    letterSpacing: 1,
    
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    // textDecorationLine: 'underline',
    fontFamily: 'tenez',
    color: '#EE1F24'
  },
  timerText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'tenez',
    letterSpacing: 1,
    // opacity: 0.7,
  },
  continueButton: {
    marginTop: 20,
    fontFamily: 'CoFoRaffineBold',
    fontWeight: '400'
  },
});