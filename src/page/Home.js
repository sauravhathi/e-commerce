import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BsCart2, BsSearch } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";

const Home = () => {
  const siteTitle = "EcomHub";
  const [cardHover, setCardHover] = useState(-1);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(4);
  const [totalPages, setTotalPages] = useState(0);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cart, setCart] = useState(0);
  const [cartItems, setCartItems] = useState([]);
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

  const getProducts = async () => {
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
          setMessage(`${category} - ${data.products.length} items`);
        } else {
          setMessage("");
        }
      }
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };

  const getPagination = () => {
    if (totalPages === 0) {
      return null;
    }
    return (
      <div className="flex justify-center items-center mt-4 mb-10 gap-2">
        <button
          className={`${page === 1 ? "bg-sky-300" : "bg-sky-600"
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
            className={`${page === index + 1 ? "bg-sky-300" : "bg-sky-600"
              } text-white px-4 py-2 rounded-md`}
            onClick={() => {
              setPage(index + 1);
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={`${page === totalPages ? "bg-sky-300" : "bg-sky-600"
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
      getProducts();
      getDetails();
    }
  }, [category, page, limit, sortField, sortOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getDetails = async () => {
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

  const userLogout = async (e) => {
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

  const getCart = async () => {
    try {
      if (cart === 0) {
        return null;
      }
      const response = await fetch('/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCartItems(data.cartItems);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold ml-2">
            <span className="text-sky-600">
              {siteTitle.split(/(?=[A-Z])/)[0]}
            </span>
            {siteTitle.split(/(?=[A-Z])/)[1]}
          </h1>
        </div>
        <div className="flex items-center">
          <div className="flex items-center relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 rounded-full w-34 md:w-[400px] bg-sky-100 focus:bg-transparent focus:outline-sky-200 focus:placeholder-transparent"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchProduct(e)}
            />
            <BsSearch
              className="absolute left-3 top-3 text-sky-400"
              onClick={(e) => searchProduct(e)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <p className="text-sky-600 px-1 py-0 rounded-md border-2 border-sky-600 hidden md:block">{!user ? "Guest" : user.name.split(" ")[0]}</p>
            <div className="flex items-center relative mr-2" onMouseEnter={() => { setShowCart(true); getCart(); }} onMouseLeave={() => setShowCart(false)}>
              <BsCart2 className="text-2xl text-sky-600" />
              {cart > 0 && (
                <p className="text-white bg-sky-600 rounded-full px-1 ml-1 absolute -top-2 -right-2">
                  {cart}
                </p>
              )}
              {showCart && (
                <div className="absolute top-5 right-0 w-80 bg-white rounded-md shadow-md p-2">
                  {
                    cartItems.length === 0 ? (
                      <p className="text-red-600">No items in cart</p>
                    ) :
                      cartItems.map((item) => (
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt="" className="w-12 h-12 object-cover" />
                            <div className="flex flex-col">
                              <p className="text-sm">{item.name}</p>
                              <p className="text-xs bg-sky-500">Rs. {item.price}</p>
                              <p className="text-xs bg-sky-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center cursor-pointer " onClick={userLogout}>
            <p className="text-sky-600 mr-2 hidden md:block">{!user ? "Login" : "Logout"}</p>
            <div className="flex items-center relative">
              <RiLogoutCircleRLine className="text-2xl text-sky-600 " onClick={userLogout} />
            </div>
          </div>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2 justify-center mt-4">
        <li
          className={`${category === "" ? "bg-sky-600 text-white" : "bg-sky-100"
            } px-2 py-1 rounded-md cursor-pointer`}
          onClick={() => setCategory("")}
        >
          All
        </li>
        {categoryList.map((categoryItem) => (
          <li
            className={`${category === categoryItem
              ? "bg-sky-600 text-white"
              : "bg-sky-100"
              } px-2 py-1 rounded-md cursor-pointer`}
            onClick={() => setCategory(categoryItem)}
            key={categoryItem}
          >
            {categoryItem}
          </li>
        ))}
      </ul>
      {message && (
        <p className="text-red-600 text-center mt-2">{message}</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
        {products.map((product, index) => (
          <div
            className={`${cardHover === index ? "shadow-xl" : "shadow-md"
              } transition-all duration-300 transform hover:scale-[1.01] rounded-md p-2`}
            onMouseEnter={() => setCardHover(index)}
            onMouseLeave={() => setCardHover(-1)}
            key={index}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-fill"
            />
            <div className="flex flex-col">
              <p className="text-sky-600">{product.brand}</p>
              <p className="text-sky-600">{product.name}</p>
              <p className="flex items-center gap-2">
                <span className="text-sky-600">
                  Rs. {product.price}
                </span>
                {
                  product.discount > 0 && (
                    <><span className="text-sm line-through text-gray-400">
                      {((product.price * (100 + product.discount)) / 100).toFixed(2)} ₹
                    </span><span className="text-red-600">
                        {product.discount}% off
                      </span></>
                  )
                }
              </p>
              <p className="text-red-600">
                {product.stock < 6 ? "Only few left" : "In stock"}
              </p>
            </div>
            <div className="flex justify-center items-center">
              <button
                className="w-full bg-sky-600 text-white py-1 rounded-md"
                onClick={(e) => addToCart(e, product)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
      {getPagination()}
    </div>
  );
}

export default Home;