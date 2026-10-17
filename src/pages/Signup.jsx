    import { Link, useNavigate } from "react-router-dom"
    import { useEffect, useState } from "react"
    import toast from "react-hot-toast"
    import { Eye, EyeOff } from "lucide-react"
    import {useDispatch, useSelector} from 'react-redux'
    import { removeErrors, removeSuccess, signupUser } from "../slices/userSlice"

    const Signup = () => {

        const dispatch = useDispatch()
        const navigate = useNavigate()
        const {loading, error , success} = useSelector((state)=> state.user)

        useEffect(()=>{
            if(error){
                toast.error(error, {position: 'top-center' , duration : 3000})
                dispatch(removeErrors())
            }
        },[dispatch, error])

        useEffect(()=>{
            if(success){
                toast.success(success , {position:'top-center' , duration:3000})
                dispatch(removeSuccess())
                navigate('/')
            }
        },[dispatch, success])

        const [preview,setPreview] = useState('https://randomuser.me/api/portraits/lego/2.jpg')

        const [user , setUser] = useState({
            username : '',
            email : '',
            password : ''
        })

        const[showpass , setShowpass] = useState(false)

        const {username , email , password} = user;

        const [avatar , setAvatar] = useState('')

        const handleChange = (e)=>{
            if(e.target.name == 'avatar'){
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = ()=>{
                    if(reader.readyState == 2){
                        setPreview(reader.result)
                    }
                };
                reader.readAsDataURL(e.target.files[0])
                setAvatar(file)
            }
            else{
                setUser({...user,[e.target.name] : e.target.value})
            }
        };

        const handleSignup = (e)=>{
            e.preventDefault();

            if(!username || !email || !password || !avatar){
                toast.error("Please fill all the details" , {position:"top-center" , duration:3000})
                return;
            }
            const myForm = new FormData()
            myForm.set('username' , username)
            myForm.set('email' , email)
            myForm.set('password' , password)
            myForm.set('avatar', avatar)
            dispatch(signupUser(myForm))
        }

    return (
        <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="border border-gray-200 p-8 rounded-lg shadow-md">
                
                {/* header */}
                <div className="flex flex-col justify-center items-center mb-8">
                    <h3 className="font-semibold text-3xl text-blue-600 mb-2">Create Account</h3>
                    <span className="text-xs text-gray-500 font-medium">Join us and start your journey</span>
                </div>

                <form encType="multipart/form-data" action="" className="flex flex-col gap-4" onSubmit={handleSignup}>
                    
                    <div className="input-group flex flex-col gap-2">
                        <label htmlFor="username" className="font-medium">Username</label>
                        <input type="text" placeholder="user123" name="username" value={username} onChange={handleChange}
                            className="border border-gray-300 px-4 py-2 rounded placeholder:text-sm focus:outline-blue-500"
                        />
                    </div>
                    
                    <div className="input-group flex flex-col gap-2">
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input type="email" placeholder="hello@example.com" name="email" value={email} onChange={handleChange}
                            className="border border-gray-200 px-4 py-2 rounded placeholder:text-sm focus:outline-blue-500"
                        />
                    </div>
                    
                    <div className="input-group flex flex-col gap-2">
                        <label htmlFor="password" className="font-medium">Password</label>
                        <div className="relative">
                            <input type={showpass == true ? 'text' : "password"} placeholder="........"  name="password" onChange={handleChange} value={password}
                            className="border border-gray-200 px-4 py-2 rounded placeholder:text-sm focus:outline-blue-500 w-full"
                            />
                            <div className="absolute right-4 top-3 cursor-pointer text-gray-600" onClick={()=>setShowpass(!showpass)}>
                                {showpass ? <Eye size={18}/> : <EyeOff size={18}/>}
                            </div>
                        </div>
                        
                    </div>

                    <div className="input-group flex gap-3  items-center my-2">
                        <div className="shrink-0">
                            <img id="preview" src={preview} alt="" className="h-12 w-12 rounded-sm  bg-gray-50 object-cover" />
                        </div>
                        <input type="file" name="avatar" accept="image/*" onChange={handleChange} className="text-sm text-slate-700 file:mr-4 file:text-indigo-700 file:font-semibold file:bg-indigo-50 file:hover:bg-indigo-100 file:px-4 file:py-1.5 file:rounded-full"/>
                    </div>

                    <button disabled={loading ? true : false} className="bg-indigo-600 text-white py-2.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition duration-200">{loading ? 'Please Wait' : "Signup"}</button>

                    <h6 className="text-sm text-center text-slate-700">Already have an account <Link to={'/login'} className="text-blue-700 underline font-medium">Login</Link></h6>
                </form>

            </div>
        </div>
        </>
    )
    }

    export default Signup
