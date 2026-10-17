import { useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import Pagetitle from '../components/Pagetitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import StarRating from '../components/StarRating';
import { addtoCart } from '../slices/cartSlice';
import { getWishlist, removeFromWishlist } from '../slices/wishlistSlice';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { error: cartError, message: cartMessage } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) dispatch(getWishlist());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (cartMessage) toast.success(cartMessage);
    if (cartError) toast.error(typeof cartError === 'string' ? cartError : cartError?.msg || 'Could not add to cart');
  }, [cartMessage, cartError]);

  const handleRemove = async (id) => {
    const result = await dispatch(removeFromWishlist(id));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Removed from wishlist');
    else toast.error(result.payload || 'Could not remove product');
  };

  const handleAddToCart = (id) => dispatch(addtoCart({ id, quantity: 1, isCartPage: false }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Pagetitle title="My Wishlist" />
      <Navbar />
      <main className="grow w-full max-w-7xl mx-auto px-5 py-8 md:py-12">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="text-rose-500" size={28} />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Wishlist</h1>
            <p className="mt-1 text-sm text-slate-500">Your favourite GenZ Trendz products, all in one place.</p>
          </div>
          <span className="ml-auto rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">{items.length} saved</span>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Heart size={42} className="mx-auto mb-4 text-rose-300" />
            <h2 className="text-xl font-bold text-slate-800">Sign in to view your wishlist</h2>
            <p className="mt-2 text-slate-500">Save products you love and find them here later.</p>
            <Link to="/login" className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Login</Link>
          </div>
        ) : loading ? <Loader /> : items.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <Heart size={48} className="mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="mt-2 text-slate-500">Tap the heart on a product to save it here.</p>
            <Link to="/products" className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Explore products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <article key={product._id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/products/${product._id}`} className="block bg-slate-100">
                  <img src={product.image?.url} alt={product.name} className="h-56 w-full object-cover" loading="lazy" />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/products/${product._id}`} className="line-clamp-2 font-bold text-slate-900 hover:text-blue-600">{product.name}</Link>
                    <button onClick={() => handleRemove(product._id)} aria-label={`Remove ${product.name}`} title="Remove from wishlist" className="rounded-full p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={17} /></button>
                  </div>
                  <div className="mt-2 flex items-center gap-2"><StarRating value={product.rating || 0} disabled showValue={false} /><span className="text-xs text-slate-500">({product.noOfReviews || 0})</span></div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div><span className="text-lg font-bold text-blue-700">₹{product.price}</span>{product.mrp > product.price && <p className="text-xs text-slate-400 line-through">₹{product.mrp}</p>}</div>
                    <button onClick={() => handleAddToCart(product._id)} disabled={!product.stock || product.stock < 1} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"><ShoppingCart size={16} /> Add to cart</button>
                  </div>
                  {!product.stock && <p className="mt-2 text-xs font-medium text-rose-600">Currently out of stock</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
