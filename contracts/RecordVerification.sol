// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title RecordVerification
 * @dev Smart contract for storing government record hashes for integrity verification
 * @notice This contract stores only hashes, not the actual record data, ensuring privacy
 */
contract RecordVerification {
    
    // Events
    event RecordHashStored(string indexed recordId, bytes32 indexed hash, address indexed storer, uint256 timestamp);
    event RecordHashUpdated(string indexed recordId, bytes32 indexed oldHash, bytes32 indexed newHash, address indexed updater, uint256 timestamp);
    
    // Struct to store record hash information
    struct RecordHash {
        bytes32 hash;
        address storer;
        uint256 timestamp;
        bool exists;
    }
    
    // Mapping from record ID to its hash information
    mapping(string => RecordHash) private recordHashes;
    
    // Mapping to track authorized addresses (government officials)
    mapping(address => bool) public authorizedStorers;
    
    // Contract owner (admin)
    address public owner;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedStorers[msg.sender] || msg.sender == owner, "Not authorized to store hashes");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedStorers[msg.sender] = true;
    }
    
    /**
     * @dev Store a hash for a government record
     * @param recordId Unique identifier for the record
     * @param hash SHA256 hash of the record data
     */
    function storeHash(string memory recordId, bytes32 hash) public onlyAuthorized {
        require(bytes(recordId).length > 0, "Record ID cannot be empty");
        require(hash != bytes32(0), "Hash cannot be empty");
        
        bool isUpdate = recordHashes[recordId].exists;
        bytes32 oldHash = recordHashes[recordId].hash;
        
        recordHashes[recordId] = RecordHash({
            hash: hash,
            storer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        if (isUpdate) {
            emit RecordHashUpdated(recordId, oldHash, hash, msg.sender, block.timestamp);
        } else {
            emit RecordHashStored(recordId, hash, msg.sender, block.timestamp);
        }
    }
    
    /**
     * @dev Get the hash for a specific record
     * @param recordId Unique identifier for the record
     * @return hash The stored hash
     * @return storer Address that stored the hash
     * @return timestamp When the hash was stored
     */
    function getHash(string memory recordId) public view returns (bytes32 hash, address storer, uint256 timestamp) {
        RecordHash memory recordHash = recordHashes[recordId];
        require(recordHash.exists, "Record hash not found");
        
        return (recordHash.hash, recordHash.storer, recordHash.timestamp);
    }
    
    /**
     * @dev Check if a record hash exists
     * @param recordId Unique identifier for the record
     * @return exists Whether the hash exists
     */
    function hashExists(string memory recordId) public view returns (bool exists) {
        return recordHashes[recordId].exists;
    }
    
    /**
     * @dev Verify if a provided hash matches the stored hash for a record
     * @param recordId Unique identifier for the record
     * @param providedHash Hash to verify against stored hash
     * @return isValid Whether the hashes match
     */
    function verifyHash(string memory recordId, bytes32 providedHash) public view returns (bool isValid) {
        require(recordHashes[recordId].exists, "Record hash not found");
        return recordHashes[recordId].hash == providedHash;
    }
    
    /**
     * @dev Add an authorized address that can store hashes
     * @param storer Address to authorize
     */
    function addAuthorizedStorer(address storer) public onlyOwner {
        require(storer != address(0), "Invalid address");
        authorizedStorers[storer] = true;
    }
    
    /**
     * @dev Remove an authorized address
     * @param storer Address to remove authorization from
     */
    function removeAuthorizedStorer(address storer) public onlyOwner {
        require(storer != owner, "Cannot remove owner authorization");
        authorizedStorers[storer] = false;
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        require(newOwner != owner, "New owner must be different from current owner");
        
        // Remove old owner from authorized storers and add new owner
        authorizedStorers[owner] = false;
        authorizedStorers[newOwner] = true;
        owner = newOwner;
    }
    
    /**
     * @dev Get contract information
     * @return contractOwner Current owner address
     * @return totalAuthorized Number of authorized addresses (approximate)
     */
    function getContractInfo() public view returns (address contractOwner, uint256 blockNumber) {
        return (owner, block.number);
    }
}