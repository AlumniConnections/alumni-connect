import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadow } from '../src/theme';
import { useApp } from '../src/store/AppContext';
import { useAuth } from '../src/store/AuthContext';
import { ApiError } from '../src/api/client';
import type { RegisterPayload } from '../src/api/types';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { t, tx, lang, toggleLang } = useApp();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === 'login';

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError(t('auth_required'));
      return;
    }
    setBusy(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        const payload: RegisterPayload = {
          email: email.trim(),
          password,
          name: name.trim() || email.trim().split('@')[0],
          university: university ? { zh: university, en: university } : undefined,
          major: major ? { zh: major, en: major } : undefined,
          gradYear: gradYear ? Number(gradYear) : undefined,
          city: city || undefined,
          occupation: occupation ? { zh: occupation, en: occupation } : undefined,
        };
        await register(payload);
      }
      // On success the auth gate redirects automatically.
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : lang === 'zh' ? '出错了，请重试' : 'Something went wrong';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = () => {
    setMode('login');
    setEmail('me@alumni.app');
    setPassword('alumni123');
    setError(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.xxxl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
            <Pressable onPress={toggleLang} style={styles.langToggle} hitSlop={8}>
              <Ionicons name="language" size={15} color="#fff" />
              <Text style={styles.langToggleText}>{lang === 'zh' ? 'EN' : '中'}</Text>
            </Pressable>
            <View style={styles.logo}>
              <Text style={styles.logoText}>校</Text>
            </View>
            <Text style={styles.brand}>{t('appName')}</Text>
            <Text style={styles.brandSub}>{t('auth_subtitle')}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isLogin ? t('auth_welcome') : t('auth_welcome_new')}</Text>

            {!isLogin && (
              <Field
                icon="person-outline"
                placeholder={t('auth_name')}
                value={name}
                onChangeText={setName}
              />
            )}

            <Field
              icon="mail-outline"
              placeholder={t('auth_email')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Field
              icon="lock-closed-outline"
              placeholder={t('auth_password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              autoCapitalize="none"
              right={
                <Pressable onPress={() => setShowPw((v) => !v)} hitSlop={8}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textHint} />
                </Pressable>
              }
            />

            {!isLogin && (
              <>
                <Text style={styles.optionalLabel}>{t('auth_optional_section')}</Text>
                <Field icon="school-outline" placeholder={t('auth_university')} value={university} onChangeText={setUniversity} />
                <Field icon="book-outline" placeholder={t('auth_major')} value={major} onChangeText={setMajor} />
                <Field icon="ribbon-outline" placeholder={t('auth_gradYear')} value={gradYear} onChangeText={setGradYear} keyboardType="number-pad" />
                <Field icon="location-outline" placeholder={t('auth_city')} value={city} onChangeText={setCity} />
                <Field icon="briefcase-outline" placeholder={t('auth_occupation')} value={occupation} onChangeText={setOccupation} />
              </>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [styles.submit, (busy || pressed) && { opacity: 0.85 }]}
              onPress={submit}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{isLogin ? t('auth_login') : t('auth_register')}</Text>
              )}
            </Pressable>

            <Pressable onPress={() => { setMode(isLogin ? 'register' : 'login'); setError(null); }} hitSlop={8}>
              <Text style={styles.switchMode}>{isLogin ? t('auth_no_account') : t('auth_have_account')}</Text>
            </Pressable>

            {isLogin && (
              <Pressable onPress={fillDemo} style={styles.demoBtn} hitSlop={8}>
                <Ionicons name="sparkles-outline" size={15} color={colors.primary} />
                <Text style={styles.demoText}>{t('auth_demo_fill')}</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  icon,
  right,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={19} color={colors.textHint} />
      <TextInput
        style={styles.fieldInput}
        placeholderTextColor={colors.textHint}
        {...props}
      />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  langToggle: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    height: 34,
    borderRadius: radii.pill,
  },
  langToggleText: { color: '#fff', ...typography.label },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.maple,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...shadow.floating,
  },
  logoText: { color: '#fff', fontSize: 38, fontWeight: '800' },
  brand: { ...typography.display, color: '#fff', marginTop: spacing.md },
  brandSub: { ...typography.body, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadow.card,
  },
  cardTitle: { ...typography.title, color: colors.text, marginBottom: spacing.lg },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: spacing.md,
  },
  fieldInput: { flex: 1, ...typography.body, color: colors.text },
  optionalLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md, marginTop: spacing.xs },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FBE7EA',
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  submitText: { ...typography.h3, color: '#fff' },
  switchMode: { ...typography.bodyStrong, color: colors.primary, textAlign: 'center', marginTop: spacing.lg },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  demoText: { ...typography.label, color: colors.primary },
});
