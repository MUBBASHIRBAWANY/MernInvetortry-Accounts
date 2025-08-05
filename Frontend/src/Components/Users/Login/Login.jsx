import axios from 'axios';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { Admin, user } from '../../../Redux/Reducers/LoginerReducer';
import { fetchUserRights } from '../../../Redux/Reducers/UseRights';
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const Login = () => {
    const dispatch = useDispatch()
    const valideUser = async () => {
        const cookies = new Cookies();
        const Token = cookies.get('token')
        try {
            const response = await createDataFunction('users/profile', { authorization: Token });
            console.log(response.data.val.email)
            if (response.data.val.email == "admin@js.com") {
                console.log("Admin")
                const role = await getDataFundtion(`userRole/role/${response.data.val.selectRole}`)
                dispatch(fetchUserRights(role?.data?.Roles))
                dispatch(Admin(response.data.val))
            }
            else {
                console.log(response.data.val)
                const role = await getDataFundtion(`userRole/role/${response.data.val.selectRole}`)
                console.log(role)
                dispatch(fetchUserRights(role?.data?.Roles))
                dispatch(user(response.data.val))
                console.log("user")
            }
            
        } catch (err) {
            console.log(err)
        }
    }
    valideUser()


    const { register, handleSubmit, watch, formState: { errors } } = useForm();


    const onSubmit = async (data) => {
        try {
            console.log(data)
            const res = await createDataFunction(`users/Login/`, data)
            if (data.email = "admin@js.com") {
                const cookies = new Cookies();
                cookies.set('token', res.data.token)
                const response = await createDataFunction('/users/profile', { authorization: Token });
            }
            else {
                const cookies = new Cookies();
                cookies.set('token', res.data.token)
                const response = await createDataFunction('/users/profile', { authorization: Token });
                console.log(response.data.val)
                
            }
            console.log(res)

        } catch (err) {
            toast.error("invalid User")
        }
    }

    return (
        <div>
            <ToastContainer />
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-30 h-40 mr-2" src="https://res.cloudinary.com/dmi26itgk/image/upload/v1746526783/ocfvq7hxb3lqrobtlrkp.png" alt="logo" />

                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your UserName</label>
                                    <input type="Text" {...register("firstname")} name="firstname" id="firstname" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" {...register("password")} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-700">Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to="/Signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
export default Login