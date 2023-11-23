import Link from 'next/link';
import style from "@/styles/reglog.module.css";
import React, { FormEvent, useRef } from "react";
import router, { useRouter } from 'next/router';

function FormRegister() {

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function mandarDatosDeRegistro(evento: FormEvent) {
    evento.preventDefault();

    const datosAEnviar = {
      nombreCompleto: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };



    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosAEnviar),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json();
        console.log(errorData);
      } else {
        const responseData = await respuesta.json();
        console.log(responseData);
         router.push('/inicio');
      }
    } catch (error) {
      console.error(`Error en la solicitud: ${error}`);
    }
  }

  return (
    <section className={style.container}>
      <h1 className={style.title}>Regístrate</h1>
      <form className={style.formcontain} onSubmit={(e) => mandarDatosDeRegistro(e)}>
        <div className={style.formgroup}>
          <label htmlFor="fullname">Nombre y Apellido</label>
          <input type="text" ref={nameRef} placeholder='Nombre y Apellido' id='fullname' />
        </div>
        <div className={style.formgroup}>
          <label htmlFor="email">Email</label>
          <input type="text" ref={emailRef} placeholder='ejemplo@ejemplo.com' id='email' />
        </div>
        <div className={style.formgroup}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" ref={passwordRef} placeholder='*******' id='password' className='text-black' />
        </div>

        <button type='submit' className={style.btn}>Registrar</button>
        <Link href={'/'} className={style.tengocuenta}>Ya tengo una cuenta</Link>
      </form>
    </section>
  );
}

export default FormRegister;
