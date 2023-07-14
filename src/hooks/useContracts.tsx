import React from 'react'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite
} from 'wagmi'

function useContracts () {
  const contractRead = useContractRead({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    // abi: wagmigotchiABI,
    functionName: 'getHunger'
  })

  const { config } = usePrepareContractWrite({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    // abi: wagmigotchiABI,
    functionName: 'feed',
    args: [1]
  })
  const contractWrite = useContractWrite(config)

  return { contractRead, contractWrite }
}

export default useContracts
