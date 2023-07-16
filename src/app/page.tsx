'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'
import contractAbi from './contract-abi.json'
import Image from 'next/image'
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwODdhYjZmNi01YTRjLTRhNDgtOGYyOS05ODQxZjdkZjE2NzMiLCJlbWFpbCI6Impvc2VsdWlzbWFuY28zN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzI0ZjNjY2MyMTVkNTJkZDVlMWQiLCJzY29wZWRLZXlTZWNyZXQiOiI1ZGI3NmEwNGVmNTRkYjFlMjMyZmEzMzkzNDdmYzZkM2FlZWY0ZmIyZGM4MGZlZTY3MjgwNGYyZDUxMmI3ZGJlIiwiaWF0IjoxNjg5MzA2NzI1fQ.1nafMrbsgr66YCP0UHEBez4Se6oUOGs3X6gMY7tKMiM`

export default function Home () {
  const [soat, setSoat] = useState<any>()
  const [tecno, setTecno] = useState<any>()
  const [param, setParam] = useState<Array<string>>(['', ''])
  const [data, setData] = useState<any>()
  const { isConnected, address } = useAccount()

  const { config: configMint } = usePrepareContractWrite({
    address: 'Here is a valid address in the avalanche local subnet',
    abi: contractAbi,
    functionName: 'safeMint',
    args: [param[0], param[1]]
  })
  const { config: configUpdate } = usePrepareContractWrite({
    address: 'Here is a valid address in the avalanche local subnet',
    abi: contractAbi,
    functionName: 'addURI',
    args: [param[1], 1]
  })
  const { write: update, status: statusUpdate } = useContractWrite(configUpdate)
  const {
    write: mint,
    isSuccess,
    status: statusMint
  } = useContractWrite(configMint)
  const { data: hasUri } = useContractRead({
    address: 'Here is a valid address in the avalanche local subnet',
    abi: contractAbi,
    functionName: 'balanceOf',
    args: [address]
  })
  const { data: ipfs } = useContractRead({
    address: 'Here is a valid address in the avalanche local subnet',
    abi: contractAbi,
    functionName: 'tokenURI',
    args: [1]
  })

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.debug('iniciando')
    e.preventDefault()
    console.debug('iniciando2')
    if (hasUri && ipfs) {
      const formDataTecno = new FormData()
      const formDataSoat = new FormData()
      formDataTecno.append('file', tecno)
      formDataSoat.append('file', soat)
      const metadataSoat = JSON.stringify({
        name: 'Soat'
      })
      const metadataTecno = JSON.stringify({
        name: 'Tecno'
      })
      formDataSoat.append('pinataMetadata', metadataSoat)
      formDataTecno.append('pinataMetadata', metadataTecno)
      const optionsTecno = JSON.stringify({
        cidVersion: 0
      })
      formDataTecno.append('pinataOptions', optionsTecno)
      const optionsSoat = JSON.stringify({
        cidVersion: 0
      })
      formDataSoat.append('pinataOptions', optionsSoat)
      try {
        const resTecno = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formDataTecno,
          {
            headers: {
              // @ts-expect-error
              'Content-Type': `multipart/form-data; boundary=${formDataTecno._boundary}`,
              Authorization: JWT
            }
          }
        )
        const resSoat = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formDataSoat,
          {
            headers: {
              // @ts-expect-error
              'Content-Type': `multipart/form-data; boundary=${formDataSoat._boundary}`,
              Authorization: JWT
            }
          }
        )
        const prevData = await axios.get(
          `https://ipfs.io/ipfs/${(ipfs as string).slice(7)}`
        )
        const data = JSON.stringify({
          name: 'Some car',
          description: 'Some car',
          image:
            'https://elcarrocolombiano.com/wp-content/uploads/2021/02/20210208-TOP-75-CARROS-MAS-VENDIDOS-DE-COLOMBIA-EN-ENERO-2021-01.jpg',
          attributes: [
            ...prevData.data.attributes,
            {
              trait_type: 'Tecno',
              value: resTecno.data.IpfsHash
            },
            {
              trait_type: 'Soat',
              value: resSoat.data.IpfsHash
            }
          ]
        })
        const newIpfs = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: JWT
            }
          }
        )
        setParam([address as string, 'ipfs://' + newIpfs.data.IpfsHash])
      } catch (error) {
        console.log(error)
      }
    } else {
      const formDataTecno = new FormData()
      const formDataSoat = new FormData()
      formDataTecno.append('file', tecno)
      formDataSoat.append('file', soat)
      console.debug('hello')
      const metadataSoat = JSON.stringify({
        name: 'Soat'
      })
      const metadataTecno = JSON.stringify({
        name: 'Tecno'
      })
      formDataSoat.append('pinataMetadata', metadataSoat)
      formDataTecno.append('pinataMetadata', metadataTecno)
      const optionsTecno = JSON.stringify({
        cidVersion: 0
      })
      formDataTecno.append('pinataOptions', optionsTecno)
      const optionsSoat = JSON.stringify({
        cidVersion: 0
      })
      formDataSoat.append('pinataOptions', optionsSoat)
      try {
        const resTecno = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formDataTecno,
          {
            headers: {
              // @ts-expect-error
              'Content-Type': `multipart/form-data; boundary=${formDataTecno._boundary}`,
              Authorization: JWT
            }
          }
        )
        const resSoat = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formDataSoat,
          {
            headers: {
              // @ts-expect-error
              'Content-Type': `multipart/form-data; boundary=${formDataSoat._boundary}`,
              Authorization: JWT
            }
          }
        )
        const data = JSON.stringify({
          name: 'Some car',
          description: 'Some car',
          image:
            'https://elcarrocolombiano.com/wp-content/uploads/2021/02/20210208-TOP-75-CARROS-MAS-VENDIDOS-DE-COLOMBIA-EN-ENERO-2021-01.jpg',
          attributes: [
            {
              trait_type: 'Tecno',
              value: resTecno.data.IpfsHash
            },
            {
              trait_type: 'Soat',
              value: resSoat.data.IpfsHash
            }
          ]
        })
        const ipfs = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: JWT
            }
          }
        )
        setParam([address as string, 'ipfs://' + ipfs.data.IpfsHash])
      } catch (error) {
        console.log(error)
      }
    }
  }
  useEffect(() => {
    async function getData () {
      const data = await axios.get(
        `https://ipfs.io/ipfs/${(ipfs as string).slice(7)}`
      )
      setData(data.data)
    }
    getData()
  }, [ipfs])

  useEffect(() => {
    console.debug(data)
    console.debug(param[0], statusMint)
    console.debug(param[1], statusUpdate)
    console.debug(mint)
    if (param[0] !== '' && statusMint === 'idle' && !data) {
      mint?.()
    } else if (data && param[0] !== '' && statusUpdate === 'idle') {
      update?.()
    }
  }, [statusMint, statusUpdate, param, data, mint, update])

  return (
    <main className='flex flex-col justify-center items-center bg-slate-100 min-h-screen'>
      <span className='absolute top-5 right-5'>
        <ConnectButton />
      </span>
      <h1 className='text-6xl font-bold font-mono text-cyan-900'>AutochainX</h1>
      <div>
        {isConnected ? (
          <form onSubmit={handleOnSubmit} className='flex gap-5 flex-col mt-10'>
            <div className='flex gap-5 flex-row'>
              <label
                className='bg-white flex flex-col gap-2 p-4 shadow-lg rounded-lg justify-center items-center'
                htmlFor='Tecno'
              >
                <p className='text-2xl font-bold'>TecnoMecanica</p>
                <input
                  // @ts-expect-error
                  onChange={e => setTecno(e.target.files[0])}
                  type='file'
                  id='Tecno'
                />
              </label>
              <label
                className='bg-white flex flex-col gap-2 p-4 shadow-lg rounded-lg justify-center items-center'
                htmlFor='Soat'
              >
                <p className='text-2xl font-bold'>Soat</p>
                <input
                  // @ts-expect-error
                  onChange={e => setSoat(e.target.files[0])}
                  type='file'
                  id='Soat'
                />
              </label>
            </div>

            <button
              className='rounded-md bg-blue-500 shadow-md text-white font-bold py-2 hover:bg-blue-700 transition ease-in-out duration-150'
              type='submit'
            >
              {hasUri ? 'Actualizar' : 'Subir'}
            </button>
          </form>
        ) : (
          <p className='my-10 text-2xl font-bold'>
            Conecta tu billetera para continuar
          </p>
        )}
      </div>
      {data && (
        <div className='w-3/6 h-3/6 flex justify-center items-center flex-col bg-white rounded-lg py-5 shadow-md my-10'>
          <h1 className='text-2xl font-bold'>{data.name}</h1>
          <p>{data.description}</p>
          <img className='h-5/6 w-5/6 m-2' src={data.image} alt='' />
          <div className='flex flex-col gap-5'>
            {data.attributes.map((item: any, index: number) => (
              <div className='bg-slate-100 shadow-sm rounded-sm p-2' key={(item.value, index)}>
                <p className='font-ligth font-bold' >{item.trait_type}</p>
                <p className='font-ligth' >{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
