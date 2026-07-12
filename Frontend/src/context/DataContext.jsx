import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import API from '../services/api';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [resVehicles, resDrivers, resTrips, resMaint, resFuel, resExpenses] = await Promise.all([
        API.get('/data/vehicles'),
        API.get('/data/drivers'),
        API.get('/data/trips'),
        API.get('/data/maintenance'),
        API.get('/data/fuel-logs'),
        API.get('/data/expenses'),
      ]);

      const mapId = (list) => (list || []).map(item => ({ ...item, id: item._id }));

      setVehicles(mapId(resVehicles.data.data));
      setDrivers(mapId(resDrivers.data.data));
      setTrips(mapId(resTrips.data.data));
      setMaintenance(mapId(resMaint.data.data));
      setFuelLogs(mapId(resFuel.data.data));
      setExpenses(mapId(resExpenses.data.data));
    } catch (error) {
      console.error('Error fetching data from TransitOps API:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setVehicles([]);
      setDrivers([]);
      setTrips([]);
      setMaintenance([]);
      setFuelLogs([]);
      setExpenses([]);
    }
  }, [user, fetchData]);

  // --- CRUD VEHICLES ---
  const addVehicle = async (vehicle) => {
    try {
      const response = await API.post('/data/vehicles', vehicle);
      if (response.data.success) {
        const newVehicle = { ...response.data.data, id: response.data.data._id };
        setVehicles(prev => [...prev, newVehicle]);
        return newVehicle;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to register vehicle.');
    }
  };

  const updateVehicle = async (id, updatedData) => {
    try {
      const response = await API.put(`/data/vehicles/${id}`, updatedData);
      if (response.data.success) {
        const updated = { ...response.data.data, id: response.data.data._id };
        setVehicles(prev => prev.map(v => v.id === id ? updated : v));
        // Refresh related data if any
        fetchData();
        return updated;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update vehicle details.');
    }
  };

  const deleteVehicle = async (id) => {
    try {
      const response = await API.delete(`/data/vehicles/${id}`);
      if (response.data.success) {
        setVehicles(prev => prev.filter(v => v.id !== id));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete vehicle.');
    }
  };

  // --- CRUD DRIVERS ---
  const addDriver = async (driver) => {
    try {
      const response = await API.post('/data/drivers', driver);
      if (response.data.success) {
        const newDriver = { ...response.data.data, id: response.data.data._id };
        setDrivers(prev => [...prev, newDriver]);
        return newDriver;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add driver profile.');
    }
  };

  const updateDriver = async (id, updatedData) => {
    try {
      const response = await API.put(`/data/drivers/${id}`, updatedData);
      if (response.data.success) {
        const updated = { ...response.data.data, id: response.data.data._id };
        setDrivers(prev => prev.map(d => d.id === id ? updated : d));
        fetchData();
        return updated;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update driver details.');
    }
  };

  const deleteDriver = async (id) => {
    try {
      const response = await API.delete(`/data/drivers/${id}`);
      if (response.data.success) {
        setDrivers(prev => prev.filter(d => d.id !== id));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete driver.');
    }
  };

  // --- TRIP DISPATCHER FUNCTIONS ---
  const createTrip = async (tripData) => {
    try {
      const response = await API.post('/data/trips', tripData);
      if (response.data.success) {
        const newTrip = { ...response.data.data, id: response.data.data._id };
        setTrips(prev => [...prev, newTrip]);
        fetchData(); // reload status changes (vehicle/driver availability)
        return newTrip;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create trip.');
    }
  };

  const dispatchTrip = async (tripId) => {
    try {
      const response = await API.put(`/data/trips/dispatch/${tripId}`);
      if (response.data.success) {
        fetchData(); // reload all data to reflect vehicle and driver state changes
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to dispatch trip.');
    }
  };

  const completeTrip = async (tripId, completionData) => {
    try {
      const response = await API.put(`/data/trips/complete/${tripId}`, completionData);
      if (response.data.success) {
        fetchData(); // reload all data to reflect vehicle, driver, fuel and expense changes
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete trip.');
    }
  };

  const cancelTrip = async (tripId) => {
    try {
      const response = await API.put(`/data/trips/cancel/${tripId}`);
      if (response.data.success) {
        fetchData(); // reload all data to reflect vehicle and driver availability
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel trip.');
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = await API.delete(`/data/trips/${tripId}`);
      if (response.data.success) {
        setTrips(prev => prev.filter(t => t.id !== tripId));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete trip.');
    }
  };

  // --- MAINTENANCE LOG WORKFLOW ---
  const addMaintenance = async (maintData) => {
    try {
      const response = await API.post('/data/maintenance', maintData);
      if (response.data.success) {
        fetchData(); // reload all data to reflect vehicle 'In Shop' state
        return { ...response.data.data, id: response.data.data._id };
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to log maintenance.');
    }
  };

  const closeMaintenance = async (maintId, closureData = {}) => {
    try {
      const response = await API.put(`/data/maintenance/close/${maintId}`, closureData);
      if (response.data.success) {
        fetchData(); // reload all data to reflect vehicle availability and maintenance expense
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to close maintenance log.');
    }
  };

  // --- FUEL & EXPENSE MANAGEMENT ---
  const addFuelLog = async (logData) => {
    try {
      const response = await API.post('/data/fuel-logs', logData);
      if (response.data.success) {
        fetchData(); // reload fuel logs and expenses
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add fuel log.');
    }
  };

  const addExpense = async (expenseData) => {
    try {
      const response = await API.post('/data/expenses', expenseData);
      if (response.data.success) {
        fetchData(); // reload expenses
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to log expense.');
    }
  };

  // Get total operational cost (Fuel + Maintenance + others) per vehicle
  const getVehicleOperationalCost = (vehicleId) => {
    return expenses
      .filter(e => e.vehicleId === vehicleId)
      .reduce((sum, e) => sum + e.cost, 0);
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      drivers,
      trips,
      maintenance,
      fuelLogs,
      expenses,
      loading,
      refreshData: fetchData,
      
      addVehicle,
      updateVehicle,
      deleteVehicle,
      
      addDriver,
      updateDriver,
      deleteDriver,
      
      createTrip,
      dispatchTrip,
      completeTrip,
      cancelTrip,
      deleteTrip,
      
      addMaintenance,
      closeMaintenance,
      
      addFuelLog,
      addExpense,
      getVehicleOperationalCost
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
