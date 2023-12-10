"use client"

import dynamic from "next/dynamic"
import Header from "./components/Header"
import Tooltip from "./components/Tooltip"
import { Provider } from "react-redux"
import store from "./redux/store"

const Input = dynamic(()=>import('./components/Input'), {ssr: false});
const MapComponent = dynamic(()=>import('./components/Map'), {ssr: false});
export default function Home() {
  return (
  <Provider store={store}>
    <div className="bg-cover bg-gradient-to-r from-blue-500 to-blue-500 h-screen">
      <div className="bg-white/25 w-full flex flex-col h-fit">
        <Header />
        <div className="flex flex-col md:flex-row justify-between items-center p-12">
          <Input />
          <MapComponent />
        </div>
        <Tooltip />
      </div>
    </div>
    </Provider>
  )
}
