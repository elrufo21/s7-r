import React, { useRef } from 'react'
import emailjs from 'emailjs-com'

const RecoverPassword = () => {
  const form = useRef<HTMLFormElement>(null)

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailInput = form.current?.elements.namedItem('email') as HTMLInputElement
    const email = emailInput.value

    // 🔑 Generamos un token único
    const token = crypto.randomUUID()
    const link = 'localhost:5173/reset-password/' + token
    emailjs
      .send(
        'service_6nswcve', // 👈 tu Service ID
        'template_0xzqquw', // 👈 tu Template ID
        {
          email: email, // 👈 mismo nombre que en tu plantilla {{email}}
          link: link, // 👈 se reemplaza en {{token}}
        },
        'LRi3in64_CQyL3qOT' // 👈 tu Public Key
      )
      .then(
        () => {
          localStorage.setItem('resetToken', token)
          alert('Revisa tu correo para continuar.')
        },
        (error) => {
          console.error('❌ Error:', error.text)
          alert('Error al enviar el correo.')
        }
      )
  }

  return (
    <form ref={form} onSubmit={sendEmail} className="login">
      <div className="blurred-box">
        <div className="relative z-10 px-4 py-6 flex flex-col items-center">
          <img
            className="rounded-full w-14 h-14"
            src={'/images/logo.jpg'}
            alt="img login"
            height={80}
            width={80}
          />
          <div className="flex flex-col">
            <label className="text-white mt-2 text-[13px] tracking-wider">Correo electrónico</label>
            <input
              type="email"
              name="email" // 👈 debe coincidir con {{email}} en tu template
              required
              className="rounded-md px-2 py-1 outline-none bg-slate-200/50 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center mt-4 bg-[#121b3c] text-white font-semibold py-2 rounded-md"
          >
            Enviar correo
          </button>
        </div>
      </div>
    </form>
  )
}

export default RecoverPassword
