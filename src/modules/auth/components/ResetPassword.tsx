import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
  useEffect(() => {
    return () => {
      localStorage.removeItem('resetToken')
    }
  }, [])
  const { token } = useParams()

  const resetToken = localStorage.getItem('resetToken')
  if (resetToken !== token) {
    return <Navigate to="/" />
  }

  return (
    <form className="login">
      <div className="blurred-box">
        <div className="relative z-10 px-4 py-6 flex flex-col items-center">
          <div className="flex flex-col">
            <label className="text-white mt-2 text-[13px] tracking-wider">Nueva contraseña</label>
            <input
              type="password"
              name="password" // 👈 debe coincidir con {{email}} en tu template
              required
              className="rounded-md px-2 py-1 outline-none bg-slate-200/50 font-semibold"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white mt-2 text-[13px] tracking-wider">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword" // 👈 debe coincidir con {{email}} en tu template
              required
              className="rounded-md px-2 py-1 outline-none bg-slate-200/50 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center mt-4 bg-[#121b3c] text-white font-semibold py-2 rounded-md"
          >
            Restablecer contraseña
          </button>
        </div>
      </div>
    </form>
  )
}

export default ResetPassword
