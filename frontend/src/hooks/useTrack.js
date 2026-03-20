import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const useTrack = () => {
  const { user } = useAuth();
  const location = useLocation();

  const track = useCallback((element, meta = {}) => {
    api.post('/track', {
      page: location.pathname,
      element,
      meta,
      userId: user?._id || null,
    }).catch(() => {});
  }, [location.pathname, user]);

  return track;
};

export default useTrack;
