import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLastActive } from '@/hooks/useLastActive';

interface ActivityTrackerProps {
  children: React.ReactNode;
}

export const ActivityTracker = ({ children }: ActivityTrackerProps) => {
  const location = useLocation();
  const { updateLastActive } = useLastActive();

  // Update last_active_at when route changes
  useEffect(() => {
    updateLastActive();
  }, [location.pathname, updateLastActive]);

  return <>{children}</>;
};
