import { useEffect } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { useForm } from 'react-hook-form'
import { useLogin } from '@/modules/auth/hooks/useLogin'
import useAppStore from '@/store/app/appStore'

interface LoginInputs {
  email: string
  password: string
}

const Login = () => {
  const { setDefaultCompany } = useAppStore((state) => state)
  const { hasErrors, loading, login } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
    setFocus,
  } = useForm<LoginInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = async ({ email, password }: LoginInputs): Promise<void> => {
    setDefaultCompany(null)
    await login(email, password)
    reset({ password: '' })
  }
  useEffect(() => {
    document.title = `S7 | Bienvenido`
    setFocus('email')
  }, [setFocus])

  return (
    <form className="login" onSubmit={handleSubmit(onSubmit)}>
      <div className="blurred-box">
        <div className="relative z-10 px-4 py-6 flex flex-col items-center">
          <img
            className="rounded-full w-14 h-14"
            src={'/images/logo.jpg'}
            alt="img login"
            height={80}
            width={80}
          />
          {hasErrors && (
            <span className="text-red-400 font-extralight text-sm text-center">
              El correo o contraseña son incorrectos
            </span>
          )}
          <div className="flex flex-col">
            <label className="text-white mt-2 text-[13px] tracking-wider">Usuario</label>
            <input
              className="rounded-md px-2 py-1 outline-none bg-slate-200/50 font-semibold"
              type="email"
              {...register('email', { required: true })}
            />
            <label className="text-white mt-2 text-[13px] tracking-wider">Contraseña</label>
            <input
              className="rounded-md px-2 py-1 outline-none bg-slate-200/50"
              type="password"
              {...register('password', { required: true })}
            />
            <button
              type="submit"
              disabled={loading || !isValid}
              className="w-full flex justify-center mt-4 bg-[#121b3c] text-white font-semibold py-2 rounded-md"
            >
              {loading ? (
                <AiOutlineLoading className="animate-spin h-5 w-5 text-gray-200" />
              ) : (
                'Ingresar'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
export default Login
