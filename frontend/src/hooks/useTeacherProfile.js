
import { useContext } from 'react';
import { TeacherProfileContext } from '../contexts/TeacherProfileContext';

export const useTeacherProfile = () => {
  const context = useContext(TeacherProfileContext);
  if (!context) {
    throw new Error('useTeacherProfile must be used within a TeacherProfileProvider');
  }
  return context;
};
