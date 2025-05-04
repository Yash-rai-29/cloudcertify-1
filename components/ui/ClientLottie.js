'use client';

import React from 'react';
import Lottie from 'lottie-react';

/**
 * Client-side only Lottie component
 * This wrapper ensures Lottie animations only render on the client
 */
const ClientLottie = (props) => {
  return <Lottie {...props} />;
};

export default ClientLottie;
