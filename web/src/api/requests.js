import React, { useCallback, useState } from 'react';
import axios from '../axios';

const RequestsContext = React.createContext();

function RequestsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(null);

  const getRequests = useCallback(async (state) => {
    try {
      setLoading(true);
      const request = {
        method: 'GET',
        url: '/requests',
      }

      if(state) {
        request.params = { state }
      }
      const response = await axios(request);

      setRequests(response.data);  
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, []);



  const value = {
    requests,
    loading,
    hasLoaded,
    error,
    getRequests,
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
}

/**
 * @returns {{
 *  error: Error,
 *  getStudents: () => Promise<void>,
 *  getStudentById: (id: string) => object,
 *  hasLoaded: boolean,
 *  loading: boolean,
 *  students: object[],
 *  pendingInvitation: object[],
 * }}
 */
function useRequests() {
  const context = React.useContext(RequestsContext);

  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentsProvider');
  }

  if (!context.loading && !context.hasLoaded) {
    context.getRequests("PENDING");
  }

  return context;
}


export { RequestsProvider, useRequests };
