import Image from 'next/image'
import { Inter } from 'next/font/google'
import FormLogin from '@/components/FormLogin'
  
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main>
      <FormLogin />
    </main>
  )
}
