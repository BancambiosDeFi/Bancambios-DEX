import ButtonComponent from '../../srm-components/Button/Button';
import { useWallet } from './wallet';

export default function WalletConnect() {
  const { connected, connect, disconnect } = useWallet();

  return (
    <div style={{ width: '' }}>
      <ButtonComponent
        type={'connect'}
        title={'Connect Wallet'}
        onClick={connected ? disconnect : connect}
        isIconVisible={false}
      />
    </div>
  );
}
