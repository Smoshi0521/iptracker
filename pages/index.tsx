import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { BiSolidChevronRight } from 'react-icons/bi';
interface Location {
  lat: string;
  lng: string;
}
const LeafletMap = dynamic(() => import('@/component/Map/LeafletMap'), { ssr: false })
export default function Home() {
  const [center, setCenter] = useState<[number, number]>([0, 0])

  const [geolocation, setGeolocation] = useState<any>(null)
  const [ipAddress, setIpAddress] = useState<any>('192.212.174.101')
  const ipRef = useRef<HTMLInputElement>(null)
  const [mapKey, setMapKey] = useState<number>(0);

  useEffect(() => {
    const fetchGeolocation = async () => {
      try {
        const response = await fetch(`/api/iptrack?ipAddress=${ipAddress}`)
        const data = await response.json()
        setGeolocation(data)
        const { lat, lng }: Location = data.location;
        setCenter([parseFloat(lat), parseFloat(lng)])
      }
      catch (err) {
        console.log(err)
      }
    }

    fetchGeolocation();
  }, [ipAddress])

  useEffect(() => {
    const updateMapKey = () => {
      setMapKey((prevKey) => prevKey + 1);
    };
    updateMapKey()
  }, [center]);

  const fetchIpAddress = async (e: FormEvent) => {
    e.preventDefault()
    const ipRefAddress = ipRef?.current?.value
    setIpAddress(ipRefAddress)
  }
  return (
    <div className='flex flex-col h-screen justify-between'>
      <div className='bg-desktop h-[300px] bg-cover flex justify-center w-full'>
        {
          geolocation && (
            <div className='flex flex-col items-center justify-start sm:justify-center gap-5 border-green-500 w-full h-full z-20 top-0 py-5'>
              <h1 className='font-bold text-white text-2xl'>IP Address Tracker</h1>
              <form onSubmit={(e) => fetchIpAddress(e)} className='flex items-center justify-center w-full px-5 '>
                <input type='text' ref={ipRef} className='w-full sm:max-w-[500px] py-3 pl-5 rounded-l-md outline-none' placeholder='Search for any IP adddress or domain' />
                <button type='submit' className='bg-black rounded-r-md py-4 px-4 text-white'><BiSolidChevronRight className="" /></button>
              </form>

              <div className='flex justify-center absolute top-36 sm:top-48 z-30 max-w-[1000px] w-full px-5 mx-10  border-black'>
                <div className='flex flex-col items-center sm:flex-row sm:items-start gap-3 sm:gap-5 bg-white w-full sm:min-w-[600px] sm:max-w-[1000px] pt-5 pb-5 sm:pb-6 px-8 rounded-xl shadow-xl'>
                  <div className='flex-1 text-center sm:text-start space-y-1'>
                    <h2 className='text-gray-500 text-xs font-medium'>IP ADDRESS</h2>
                    <p className='font-bold text-md'>{geolocation?.ip}</p>
                  </div>
                  <span className='h-5/6 hidden sm:block border-[1px] border-gray-200'></span>
                  <div className='flex-1 text-center sm:text-start space-y-1'>
                    <h2 className='text-gray-500 text-xs font-medium'>LOCATION</h2>
                    <p className='font-bold text-md'>{`${geolocation?.location?.region}, ${geolocation?.location?.country} ${geolocation?.location?.postalCode}`}</p>
                  </div>
                  <span className='h-5/6 hidden sm:block border-[1px] border-gray-200'></span>
                  <div className='flex-1 text-center sm:text-start'>
                    <h2 className='text-gray-500 text-xs font-medium'>TIMEZONE</h2>
                    <p className='font-bold text-md'>{`UTC ${geolocation?.location?.timezone}`}</p>
                  </div >
                  <span className='h-5/6 hidden sm:block border-[1px] border-gray-200'></span>
                  <div className='flex-1 text-center sm:text-start'>
                    <h2 className='text-gray-500 text-xs font-medium'>ISP</h2>
                    <p className='font-bold text-md'>{geolocation?.isp}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <LeafletMap key={mapKey} ipAddress={center} isp={geolocation?.isp} />
    </div>
  )
}
