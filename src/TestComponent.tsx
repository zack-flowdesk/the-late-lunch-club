import React, { useContext, useEffect } from 'react';
import CirclesSDKContext from './CirclesSDKContext';

const TestComponent = () => {
  const { sdk, isConnected, initSdk, circlesAddress, accountBalance } = useContext(CirclesSDKContext);

  // Initialize SDK when the component mounts
  useEffect(() => {
    if (!isConnected) {
      initSdk();
    }
  }, [isConnected, initSdk]);

  return (
    <div>
      <h1>Circles SDK Integration</h1>
      {isConnected ? (
        <div>
          <p>Circles Address: {circlesAddress}</p>
          <p>CRC Balance: {accountBalance}</p>
        </div>
      ) : (
        <p>Connecting to Circles...</p>
      )}
    </div>
  );
};

export default TestComponent;