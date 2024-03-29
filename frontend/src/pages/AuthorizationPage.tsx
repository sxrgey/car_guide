import React, { useEffect, useState } from 'react'
import { InputString } from '../components/InputString'
import { delay } from '../functions/common'
import axios, { AxiosError } from 'axios'
import { IUser } from "../models"

export function AuthorizationPage() {

  const [emailInput, setEmailInput] = useState<string>('')
  const [passwordInput, setPasswordInput] = useState<string>('')
  const [successAutho, setSuccessAutho] = useState(false)
  const [errorAutho, setErrorAutho] = useState(false)
  const [autStatus, setAutStatus] = useState<boolean>()
  const [clickAut, setClickAut] = useState(0)
  const [jwt, setJwt] = useState('')

  let user:IUser = {
    email: emailInput,
    password: passwordInput
  }
  useEffect(() => {
    user = {

      email: emailInput,
      password: passwordInput
    }
  }, [clickAut])
  
  async function checkAuthorization()  {
    try {
    await axios.post<{jwt: string}>('https://carguider.ru/api/login/', user).catch(error => {setAutStatus(false)})
    const response = await axios.post<{jwt: string}>('https://carguider.ru/api/login/', user)
    setAutStatus(response? true: false)
    setJwt(response.data.jwt)
    tryAuthorization()
    } catch (e: unknown) {
      const error = e as AxiosError
      console.log(error.message)
    } 
  }

  useEffect(() => {
    tryAuthorization()
  }, [autStatus])
    
  function tryAuthorization() {
    const response = autStatus
    if (response != undefined) {
      if (response) {
        setSuccessAutho(true)
        setErrorAutho(false)
        localStorage.setItem('jwt', jwt)
        delay(1000).then(() => window.location.assign('/'))
      } else {
        setErrorAutho(true)
        setSuccessAutho(false)
      }
    }
  }


  return (
    <>

      <div
        className = "fixed bg-gray-100 w-5/12 h-1/2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-3xl border-l-2 border-r-2 border-red-600 shadow-2xl shadow-black/50">
      
        <div className="container w-1/2 space-y-3 fixed inline-block text-left left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <h2 className="text-3xl text-center text-red-700">Car Guider</h2>
            <h1 className='text-2xl text-center text-gray-500'>Вход</h1>
            <InputString title='E-mail' placeholder = 'Введите E-mail' name = 'email' setInput={setEmailInput}/>
            <InputString title='Пароль' placeholder = 'Введите пароль' name = 'password' setInput={setPasswordInput}/>
            <button className=" w-full px-2 py-1 transition ease-in duration-200 uppercase rounded-full text-red-700 hover:bg-red-600 hover:text-white border-2 border-red-700 focus:outline-none"
            onClick={() => {setClickAut(prev => prev + 1); checkAuthorization()}}>
              Войти
            </button>
          <h1 className='text-gray-500 text-sm text-center overline'>Нет аккаунта в Car Guider?</h1>
          <div className={successAutho? 'visible' : 'hidden'}>
            <h1 className='text-green-500 text-xm text-center py-2 underline'>Вход выполнен</h1>
          </div>
          <div className={errorAutho? 'visible' : 'hidden'}>
            <h1 className='text-red-500 text-xm text-center py-2 underline'>Неправильно указан логин и/или пароль</h1>
          </div>
          <button type="button" className="w-full px-2 py-1 transition ease-in duration-200 uppercase rounded-full bg-red-100 text-red-700 border-red-100 hover:bg-red-200 hover:border-red-200 border-2 focus:outline-none "
          onClick= {() => window.location.assign('/registration')}>
            Зарегистрироваться
          </button>
        </div>
      </div>

    </>
    
  )
}
