import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const isDarkMode = true;

const backgroundStyle = {
  backgroundColor: Colors.darker,
};

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const Content = () => {
  const { initialize, discoverReaders, discoveredReaders, connectBluetoothReader, isInitialized, cancelDiscovering } = useStripeTerminal({
    didUpdateDiscoveredReaders: (readers) => {
      // After the SDK discovers a reader, your app can connect to it.
    },
  });

  useEffect(() => {
    initialize({ logLevel: 'verbose' });
    console.log('[INITIALIZE]')
  }, [initialize]);

  useEffect(() => {
    if (!!discoveredReaders.length)
      handleConnectBluetoothReader(discoveredReaders[0]);
  }, [discoveredReaders]);

  const handleDiscoverReaders = async () => {
    if (!isInitialized) return;
      
    console.log('[DISCOVER READERS]')
    // The list of discovered readers is reported in the `didUpdateDiscoveredReaders` method
    // within the `useStripeTerminal` hook.
    const { error } = await discoverReaders({
      discoveryMethod: 'bluetoothScan',
    });

    if (error) {
      console.log('[DISCOVER READERS]', error?.message)
      cancelDiscovering();
    }

    else console.log('[DISCOVER READER]', 'READER FOUND')
  };

  const handleConnectBluetoothReader = async selectedReader => {
    try {
      console.log('[SELECTED READER]', selectedReader.serialNumber);

      // And with the next command app crashes; can't even catch and error
      const { reader, error } = await connectBluetoothReader({
        reader: selectedReader,
        locationId: 'LOCATION_ID' // 'tml_b87**********************'
      });

      if (error) {
        console.log('[CONNECT error]', error.message)
        cancelDiscovering();
      }

      else console.log('[CONNECT SUCCESS: READER]', reader);
    }
    
    catch (error) {
      console.log('%c[error connecting]', 'background: #2b0001; color: #fd7b7d', error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Sample App Get molo">
            Connect via Bluetooth test. Check console
          </Section>
          <Button
            title='Search readers'
            onPress={handleDiscoverReaders}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Content;