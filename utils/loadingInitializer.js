import { setLoadingController } from './services/api';
import { setTestLibraryLoadingController } from './services/testLibraryService';
import { setResourcesLoadingController } from './services/resourcesService';
import { setDashboardLoadingController } from './services/dashboardService';

/**
 * Initializes the loading controller by connecting the LoadingContext 
 * controller to all API service interceptors and service functions
 * 
 * @param {Object} controller - The loading controller from LoadingContext
 */
export const initializeLoadingSystem = (controller) => {
  if (controller && typeof controller.startLoading === 'function' && 
      typeof controller.stopLoading === 'function') {
    // Set loading controller for main API service
    setLoadingController(controller);
    
    // Set loading controllers for other services
    setTestLibraryLoadingController(controller);
    setResourcesLoadingController(controller);
    setDashboardLoadingController(controller);
    
    console.log('Loading system initialized successfully');
  } else {
    console.warn('Failed to initialize loading system: invalid controller');
  }
};

export default initializeLoadingSystem;
