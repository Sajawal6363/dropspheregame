import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface Settings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  language: string;
}

const defaultSettings: Settings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  language: "en",
};

export const [SettingsContext, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem("dropsphere_settings");
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (!isLoading) {
      const saveSettings = async () => {
        try {
          await AsyncStorage.setItem(
            "dropsphere_settings",
            JSON.stringify(settings),
          );
        } catch (error) {
          console.error("Error saving settings:", error);
        }
      };

      void saveSettings();
    }
  }, [settings, isLoading]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const setMusicEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, musicEnabled: enabled }));
  }, []);

  const setVibrationEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, vibrationEnabled: enabled }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return useMemo(
    () => ({
      ...settings,
      isLoading,
      setSoundEnabled,
      setMusicEnabled,
      setVibrationEnabled,
      setLanguage,
      resetSettings,
    }),
    [
      settings,
      isLoading,
      setSoundEnabled,
      setMusicEnabled,
      setVibrationEnabled,
      setLanguage,
      resetSettings,
    ],
  );
});
