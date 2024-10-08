import { useState } from 'react';
import { KPI, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import background from '../assets/useraccessBackground.jpg';
import logo from '/logo.webp';
import { calculateResourceUtilizationRate, calculateTaskCompletionRate, calculateTaskEfficiency } from '../helper';
import {  PuffLoader } from 'react-spinners';
// import { set } from 'date-fns';

const UserAccess = () => {
    const { login, setUser, setKPI, setCompanyTasks, setLatestProject, setProjects, setMaterials, setUsers } = useAuth();
    const navigate = useNavigate();
    const [access, setAccess] = useState<string>('logIn');
    const [activeInput, setActiveInput] = useState<string>('');
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | undefined>(false);

    const fetchAdminTasks = async () => {
        try {
          const response = await axios.get('/api/tasks');
          setCompanyTasks(response.data.tasks);
        } catch (error) {
          console.error('Failed to fetch admin tasks:', error);
        }
      };

      const fetchUsers = async () => {
        try {
          const response = await axios.get('/api/users');
          setUsers(response.data);
        } catch (error) {
          console.error('Failed to fetch Users:', error);
        }
      };

      const fetchLatestProject = async () => {
        try {
          const response = await axios.post('/api/tasks/latestProjectTarget');
          setLatestProject(response.data.latestProject);
        } catch (error) {
          console.error('Failed to fetch latest project:', error);
        }
      };
      const FetchMaterials = async() => {
        try {
          const response = await axios.get('/api/materials/');
          setMaterials(response.data);
        } catch (error) {
          console.error('Error fetching materials:', error);
        }
      }
      const fetchProject = async () => {
        try {
          const response = await axios.post('/api/tasks/getProjectTargets');
          setProjects(response.data.projectTargets);
        } catch (error) {
          console.error('Failed to fetch projects:', error);
        }
      };

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const data = {
            username: credentials.username,
            password: credentials.password,
        }
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`/api/user/auth/login`, data)
            
            if (response.data.success) {
                const user = response.data.user;
                login(data);
                setUser(user);
                if (user.role === 'Admin') {
                    await fetchAdminTasks();
                    await fetchLatestProject();
                    await fetchProject();
                    await FetchMaterials();
                    await fetchUsers();
                }
                if (user.tasks && user.tasks.length > 0){                    
                    const taskCompletionRate = calculateTaskCompletionRate(user.tasks);
                    const resourceUtilizationRate = calculateResourceUtilizationRate(user.tasks);
                    const taskEfficiency = calculateTaskEfficiency(user.tasks);
                    const taskOverdueRate = 100 - taskEfficiency;
                  
                    const userRating = Math.round(
                                            ( taskCompletionRate * 0.4 ) + 
                                            ( resourceUtilizationRate * 0.3 ) + 
                                            ( taskEfficiency * 0.2 ) + 
                                            ( taskOverdueRate * 0.1 )
                                        );
                  
                    const kpi: KPI = {
                      taskCompletionRate,
                      resourceUtilizationRate,
                      taskEfficiency,
                      taskOverdueRate,
                      userRating
                    }

                    setKPI(kpi);

                }
                setLoading(false);
                // Assume the token is returned in response data
                localStorage.setItem('authToken', 'Logged in gee');
                if(response.data.user.role === 'Admin'){
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            } else {
                setError(response.data.message || 'Invalid username or password');
            }
        } catch (err) {
            console.error(err);
            const error = err as AxiosError;
            // Handle different types of errors
            if (error.response && error.response.data) {
                // Explicitly check if message exists in response data
                const errorMessage = (error.response.data as { message: string }).message;
                setError(errorMessage || 'Failed to log in. Please try again.');
            } else {
                setError('Server error. Please try again later.');
            }
        }
    };





  return (
    <div className="w-[100vw] h-[100vh] flex">
        <img src={background} alt="background image" className='w-[45vw] object-cover' />
        <div className='flex w-[55vw]  items-center justify-center'>
            <div className={`${access == 'logIn' ? 'h-[84vh]': 'h-[100vh]'} w-[36vw] flex flex-col items-center`}>
                <img src={logo} alt="OptiWork logo" className='w-36 h-36 object-cover' />
                <h2 className='-mt-9 text-3xl font-semibold text-[#0082B3]'> { access == 'logIn' ? 'Welcome Back' : 'Sign Up' } </h2>
                <p className='text-sm'> { access == 'logIn' ? 'Gain secure access to your software' : 'Welcome to the future of Industrial Software' }  </p>
                { access == 'logIn' ? 
                <>
                    <form>
                        <div className='flex flex-col w-[34vw] mt-6 mb-4 relative '>
                            <label 
                                htmlFor="" 
                                className={`${activeInput == 'loginUser' && !error ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}
                            >
                                Username
                            </label>
                            <input 
                                type="text" 
                                placeholder='Please Enter your Username' 
                                value={credentials.username}
                                onChange={(e) => {
                                                    setCredentials({ ...credentials, username: e.target.value });
                                                    setError(null);
                                                    setLoading(false);
                                                }}
                                className={`${activeInput == 'loginUser' && !error && 'outline outline-2'} ${error && 'border-red-500'} border p-3 rounded-md placeholder-shown:text-sm`} 
                                onClick={() => setActiveInput('loginUser')} 
                                required
                            />
                        </div>
                        <div className={`${activeInput == 'loginPassword' && 'mt-6'} flex flex-col w-[34vw] mt-2 mb-4 relative`}>
                            <label 
                                htmlFor="" 
                                className={`${activeInput == 'loginPassword' && !error ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}
                            >
                                Password
                            </label>
                            <input 
                                type="password" 
                                placeholder='Please Enter your password' 
                                value={credentials.password}
                                onChange={(e) => {
                                                    setCredentials({ ...credentials, password: e.target.value });
                                                    setError(null);
                                                    setLoading(false);
                                            }}
                                className={`${activeInput == 'loginPassword' && !error && 'outline outline-2'} ${error && 'border-red-500'} border p-3 rounded-md placeholder-shown:text-sm`} 
                                onClick={() => setActiveInput('loginPassword')}
                                required 
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button className={`border w-[34vw] p-3 mt-4 rounded-md text-white bg-[#002E3C] font-medium ${loading ? ' opacity-60 ' : ''}`}  onClick={(e) => handleLogin(e)} disabled={loading}>
                                <div className="flex gap-6 items-center justify-center">
                                    {
                                        loading && 
                                    <div className="flex gap-2 items-center animate-pulse">
                                        <PuffLoader size={14} color='#fff' speedMultiplier={1} />
                                        <PuffLoader size={12} color='#fff' speedMultiplier={0.7} />
                                        <PuffLoader size={10} color='#fff' speedMultiplier={0.45} />
                                    </div>}
                                     LOG IN 
                                    {
                                        loading && 
                                    <div className="flex gap-2 items-center animate-pulse">
                                        <PuffLoader size={10} color='#fff' speedMultiplier={0.45} />
                                        <PuffLoader size={12} color='#fff' speedMultiplier={0.7} />
                                        <PuffLoader size={14} color='#fff' speedMultiplier={1} />
                                    </div>}
                                </div>
                            </button>
                        <p className='text-sm mt-2 text-center'>Don't have an account?
                            <button className='ml-1 text-[#0082B3]' onClick={() => setAccess('signUp')}>Sign up</button>
                        </p>
                    </form>
                </> 
                    : 
                <>
                    <form>
                        <div className='flex flex-col w-[34vw] mt-6 mb-4 relative '>
                            <label htmlFor="" className={`${activeInput == 'newUserFullName' ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}>Full Name</label>
                            <input type="text" placeholder='Please Enter your full name' className={`${activeInput == 'newUserFullName' && 'outline outline-2'} border p-3 rounded-md placeholder-shown:text-sm`} onClick={() => setActiveInput('newUserFullName')} />
                        </div>
                        <div className='flex flex-col w-[34vw] mt-2 mb-4 relative '>
                            <label htmlFor="" className={`${activeInput == 'newUser' ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}>Username</label>
                            <input type="text" placeholder='Please Enter your new Username' className={`${activeInput == 'newUser' && 'outline outline-2'} border p-3 rounded-md placeholder-shown:text-sm`} onClick={() => setActiveInput('newUser')} />
                        </div>
                        <div className={`${activeInput == 'newUserPassword' && 'mt-6'} flex flex-col w-[34vw] mt-2 mb-4 relative`}>
                            <label htmlFor="" className={`${activeInput == 'newUserPassword' ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}>Password</label>
                            <input type="password" placeholder='Please Enter your password' className={`${activeInput == 'newUserPassword' && 'outline outline-2'} border p-3 rounded-md placeholder-shown:text-sm`} onClick={() => setActiveInput('newUserPassword')} />
                        </div>
                        <div className={`${activeInput == 'confirmPassword' && 'mt-6'} flex flex-col w-[34vw] mt-2 mb-4 relative`}>
                            <label htmlFor="" className={`${activeInput == 'confirmPassword' ?  'absolute -top-4 left-2 bg-white p-2 text-xs': 'ml-1 mb-1'} delay-75 font-semibold`}>Confirm Password</label>
                            <input type="password" placeholder='Please confirm your password' className={`${activeInput == 'confirmPassword' && 'outline outline-2'} border p-3 rounded-md placeholder-shown:text-sm`} onClick={() => setActiveInput('confirmPassword')} />
                        </div>
                        <button className='border w-[34vw] p-3 mt-4 rounded-md text-white bg-[#002E3C] font-medium'> Sign Up </button>
                        <p className='text-sm mt-2 text-center'>You already have an account?
                            <button className='ml-1 text-[#0082B3]' onClick={() => setAccess('logIn')}>Log In</button>
                        </p>
                    </form>
                </>}
            </div>
        </div>
    </div>
  )
}

export default UserAccess