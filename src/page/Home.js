import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsBag, BsSearch } from "react-icons/bs";

const Home = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cart, setCart] = useState(0);
  const [categoryList, setCategoryList] = useState([
    "electronics",
    "sports",
    "watch",
    "bags",
    "shoes",
    "computers",
    "books",
  ]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products', {
        params: {
          category: category,
          page: page,
          limit: limit,
          sortField: sortField,
          sortOrder: sortOrder,
        }
      });
      const data = await response.data;
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data.products);
        setPage(data.page);
        setLimit(data.limit);
        setTotalPages(data.totalPages);
        if (data.length === 0) {
          setMessage("No product found");
        }
        if (category) {
          setMessage(data.length + " products found");
        } else {
          setMessage("");
        }
      }
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  const pagination = () => {
    if (totalPages === 0) {
      return null;
    }

    return (
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          className={`${page === 1 ? "bg-gray-300" : "bg-indigo-600"
            } text-white px-4 py-2 rounded-l`}

          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          Prev
        </button>
        {Array(totalPages).fill(0).map((_, index) => (
          <button
            key={index + 1}
            className={`${page === index + 1 ? "bg-gray-300" : "bg-indigo-600"
              } text-white px-4 py-2`}

            onClick={() => {
              setPage(index + 1);
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`${page === totalPages ? "bg-gray-300" : "bg-indigo-600"
            } text-white px-4 py-2 rounded-r`}

          onClick={() => {
            if (page < totalPages) {
              setPage(page + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    );
  };

  let isuseEffectCalled = false;
  useEffect(() => {
    if (!isuseEffectCalled) {
      isuseEffectCalled = true;
      fetchProducts();
      getUserDetails();
    }
  }, [category, page, limit, sortField, sortOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getUserDetails = async () => {
    try {
      const response = await fetch('/user/details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });

      if (response.status === 404 || response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      const data = await response.json();
      setUser(data.user);
      setCart(data.user.cart.length);
    }
    catch (error) {
      setError(error);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const addToCart = async (e, product) => {
    e.preventDefault();
    try {
      const response = await fetch('/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': user._id
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCart(data.totalItems);
        alert("Product added to cart");
      }
    } catch (error) {
      setError(error);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      setError(error);
    }
  };

  const searchProduct = async (e) => {
    e.preventDefault();
    setCategory("");
    if (search === "") {
      setMessage("Please enter a search term");
      return;
    }
    try {
      const response = await fetch(`/search/${search}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessage(data.length + " products found");
        setProducts(data);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold ml-2">Ecommerce</h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center relative">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 mr-2 focus:placeholder-transparent focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchProduct(e)}
            />
            <BsSearch
              className="text-2xl cursor-pointer hidden md:block"
              onClick={(e) => searchProduct(e)}
            />
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <p className="text-gray-600 mr-2 hidden md:block">{!user ? "Guest" : "Hi, " + user.name}</p>
            <div className="flex items-center relative mr-2">
              <BsBag className="text-2xl" />
              {cart > 0 && (
                <p className="text-white bg-slate-600 rounded-full px-1 ml-1 absolute -top-2 -right-2">
                  {cart}
                </p>
              )}
            </div>
          </div>
          <button
            className="bg-slate-600 text-white rounded-md px-2 py-1 ml-2"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="sticky top-16 bg-white z-10 flex justify-start items-center gap-2 p-2">
        <p className="text-gray-600 text-center">Categories</p>
        <select
          className="border border-gray-300 rounded-md px-2 py-1 mr-2 focus:placeholder-transparent focus:outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          {categoryList.map((categoryItem) => (
            <option value={categoryItem} key={categoryItem}>
              {categoryItem}
            </option>
          ))}
        </select>
      </div>
      {message && (
        <p className="text-red-600 text-center">{message}</p>
      )}
      <div className="flex flex-wrap justify-center items-center gap-2 p-2">
        {products.map((product, index) => (
          <div
            className="w-64 h-54 flex flex-col justify-between items-center border border-gray-300 rounded-md p-2"
            key={index}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-contain h-40 w-40"
            />
            <div className="flex flex-col justify-start">
              <p className="text-gray-600 text-center">{product.brand}</p>
              <p className="text-gray-600 text-center">{product.name}</p>
              <p>
                <span className="">
                  {product.price} ₹
                </span>
                {product.discount > 0 && (
                  <span className="text-gray-600 line-through ml-2">
                    {((product.price * (100 + product.discount)) / 100).toFixed(2)} ₹
                  </span>
                )}
                <span className="text-gray-600 ml-2">
                  {product.discount}% off
                </span>
              </p>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="bg-slate-600 text-white rounded-md px-2 py-1 ml-2"
                onClick={(e) => addToCart(e, product)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {pagination()}
    </div>
  );
}

export default Home;