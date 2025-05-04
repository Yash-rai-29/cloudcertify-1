import { useState, useCallback } from 'react';
import axios from 'axios';
import { useLoading } from '../contexts/LoadingContext';

/**
 * Custom hook for making API calls with integrated loading state management
 * @returns {Object} API utility functions with loading state handling
 */
export const useApi = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { startLoading, stopLoading } = useLoading();

  /**
   * Make a GET request with automatic loading state handling
   * @param {string} url - The endpoint URL
   * @param {Object} config - Axios request configuration
   * @returns {Promise} Promise resolving to the response data
   */
  const get = useCallback(async (url, config = {}) => {
    try {
      setError(null);
      startLoading();
      const response = await axios.get(url, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      stopLoading(300); // Small delay to prevent flickering
    }
  }, [startLoading, stopLoading]);

  /**
   * Make a POST request with automatic loading state handling
   * @param {string} url - The endpoint URL
   * @param {Object} data - The data to send
   * @param {Object} config - Axios request configuration
   * @returns {Promise} Promise resolving to the response data
   */
  const post = useCallback(async (url, data = {}, config = {}) => {
    try {
      setError(null);
      startLoading();
      const response = await axios.post(url, data, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      stopLoading(300);
    }
  }, [startLoading, stopLoading]);

  /**
   * Make a PUT request with automatic loading state handling
   * @param {string} url - The endpoint URL
   * @param {Object} data - The data to send
   * @param {Object} config - Axios request configuration
   * @returns {Promise} Promise resolving to the response data
   */
  const put = useCallback(async (url, data = {}, config = {}) => {
    try {
      setError(null);
      startLoading();
      const response = await axios.put(url, data, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      stopLoading(300);
    }
  }, [startLoading, stopLoading]);

  /**
   * Make a DELETE request with automatic loading state handling
   * @param {string} url - The endpoint URL
   * @param {Object} config - Axios request configuration
   * @returns {Promise} Promise resolving to the response data
   */
  const del = useCallback(async (url, config = {}) => {
    try {
      setError(null);
      startLoading();
      const response = await axios.delete(url, config);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      stopLoading(300);
    }
  }, [startLoading, stopLoading]);

  return {
    get,
    post,
    put,
    del,
    error,
    data,
  };
};

export default useApi;
