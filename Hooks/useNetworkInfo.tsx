import {useSelector} from 'react-redux';

const isConnectedSelector = (state: {network: {isConnected: boolean}}) =>
  state.network.isConnected;

const useNetworkInfo = () => {
  const isConnected = useSelector(isConnectedSelector);

  return {isConnected};
};

export default useNetworkInfo;
