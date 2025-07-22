import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Product, Store, User, CartItem, Order, Category } from "../types";
import productsService from "../services/productsService";
import storesService from "../services/storesService";
import authService from "../services/authService";
import cartService from "../services/cartService";

// Types for state
interface DataState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Products state
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  trendingStores: any[];
  weeklyTrends: any[];

  // Stores state
  stores: Store[];
  myStore: Store | null;

  // Cart state
  cartItems: CartItem[];
  cartTotal: number;

  // Orders state
  orders: Order[];

  // Loading states
  loading: {
    auth: boolean;
    products: boolean;
    stores: boolean;
    cart: boolean;
    orders: boolean;
    general: boolean;
  };

  // Error states
  errors: {
    auth: string | null;
    products: string | null;
    stores: string | null;
    cart: string | null;
    orders: string | null;
    general: string | null;
  };
}

// Action types
type DataAction =
  | {
      type: "SET_LOADING";
      payload: { key: keyof DataState["loading"]; value: boolean };
    }
  | {
      type: "SET_ERROR";
      payload: { key: keyof DataState["errors"]; value: string | null };
    }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_AUTHENTICATED"; payload: boolean }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_FEATURED_PRODUCTS"; payload: Product[] }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | {
      type: "SET_TRENDING_DATA";
      payload: { trendingStores: any[]; weeklyTrends: any[] };
    }
  | { type: "SET_STORES"; payload: Store[] }
  | { type: "SET_MY_STORE"; payload: Store | null }
  | { type: "SET_CART_ITEMS"; payload: CartItem[] }
  | { type: "SET_CART_TOTAL"; payload: number }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "UPDATE_CART_ITEM"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOGOUT" };

// Initial state
const initialState: DataState = {
  user: null,
  isAuthenticated: false,
  products: [],
  featuredProducts: [],
  categories: [],
  trendingStores: [],
  weeklyTrends: [],
  stores: [],
  myStore: null,
  cartItems: [],
  cartTotal: 0,
  orders: [],
  loading: {
    auth: false,
    products: false,
    stores: false,
    cart: false,
    orders: false,
    general: false,
  },
  errors: {
    auth: null,
    products: null,
    stores: null,
    cart: null,
    orders: null,
    general: null,
  },
};

// Reducer
const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
      };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_AUTHENTICATED":
      return { ...state, isAuthenticated: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "SET_FEATURED_PRODUCTS":
      return { ...state, featuredProducts: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_TRENDING_DATA":
      return {
        ...state,
        trendingStores: action.payload.trendingStores,
        weeklyTrends: action.payload.weeklyTrends,
      };
    case "SET_STORES":
      return { ...state, stores: action.payload };
    case "SET_MY_STORE":
      return { ...state, myStore: action.payload };
    case "SET_CART_ITEMS":
      return { ...state, cartItems: action.payload };
    case "SET_CART_TOTAL":
      return { ...state, cartTotal: action.payload };
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    case "ADD_TO_CART":
      return { ...state, cartItems: [...state.cartItems, action.payload] };
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_CART":
      return { ...state, cartItems: [], cartTotal: 0 };
    case "LOGOUT":
      return {
        ...initialState,
        // שמירת קטגוריות וחנויות פומביות
        categories: state.categories,
        stores: state.stores,
        trendingStores: state.trendingStores,
        weeklyTrends: state.weeklyTrends,
      };
    default:
      return state;
  }
};

// Context
interface DataContextType {
  state: DataState;
  dispatch: React.Dispatch<DataAction>;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (registerData: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;

  // Products actions
  loadProducts: (params?: any) => Promise<void>;
  loadFeaturedProducts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadTrendingData: () => Promise<void>;
  searchProducts: (query: string, filters?: any) => Promise<Product[]>;

  // Stores actions
  loadStores: (params?: any) => Promise<void>;
  loadMyStore: () => Promise<void>;

  // Cart actions
  loadCart: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    options?: any
  ) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Orders actions
  loadOrders: () => Promise<void>;
  createOrder: (orderData: any) => Promise<Order>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Helper function to handle errors
  const handleError = (error: any, errorKey: keyof DataState["errors"]) => {
    const errorMessage = error.message || "שגיאה לא צפויה";
    dispatch({
      type: "SET_ERROR",
      payload: { key: errorKey, value: errorMessage },
    });
    console.error(`Error in ${errorKey}:`, error);
  };

  // Auth actions
  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING", payload: { key: "auth", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "auth", value: null } });

    try {
      const authData = await authService.login({ email, password });
      dispatch({ type: "SET_USER", payload: authData.user });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });

      // טען נתונים נוספים אחרי התחברות
      await Promise.all([loadCart(), loadOrders(), loadMyStore()]);
    } catch (error) {
      handleError(error, "auth");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "auth", value: false } });
    }
  };

  const register = async (registerData: any) => {
    dispatch({ type: "SET_LOADING", payload: { key: "auth", value: true } });
    dispatch({ type: "SET_ERROR", payload: { key: "auth", value: null } });

    try {
      const authData = await authService.register(registerData);
      dispatch({ type: "SET_USER", payload: authData.user });
      dispatch({ type: "SET_AUTHENTICATED", payload: true });
    } catch (error) {
      handleError(error, "auth");
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "auth", value: false } });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.warn("Logout error:", error);
      // עדיין נבצע logout מקומי גם אם יש שגיאה
      dispatch({ type: "LOGOUT" });
    }
  };

  const loadUser = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        const user = await authService.getCurrentUser();
        dispatch({ type: "SET_USER", payload: user });
        dispatch({ type: "SET_AUTHENTICATED", payload: true });
      }
    } catch (error) {
      console.warn("Load user error:", error);
      dispatch({ type: "SET_AUTHENTICATED", payload: false });
    }
  };

  // Products actions
  const loadProducts = async (params = {}) => {
    dispatch({
      type: "SET_LOADING",
      payload: { key: "products", value: true },
    });

    try {
      const response = await productsService.getProducts(params);
      dispatch({ type: "SET_PRODUCTS", payload: response.data });
    } catch (error) {
      handleError(error, "products");
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { key: "products", value: false },
      });
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const products = await productsService.getFeaturedProducts();
      dispatch({ type: "SET_FEATURED_PRODUCTS", payload: products });
    } catch (error) {
      console.warn("API not available, using mock data for featured products");
      // נתונים דמה זמניים כשה-API לא זמין
      const mockProducts: Product[] = [];
      dispatch({ type: "SET_FEATURED_PRODUCTS", payload: mockProducts });
    }
  };

  const loadCategories = async () => {
    try {
      // נניח שיש endpoint לקטגוריות
      // אחרת נשתמש בנתונים הקבועים
      const categories = [
        {
          id: "1",
          name: "אופנה נשית",
          icon: "woman",
          image: "",
          productCount: 1250,
        },
        {
          id: "2",
          name: "אופנה גברית",
          icon: "man",
          image: "",
          productCount: 890,
        },
        {
          id: "3",
          name: "נעליים",
          icon: "footsteps",
          image: "",
          productCount: 567,
        },
        {
          id: "4",
          name: "תיקים ותכשיטים",
          icon: "bag",
          image: "",
          productCount: 423,
        },
        {
          id: "5",
          name: "בגדי ילדים",
          icon: "happy",
          image: "",
          productCount: 334,
        },
        {
          id: "6",
          name: "ספורט ופנויים",
          icon: "fitness",
          image: "",
          productCount: 278,
        },
      ];
      dispatch({ type: "SET_CATEGORIES", payload: categories });
    } catch (error) {
      handleError(error, "products");
    }
  };

  const loadTrendingData = async () => {
    try {
      const trendingData = await productsService.getTrendingData();
      dispatch({ type: "SET_TRENDING_DATA", payload: trendingData });
    } catch (error) {
      console.warn("API not available, using mock data for trending");
      // נתונים דמה זמניים כשה-API לא זמין
      const mockTrendingData = {
        trendingStores: [],
        weeklyTrends: [],
      };
      dispatch({ type: "SET_TRENDING_DATA", payload: mockTrendingData });
    }
  };

  const searchProducts = async (query: string, filters = {}) => {
    try {
      const response = await productsService.searchProducts({
        query,
        ...filters,
      });
      return response.data;
    } catch (error) {
      handleError(error, "products");
      return [];
    }
  };

  // Stores actions
  const loadStores = async (params = {}) => {
    dispatch({ type: "SET_LOADING", payload: { key: "stores", value: true } });

    try {
      const response = await storesService.getStores(params);
      dispatch({ type: "SET_STORES", payload: response.data });
    } catch (error) {
      handleError(error, "stores");
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { key: "stores", value: false },
      });
    }
  };

  const loadMyStore = async () => {
    if (!state.isAuthenticated) return;

    try {
      const store = await storesService.getMyStore();
      dispatch({ type: "SET_MY_STORE", payload: store });
    } catch (error) {
      // אם המשתמש לא בעל חנות, זו לא שגיאה
      console.log("User has no store");
    }
  };

  // Cart actions
  const loadCart = async () => {
    if (!state.isAuthenticated) return;

    dispatch({ type: "SET_LOADING", payload: { key: "cart", value: true } });

    try {
      const cartItems = await cartService.getCart();
      dispatch({ type: "SET_CART_ITEMS", payload: cartItems });

      // חשב סה"כ
      const total = await cartService.calculateCartTotal();
      dispatch({ type: "SET_CART_TOTAL", payload: total.total });
    } catch (error) {
      handleError(error, "cart");
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "cart", value: false } });
    }
  };

  const addToCart = async (
    productId: string,
    quantity: number,
    options = {}
  ) => {
    try {
      const cartItem = await cartService.addToCart({
        productId,
        quantity,
        ...options,
      });
      dispatch({ type: "ADD_TO_CART", payload: cartItem });

      // רענן סה"כ
      const total = await cartService.calculateCartTotal();
      dispatch({ type: "SET_CART_TOTAL", payload: total.total });
    } catch (error) {
      handleError(error, "cart");
      throw error;
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      const updatedItem = await cartService.updateCartItem({
        cartItemId: itemId,
        quantity,
      });
      dispatch({ type: "UPDATE_CART_ITEM", payload: updatedItem });

      // רענן סה"כ
      const total = await cartService.calculateCartTotal();
      dispatch({ type: "SET_CART_TOTAL", payload: total.total });
    } catch (error) {
      handleError(error, "cart");
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartService.removeFromCart(itemId);
      dispatch({ type: "REMOVE_FROM_CART", payload: itemId });

      // רענן סה"כ
      const total = await cartService.calculateCartTotal();
      dispatch({ type: "SET_CART_TOTAL", payload: total.total });
    } catch (error) {
      handleError(error, "cart");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      handleError(error, "cart");
      throw error;
    }
  };

  // Orders actions
  const loadOrders = async () => {
    if (!state.isAuthenticated) return;

    dispatch({ type: "SET_LOADING", payload: { key: "orders", value: true } });

    try {
      const response = await cartService.getUserOrders();
      dispatch({ type: "SET_ORDERS", payload: response.data });
    } catch (error) {
      handleError(error, "orders");
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: { key: "orders", value: false },
      });
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const order = await cartService.createOrder(orderData);
      dispatch({ type: "SET_ORDERS", payload: [...state.orders, order] });

      // נקה עגלה אחרי הזמנה מוצלחת
      dispatch({ type: "CLEAR_CART" });

      return order;
    } catch (error) {
      handleError(error, "orders");
      throw error;
    }
  };

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({
        type: "SET_LOADING",
        payload: { key: "general", value: true },
      });

      try {
        // טען נתונים בסיסיים
        await Promise.all([
          loadUser(),
          loadCategories(),
          loadFeaturedProducts(),
          loadTrendingData(),
        ]);
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { key: "general", value: false },
        });
      }
    };

    initializeApp();
  }, []);

  const contextValue: DataContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    loadUser,
    loadProducts,
    loadFeaturedProducts,
    loadCategories,
    loadTrendingData,
    searchProducts,
    loadStores,
    loadMyStore,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadOrders,
    createOrder,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// Hook to use the context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
