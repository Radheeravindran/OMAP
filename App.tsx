import "react-native-url-polyfill/auto";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { supabase, isSupabaseConfigured } from "./src/lib/supabase";
import AuthScreen from "./src/screens/AuthScreen";
import MainTabs from "./src/navigation/MainTabs";

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#ea580c" />
    </View>
  );
}

export default function App() {
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null);
      setReady(true);
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 3000);
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!cancelled) {
          setSession(s ?? null);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSession(null);
          setReady(true);
        }
      })
      .finally(() => clearTimeout(timeout));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null));
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((raw) => {
      if (!raw) return;
      try {
        if (raw.startsWith("zlip://")) {
          const parsed = Linking.parse(raw);
          const u = parsed.queryParams?.url;
          setInitialUrl(typeof u === "string" ? decodeURIComponent(u) : raw);
        } else {
          setInitialUrl(raw);
        }
      } catch {
        setInitialUrl(raw);
      }
    });
    const sub = Linking.addEventListener("url", ({ url }) => {
      try {
        if (url.startsWith("zlip://")) {
          const parsed = Linking.parse(url);
          const u = parsed.queryParams?.url;
          setInitialUrl(typeof u === "string" ? decodeURIComponent(u) : url);
        } else {
          setInitialUrl(url);
        }
      } catch {
        setInitialUrl(url);
      }
    });
    return () => sub.remove();
  }, []);

  if (!ready) {
    return (
      <>
        <LoadingScreen />
        <StatusBar style="dark" />
      </>
    );
  }

  return (
    <NavigationContainer>
      {session ? (
        <MainTabs initialSharedUrl={initialUrl ?? undefined} />
      ) : (
        <AuthScreen />
      )}
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafaf9",
  },
});
