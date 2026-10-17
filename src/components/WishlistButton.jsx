import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';

const WishlistButton = ({ productId, className = '', showLabel = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { items, mutationLoading } = useSelector((state) => state.wishlist);
  const isSaved = items.some((item) => String(item?._id || item) === String(productId));

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast('Please log in to save products', { icon: '❤️' });
      navigate('/login');
      return;
    }
    const result = isSaved
      ? await dispatch(removeFromWishlist(productId))
      : await dispatch(addToWishlist(productId));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(isSaved ? 'Removed from wishlist' : 'Added to wishlist');
    } else {
      toast.error(result.payload || 'Wishlist update failed');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutationLoading}
      aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/95 p-2 text-gray-600 shadow-sm transition hover:scale-105 hover:text-rose-600 disabled:cursor-wait disabled:opacity-60 ${className}`}
    >
      <Heart size={18} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
      {showLabel && <span className="text-sm font-semibold">{isSaved ? 'Saved' : 'Add to wishlist'}</span>}
    </button>
  );
};

export default WishlistButton;
