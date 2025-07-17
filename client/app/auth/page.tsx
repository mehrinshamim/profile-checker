import LeftSide from './components/left';
import RightSide from './components/right';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex relative">
      <LeftSide />
      <RightSide />
    
     
    </div>
  );
} 