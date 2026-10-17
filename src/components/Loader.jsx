
const Loader = () => {
  return (
    <>
        <div className="w-full h-screen flex justify-center items-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
                <span className="sr-only">Loading</span>
            </div>
        </div>
    </>
  )
}

export default Loader
