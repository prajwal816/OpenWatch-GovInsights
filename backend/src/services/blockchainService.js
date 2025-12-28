import { ethers } from 'ethers'
import crypto from 'crypto'

// Optional blockchain service for record integrity verification
export const hashRecord = async (record) => {
    try {
        // Create a hash of the record data
        const recordString = JSON.stringify({
            id: record.id,
            title: record.title,
            description: record.description,
            department: record.department,
            status: record.status,
            createdAt: record.createdAt,
            createdBy: record.createdBy
        })

        const hash = crypto.createHash('sha256').update(recordString).digest('hex')

        // If blockchain is configured, store hash on-chain
        if (process.env.ETHEREUM_RPC_URL && process.env.PRIVATE_KEY && process.env.CONTRACT_ADDRESS) {
            try {
                const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
                const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

                // Simple contract ABI for storing hashes
                const contractABI = [
                    "function storeHash(string memory recordId, bytes32 hash) public",
                    "function getHash(string memory recordId) public view returns (bytes32)"
                ]

                const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet)

                // Store hash on blockchain
                const tx = await contract.storeHash(record.id, `0x${hash}`)
                await tx.wait()

                console.log(`Record ${record.id} hash stored on blockchain: ${hash}`)
                return {
                    hash,
                    blockchainTx: tx.hash,
                    verified: true
                }
            } catch (blockchainError) {
                console.warn('Blockchain storage failed, using local hash only:', blockchainError.message)
                return {
                    hash,
                    verified: false,
                    error: blockchainError.message
                }
            }
        }

        // Return local hash only
        return {
            hash,
            verified: false,
            note: 'Blockchain not configured, using local hash only'
        }
    } catch (error) {
        console.error('Hash generation failed:', error)
        return null
    }
}

export const verifyRecord = async (record, expectedHash) => {
    try {
        const currentHash = await hashRecord(record)
        return currentHash?.hash === expectedHash
    } catch (error) {
        console.error('Record verification failed:', error)
        return false
    }
}

export const getBlockchainHash = async (recordId) => {
    try {
        if (!process.env.ETHEREUM_RPC_URL || !process.env.CONTRACT_ADDRESS) {
            return null
        }

        const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL)
        const contractABI = [
            "function getHash(string memory recordId) public view returns (bytes32)"
        ]

        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, provider)
        const hash = await contract.getHash(recordId)

        return hash !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? hash : null
    } catch (error) {
        console.error('Blockchain hash retrieval failed:', error)
        return null
    }
}