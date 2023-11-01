import React, { useEffect } from 'react';
import {
  PermissionsAndroid
} from 'react-native';
import { btoa as encode } from "Base64";
import { StripeTerminalProvider } from '@stripe/stripe-terminal-react-native';
import axios from "axios";
import Content from './Content';

const App = () => {
  useEffect(() => {
    const init = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Stripe Terminal needs access to your location',
            buttonPositive: 'Accept',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the Location');
        } else {
          console.error(
            'Location services are required in order to connect to a reader.'
          );
        }
      } catch {}
    }
    init();
  }, []);

  const fetchTokenProvider = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `https://api.stripe.com/v1/terminal/connection_tokens`,
        data: null,
        headers: {
          Authorization: `Basic ${encode('STRIPE_AUTH_KEY')}`, // sk_live_Nom************
        },
      });
    
      return response.data.secret;
    }
    
    catch (error) {
      console.log('%c[error]', 'background: #2b0001; color: #fd7b7d', error);
    }
  };

  return (
    <StripeTerminalProvider
      logLevel="verbose"
      tokenProvider={fetchTokenProvider}
    >
      <Content />
    </StripeTerminalProvider>
  );
};

export default App;
