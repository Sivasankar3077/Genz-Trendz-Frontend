import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { updateProfile } from "../slices/userSlice"
import toast from "react-hot-toast"

const EditProfile = () => {

  const {user , loading , error , message} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const [ profileData , setProfileData ] = useState({
    username : user?.username || '',
    email : user?.email || ''
  });
  const [preview , setPreview ] = useState(user?.avatar?.url || "")
  const [avatar , setAvatar] = useState('');

  const {username , email } = profileData;

  const handleChange = (e)=>{
    setProfileData({...profileData , [e.target.name] : e.target.value})
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setAvatar(file)
    const reader = new FileReader();
    reader.onload = () => {
        if(reader.readyState == 2){
        setPreview(reader.result)
    }}

    reader.readAsDataURL(file);
  }

  const handleUpdate = async () => {
    const myForm = new FormData();
    myForm.append('username' , username)
    myForm.append('email' , email)
    if(avatar){
        myForm.append('avatar' , avatar)
    }
    
    try{
        const result = await dispatch(updateProfile(myForm)).unwrap();
        toast.success(result.msg , {position : 'top-center' , duration : 3000})
        navigate('/profile')
    }
    catch(error){
        toast.error(error?.err || error?.msg || "Failed to update profile" , {position:'top-center' , duration : 3000})
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-slate-50'>
          <div className='shadow-md rounded-lg border border-slate-100 bg-white w-90'>
            <div className='mb-5'>
                <div className='flex flex-col items-center justify-center pb-5 pt-8 px-8 gap-3'>

                    <img src={preview} alt={user?.username || "user"}  className='h-25 w-25 rounded-full object-cover border-2 border-amber-600'/>

                    <label htmlFor="avatar" className="px-4 py-1 bg-blue-50 text-blue-500 font-medium rounded-full cursor-pointer">Change Profile
                    </label>

                    <input type="file" id="avatar" className="hidden" name="avatar" accept="image/*" 
                    onChange={handleAvatarChange}/>

                    
                </div>
            </div>
    
            <div className='px-8 flex flex-col gap-8 pt-3 pb-5'>
                <div className='flex flex-col gap-2'>
                    <span className='font-medium text-gray-500'>Username</span>

                    <input type="text" className='w-full bg-slate-100 rounded px-5 py-2 font-medium text-blue-600 shadow-sm focus:outline-blue-500' autoFocus name="username"
                        value={username}
                        onChange={handleChange}
                    />
                </div>
    
                <div className='flex flex-col gap-2'>
                    <span className='font-medium text-gray-500'>email</span>
                    
                    <input type="text" className='w-full bg-slate-100 rounded px-5 py-2 font-medium text-blue-600 shadow-sm focus:outline-blue-500' 
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
    
                <button onClick={handleUpdate} className='bg-blue-600 text-white font-semibold py-1.5 rounded hover:bg-blue-700 transition duration-200 cursor-pointer text-center'>Update Profile</button>
            </div>
          </div>
    </div>
  )
}

export default EditProfile
