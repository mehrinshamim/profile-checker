import LeftSide from './components/left';
import RightSide from './components/right';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex">
      <LeftSide />
      <RightSide />
    </div>
  );
} 