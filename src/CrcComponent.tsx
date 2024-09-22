import React, { useContext, useEffect, useState } from 'react';
import {Button, Input, List, Typography, message as antdMessage, Space, Switch, Spin} from 'antd';
import CirclesSDKContext from './CirclesSDKContext';
import { Avatar, parseError } from '@circles-sdk/sdk';
const {Title, Text, Paragraph} = Typography;

const CrcComponent = () => {
  const { sdk, isConnected, initSdk, circlesAddress, personalBalance, groupBalance, avatar, updateBalances } = useContext(CirclesSDKContext);
  const [convertAmount, setConvertAmount] = useState(1);
  const [currentStatus, setCurrentStatus] = useState('');

  const handleConvertTokens = async () => {
    // setCurrentStatus('Minting personal tokens...');
    // await (avatar as unknown as Avatar).personalMint();
    setCurrentStatus('Minting group tokens...');
    await (avatar as unknown as Avatar).groupMint("0xDCA022fDed8C8Dac6Ef233B57C2c06C356FB3547", [circlesAddress ?? ""], [BigInt(convertAmount * 10 ** 18)], Uint8Array.of(0));
    setCurrentStatus('Updating balances...');
    await updateBalances();
    setCurrentStatus('');
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <hr />
          <Paragraph>Circles Address: <Text strong>{circlesAddress}</Text></Paragraph>
          <Paragraph>Convert to group tokens (Balance: <Text strong>{groupBalance.toFixed(2)}</Text> 🤝)</Paragraph>
          {currentStatus ? (<Space direction="vertical" style={{width: '100%'}}><Spin tip={currentStatus}><Text></Text></Spin></Space>) : (
            <Space direction="vertical" style={{width: '100%'}}>
              <Input
                placeholder="Enter amount to convert"
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                style={{width: '100%'}}
              />
              <Text type="secondary">Remaining personal tokens: {personalBalance.toFixed(2)} 👤</Text>
              <Button type="primary" onClick={handleConvertTokens}>
                Convert
              </Button>
            </Space>
          )}
        </div>
      ) : (
        <p>Connecting to Circles...</p>
      )}
    </div>
  );
};

export default CrcComponent;