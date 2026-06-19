import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { ClueProvider } from '@/store/clueContext';
import './app.scss';

function App(props) {
  useEffect(() => {});

  useDidShow(() => {});

  useDidHide(() => {});

  return <ClueProvider>{props.children}</ClueProvider>;
}

export default App;
