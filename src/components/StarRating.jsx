import { Star } from 'lucide-react'
import { useEffect, useState } from 'react';

const StarRating = ({value =0 , onRatingChange , disabled = false , showValue = true}) => {
  
  const[hover , setHover] = useState(0);
  const [rating , setRating ] = useState(value)

  const handleClick = (star)=>{
    if(disabled) return;
    setRating(star);
    onRatingChange?.(star)
  }

  useEffect(()=>{
    setRating(value)
  } , [value])
  
  return (
    <>
        <div className='flex items-center gap-2'>
            <div className='flex gap-1'>
                {
                [1,2,3,4,5].map((star,index)=>{
                    const filled = star <= Math.max(hover,rating); 
                    return <Star key={index} size={16}
                        className={`transition-all duration-200 
                                    ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-500'}
                                    ${disabled ? 'cursor-default': 'cursor-pointer'}`}

                        onMouseEnter={()=> !disabled && setHover(star)}
                        onMouseLeave = {()=> !disabled && setHover(0)}
                        onClick={()=> handleClick(star)}
                    />
                })}
            </div>

            {showValue && 
                <span className='text-gray-500 font-semibold text-xs'>{rating}/5</span>
            }
        </div>
    </>
  )
}

export default StarRating
