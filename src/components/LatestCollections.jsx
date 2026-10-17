import LatestProducts from './LatestProducts'

const LatestUpdates = ({products}) => {
  return (
    <>
      <div className='mt-12 flex flex-col justify-around items-center'>
        <div className="latest py-5">
          <h3 className='text-center text-blue-600 text-2xl font-semibold mb-10'>Latest Collections</h3>

          <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product,index) => (
              <LatestProducts key={index} product = {product}/>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default LatestUpdates
