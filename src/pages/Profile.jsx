import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {

  const {user} = useSelector(state => state.user)

  return (
    <div className='min-h-screen flex justify-center items-center bg-slate-50'>
      <div className='shadow-md rounded-lg border border-slate-100 bg-white w-80 sm:w-90'>
        <div className='mb-5'>
            <div className='flex justify-center pb-5 pt-8 px-8'>
                <img src={user?.avatar?.url} alt={user?.username || "user"}  className='h-25 w-25 rounded-full object-cover border-2 border-amber-600'/>
            </div>
        </div>

        <div className='px-8 flex flex-col gap-8 pt-3 pb-5'>
            <div className='flex flex-col gap-2'>
                <span className='font-medium text-gray-500'>Username</span>
                <h3 className='w-full bg-slate-100 rounded px-5 py-2 font-medium text-blue-600 shadow-sm'>{user?.username || 'Username'}</h3>
            </div>

            <div className='flex flex-col gap-2'>
                <span className='font-medium text-gray-500'>email</span>
                <h3 className='w-full bg-slate-100 rounded px-5 py-2 font-medium text-blue-600 shadow-sm '>{user?.email || "user@gmail.com"}</h3>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <Link to={'/profile/edit'} className='bg-blue-600 text-white font-semibold py-1.5 rounded hover:bg-blue-700 transition duration-200 cursor-pointer text-center sm:flex-1'>Edit Profile</Link>

              <Link to={'/profile/changePass'} className='bg-blue-600 text-white font-semibold py-1.5 rounded hover:bg-blue-700 transition duration-200 cursor-pointer text-center sm:flex-1'>Change Password</Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
