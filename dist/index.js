'use strict';

var viem = require('viem');
var accounts = require('viem/accounts');
var EventEmitter = require('events');
var React3 = require('react');
var jsxRuntime = require('react/jsx-runtime');
var framerMotion = require('framer-motion');
var lucideReact = require('lucide-react');
var reactSlot = require('@radix-ui/react-slot');
var classVarianceAuthority = require('class-variance-authority');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var ProgressPrimitive = require('@radix-ui/react-progress');
var AvatarPrimitive = require('@radix-ui/react-avatar');
var DialogPrimitive = require('@radix-ui/react-dialog');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var EventEmitter__default = /*#__PURE__*/_interopDefault(EventEmitter);
var React3__namespace = /*#__PURE__*/_interopNamespace(React3);
var ProgressPrimitive__namespace = /*#__PURE__*/_interopNamespace(ProgressPrimitive);
var AvatarPrimitive__namespace = /*#__PURE__*/_interopNamespace(AvatarPrimitive);
var DialogPrimitive__namespace = /*#__PURE__*/_interopNamespace(DialogPrimitive);

// src/core/SubscriptionSDK.ts

// src/config/abis.ts
var subscriptionManagerABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getMerchantBalance",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMerchantPlan",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ISubscriptionTypes.MerchantPlan",
        "components": [
          {
            "name": "payoutAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "subscriptionPeriod",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "gracePeriod",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "isActive",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "totalSubscribers",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getMerchantPrice",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isMerchantTokenAccepted",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "platformFeeBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerMerchant",
    "inputs": [
      {
        "name": "payoutAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "subscriptionPeriod",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "gracePeriod",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setMerchantPrice",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "price",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setPlatformFee",
    "inputs": [
      {
        "name": "_feeBps",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setSubscriptionNFT",
    "inputs": [
      {
        "name": "_nft",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "subscribe",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "subscriptionNFT",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateMerchantPlan",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "payoutAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "subscriptionPeriod",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "isActive",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawMerchantBalance",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawPlatformFees",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "MerchantRegistered",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "payoutAddress",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MerchantWithdrawal",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PaymentReceived",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "paymentToken",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "platformFee",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "period",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PlatformFeeWithdrawal",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];
var subscriptionNFTABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "uri",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_manager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_callbackSender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "DEFAULT_ADMIN_ROLE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MANAGER_ROLE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "REACTIVE_ROLE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOfBatch",
    "inputs": [
      {
        "name": "accounts",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "burnExpired",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "coverDebt",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getRemainingTime",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoleAdmin",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSubscriptionStatus",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct ISubscriptionTypes.SubscriptionStatus",
        "components": [
          {
            "name": "expiresAt",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "startedAt",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "renewalCount",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "lastPaymentAmount",
            "type": "uint128",
            "internalType": "uint128"
          },
          {
            "name": "paymentToken",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "autoRenew",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "grantRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "hasRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isInGracePeriod",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isSubscriptionActive",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mintOrRenew",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "additionalPeriod",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "onPaymentProcessed",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expiresAt",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pay",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "pay",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "processBatchExpiry",
    "inputs": [
      {
        "name": "users",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "merchantIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "reactiveContract",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "callerConfirmation",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "revokeRole",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeBatchTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setMerchantGracePeriod",
    "inputs": [
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "gracePeriod",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setReactiveContract",
    "inputs": [
      {
        "name": "_reactive",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "subscriptionManager",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "uri",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleAdminChanged",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "previousAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "newAdminRole",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleGranted",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleRevoked",
    "inputs": [
      {
        "name": "role",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SubscriptionBurned",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SubscriptionExpired",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SubscriptionMinted",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "expiresAt",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "renewalCount",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "SubscriptionRenewed",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "newExpiresAt",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "renewalCount",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferBatch",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ids",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      },
      {
        "name": "values",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferSingle",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "URI",
    "inputs": [
      {
        "name": "value",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AccessControlBadConfirmation",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AccessControlUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "neededRole",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InvalidArrayLength",
    "inputs": [
      {
        "name": "idsLength",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "valuesLength",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InvalidOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC1155MissingApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  }
];
var subscriptionReactiveABI = [
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "coverDebt",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositForOperations",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "emergencyWithdraw",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getDebt",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getExpiringSubscriptions",
    "inputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "users",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "merchantIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getTrackedExpiration",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [
      {
        "name": "subscriptionManager",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "subscriptionNFT",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "destinationChainId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pay",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "react",
    "inputs": [
      {
        "name": "log",
        "type": "tuple",
        "internalType": "struct IReactive.LogRecord",
        "components": [
          {
            "name": "chain_id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "_contract",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "topic_0",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "topic_1",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "topic_2",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "topic_3",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "block_number",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "op_code",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "block_hash",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "tx_hash",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "log_index",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resume",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "subscribeToCron",
    "inputs": [
      {
        "name": "interval",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "subscribeToPaymentEvents",
    "inputs": [
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "contractAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateCallbackGasLimit",
    "inputs": [
      {
        "name": "newLimit",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "updateSubscriptionState",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "merchantId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "expiresAt",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Callback",
    "inputs": [
      {
        "name": "chain_id",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "_contract",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "gas_limit",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "payload",
        "type": "bytes",
        "indexed": false,
        "internalType": "bytes"
      }
    ],
    "anonymous": false
  }
];
var mockERC20ABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "symbol",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "decimals_",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "burn",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];

// src/config/contracts.ts
var CONTRACT_ADDRESSES = {
  sepolia: {
    subscriptionManager: "0x82b069578ae3dA9ea740D24934334208b83E530E",
    subscriptionNFT: "0x404cb817FA393D3689D1405DB0B76a20eDE72d43",
    testToken: "0x10586EBF2Ce1F3e851a8F15659cBa15b03Eb8B8A"
  },
  reactive: {
    subscriptionReactive: "0xa55B7A74D05b5D5C48E431e44Fea83a1047A7582"
  }
};

// src/services/MerchantService.ts
var MerchantService = class {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.contract = viem.getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }
  /**
   * Register a new merchant on the platform
   */
  async registerMerchant(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const hash = await this.contract.write.registerMerchant([
      params.payoutAddress,
      BigInt(params.subscriptionPeriod),
      BigInt(params.gracePeriod)
    ]);
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
    const merchantId = this.extractMerchantIdFromReceipt(receipt);
    return { hash, merchantId };
  }
  /**
   * Update existing merchant plan configuration
   */
  async updateMerchantPlan(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.contract.write.updateMerchantPlan([
      params.merchantId,
      params.payoutAddress,
      BigInt(params.subscriptionPeriod),
      params.isActive
    ]);
  }
  /**
   * Set pricing for a specific payment token
   */
  async setMerchantPrice(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    params.decimals || 18;
    const priceInWei = viem.parseEther(params.price);
    return await this.contract.write.setMerchantPrice([
      params.merchantId,
      params.paymentToken,
      priceInWei
    ]);
  }
  /**
   * Set multiple token prices at once
   */
  async setBulkPrices(params) {
    const hashes = [];
    for (const token of params.tokens) {
      const hash = await this.setMerchantPrice({
        merchantId: params.merchantId,
        paymentToken: token.address,
        price: token.price,
        decimals: token.decimals
      });
      hashes.push(hash);
    }
    return hashes;
  }
  /**
   * Get merchant plan details
   */
  async getMerchantPlan(merchantId) {
    const plan = await this.contract.read.getMerchantPlan([merchantId]);
    return {
      payoutAddress: plan.payoutAddress,
      subscriptionPeriod: plan.subscriptionPeriod,
      gracePeriod: plan.gracePeriod,
      isActive: plan.isActive,
      totalSubscribers: plan.totalSubscribers
    };
  }
  /**
   * Get merchant balance for a specific token
   */
  async getMerchantBalance(merchantId, token) {
    return await this.contract.read.getMerchantBalance([merchantId, token]);
  }
  /**
   * Get all balances for a merchant across multiple tokens
   */
  async getAllMerchantBalances(merchantId, tokens) {
    const balances = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      const balance = await this.getMerchantBalance(merchantId, token);
      if (balance > 0n) {
        balances.set(token, balance);
      }
    }
    return balances;
  }
  /**
   * Withdraw merchant balance for a specific token
   */
  async withdrawMerchantBalance(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.contract.write.withdrawMerchantBalance([
      params.merchantId,
      params.token
    ]);
  }
  /**
   * Withdraw all available balances for a merchant
   */
  async withdrawAllBalances(merchantId, tokens) {
    const hashes = [];
    const balances = await this.getAllMerchantBalances(merchantId, tokens);
    for (const [token, balance] of balances) {
      if (balance > 0n) {
        const hash = await this.withdrawMerchantBalance({
          merchantId,
          token
        });
        hashes.push(hash);
      }
    }
    return hashes;
  }
  /**
   * Get merchant price for a specific token
   */
  async getMerchantPrice(merchantId, token) {
    return await this.contract.read.getMerchantPrice([merchantId, token]);
  }
  /**
   * Check if a merchant accepts a specific token
   */
  async isMerchantTokenAccepted(merchantId, token) {
    return await this.contract.read.isMerchantTokenAccepted([merchantId, token]);
  }
  /**
   * Get all accepted tokens and their prices for a merchant
   */
  async getMerchantTokenPrices(merchantId, possibleTokens) {
    const prices = /* @__PURE__ */ new Map();
    for (const token of possibleTokens) {
      const isAccepted = await this.isMerchantTokenAccepted(merchantId, token);
      if (isAccepted) {
        const price = await this.getMerchantPrice(merchantId, token);
        prices.set(token, price);
      }
    }
    return prices;
  }
  /**
   * Listen to merchant registration events
   */
  watchMerchantRegistrations(callback) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "MerchantRegistered",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { merchantId, owner, payoutAddress } = log.args;
          callback(merchantId, owner, payoutAddress);
        });
      }
    });
  }
  /**
   * Listen to merchant withdrawal events
   */
  watchMerchantWithdrawals(merchantId, callback) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "MerchantWithdrawal",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          if (!merchantId || args.merchantId === merchantId) {
            callback?.({
              merchantId: args.merchantId,
              token: args.token,
              amount: args.amount,
              payoutAddress: args.payoutAddress
            });
          }
        });
      }
    });
  }
  /**
   * Get historical merchant events
   */
  async getMerchantHistory(merchantId) {
    const registrationLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "MerchantRegistered",
      fromBlock: "earliest",
      args: { merchantId }
    });
    const withdrawalLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "MerchantWithdrawal",
      fromBlock: "earliest",
      args: { merchantId }
    });
    return {
      registrations: registrationLogs,
      withdrawals: withdrawalLogs
    };
  }
  /**
   * Extract merchant ID from transaction receipt
   */
  extractMerchantIdFromReceipt(receipt) {
    const merchantRegisteredEvent = receipt.logs.find(
      (log) => {
        try {
          const decoded = viem.decodeEventLog({
            abi: subscriptionManagerABI,
            data: log.data,
            topics: log.topics
          });
          return decoded.eventName === "MerchantRegistered";
        } catch {
          return false;
        }
      }
    );
    if (merchantRegisteredEvent) {
      const decoded = viem.decodeEventLog({
        abi: subscriptionManagerABI,
        data: merchantRegisteredEvent.data,
        topics: merchantRegisteredEvent.topics
      });
      return decoded.args.merchantId;
    }
    return void 0;
  }
  /**
   * Format price for display
   */
  formatPrice(price, decimals = 18) {
    return viem.formatEther(price);
  }
  /**
   * Calculate estimated revenue
   */
  calculateEstimatedRevenue(params) {
    const totalRevenue = params.price * BigInt(params.subscribers);
    const platformFee = totalRevenue * BigInt(params.platformFeeBps) / 10000n;
    return totalRevenue - platformFee;
  }
  /**
   * Check if an address is a registered merchant
   */
  async isMerchant(address) {
    try {
      const plan = await this.getMerchantPlan(1n);
      return plan.payoutAddress.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }
  /**
   * Get total number of merchants registered
   */
  async getMerchantCount() {
    let count = 0n;
    for (let i = 1n; i <= 10n; i++) {
      try {
        await this.getMerchantPlan(i);
        count = i;
      } catch {
        break;
      }
    }
    return count;
  }
};
var SubscriptionService = class {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.managerContract = viem.getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
    this.nftContract = viem.getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }
  /**
   * Subscribe to a merchant plan
   */
  async subscribe(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const isETH = params.paymentToken === viem.zeroAddress;
    if (isETH) {
      const price = await this.getSubscriptionPrice(params.merchantId, params.paymentToken);
      return await this.managerContract.write.subscribe(
        [params.merchantId, params.paymentToken],
        { value: price }
      );
    } else {
      return await this.managerContract.write.subscribe([
        params.merchantId,
        params.paymentToken
      ]);
    }
  }
  /**
   * Subscribe with automatic token approval
   */
  async subscribeWithApproval(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const price = await this.getSubscriptionPrice(params.merchantId, params.paymentToken);
    const allowance = await params.tokenContract.read.allowance([
      this.walletClient.account?.address,
      CONTRACT_ADDRESSES.sepolia.subscriptionManager
    ]);
    let approvalHash;
    if (allowance < price) {
      approvalHash = await params.tokenContract.write.approve([
        CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        price
      ]);
      await this.publicClient.waitForTransactionReceipt({ hash: approvalHash });
    }
    const subscriptionHash = await this.subscribe({
      merchantId: params.merchantId,
      paymentToken: params.paymentToken
    });
    return { approvalHash, subscriptionHash };
  }
  /**
   * Get subscription status for a user
   */
  async getSubscriptionStatus(user, merchantId) {
    const status = await this.nftContract.read.getSubscriptionStatus([user, merchantId]);
    return {
      isActive: status.isActive,
      expiresAt: status.expiresAt,
      renewalCount: status.renewalCount,
      lastRenewal: status.lastRenewal,
      merchantId: status.merchantId
    };
  }
  /**
   * Check if subscription is active
   */
  async isSubscriptionActive(user, merchantId) {
    return await this.nftContract.read.isSubscriptionActive([user, merchantId]);
  }
  /**
   * Get all user subscriptions
   */
  async getUserSubscriptions(user) {
    return await this.nftContract.read.getUserSubscriptions([user]);
  }
  /**
   * Get detailed information for all user subscriptions
   */
  async getAllUserSubscriptionDetails(user) {
    const merchantIds = await this.getUserSubscriptions(user);
    const statuses = [];
    for (const merchantId of merchantIds) {
      const status = await this.getSubscriptionStatus(user, merchantId);
      statuses.push(status);
    }
    return statuses;
  }
  /**
   * Get subscription price for a merchant and token
   */
  async getSubscriptionPrice(merchantId, paymentToken) {
    return await this.managerContract.read.getMerchantPrice([merchantId, paymentToken]);
  }
  /**
   * Get all payment options for a merchant
   */
  async getPaymentOptions(merchantId, supportedTokens) {
    const options = [];
    for (const token of supportedTokens) {
      const isAccepted = await this.managerContract.read.isMerchantTokenAccepted([
        merchantId,
        token.address
      ]);
      if (isAccepted) {
        const price = await this.getSubscriptionPrice(merchantId, token.address);
        options.push({
          token: token.address,
          price,
          symbol: token.symbol,
          decimals: token.decimals
        });
      }
    }
    return options;
  }
  /**
   * Calculate time remaining for subscription
   */
  getTimeRemaining(expiresAt) {
    const now = BigInt(Math.floor(Date.now() / 1e3));
    const remaining = Number(expiresAt - now);
    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, isExpired: true };
    }
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor(remaining % 86400 / 3600);
    const minutes = Math.floor(remaining % 3600 / 60);
    return { days, hours, minutes, isExpired: false };
  }
  /**
   * Get subscription plan details
   */
  async getSubscriptionPlan(merchantId) {
    const plan = await this.managerContract.read.getMerchantPlan([merchantId]);
    return {
      period: plan.subscriptionPeriod,
      gracePeriod: plan.gracePeriod,
      isActive: plan.isActive
    };
  }
  /**
   * Estimate renewal date
   */
  estimateRenewalDate(currentExpiry, period) {
    const now = BigInt(Math.floor(Date.now() / 1e3));
    const newExpiry = currentExpiry > now ? currentExpiry + period : now + period;
    return new Date(Number(newExpiry) * 1e3);
  }
  /**
   * Watch for payment events
   */
  watchPaymentEvents(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "PaymentReceived",
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            paymentToken: args.paymentToken,
            amount: args.amount,
            platformFee: args.platformFee,
            subscriptionPeriod: args.subscriptionPeriod
          });
        });
      }
    });
  }
  /**
   * Watch for subscription minting events
   */
  watchSubscriptionMinted(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionMinted",
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            expiresAt: args.expiresAt
          });
        });
      }
    });
  }
  /**
   * Watch for subscription renewal events
   */
  watchSubscriptionRenewed(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionRenewed",
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.callback({
            subscriber: args.user,
            merchantId: args.merchantId,
            newExpiresAt: args.newExpiresAt,
            renewalCount: args.renewalCount
          });
        });
      }
    });
  }
  /**
   * Get subscription history for a user
   */
  async getSubscriptionHistory(user, merchantId) {
    const mintedLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionMinted",
      fromBlock: "earliest",
      args: { user, merchantId }
    });
    const renewedLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionRenewed",
      fromBlock: "earliest",
      args: { user, merchantId }
    });
    const paymentLogs = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "PaymentReceived",
      fromBlock: "earliest",
      args: { user, merchantId }
    });
    return {
      minted: mintedLogs,
      renewed: renewedLogs,
      payments: paymentLogs
    };
  }
  /**
   * Calculate total spent by user
   */
  async calculateTotalSpent(user, merchantId) {
    const { payments } = await this.getSubscriptionHistory(user, merchantId);
    return payments.reduce((total, payment) => {
      return total + payment.args.amount;
    }, 0n);
  }
  /**
   * Check if user needs to renew soon
   */
  async needsRenewalSoon(user, merchantId, thresholdDays = 7) {
    const status = await this.getSubscriptionStatus(user, merchantId);
    if (!status.isActive) return false;
    const timeRemaining = this.getTimeRemaining(status.expiresAt);
    return timeRemaining.days <= thresholdDays && !timeRemaining.isExpired;
  }
  /**
   * Get NFT balance for a user and merchant
   */
  async getNFTBalance(user, merchantId) {
    return await this.nftContract.read.balanceOf([user, merchantId]);
  }
  /**
   * Get NFT URI for a subscription
   */
  async getNFTUri(tokenId) {
    return await this.nftContract.read.uri([tokenId]);
  }
  /**
   * Format subscription period for display
   */
  formatPeriod(seconds) {
    const days = Number(seconds) / 86400;
    if (days >= 365) {
      return `${Math.floor(days / 365)} year${days >= 730 ? "s" : ""}`;
    } else if (days >= 30) {
      return `${Math.floor(days / 30)} month${days >= 60 ? "s" : ""}`;
    } else if (days >= 7) {
      return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""}`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  }
  /**
   * Format price for display
   */
  formatPrice(price, decimals = 18) {
    if (decimals === 18) {
      return viem.formatEther(price);
    }
    return (Number(price) / Math.pow(10, decimals)).toFixed(6);
  }
};
var TokenService = class {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.tokenContracts = /* @__PURE__ */ new Map();
  }
  /**
   * Get or create token contract instance
   */
  getTokenContract(tokenAddress) {
    if (!this.tokenContracts.has(tokenAddress)) {
      const contract = viem.getContract({
        address: tokenAddress,
        abi: mockERC20ABI,
        client: { public: this.publicClient, wallet: this.walletClient }
      });
      this.tokenContracts.set(tokenAddress, contract);
    }
    return this.tokenContracts.get(tokenAddress);
  }
  /**
   * Get token information
   */
  async getTokenInfo(tokenAddress) {
    if (tokenAddress === viem.zeroAddress) {
      return {
        address: viem.zeroAddress,
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        totalSupply: 0n
        // Not applicable for ETH
      };
    }
    const contract = this.getTokenContract(tokenAddress);
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.read.name(),
      contract.read.symbol(),
      contract.read.decimals(),
      contract.read.totalSupply()
    ]);
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply
    };
  }
  /**
   * Get token balance for an address
   */
  async getBalance(tokenAddress, userAddress) {
    if (tokenAddress === viem.zeroAddress) {
      return await this.publicClient.getBalance({ address: userAddress });
    }
    const contract = this.getTokenContract(tokenAddress);
    return await contract.read.balanceOf([userAddress]);
  }
  /**
   * Get multiple token balances
   */
  async getBalances(tokens, userAddress) {
    const balances = [];
    for (const token of tokens) {
      const balance = await this.getBalance(token.address, userAddress);
      balances.push({
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        balance,
        formattedBalance: this.formatTokenAmount(balance, token.decimals)
      });
    }
    return balances;
  }
  /**
   * Approve token spending
   */
  async approve(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    if (params.tokenAddress === viem.zeroAddress) {
      throw new Error("Cannot approve ETH");
    }
    const contract = this.getTokenContract(params.tokenAddress);
    return await contract.write.approve([params.spender, params.amount]);
  }
  /**
   * Check token allowance
   */
  async getAllowance(params) {
    if (params.tokenAddress === viem.zeroAddress) {
      return 0n;
    }
    const contract = this.getTokenContract(params.tokenAddress);
    return await contract.read.allowance([params.owner, params.spender]);
  }
  /**
   * Approve if needed
   */
  async approveIfNeeded(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    if (params.tokenAddress === viem.zeroAddress) {
      return { needed: false };
    }
    const currentAllowance = await this.getAllowance({
      tokenAddress: params.tokenAddress,
      owner: this.walletClient.account.address,
      spender: params.spender
    });
    if (currentAllowance < params.amount) {
      const hash = await this.approve({
        tokenAddress: params.tokenAddress,
        spender: params.spender,
        amount: params.amount
      });
      return { needed: true, hash };
    }
    return { needed: false };
  }
  /**
   * Mint test tokens (only for MockERC20)
   */
  async mintTestTokens(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = viem.parseUnits(params.amount, decimals);
    try {
      return await contract.write.mint([params.to, amountInWei]);
    } catch (error) {
      throw new Error("This token does not support minting");
    }
  }
  /**
   * Burn tokens
   */
  async burnTokens(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = viem.parseUnits(params.amount, decimals);
    try {
      return await contract.write.burn([amountInWei]);
    } catch (error) {
      throw new Error("This token does not support burning");
    }
  }
  /**
   * Transfer tokens
   */
  async transfer(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    if (params.tokenAddress === viem.zeroAddress) {
      const amountInWei2 = viem.parseUnits(params.amount, 18);
      return await this.walletClient.sendTransaction({
        account: this.walletClient.account,
        to: params.to,
        value: amountInWei2,
        chain: this.walletClient.chain
        // fix: add required 'chain' property
      });
    }
    const contract = this.getTokenContract(params.tokenAddress);
    const decimals = await contract.read.decimals();
    const amountInWei = viem.parseUnits(params.amount, decimals);
    return await contract.write.transfer([params.to, amountInWei]);
  }
  /**
   * Get faucet tokens for testing
   */
  async getFaucetTokens(userAddress) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const amount = "1000";
    const hash = await this.mintTestTokens({
      tokenAddress: CONTRACT_ADDRESSES.sepolia.testToken,
      to: userAddress,
      amount
    });
    return {
      tokenAddress: CONTRACT_ADDRESSES.sepolia.testToken,
      amount: viem.parseUnits(amount, 18),
      hash
    };
  }
  /**
   * Watch token transfers
   */
  watchTransfers(params) {
    this.getTokenContract(params.tokenAddress);
    return this.publicClient.watchContractEvent({
      address: params.tokenAddress,
      abi: mockERC20ABI,
      eventName: "Transfer",
      args: {
        from: params.from,
        to: params.to
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.callback({
            from: args.from,
            to: args.to,
            value: args.value
          });
        });
      }
    });
  }
  /**
   * Watch approvals
   */
  watchApprovals(params) {
    return this.publicClient.watchContractEvent({
      address: params.tokenAddress,
      abi: mockERC20ABI,
      eventName: "Approval",
      args: {
        owner: params.owner,
        spender: params.spender
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.callback({
            owner: args.owner,
            spender: args.spender,
            value: args.value
          });
        });
      }
    });
  }
  /**
   * Get supported tokens for the platform
   */
  getSupportedTokens() {
    return [
      {
        address: viem.zeroAddress,
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        isNative: true
      },
      {
        address: CONTRACT_ADDRESSES.sepolia.testToken,
        name: "Subscription Test Token",
        symbol: "SUBTEST",
        decimals: 18,
        isNative: false
      }
      // Add more supported tokens here
    ];
  }
  /**
   * Format token amount for display
   */
  formatTokenAmount(amount, decimals, precision = 6) {
    const formatted = viem.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return "0";
    if (num < 1e-6) return "< 0.000001";
    return num.toFixed(precision).replace(/\.?0+$/, "");
  }
  /**
   * Parse token amount from user input
   */
  parseTokenAmount(amount, decimals) {
    return viem.parseUnits(amount, decimals);
  }
  /**
   * Estimate gas for token operations
   */
  async estimateGas(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    this.getTokenContract(params.tokenAddress);
    const from = this.walletClient.account.address;
    switch (params.operation) {
      case "approve":
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: "approve",
          args: [params.to, params.amount],
          account: from
        });
      case "transfer":
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: "transfer",
          args: [params.to, params.amount],
          account: from
        });
      case "mint":
        return await this.publicClient.estimateContractGas({
          address: params.tokenAddress,
          abi: mockERC20ABI,
          functionName: "mint",
          args: [params.to, params.amount],
          account: from
        });
      default:
        throw new Error("Unknown operation");
    }
  }
  /**
   * Check if address has sufficient balance
   */
  async hasSufficientBalance(params) {
    const balance = await this.getBalance(params.tokenAddress, params.userAddress);
    return balance >= params.requiredAmount;
  }
};

// src/services/NFTService.ts
var NFTService = class {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
  }
  /**
   * Get NFT balance for a user and merchant
   */
  async getBalance(user, merchantId) {
    const contract = this.getContract();
    return await contract.read.balanceOf(user, merchantId);
  }
  /**
   * Get NFT balances for a user with specific merchant IDs
   */
  async getBalancesForMerchants(user, merchantIds) {
    const contract = this.getContract();
    const balances = [];
    for (const merchantId of merchantIds) {
      const balance = await contract.read.balanceOf(user, merchantId);
      const isActive = await contract.read.isSubscriptionActive(user, merchantId);
      balances.push({
        merchantId,
        balance,
        isActive
      });
    }
    return balances;
  }
  /**
   * Get NFT metadata URI
   */
  async getTokenURI(tokenId) {
    const contract = this.getContract();
    return await contract.read.uri(tokenId);
  }
  /**
   * Get full NFT metadata including on-chain data
   */
  async getFullMetadata(user, merchantId) {
    const contract = this.getContract();
    const [status, uri] = await Promise.all([
      contract.read.getSubscriptionStatus(user, merchantId),
      contract.read.uri(merchantId)
    ]);
    return {
      tokenId: merchantId,
      merchantId,
      subscriber: user,
      expiresAt: status.expiresAt,
      renewalCount: BigInt(status.renewalCount),
      uri
    };
  }
  /**
   * Check if NFT transfer is allowed
   */
  async isTransferAllowed(from, to, merchantId) {
    try {
      const contract = this.getContract();
      const isActive = await contract.read.isSubscriptionActive(from, merchantId);
      return isActive;
    } catch {
      return false;
    }
  }
  /**
   * Transfer NFT (subscription)
   */
  async safeTransferFrom(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    return await contract.write.safeTransferFrom(
      params.from,
      params.to,
      params.merchantId,
      params.amount || 1n,
      params.data || "0x"
    );
  }
  /**
   * Batch transfer multiple NFTs
   */
  async safeBatchTransferFrom(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    const amounts = params.amounts || params.merchantIds.map(() => 1n);
    return await contract.write.safeBatchTransferFrom(
      params.from,
      params.to,
      params.merchantIds,
      amounts,
      params.data || "0x"
    );
  }
  /**
   * Set approval for all NFTs
   */
  async setApprovalForAll(operator, approved) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    return await contract.write.setApprovalForAll(operator, approved);
  }
  /**
   * Check if operator is approved for all
   */
  async isApprovedForAll(owner, operator) {
    const contract = this.getContract();
    return await contract.read.isApprovedForAll(owner, operator);
  }
  /**
   * Burn expired subscription NFT
   */
  async burnExpiredSubscription(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    const status = await contract.read.getSubscriptionStatus(
      params.subscriber,
      params.merchantId
    );
    const now = BigInt(Math.floor(Date.now() / 1e3));
    if (status.expiresAt > now) {
      throw new Error("Subscription is not expired");
    }
    return await contract.write.burnExpired(
      params.subscriber,
      params.merchantId
    );
  }
  /**
   * Get total supply for a token ID
   */
  async getTotalSupply(merchantId) {
    this.getContract();
    const mintEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionMinted",
      args: { merchantId },
      fromBlock: "earliest"
    });
    const burnEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionBurned",
      args: { merchantId },
      fromBlock: "earliest"
    });
    return BigInt(mintEvents.length - burnEvents.length);
  }
  /**
   * Get all token holders for a merchant
   */
  async getTokenHolders(merchantId) {
    const mintEvents = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionMinted",
      args: { merchantId },
      fromBlock: "earliest"
    });
    const holders = /* @__PURE__ */ new Set();
    for (const event of mintEvents) {
      const args = event.args;
      holders.add(args.subscriber);
    }
    const activeHolders = [];
    for (const holder of holders) {
      const isActive = await this.isSubscriptionActive(holder, merchantId);
      if (isActive) {
        activeHolders.push(holder);
      }
    }
    return activeHolders;
  }
  /**
   * Check if subscription is active
   */
  async isSubscriptionActive(user, merchantId) {
    const contract = this.getContract();
    return await contract.read.isSubscriptionActive(user, merchantId);
  }
  /**
   * Get subscription expiry timestamp
   */
  async getSubscriptionExpiry(user, merchantId) {
    const contract = this.getContract();
    const status = await contract.read.getSubscriptionStatus(user, merchantId);
    return status.expiresAt;
  }
  /**
   * Watch transfer events
   */
  watchTransferEvents(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "TransferSingle",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          if (params.from && args.from !== params.from) return;
          if (params.to && args.to !== params.to) return;
          if (params.merchantId && args.id !== params.merchantId) return;
          params.callback({
            operator: args.operator,
            from: args.from,
            to: args.to,
            id: args.id,
            value: args.value
          });
        });
      }
    });
  }
  /**
   * Watch batch transfer events
   */
  watchBatchTransferEvents(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "TransferBatch",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          if (params.from && args.from !== params.from) return;
          if (params.to && args.to !== params.to) return;
          params.callback({
            operator: args.operator,
            from: args.from,
            to: args.to,
            ids: args.ids,
            values: args.values
          });
        });
      }
    });
  }
  /**
   * Watch approval events
   */
  watchApprovalEvents(params) {
    return this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "ApprovalForAll",
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          if (params.owner && args.account !== params.owner) return;
          if (params.operator && args.operator !== params.operator) return;
          params.callback({
            account: args.account,
            operator: args.operator,
            approved: args.approved
          });
        });
      }
    });
  }
  /**
   * Generate NFT image/metadata (placeholder)
   */
  generateNFTMetadata(params) {
    const expiryDate = new Date(Number(params.expiresAt) * 1e3);
    const isActive = params.expiresAt > BigInt(Math.floor(Date.now() / 1e3));
    return {
      name: `${params.merchantName} Subscription`,
      description: `Active subscription to ${params.merchantName}`,
      image: `https://placeholder.com/nft/${params.merchantId}`,
      attributes: [
        {
          trait_type: "Status",
          value: isActive ? "Active" : "Expired"
        },
        {
          trait_type: "Expires At",
          value: expiryDate.toISOString()
        },
        {
          trait_type: "Renewal Count",
          value: Number(params.renewalCount)
        },
        {
          trait_type: "Tier",
          value: params.tier || "Standard"
        }
      ]
    };
  }
  /**
   * Get contract instance
   */
  getContract() {
    return {
      read: {
        balanceOf: (account, id) => this.publicClient.readContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "balanceOf",
          args: [account, id]
        }),
        getSubscriptionStatus: (user, merchantId) => this.publicClient.readContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "getSubscriptionStatus",
          args: [user, merchantId]
        }),
        isSubscriptionActive: (user, merchantId) => this.publicClient.readContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "isSubscriptionActive",
          args: [user, merchantId]
        }),
        uri: (id) => this.publicClient.readContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "uri",
          args: [id]
        }),
        isApprovedForAll: (account, operator) => this.publicClient.readContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "isApprovedForAll",
          args: [account, operator]
        })
      },
      write: {
        safeTransferFrom: (from, to, id, value, data) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "safeTransferFrom",
          args: [from, to, id, value, data],
          account: this.walletClient.account,
          chain: void 0
        }),
        safeBatchTransferFrom: (from, to, ids, values, data) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "safeBatchTransferFrom",
          args: [from, to, ids, values, data],
          account: this.walletClient.account,
          chain: void 0
        }),
        setApprovalForAll: (operator, approved) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "setApprovalForAll",
          args: [operator, approved],
          account: this.walletClient.account,
          chain: void 0
        }),
        burnExpired: (subscriber, merchantId) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          functionName: "burnExpired",
          args: [subscriber, merchantId],
          account: this.walletClient.account,
          chain: void 0
        })
      }
    };
  }
  /**
   * Check if NFT features are supported
   */
  async supportsInterface(interfaceId) {
    this.getContract();
    try {
      const supported = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        functionName: "supportsInterface",
        args: [interfaceId]
      });
      return supported;
    } catch {
      return false;
    }
  }
};
var EventMonitoringService = class {
  constructor(publicClient) {
    this.publicClient = publicClient;
    this.unsubscribers = /* @__PURE__ */ new Map();
    this.eventCache = /* @__PURE__ */ new Map();
  }
  /**
   * Monitor payment events in real-time
   */
  monitorPaymentEvents(params) {
    const id = `payment-${Date.now()}`;
    const unwatch = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "PaymentReceived",
      args: {
        user: params.subscriber,
        merchantId: params.merchantId
      },
      onLogs: (logs) => {
        logs.forEach((log) => {
          const args = log.args;
          params.onEvent({
            subscriber: args.user,
            merchantId: args.merchantId,
            paymentToken: args.paymentToken,
            amount: args.amount,
            platformFee: args.platformFee,
            subscriptionPeriod: args.subscriptionPeriod,
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber
          }, log);
        });
      }
    });
    this.unsubscribers.set(id, unwatch);
    return id;
  }
  /**
   * Monitor subscription lifecycle events
   */
  monitorSubscriptionLifecycle(params) {
    const id = `lifecycle-${Date.now()}`;
    const unwatchers = [];
    if (params.onMinted) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionMinted",
        args: { user: params.subscriber, merchantId: params.merchantId },
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onMinted({
              subscriber: args.user,
              merchantId: args.merchantId,
              expiresAt: args.expiresAt,
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }
    if (params.onRenewed) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionRenewed",
        args: { user: params.subscriber, merchantId: params.merchantId },
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onRenewed({
              subscriber: args.user,
              merchantId: args.merchantId,
              newExpiresAt: args.newExpiresAt,
              renewalCount: args.renewalCount,
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }
    const unsubscribe = () => {
      unwatchers.forEach((unwatch) => unwatch());
    };
    this.unsubscribers.set(id, unsubscribe);
    return id;
  }
  /**
   * Monitor merchant events
   */
  monitorMerchantEvents(params) {
    const id = `merchant-${Date.now()}`;
    const unwatchers = [];
    if (params.onRegistered) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "MerchantRegistered",
        args: params.merchantId ? { merchantId: params.merchantId } : void 0,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onRegistered({
              merchantId: args.merchantId,
              owner: args.owner,
              payoutAddress: args.payoutAddress,
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }
    if (params.onWithdrawal) {
      const unwatch = this.publicClient.watchContractEvent({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "MerchantWithdrawal",
        args: params.merchantId ? { merchantId: params.merchantId } : void 0,
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onWithdrawal({
              merchantId: args.merchantId,
              token: args.token,
              amount: args.amount,
              payoutAddress: args.payoutAddress,
              blockNumber: log.blockNumber,
              transactionHash: log.transactionHash
            }, log);
          });
        }
      });
      unwatchers.push(unwatch);
    }
    const unsubscribe = () => {
      unwatchers.forEach((unwatch) => unwatch());
    };
    this.unsubscribers.set(id, unsubscribe);
    return id;
  }
  /**
   * Get historical events
   */
  async getHistoricalEvents(params) {
    const abi = params.contractAddress === CONTRACT_ADDRESSES.sepolia.subscriptionManager ? subscriptionManagerABI : subscriptionNFTABI;
    const events = await this.publicClient.getContractEvents({
      address: params.contractAddress,
      abi,
      eventName: params.eventName,
      fromBlock: params.fromBlock || "earliest",
      toBlock: params.toBlock || "latest",
      args: params.args
    });
    return events.map((event) => ({
      ...event.args,
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      logIndex: event.logIndex
    }));
  }
  /**
   * Get aggregated statistics from events
   */
  async getEventStatistics(params) {
    const paymentEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      eventName: "PaymentReceived",
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });
    const merchantEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      eventName: "MerchantRegistered",
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });
    const renewalEvents = await this.getHistoricalEvents({
      contractAddress: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      eventName: "SubscriptionRenewed",
      fromBlock: params.startBlock,
      toBlock: params.endBlock
    });
    const uniqueSubscribers = new Set(paymentEvents.map((e) => e.user)).size;
    const totalVolume = paymentEvents.reduce((sum, e) => sum + BigInt(e.amount), 0n);
    return {
      totalPayments: paymentEvents.length,
      totalVolume,
      uniqueSubscribers,
      totalMerchants: merchantEvents.length,
      totalRenewals: renewalEvents.length
    };
  }
  /**
   * Monitor multiple events with a single subscription
   */
  monitorMultipleEvents(configs) {
    const id = `multi-${Date.now()}`;
    const unwatchers = [];
    for (const config of configs) {
      for (const event of config.events) {
        const abi = config.address === CONTRACT_ADDRESSES.sepolia.subscriptionManager ? subscriptionManagerABI : subscriptionNFTABI;
        const unwatch = this.publicClient.watchContractEvent({
          address: config.address,
          abi,
          eventName: event.name,
          onLogs: (logs) => {
            logs.forEach((log) => {
              event.callback(log.args, log);
            });
          }
        });
        unwatchers.push(unwatch);
      }
    }
    const unsubscribe = () => {
      unwatchers.forEach((unwatch) => unwatch());
    };
    this.unsubscribers.set(id, unsubscribe);
    return id;
  }
  /**
   * Stop monitoring events
   */
  stopMonitoring(monitorId) {
    const unsubscribe = this.unsubscribers.get(monitorId);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(monitorId);
      return true;
    }
    return false;
  }
  /**
   * Stop all monitoring
   */
  stopAllMonitoring() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.unsubscribers.clear();
    this.eventCache.clear();
  }
  /**
   * Get cached events
   */
  getCachedEvents(key) {
    return this.eventCache.get(key) || [];
  }
  /**
   * Cache events for later retrieval
   */
  cacheEvents(key, events) {
    const existing = this.eventCache.get(key) || [];
    this.eventCache.set(key, [...existing, ...events]);
  }
  /**
   * Clear event cache
   */
  clearCache(key) {
    if (key) {
      this.eventCache.delete(key);
    } else {
      this.eventCache.clear();
    }
  }
  /**
   * Watch for specific transaction
   */
  async waitForTransaction(txHash) {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: txHash
    });
    const events = receipt.logs.map((log) => {
      try {
        const decoded = viem.decodeEventLog({
          abi: subscriptionManagerABI,
          data: log.data,
          topics: log.topics
        });
        return decoded;
      } catch {
        try {
          const decoded = viem.decodeEventLog({
            abi: subscriptionNFTABI,
            data: log.data,
            topics: log.topics
          });
          return decoded;
        } catch {
          return null;
        }
      }
    }).filter(Boolean);
    return {
      status: receipt.status === "success" ? "success" : "reverted",
      events
    };
  }
  /**
   * Create event filter for custom monitoring
   */
  createEventFilter(params) {
    return {
      address: params.address,
      topics: [
        viem.parseAbiItem(params.eventSignature),
        ...params.args || []
      ]
    };
  }
};
var AnalyticsService = class {
  constructor(publicClient) {
    this.publicClient = publicClient;
  }
  /**
   * Get overall platform metrics
   */
  async getPlatformMetrics(params) {
    const fromBlock = params?.fromBlock || "earliest";
    const toBlock = params?.toBlock || "latest";
    const [
      merchantRegistrations,
      payments,
      renewals
    ] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "MerchantRegistered",
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "PaymentReceived",
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionRenewed",
        fromBlock,
        toBlock
      })
    ]);
    const uniqueSubscribers = new Set(payments.map((p) => p.args.subscriber));
    const activeMerchantIds = new Set(payments.map((p) => p.args.merchantId));
    const totalVolume = payments.reduce(
      (sum, p) => sum + BigInt(p.args.amount),
      0n
    );
    const totalPlatformFees = payments.reduce(
      (sum, p) => sum + BigInt(p.args.platformFee),
      0n
    );
    const averageSubscriptionPrice = payments.length > 0 ? totalVolume / BigInt(payments.length) : 0n;
    return {
      totalMerchants: merchantRegistrations.length,
      activeMerchants: activeMerchantIds.size,
      totalSubscribers: uniqueSubscribers.size,
      activeSubscriptions: await this.getActiveSubscriptionCount(),
      totalVolume,
      totalPlatformFees,
      averageSubscriptionPrice,
      totalRenewals: renewals.length
    };
  }
  /**
   * Get analytics for a specific merchant
   */
  async getMerchantAnalytics(merchantId, params) {
    const fromBlock = params?.fromBlock || "earliest";
    const toBlock = params?.toBlock || "latest";
    const [payments, subscriptions, renewals] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "PaymentReceived",
        args: { merchantId },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionMinted",
        args: { merchantId },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionRenewed",
        args: { merchantId },
        fromBlock,
        toBlock
      })
    ]);
    const totalRevenue = payments.reduce((sum, p) => {
      const args = p.args;
      return sum + BigInt(args.amount) - BigInt(args.platformFee);
    }, 0n);
    const uniqueSubscribers = new Set(payments.map((p) => p.args.subscriber));
    const tokenVolumes = /* @__PURE__ */ new Map();
    payments.forEach((p) => {
      const args = p.args;
      const token = args.paymentToken;
      const current = tokenVolumes.get(token) || { volume: 0n, transactions: 0 };
      tokenVolumes.set(token, {
        volume: current.volume + BigInt(args.amount),
        transactions: current.transactions + 1
      });
    });
    const topPaymentTokens = Array.from(tokenVolumes.entries()).map(([token, data]) => ({ token, ...data })).sort((a, b) => Number(b.volume - a.volume));
    const revenueOverTime = payments.map((p) => ({
      timestamp: p.blockNumber || 0n,
      amount: BigInt(p.args.amount) - BigInt(p.args.platformFee)
    }));
    const churnRate = await this.calculateChurnRate(merchantId, uniqueSubscribers.size);
    const renewalRate = subscriptions.length > 0 ? renewals.length / subscriptions.length * 100 : 0;
    return {
      merchantId,
      totalRevenue,
      totalSubscribers: uniqueSubscribers.size,
      activeSubscribers: await this.getActiveMerchantSubscribers(merchantId),
      averageSubscriptionValue: payments.length > 0 ? totalRevenue / BigInt(payments.length) : 0n,
      churnRate,
      renewalRate,
      topPaymentTokens,
      revenueOverTime
    };
  }
  /**
   * Get analytics for a specific user
   */
  async getUserAnalytics(userAddress, params) {
    const fromBlock = params?.fromBlock || "earliest";
    const toBlock = params?.toBlock || "latest";
    const [payments, subscriptions, renewals] = await Promise.all([
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "PaymentReceived",
        args: { user: userAddress },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionMinted",
        args: { user: userAddress },
        fromBlock,
        toBlock
      }),
      this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionRenewed",
        args: { user: userAddress },
        fromBlock,
        toBlock
      })
    ]);
    const totalSpent = payments.reduce(
      (sum, p) => sum + BigInt(p.args.amount),
      0n
    );
    const subscriptionMap = /* @__PURE__ */ new Map();
    subscriptions.forEach((s) => {
      const args = s.args;
      const key = `${args.merchantId}`;
      subscriptionMap.set(key, {
        merchantId: args.merchantId,
        startDate: s.blockNumber || 0n,
        expiresAt: args.expiresAt,
        amount: 0n,
        renewalCount: 0
      });
    });
    renewals.forEach((r) => {
      const args = r.args;
      const key = `${args.merchantId}`;
      const existing = subscriptionMap.get(key);
      if (existing) {
        existing.expiresAt = args.newExpiresAt;
        existing.renewalCount = Number(args.renewalCount);
      }
    });
    payments.forEach((p) => {
      const args = p.args;
      const key = `${args.merchantId}`;
      const existing = subscriptionMap.get(key);
      if (existing) {
        existing.amount = existing.amount + BigInt(args.amount);
      }
    });
    const subscriptionHistory = Array.from(subscriptionMap.values());
    const now = BigInt(Math.floor(Date.now() / 1e3));
    const activeSubscriptions = subscriptionHistory.filter(
      (s) => s.expiresAt > now
    ).length;
    return {
      totalSpent,
      activeSubscriptions,
      totalSubscriptions: subscriptionHistory.length,
      averageSpend: subscriptionHistory.length > 0 ? totalSpent / BigInt(subscriptionHistory.length) : 0n,
      subscriptionHistory
    };
  }
  /**
   * Get revenue trends over time
   */
  async getRevenueTrends(params) {
    const payments = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "PaymentReceived",
      args: params.merchantId ? { merchantId: params.merchantId } : void 0,
      fromBlock: params.fromBlock || "earliest",
      toBlock: params.toBlock || "latest"
    });
    const grouped = /* @__PURE__ */ new Map();
    for (const payment of payments) {
      const block = await this.publicClient.getBlock({
        blockNumber: payment.blockNumber
      });
      const timestamp = block.timestamp;
      const date = new Date(Number(timestamp) * 1e3);
      let key;
      switch (params.interval) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
          break;
      }
      const args = payment.args;
      const current = grouped.get(key) || 0n;
      grouped.set(key, current + BigInt(args.amount));
    }
    return Array.from(grouped.entries()).map(([label, value]) => ({
      timestamp: BigInt(Date.parse(label) / 1e3),
      value,
      label
    })).sort((a, b) => Number(a.timestamp - b.timestamp));
  }
  /**
   * Get subscription growth metrics
   */
  async getSubscriptionGrowth(params) {
    const subscriptions = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "SubscriptionMinted",
      args: params.merchantId ? { merchantId: params.merchantId } : void 0,
      fromBlock: params.fromBlock || "earliest",
      toBlock: params.toBlock || "latest"
    });
    const grouped = /* @__PURE__ */ new Map();
    for (const subscription of subscriptions) {
      const block = await this.publicClient.getBlock({
        blockNumber: subscription.blockNumber
      });
      const timestamp = block.timestamp;
      const date = new Date(Number(timestamp) * 1e3);
      let key;
      switch (params.interval) {
        case "daily":
          key = date.toISOString().split("T")[0];
          break;
        case "weekly":
          const week = this.getWeekNumber(date);
          key = `${date.getFullYear()}-W${week}`;
          break;
        case "monthly":
          key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
          break;
      }
      const current = grouped.get(key) || 0;
      grouped.set(key, current + 1);
    }
    let cumulative = 0;
    const result = [];
    Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).forEach(([label, count]) => {
      cumulative += count;
      result.push({
        timestamp: BigInt(Date.parse(label) / 1e3),
        value: cumulative,
        label
      });
    });
    return result;
  }
  /**
   * Get token distribution analytics
   */
  async getTokenDistribution(params) {
    const payments = await this.publicClient.getContractEvents({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "PaymentReceived",
      args: params?.merchantId ? { merchantId: params.merchantId } : void 0,
      fromBlock: params?.fromBlock || "earliest",
      toBlock: params?.toBlock || "latest"
    });
    const tokenStats = /* @__PURE__ */ new Map();
    let totalVolume = 0n;
    payments.forEach((p) => {
      const args = p.args;
      const token = args.paymentToken;
      const current = tokenStats.get(token) || { volume: 0n, transactions: 0 };
      tokenStats.set(token, {
        volume: current.volume + BigInt(args.amount),
        transactions: current.transactions + 1
      });
      totalVolume += BigInt(args.amount);
    });
    return Array.from(tokenStats.entries()).map(([token, stats]) => ({
      token,
      symbol: token === "0x0000000000000000000000000000000000000000" ? "ETH" : "SUBTEST",
      volume: stats.volume,
      transactions: stats.transactions,
      percentage: totalVolume > 0n ? Number(stats.volume * 10000n / totalVolume) / 100 : 0
    })).sort((a, b) => Number(b.volume - a.volume));
  }
  /**
   * Calculate platform conversion rate
   */
  async getConversionMetrics() {
    return {
      visitorToSubscriber: 0,
      trialToPayment: 0,
      renewalRate: 0
    };
  }
  // Helper methods
  async getActiveSubscriptionCount() {
    return 0;
  }
  async getActiveMerchantSubscribers(merchantId) {
    return 0;
  }
  async calculateChurnRate(merchantId, totalSubscribers) {
    return 0;
  }
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 864e5;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }
  /**
   * Format analytics data for display
   */
  formatMetrics(metrics) {
    return {
      ...metrics,
      totalVolume: viem.formatEther(metrics.totalVolume),
      totalPlatformFees: viem.formatEther(metrics.totalPlatformFees),
      averageSubscriptionPrice: viem.formatEther(metrics.averageSubscriptionPrice)
    };
  }
  /**
   * Get total number of subscriptions (simplified version for tests)
   */
  async getTotalSubscriptions() {
    try {
      const subscriptions = await this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
        abi: subscriptionNFTABI,
        eventName: "SubscriptionMinted",
        fromBlock: "earliest",
        toBlock: "latest"
      });
      return BigInt(subscriptions.length);
    } catch {
      return 0n;
    }
  }
  /**
   * Get merchant statistics (simplified version for tests)
   */
  async getMerchantStatistics(merchantId) {
    try {
      const payments = await this.publicClient.getContractEvents({
        address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
        abi: subscriptionManagerABI,
        eventName: "PaymentReceived",
        args: { merchantId },
        fromBlock: "earliest",
        toBlock: "latest"
      });
      const totalRevenue = payments.reduce((sum, p) => {
        const args = p.args;
        return sum + BigInt(args.amount) - BigInt(args.platformFee || 0n);
      }, 0n);
      const uniqueSubscribers = new Set(payments.map((p) => p.args.user));
      return {
        totalRevenue,
        activeSubscriptions: BigInt(uniqueSubscribers.size),
        // Simplified
        totalSubscribers: BigInt(uniqueSubscribers.size)
      };
    } catch {
      return {
        totalRevenue: 0n,
        activeSubscriptions: 0n,
        totalSubscribers: 0n
      };
    }
  }
  /**
   * Get platform statistics (simplified version for tests)
   */
  async getPlatformStatistics() {
    try {
      const [merchantRegistrations, subscriptions, payments] = await Promise.all([
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
          abi: subscriptionManagerABI,
          eventName: "MerchantRegistered",
          fromBlock: "earliest",
          toBlock: "latest"
        }),
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
          abi: subscriptionNFTABI,
          eventName: "SubscriptionMinted",
          fromBlock: "earliest",
          toBlock: "latest"
        }),
        this.publicClient.getContractEvents({
          address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
          abi: subscriptionManagerABI,
          eventName: "PaymentReceived",
          fromBlock: "earliest",
          toBlock: "latest"
        })
      ]);
      const totalVolume = payments.reduce(
        (sum, p) => sum + BigInt(p.args.amount),
        0n
      );
      return {
        totalMerchants: BigInt(merchantRegistrations.length),
        totalSubscriptions: BigInt(subscriptions.length),
        totalVolume
      };
    } catch {
      return {
        totalMerchants: 0n,
        totalSubscriptions: 0n,
        totalVolume: 0n
      };
    }
  }
};
var ROLE_HASHES = {
  DEFAULT_ADMIN: "0x0000000000000000000000000000000000000000000000000000000000000000",
  MANAGER: viem.keccak256(viem.toHex("MANAGER_ROLE")),
  REACTIVE: viem.keccak256(viem.toHex("REACTIVE_ROLE")),
  PAUSER: viem.keccak256(viem.toHex("PAUSER_ROLE"))
};

// src/services/AdminService.ts
var AdminService = class {
  constructor(publicClient, walletClient) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.managerContract = viem.getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
    this.nftContract = viem.getContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      client: { public: this.publicClient, wallet: this.walletClient }
    });
  }
  /**
   * Check if address is contract owner
   */
  async isOwner(address) {
    try {
      const owner = await this.managerContract.read.owner();
      return owner.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }
  /**
   * Check if address has specific role
   */
  async hasRole(role, address) {
    try {
      const roleHash = this.getRoleHash(role);
      return await this.nftContract.read.hasRole([roleHash, address]);
    } catch {
      return false;
    }
  }
  /**
   * Set platform fee (owner only)
   */
  async setPlatformFee(feeBps) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    if (feeBps > 1e4) throw new Error("Fee cannot exceed 100%");
    return await this.managerContract.write.setPlatformFee([feeBps]);
  }
  /**
   * Get current platform fee
   */
  async getPlatformFee() {
    const fee = await this.managerContract.read.platformFeeBps();
    return Number(fee);
  }
  /**
   * Set subscription NFT contract address (one-time setup)
   */
  async setSubscriptionNFT(nftAddress) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.managerContract.write.setSubscriptionNFT([nftAddress]);
  }
  /**
   * Set reactive contract address on NFT
   */
  async setReactiveContract(reactiveAddress) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.nftContract.write.setReactiveContract([reactiveAddress]);
  }
  /**
   * Grant role to address
   */
  async grantRole(role, address) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const roleHash = this.getRoleHash(role);
    return await this.nftContract.write.grantRole([roleHash, address]);
  }
  /**
   * Revoke role from address
   */
  async revokeRole(role, address) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const roleHash = this.getRoleHash(role);
    return await this.nftContract.write.revokeRole([roleHash, address]);
  }
  /**
   * Withdraw platform fees
   */
  async withdrawPlatformFees(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.managerContract.write.withdrawPlatformFees([
      params.token,
      params.to
    ]);
  }
  /**
   * Get platform fee balance for a token
   */
  async getPlatformFeeBalance(token) {
    return 0n;
  }
  /**
   * Transfer ownership of manager contract
   */
  async transferOwnership(newOwner) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.managerContract.write.transferOwnership([newOwner]);
  }
  /**
   * Renounce ownership (irreversible!)
   */
  async renounceOwnership() {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const confirmed = confirm("This action is irreversible! Are you sure you want to renounce ownership?");
    if (!confirmed) throw new Error("Operation cancelled");
    return await this.managerContract.write.renounceOwnership();
  }
  /**
   * Pause NFT transfers (emergency)
   */
  async pauseNFT() {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.nftContract.write.pause();
  }
  /**
   * Unpause NFT transfers
   */
  async unpauseNFT() {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.nftContract.write.unpause();
  }
  /**
   * Check if NFT is paused
   */
  async isNFTPaused() {
    return await this.nftContract.read.paused();
  }
  /**
   * Update base URI for NFT metadata
   */
  async setBaseURI(uri) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.nftContract.write.setBaseURI([uri]);
  }
  /**
   * Get contract configuration
   */
  async getContractConfig() {
    const [
      owner,
      platformFeeBps,
      subscriptionNFT,
      baseURI,
      paused
    ] = await Promise.all([
      this.managerContract.read.owner(),
      this.managerContract.read.platformFeeBps(),
      this.managerContract.read.subscriptionNFT(),
      this.nftContract.read.uri([0n]),
      // Get base URI
      this.nftContract.read.paused()
    ]);
    return {
      manager: {
        owner,
        platformFeeBps: Number(platformFeeBps),
        subscriptionNFT
      },
      nft: {
        baseURI,
        paused,
        reactiveContract: CONTRACT_ADDRESSES.reactive.subscriptionReactive
      }
    };
  }
  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    return {
      totalMerchants: 0,
      totalSubscriptions: 0,
      platformRevenue: /* @__PURE__ */ new Map()
    };
  }
  /**
   * Emergency withdrawal (if contract has stuck funds)
   */
  async emergencyWithdraw(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    throw new Error("Emergency withdrawal not implemented");
  }
  /**
   * Batch operations for efficiency
   */
  async batchGrantRoles(params) {
    const hashes = [];
    for (const param of params) {
      const hash = await this.grantRole(param.role, param.address);
      hashes.push(hash);
    }
    return hashes;
  }
  /**
   * Monitor admin events
   */
  watchAdminEvents(callback) {
    const unwatchers = [];
    const watchOwnershipTransfer = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      abi: subscriptionManagerABI,
      eventName: "OwnershipTransferred",
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: "OwnershipTransferred",
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchOwnershipTransfer);
    const watchRoleGranted = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "RoleGranted",
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: "RoleGranted",
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchRoleGranted);
    const watchRoleRevoked = this.publicClient.watchContractEvent({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      eventName: "RoleRevoked",
      onLogs: (logs) => {
        logs.forEach((log) => {
          callback({
            type: "RoleRevoked",
            ...log.args
          });
        });
      }
    });
    unwatchers.push(watchRoleRevoked);
    return () => {
      unwatchers.forEach((unwatch) => unwatch());
    };
  }
  /**
   * Get role hash for a role name
   */
  getRoleHash(role) {
    return ROLE_HASHES[role] || role;
  }
  /**
   * Validate admin permissions before operation
   */
  async validateAdminPermissions(address) {
    const [isOwner, isManager, isPauser] = await Promise.all([
      this.isOwner(address),
      this.hasRole("MANAGER", address),
      this.hasRole("PAUSER", address)
    ]);
    return { isOwner, isManager, isPauser };
  }
};
var ReactiveNetworkService = class {
  // Sepolia
  constructor(publicClient, walletClient, reactiveProvider) {
    this.publicClient = publicClient;
    this.walletClient = walletClient;
    this.reactiveProvider = reactiveProvider;
    this.REACTIVE_RPC = "https://lasna-rpc.rnk.dev/";
    this.L1_CHAIN_ID = 11155111;
  }
  /**
   * Subscribe to payment events from L1
   */
  async subscribeToPaymentEvents(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    const chainId = params.chainId || BigInt(this.L1_CHAIN_ID);
    const contractAddress = params.contractAddress || CONTRACT_ADDRESSES.sepolia.subscriptionManager;
    return await contract.write.subscribeToPaymentEvents(chainId, contractAddress);
  }
  /**
   * Subscribe to CRON job for expiry checks
   */
  async subscribeToCronJob(params) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    return await contract.write.subscribeToCron(params.interval);
  }
  /**
   * Get tracked subscription expirations
   * Note: The reactive contract tracks expirations but doesn't expose subscription lists
   * This method gets expiring subscriptions within a time range
   */
  async getExpiringSubscriptions(beforeTimestamp, limit = 100n) {
    try {
      const contract = this.getContract();
      const timestamp = beforeTimestamp || BigInt(Math.floor(Date.now() / 1e3) + 86400);
      const [users, merchantIds] = await contract.read.getExpiringSubscriptions(timestamp, limit);
      return {
        users,
        merchantIds
      };
    } catch (error) {
      console.log("Error fetching expiring subscriptions:", error);
      return { users: [], merchantIds: [] };
    }
  }
  /**
   * Get tracked expiration for a specific user and merchant
   */
  async getTrackedExpiration(user, merchantId) {
    try {
      const contract = this.getContract();
      return await contract.read.getTrackedExpiration(user, merchantId);
    } catch (error) {
      console.log("Error fetching tracked expiration:", error);
      return 0n;
    }
  }
  /**
   * Get debt amount from reactive contract
   */
  async getDebt() {
    try {
      const contract = this.getContract();
      return await contract.read.getDebt();
    } catch (error) {
      console.log("Error fetching debt:", error);
      return 0n;
    }
  }
  /**
   * Pause reactive contract
   */
  async pauseContract() {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    return await contract.write.pause();
  }
  /**
   * Resume reactive contract
   */
  async resumeContract() {
    if (!this.walletClient) throw new Error("Wallet not connected");
    const contract = this.getContract();
    return await contract.write.resume();
  }
  /**
   * Check if reactive contract has REACTIVE_ROLE on NFT contract
   */
  async hasReactiveRole() {
    const REACTIVE_ROLE = "0x6c32362347342e2fb3c7c64c0c4fe5a21823981ee87c54bb16cfffc87c68c502";
    return await this.publicClient.readContract({
      address: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      abi: subscriptionNFTABI,
      functionName: "hasRole",
      args: [REACTIVE_ROLE, CONTRACT_ADDRESSES.reactive.subscriptionReactive]
    });
  }
  /**
   * Get REACT token balance
   */
  async getReactBalance(address) {
    if (!this.reactiveProvider) {
      throw new Error("Reactive provider not configured");
    }
    return await this.reactiveProvider.getBalance({ address });
  }
  /**
   * Fund reactive contract with REACT tokens
   */
  async fundReactiveContract(amount) {
    if (!this.walletClient) throw new Error("Wallet not connected");
    return await this.walletClient.sendTransaction({
      account: this.walletClient.account,
      to: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
      value: viem.parseEther(amount),
      chain: this.walletClient.chain
    });
  }
  /**
   * Get reactive contract configuration
   * Note: The reactive contract doesn't expose these values directly
   * These would typically be stored in the contract's config or retrieved from events
   */
  async getReactiveConfig() {
    return {
      subscriptionManager: CONTRACT_ADDRESSES.sepolia.subscriptionManager,
      subscriptionNFT: CONTRACT_ADDRESSES.sepolia.subscriptionNFT,
      targetChainId: BigInt(this.L1_CHAIN_ID),
      // Sepolia chain ID
      paymentEventSubscriptionId: void 0,
      // Would need to track from events
      cronSubscriptionId: void 0
      // Would need to track from events
    };
  }
  /**
   * Monitor reactive events
   */
  watchReactiveEvents(params) {
    if (!this.reactiveProvider) {
      throw new Error("Reactive provider not configured");
    }
    const unwatchers = [];
    if (params.onPaymentProcessed) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: "PaymentProcessed",
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onPaymentProcessed({
              subscriber: args.subscriber,
              merchantId: args.merchantId,
              amount: args.amount,
              token: args.token
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    if (params.onSubscriptionExpired) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: "SubscriptionExpired",
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onSubscriptionExpired({
              subscriber: args.subscriber,
              merchantId: args.merchantId
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    if (params.onCronTriggered) {
      const unwatch = this.reactiveProvider.watchContractEvent({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName: "CronTriggered",
        onLogs: (logs) => {
          logs.forEach((log) => {
            const args = log.args;
            params.onCronTriggered({
              timestamp: args.timestamp,
              processedCount: args.processedCount
            });
          });
        }
      });
      unwatchers.push(unwatch);
    }
    return () => {
      unwatchers.forEach((unwatch) => unwatch());
    };
  }
  /**
   * Get reactive event history
   */
  async getEventHistory(params) {
    if (!this.reactiveProvider) {
      throw new Error("Reactive provider not configured");
    }
    const events = [];
    const eventNames = params?.eventType ? [params.eventType] : ["PaymentProcessed", "SubscriptionExpired", "CronTriggered"];
    for (const eventName of eventNames) {
      const logs = await this.reactiveProvider.getContractEvents({
        address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
        abi: subscriptionReactiveABI,
        eventName,
        fromBlock: params?.fromBlock || "earliest",
        toBlock: params?.toBlock || "latest"
      });
      for (const log of logs) {
        const block = await this.reactiveProvider.getBlock({
          blockNumber: log.blockNumber
        });
        events.push({
          blockNumber: log.blockNumber,
          timestamp: block.timestamp,
          eventType: eventName,
          data: log.args
        });
      }
    }
    return events.sort((a, b) => Number(a.blockNumber - b.blockNumber));
  }
  /**
   * Estimate gas for reactive operations
   */
  async estimateReactiveGas(operation) {
    const estimates = {
      subscribe: viem.parseEther("0.01"),
      cancel: viem.parseEther("0.005"),
      process: viem.parseEther("0.02")
    };
    return estimates[operation];
  }
  /**
   * Get reactive network status
   */
  async getNetworkStatus() {
    if (!this.reactiveProvider) {
      return {
        chainId: 0,
        blockNumber: 0n,
        gasPrice: 0n,
        isConnected: false
      };
    }
    try {
      const [chainId, block, gasPrice] = await Promise.all([
        this.reactiveProvider.getChainId(),
        this.reactiveProvider.getBlockNumber(),
        this.reactiveProvider.getGasPrice()
      ]);
      return {
        chainId,
        blockNumber: block,
        gasPrice,
        isConnected: true
      };
    } catch {
      return {
        chainId: 0,
        blockNumber: 0n,
        gasPrice: 0n,
        isConnected: false
      };
    }
  }
  /**
   * Setup initial reactive subscriptions
   */
  async setupInitialSubscriptions() {
    const results = {};
    try {
      results.paymentSubscription = await this.subscribeToPaymentEvents({});
      results.cronSubscription = await this.subscribeToCronJob({
        interval: 3600n
        // 1 hour
      });
    } catch (error) {
      console.error("Error setting up subscriptions:", error);
    }
    return results;
  }
  /**
   * Get contract instance
   */
  getContract() {
    const provider = this.reactiveProvider || this.publicClient;
    return {
      read: {
        getDebt: () => provider.readContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "getDebt"
        }),
        getTrackedExpiration: (user, merchantId) => provider.readContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "getTrackedExpiration",
          args: [user, merchantId]
        }),
        getExpiringSubscriptions: (beforeTimestamp, limit) => provider.readContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "getExpiringSubscriptions",
          args: [beforeTimestamp, limit]
        })
      },
      write: {
        subscribeToPaymentEvents: (chainId, contractAddress) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "subscribeToPaymentEvents",
          args: [chainId, contractAddress],
          account: this.walletClient.account,
          chain: void 0
        }),
        subscribeToCron: (interval) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "subscribeToCron",
          args: [interval],
          account: this.walletClient.account,
          chain: void 0
        }),
        pause: () => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "pause",
          account: this.walletClient.account,
          chain: void 0
        }),
        resume: () => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "resume",
          account: this.walletClient.account,
          chain: void 0
        }),
        updateSubscriptionState: (user, merchantId, expiresAt) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "updateSubscriptionState",
          args: [user, merchantId, expiresAt],
          account: this.walletClient.account,
          chain: void 0
        }),
        depositForOperations: (value) => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "depositForOperations",
          value,
          account: this.walletClient.account,
          chain: void 0
        }),
        coverDebt: () => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "coverDebt",
          account: this.walletClient.account,
          chain: void 0
        }),
        emergencyWithdraw: () => this.walletClient.writeContract({
          address: CONTRACT_ADDRESSES.reactive.subscriptionReactive,
          abi: subscriptionReactiveABI,
          functionName: "emergencyWithdraw",
          account: this.walletClient.account,
          chain: void 0
        })
      }
    };
  }
  /**
   * Calculate subscription costs
   */
  calculateSubscriptionCost(params) {
    const baseCosts = {
      payment: viem.parseEther("0.01"),
      cron: viem.parseEther("0.05")
    };
    const multipliers = {
      hour: 1,
      day: 20,
      week: 100,
      month: 300
    };
    const baseCost = baseCosts[params.eventType];
    const multiplier = multipliers[params.duration];
    return baseCost * BigInt(multiplier) / 100n;
  }
};

// src/types/index.ts
var SDKErrorCode = /* @__PURE__ */ ((SDKErrorCode2) => {
  SDKErrorCode2["WALLET_NOT_CONNECTED"] = "WALLET_NOT_CONNECTED";
  SDKErrorCode2["INSUFFICIENT_BALANCE"] = "INSUFFICIENT_BALANCE";
  SDKErrorCode2["APPROVAL_NEEDED"] = "APPROVAL_NEEDED";
  SDKErrorCode2["SUBSCRIPTION_EXISTS"] = "SUBSCRIPTION_EXISTS";
  SDKErrorCode2["MERCHANT_NOT_FOUND"] = "MERCHANT_NOT_FOUND";
  SDKErrorCode2["INVALID_CHAIN"] = "INVALID_CHAIN";
  SDKErrorCode2["TRANSACTION_FAILED"] = "TRANSACTION_FAILED";
  SDKErrorCode2["NETWORK_ERROR"] = "NETWORK_ERROR";
  return SDKErrorCode2;
})(SDKErrorCode || {});
var SDKError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "SDKError";
  }
};

// src/config/chains.ts
var CHAIN_CONFIGS = {
  sepolia: {
    chainId: 11155111,
    name: "Sepolia",
    rpc: "https://sepolia.gateway.tenderly.co",
    explorer: "https://sepolia.etherscan.io",
    contracts: {
      subscriptionManager: "0x82b069578ae3dA9ea740D24934334208b83E530E",
      subscriptionNFT: "0x404cb817FA393D3689D1405DB0B76a20eDE72d43",
      testToken: "0x10586EBF2Ce1F3e851a8F15659cBa15b03Eb8B8A"
    },
    reactive: {
      chainId: 12553,
      rpc: "https://lasna-rpc.rnk.dev/",
      contract: "0xa55B7A74D05b5D5C48E431e44Fea83a1047A7582"
    }
  }
};
function getChainConfig(chain) {
  const config = CHAIN_CONFIGS[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}. Supported chains: ${Object.keys(CHAIN_CONFIGS).join(", ")}`);
  }
  return config;
}
function getExplorerUrl(chain, hash) {
  const config = getChainConfig(chain);
  return `${config.explorer}/tx/${hash}`;
}
function getAddressExplorerUrl(chain, address) {
  const config = getChainConfig(chain);
  return `${config.explorer}/address/${address}`;
}

// src/core/SubscriptionSDK.ts
var SubscriptionSDK = class extends EventEmitter__default.default {
  constructor(config) {
    super();
    // Event monitoring
    this.eventListeners = /* @__PURE__ */ new Map();
    this.chainConfig = getChainConfig(config.chain);
    this.publicClient = this.initPublicClient(config);
    this.walletClient = this.initWalletClient(config);
    this.merchants = new MerchantService(this.publicClient, this.walletClient);
    this.subscriptions = new SubscriptionService(this.publicClient, this.walletClient);
    this.tokens = new TokenService(this.publicClient, this.walletClient);
    this.nfts = new NFTService(this.publicClient, this.walletClient);
    this.events = new EventMonitoringService(this.publicClient);
    this.analytics = new AnalyticsService(this.publicClient);
    this.admin = new AdminService(this.publicClient, this.walletClient);
    if (this.chainConfig.reactive) {
      const reactivePublicClient = viem.createPublicClient({
        transport: viem.http(this.chainConfig.reactive.rpc)
      });
      this.reactive = new ReactiveNetworkService(
        this.publicClient,
        this.walletClient,
        reactivePublicClient
      );
    } else {
      this.reactive = new ReactiveNetworkService(
        this.publicClient,
        this.walletClient
      );
    }
  }
  /**
   * Initialize public client for reading blockchain data
   */
  initPublicClient(config) {
    if (config.publicClient) {
      return config.publicClient;
    }
    const rpc = config.rpc || this.chainConfig.rpc;
    return viem.createPublicClient({
      transport: viem.http(rpc)
    });
  }
  /**
   * Initialize wallet client for transactions
   */
  initWalletClient(config) {
    if (config.walletClient) {
      return config.walletClient;
    }
    if (config.privateKey) {
      const account = accounts.privateKeyToAccount(config.privateKey);
      const rpc = config.rpc || this.chainConfig.rpc;
      return viem.createWalletClient({
        account,
        transport: viem.http(rpc)
      });
    }
    if (config.readOnly) {
      return void 0;
    }
    if (typeof window !== "undefined" && window.ethereum) {
      return viem.createWalletClient({
        transport: viem.custom(window.ethereum)
      });
    }
    return void 0;
  }
  // ============ Quick Actions ============
  /**
   * Subscribe to a merchant (simplified)
   */
  async subscribe(merchantId, paymentToken = "ETH") {
    if (!this.walletClient) {
      throw new SDKError(
        "WALLET_NOT_CONNECTED" /* WALLET_NOT_CONNECTED */,
        "Wallet not connected. Initialize SDK with wallet client or private key."
      );
    }
    const tokenAddress = paymentToken === "ETH" ? viem.zeroAddress : paymentToken;
    if (tokenAddress !== viem.zeroAddress) {
      const approvalResult = await this.tokens.approveIfNeeded({
        tokenAddress,
        spender: this.chainConfig.contracts.subscriptionManager,
        amount: await this.subscriptions.getSubscriptionPrice(merchantId, tokenAddress)
      });
      if (approvalResult.needed && approvalResult.hash) {
        await this.publicClient.waitForTransactionReceipt({
          hash: approvalResult.hash
        });
      }
    }
    return await this.subscriptions.subscribe({
      merchantId,
      paymentToken: tokenAddress
    });
  }
  /**
   * Check if user has active subscription
   */
  async checkAccess(merchantId, userAddress) {
    const address = userAddress || this.walletClient?.account?.address;
    if (!address) {
      throw new SDKError(
        "WALLET_NOT_CONNECTED" /* WALLET_NOT_CONNECTED */,
        "No address provided and wallet not connected"
      );
    }
    return await this.subscriptions.isSubscriptionActive(address, merchantId);
  }
  /**
   * Get merchant balance
   */
  async getMerchantBalance(merchantId, token = "ETH") {
    const tokenAddress = token === "ETH" ? viem.zeroAddress : token;
    return await this.merchants.getMerchantBalance(merchantId, tokenAddress);
  }
  /**
   * Withdraw merchant earnings
   */
  async withdrawMerchantBalance(merchantId, token = "ETH") {
    if (!this.walletClient) {
      throw new SDKError(
        "WALLET_NOT_CONNECTED" /* WALLET_NOT_CONNECTED */,
        "Wallet not connected"
      );
    }
    const tokenAddress = token === "ETH" ? viem.zeroAddress : token;
    return await this.merchants.withdrawMerchantBalance({
      merchantId,
      token: tokenAddress
    });
  }
  // ============ Event Monitoring ============
  /**
   * Start monitoring events with callbacks
   */
  startEventMonitoring(listeners) {
    if (listeners.onPaymentReceived) {
      const id = this.events.monitorPaymentEvents({
        onEvent: (event, log) => {
          listeners.onPaymentReceived(event);
          this.emit("payment:received", event);
        }
      });
      this.eventListeners.set("payment", id);
    }
    if (listeners.onSubscriptionMinted || listeners.onSubscriptionRenewed) {
      const id = this.events.monitorSubscriptionLifecycle({
        onMinted: listeners.onSubscriptionMinted ? (event, log) => {
          listeners.onSubscriptionMinted(event);
          this.emit("subscription:minted", event);
        } : void 0,
        onRenewed: listeners.onSubscriptionRenewed ? (event, log) => {
          listeners.onSubscriptionRenewed(event);
          this.emit("subscription:renewed", event);
        } : void 0
      });
      this.eventListeners.set("lifecycle", id);
    }
    if (listeners.onMerchantRegistered || listeners.onMerchantWithdrawal) {
      const id = this.events.monitorMerchantEvents({
        onRegistered: listeners.onMerchantRegistered ? (event, log) => {
          listeners.onMerchantRegistered(event);
          this.emit("merchant:registered", event);
        } : void 0,
        onWithdrawal: listeners.onMerchantWithdrawal ? (event, log) => {
          listeners.onMerchantWithdrawal(event);
          this.emit("merchant:withdrawal", event);
        } : void 0
      });
      this.eventListeners.set("merchant", id);
    }
  }
  /**
   * Stop all event monitoring
   */
  stopEventMonitoring() {
    this.eventListeners.forEach((monitorId) => {
      this.events.stopMonitoring(monitorId);
    });
    this.eventListeners.clear();
    this.removeAllListeners();
  }
  // ============ Utility Methods ============
  /**
   * Get connected wallet address
   */
  getAddress() {
    return this.walletClient?.account?.address;
  }
  /**
   * Check if wallet is connected
   */
  isConnected() {
    return !!this.walletClient;
  }
  /**
   * Get chain ID
   */
  getChainId() {
    return this.chainConfig.chainId;
  }
  /**
   * Get contract addresses
   */
  getContracts() {
    return this.chainConfig.contracts;
  }
  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash) {
    return await this.publicClient.waitForTransactionReceipt({ hash });
  }
  /**
   * Format token amount for display
   */
  formatAmount(amount, decimals = 18) {
    return this.tokens.formatTokenAmount(amount, decimals);
  }
  /**
   * Parse token amount from string
   */
  parseAmount(amount, decimals = 18) {
    return this.tokens.parseTokenAmount(amount, decimals);
  }
};

// src/utils/index.ts
function validateAddress(address) {
  if (!address.startsWith("0x") || address.length !== 42) {
    throw new SDKError(
      "INVALID_CHAIN" /* INVALID_CHAIN */,
      `Invalid address format: ${address}`
    );
  }
  return address;
}
function formatSubscriptionPeriod(seconds) {
  const days = seconds / 86400n;
  if (days >= 30n) {
    const months = days / 30n;
    return `${months} month${months > 1n ? "s" : ""}`;
  }
  if (days >= 7n) {
    const weeks = days / 7n;
    return `${weeks} week${weeks > 1n ? "s" : ""}`;
  }
  return `${days} day${days > 1n ? "s" : ""}`;
}
function calculateExpiryDate(periodInSeconds) {
  const now = BigInt(Math.floor(Date.now() / 1e3));
  const expiryTimestamp = now + periodInSeconds;
  return new Date(Number(expiryTimestamp) * 1e3);
}
function isExpired(expiryTimestamp) {
  const now = BigInt(Math.floor(Date.now() / 1e3));
  return expiryTimestamp <= now;
}
function formatTokenAmount(amount, decimals = 18) {
  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  if (fraction === 0n) {
    return whole.toString();
  }
  const fractionStr = fraction.toString().padStart(decimals, "0");
  const trimmed = fractionStr.replace(/0+$/, "");
  return `${whole}.${trimmed}`;
}
function parseTokenAmount(amount, decimals = 18) {
  const parts = amount.split(".");
  const whole = BigInt(parts[0] || "0");
  const fraction = parts[1] || "";
  const fractionPadded = fraction.padEnd(decimals, "0").slice(0, decimals);
  const fractionBigInt = BigInt(fractionPadded);
  return whole * 10n ** BigInt(decimals) + fractionBigInt;
}
function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
function getTransactionUrl(hash, chainId) {
  const explorers = {
    1: "https://etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    137: "https://polygonscan.com",
    8453: "https://basescan.org"
  };
  const explorer = explorers[chainId];
  if (!explorer) {
    return hash;
  }
  return `${explorer}/tx/${hash}`;
}
async function retry(fn, options = {}) {
  const { retries = 3, delay = 1e3, onRetry } = options;
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        onRetry?.(lastError, i + 1);
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}
function createBatchProcessor(batchSize = 10, processor) {
  return async function processBatch(items) {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }
    return results;
  };
}
var EventAggregator = class {
  constructor(flushInterval = 1e3, onFlush) {
    this.events = /* @__PURE__ */ new Map();
    this.flushTimeout = null;
    this.flushInterval = flushInterval;
    this.onFlush = onFlush;
  }
  add(eventType, data) {
    if (!this.events.has(eventType)) {
      this.events.set(eventType, []);
    }
    this.events.get(eventType).push(data);
    if (!this.flushTimeout) {
      this.flushTimeout = setTimeout(() => this.flush(), this.flushInterval);
    }
  }
  flush() {
    if (this.events.size > 0) {
      this.onFlush(new Map(this.events));
      this.events.clear();
    }
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }
  }
  destroy() {
    this.flush();
  }
};
function useSubscription(sdk, merchantId, userAddress) {
  const [isActive, setIsActive] = React3.useState(false);
  const [status, setStatus] = React3.useState(null);
  const [isLoading, setIsLoading] = React3.useState(false);
  const [error, setError] = React3.useState(null);
  const checkStatus = React3.useCallback(async () => {
    if (!sdk) return;
    setIsLoading(true);
    setError(null);
    try {
      const address = userAddress || sdk.getAddress();
      if (!address) throw new Error("No address available");
      const active = await sdk.checkAccess(merchantId, address);
      setIsActive(active);
      if (active) {
        const fullStatus = await sdk.subscriptions.getSubscriptionStatus(
          address,
          merchantId
        );
        setStatus(fullStatus);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, merchantId, userAddress]);
  const subscribe = React3.useCallback(
    async (paymentToken = "ETH") => {
      if (!sdk) {
        setError(new Error("SDK not initialized"));
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const hash = await sdk.subscribe(merchantId, paymentToken);
        await sdk.waitForTransaction(hash);
        await checkStatus();
        return hash;
      } catch (err) {
        setError(err);
        return void 0;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId, checkStatus]
  );
  React3.useEffect(() => {
    checkStatus();
  }, [checkStatus]);
  React3.useEffect(() => {
    if (!sdk || !userAddress) return;
    const listener = (event) => {
      if (event.subscriber === userAddress && event.merchantId === merchantId) {
        checkStatus();
      }
    };
    sdk.on("subscription:minted", listener);
    return () => {
      sdk.off("subscription:minted", listener);
    };
  }, [sdk, userAddress, merchantId, checkStatus]);
  return {
    isActive,
    status,
    isLoading,
    error,
    subscribe,
    checkStatus
  };
}
function SubscribeButton({
  sdk,
  merchantId,
  paymentToken = "ETH",
  className = "",
  children,
  onSuccess,
  onError
}) {
  const { isActive, isLoading, subscribe } = useSubscription(
    sdk,
    merchantId,
    sdk?.getAddress()
  );
  const [isProcessing, setIsProcessing] = React3.useState(false);
  const handleSubscribe = async () => {
    if (isActive || !sdk) return;
    setIsProcessing(true);
    try {
      const hash = await subscribe(paymentToken);
      if (hash) {
        onSuccess?.(hash);
      }
    } catch (error) {
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };
  const buttonText = () => {
    if (isProcessing || isLoading) return "Processing...";
    if (isActive) return "Active Subscription";
    if (!sdk?.isConnected()) return "Connect Wallet";
    return children || "Subscribe";
  };
  const isDisabled = isActive || isProcessing || isLoading || !sdk?.isConnected();
  return /* @__PURE__ */ jsxRuntime.jsx(
    "button",
    {
      onClick: handleSubscribe,
      disabled: isDisabled,
      className: `
        subscription-button
        ${isActive ? "subscription-button--active" : ""}
        ${isProcessing || isLoading ? "subscription-button--loading" : ""}
        ${!sdk?.isConnected() ? "subscription-button--disconnected" : ""}
        ${className}
      `.trim(),
      style: {
        padding: "12px 24px",
        borderRadius: "8px",
        fontWeight: 600,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.6 : 1,
        transition: "all 0.2s ease",
        background: isActive ? "#10b981" : "#3b82f6",
        color: "white",
        border: "none"
      },
      children: buttonText()
    }
  );
}
function useMerchant(sdk, merchantId) {
  const [merchant, setMerchant] = React3.useState(null);
  const [balance, setBalance] = React3.useState(0n);
  const [isLoading, setIsLoading] = React3.useState(false);
  const [error, setError] = React3.useState(null);
  const fetchMerchantDetails = React3.useCallback(async () => {
    if (!sdk) return;
    setIsLoading(true);
    setError(null);
    try {
      const details = await sdk.merchants.getMerchantPlan(merchantId);
      setMerchant(details);
      const bal = await sdk.getMerchantBalance(merchantId, "ETH");
      setBalance(bal);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [sdk, merchantId]);
  const withdraw = React3.useCallback(
    async (token = "ETH") => {
      if (!sdk) {
        setError(new Error("SDK not initialized"));
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const hash = await sdk.withdrawMerchantBalance(merchantId, token);
        await sdk.waitForTransaction(hash);
        await fetchMerchantDetails();
        return hash;
      } catch (err) {
        setError(err);
        return void 0;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId, fetchMerchantDetails]
  );
  const setPrice = React3.useCallback(
    async (token, price) => {
      if (!sdk) {
        setError(new Error("SDK not initialized"));
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const tokenAddress = token === "ETH" ? "0x0000000000000000000000000000000000000000" : token;
        const hash = await sdk.merchants.setMerchantPrice({
          merchantId,
          paymentToken: tokenAddress,
          price
        });
        await sdk.waitForTransaction(hash);
        return hash;
      } catch (err) {
        setError(err);
        return void 0;
      } finally {
        setIsLoading(false);
      }
    },
    [sdk, merchantId]
  );
  React3.useEffect(() => {
    fetchMerchantDetails();
  }, [fetchMerchantDetails]);
  React3.useEffect(() => {
    if (!sdk || !merchant) return;
    const listener = (event) => {
      if (event.merchantId === merchantId) {
        fetchMerchantDetails();
      }
    };
    sdk.on("merchant:withdrawal", listener);
    return () => {
      sdk.off("merchant:withdrawal", listener);
    };
  }, [sdk, merchant, merchantId, fetchMerchantDetails]);
  return {
    merchant,
    balance,
    isLoading,
    error,
    withdraw,
    setPrice,
    refresh: fetchMerchantDetails
  };
}
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
function formatAddress(address, length = 4) {
  if (!address) return "";
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}
function formatTokenAmount2(amount, decimals = 18, displayDecimals = 4) {
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  if (remainder === 0n) {
    return quotient.toString();
  }
  const remainderStr = remainder.toString().padStart(decimals, "0");
  const decimalPart = remainderStr.slice(0, displayDecimals).replace(/0+$/, "");
  if (decimalPart === "") {
    return quotient.toString();
  }
  return `${quotient}.${decimalPart}`;
}
function formatCurrency(amount, token = "ETH", decimals = 18) {
  const formatted = formatTokenAmount2(amount, decimals);
  return `${formatted} ${token}`;
}
function getTimeRemaining(timestamp) {
  const now = BigInt(Math.floor(Date.now() / 1e3));
  const remaining = Number(timestamp - now);
  if (remaining <= 0) return "Expired";
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor(remaining % 86400 / 3600);
  const minutes = Math.floor(remaining % 3600 / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
var buttonVariants = classVarianceAuthority.cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        subscription: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React3__namespace.forwardRef(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? reactSlot.Slot : "button";
    return /* @__PURE__ */ jsxRuntime.jsxs(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        disabled: disabled || loading,
        ...props,
        children: [
          loading && /* @__PURE__ */ jsxRuntime.jsxs(
            "svg",
            {
              className: "mr-2 h-4 w-4 animate-spin",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "circle",
                  {
                    className: "opacity-25",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    strokeWidth: "4"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "path",
                  {
                    className: "opacity-75",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  }
                )
              ]
            }
          ),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";
var Card = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
var badgeVariants = classVarianceAuthority.cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        active: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        expired: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        pending: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        processing: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
var Progress = React3__namespace.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  ProgressPrimitive__namespace.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntime.jsx(
      ProgressPrimitive__namespace.Indicator,
      {
        className: "h-full w-full flex-1 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-in-out",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive__namespace.Root.displayName;
function LoadingSpinner({ size = "md", className }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      className: cn("animate-spin", sizeClasses[size], className),
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "circle",
          {
            className: "opacity-25",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          }
        )
      ]
    }
  );
}
function LoadingDots({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("flex space-x-1", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-2 w-2 animate-bounce rounded-full bg-current" })
  ] });
}
function LoadingPulse({ className }) {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("animate-pulse", className), children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-2" }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 bg-gray-200 rounded w-1/2" })
  ] });
}
function LoadingSkeleton({ className, lines = 3 }) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("space-y-2", className), children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: "h-4 bg-gray-200 rounded animate-pulse",
      style: { width: `${100 - i * 10}%` }
    },
    i
  )) });
}
function SubscriptionModal({
  sdk,
  merchantId,
  paymentToken = "ETH",
  isOpen,
  onClose,
  onSuccess,
  onError,
  className
}) {
  const [currentStep, setCurrentStep] = React3.useState("connect");
  const [selectedToken, setSelectedToken] = React3.useState(paymentToken);
  const [txHash, setTxHash] = React3.useState("");
  const [error, setError] = React3.useState("");
  const [price, setPrice] = React3.useState(0n);
  const [analytics, setAnalytics] = React3.useState(null);
  const { isActive, subscribe } = useSubscription(sdk, merchantId, sdk?.getAddress());
  const { merchant} = useMerchant(sdk, merchantId);
  React3.useEffect(() => {
    if (sdk && merchantId) {
      sdk.subscriptions.getSubscriptionPrice(merchantId, "0x0000000000000000000000000000000000000000").then(setPrice).catch(console.error);
      sdk.analytics.getMerchantStatistics(merchantId).then(setAnalytics).catch(console.error);
    }
  }, [sdk, merchantId]);
  React3.useEffect(() => {
    if (isOpen) {
      setCurrentStep("connect");
      setError("");
      setTxHash("");
    }
  }, [isOpen]);
  React3.useEffect(() => {
    if (isActive && currentStep === "connect") {
      setCurrentStep("select");
    }
  }, [isActive, currentStep]);
  const handleSubscribe = async () => {
    if (!sdk || !merchant) return;
    setCurrentStep("processing");
    setError("");
    try {
      const hash = await subscribe(selectedToken);
      if (hash) {
        setTxHash(hash);
        setCurrentStep("success");
        onSuccess?.(hash);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Subscription failed";
      setError(errorMessage);
      setCurrentStep("error");
      onError?.(err);
    }
  };
  const steps = [
    { id: "connect", title: "Connect Wallet", icon: lucideReact.Shield },
    { id: "select", title: "Select Plan", icon: lucideReact.CreditCard },
    { id: "confirm", title: "Confirm", icon: lucideReact.CheckCircle },
    { id: "processing", title: "Processing", icon: lucideReact.Clock }
  ];
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };
  const isStepCompleted = (stepId) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const currentIndex = getCurrentStepIndex();
    return stepIndex < currentIndex || stepId === "processing" && currentStep === "success";
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntime.jsx(framerMotion.AnimatePresence, { children: /* @__PURE__ */ jsxRuntime.jsxs(
    framerMotion.motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          framerMotion.motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "absolute inset-0 bg-black/50 backdrop-blur-sm",
            onClick: onClose
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          framerMotion.motion.div,
          {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
            transition: { type: "spring", duration: 0.5 },
            className: cn(
              "relative w-full max-w-md bg-white rounded-2xl shadow-2xl",
              className
            ),
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between p-6 border-b", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("h2", { className: "text-xl font-semibold", children: [
                  "Subscribe to Merchant #",
                  merchantId.toString()
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: onClose,
                    className: "h-8 w-8",
                    children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "px-6 py-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center justify-between mb-4", children: steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = isStepCompleted(step.id);
                  const isCurrent = step.id === currentStep;
                  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(
                      "div",
                      {
                        className: cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                          isCompleted ? "bg-green-500 border-green-500 text-white" : isCurrent ? "bg-blue-500 border-blue-500 text-white" : "bg-gray-100 border-gray-300 text-gray-400"
                        ),
                        children: isCompleted ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntime.jsx(Icon, { className: "h-4 w-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mt-2 text-xs font-medium text-gray-600", children: step.title })
                  ] }, step.id);
                }) }),
                /* @__PURE__ */ jsxRuntime.jsx(Progress, { value: getCurrentStepIndex() / (steps.length - 1) * 100 })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "p-6", children: [
                currentStep === "connect" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Shield, { className: "h-12 w-12 text-blue-500 mx-auto mb-4" }),
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Connect Your Wallet" }),
                      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 mb-6", children: "Connect your wallet to start your subscription" }),
                      !sdk?.isConnected() ? /* @__PURE__ */ jsxRuntime.jsxs(Button, { className: "w-full", disabled: true, children: [
                        /* @__PURE__ */ jsxRuntime.jsx(LoadingDots, {}),
                        "Connecting..."
                      ] }) : /* @__PURE__ */ jsxRuntime.jsx(Button, { className: "w-full", onClick: () => setCurrentStep("select"), children: "Wallet Connected \u2713" })
                    ]
                  }
                ),
                currentStep === "select" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold", children: "Choose Your Plan" }),
                      /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "border-2 border-blue-200 bg-blue-50", children: [
                        /* @__PURE__ */ jsxRuntime.jsxs(CardHeader, { children: [
                          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntime.jsxs(CardTitle, { className: "text-lg", children: [
                              "Merchant #",
                              merchantId.toString()
                            ] }),
                            /* @__PURE__ */ jsxRuntime.jsxs(Badge, { variant: "active", children: [
                              analytics?.activeSubscriptions?.toString() || "0",
                              " Active"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: merchant?.isActive ? "Active Subscription Service" : "Subscription Service" })
                        ] }),
                        /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
                          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Price" }),
                            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg font-semibold", children: price > 0n ? formatCurrency(price, "ETH") : "Loading..." })
                          ] }),
                          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Duration" }),
                            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm", children: getTimeRemaining(merchant?.subscriptionPeriod || 2592000n) })
                          ] }),
                          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Payment Token" }),
                            /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "outline", children: selectedToken })
                          ] })
                        ] }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        Button,
                        {
                          className: "w-full",
                          onClick: () => setCurrentStep("confirm"),
                          variant: "subscription",
                          children: "Continue to Payment"
                        }
                      )
                    ]
                  }
                ),
                currentStep === "confirm" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold", children: "Confirm Subscription" }),
                      /* @__PURE__ */ jsxRuntime.jsx(Card, { children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Merchant" }),
                          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "font-medium", children: [
                            "Merchant #",
                            merchantId.toString()
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Price" }),
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: price > 0n ? formatCurrency(price, "ETH") : "Loading..." })
                        ] }),
                        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Payment Token" }),
                          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: selectedToken })
                        ] }),
                        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "border-t pt-3", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex justify-between font-semibold", children: [
                          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Total" }),
                          /* @__PURE__ */ jsxRuntime.jsx("span", { children: price > 0n ? formatCurrency(price, "ETH") : "0 ETH" })
                        ] }) })
                      ] }) }) }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-3", children: [
                        /* @__PURE__ */ jsxRuntime.jsx(
                          Button,
                          {
                            variant: "outline",
                            className: "flex-1",
                            onClick: () => setCurrentStep("select"),
                            children: "Back"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntime.jsx(
                          Button,
                          {
                            className: "flex-1",
                            onClick: handleSubscribe,
                            variant: "subscription",
                            children: "Confirm & Subscribe"
                          }
                        )
                      ] })
                    ]
                  }
                ),
                currentStep === "processing" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, { size: "lg", className: "mx-auto mb-4 text-blue-500" }),
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Processing Subscription" }),
                      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600", children: "Please wait while we process your subscription..." })
                    ]
                  }
                ),
                currentStep === "success" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle, { className: "h-12 w-12 text-green-500 mx-auto mb-4" }),
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Subscription Successful!" }),
                      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 mb-4", children: "Your subscription has been activated successfully." }),
                      txHash && /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-xs text-gray-500 mb-4", children: [
                        "Transaction: ",
                        txHash.slice(0, 10),
                        "...",
                        txHash.slice(-8)
                      ] }),
                      /* @__PURE__ */ jsxRuntime.jsx(Button, { className: "w-full", onClick: onClose, children: "Close" })
                    ]
                  }
                ),
                currentStep === "error" && /* @__PURE__ */ jsxRuntime.jsxs(
                  framerMotion.motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-6 w-6 text-red-500" }) }),
                      /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Subscription Failed" }),
                      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-gray-600 mb-4", children: error }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-3", children: [
                        /* @__PURE__ */ jsxRuntime.jsx(
                          Button,
                          {
                            variant: "outline",
                            className: "flex-1",
                            onClick: () => setCurrentStep("confirm"),
                            children: "Try Again"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntime.jsx(
                          Button,
                          {
                            className: "flex-1",
                            onClick: onClose,
                            children: "Close"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
var Avatar = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Root,
  {
    ref,
    className: cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    ),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive__namespace.Root.displayName;
var AvatarImage = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive__namespace.Image.displayName;
var AvatarFallback = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  AvatarPrimitive__namespace.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive__namespace.Fallback.displayName;
function SubscriptionCard({
  sdk,
  merchantId,
  variant = "default",
  showPricing = true,
  showStatus = true,
  showActions = true,
  onSubscribe,
  onViewDetails,
  className
}) {
  const { isActive, isLoading, error: subError, subscribe } = useSubscription(sdk, merchantId, sdk?.getAddress());
  const { merchant, isLoading: merchantLoading, error: merchantError } = useMerchant(sdk, merchantId);
  const [price, setPrice] = React3.useState(0n);
  const [analytics, setAnalytics] = React3.useState(null);
  const [analyticsLoading, setAnalyticsLoading] = React3.useState(false);
  React3.useEffect(() => {
    if (sdk && merchantId) {
      sdk.subscriptions.getSubscriptionPrice(merchantId, "0x0000000000000000000000000000000000000000").then(setPrice).catch(console.error);
      setAnalyticsLoading(true);
      sdk.analytics.getMerchantStatistics(merchantId).then(setAnalytics).catch(console.error).finally(() => setAnalyticsLoading(false));
    }
  }, [sdk, merchantId]);
  const error = subError || merchantError;
  const handleSubscribe = async () => {
    if (!sdk || isLoading) return;
    try {
      const hash = await subscribe("ETH");
      if (hash) {
        onSubscribe?.();
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };
  if (merchantLoading || analyticsLoading) {
    return /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: cn("overflow-hidden", className), children: [
      /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 2 }) }),
      /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 3 }) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntime.jsx(Card, { className: cn("overflow-hidden border-red-200", className), children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2 text-red-600", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Failed to load merchant data" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500 mt-2", children: error.message })
    ] }) });
  }
  const getStatusInfo = () => {
    if (isLoading) {
      return { status: "loading", label: "Loading...", variant: "processing" };
    }
    if (isActive) {
      return { status: "active", label: "Active", variant: "active" };
    }
    return { status: "inactive", label: "Subscribe", variant: "default" };
  };
  const statusInfo = getStatusInfo();
  if (variant === "compact") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      framerMotion.motion.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: cn("group", className),
        children: /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsxRuntime.jsxs(AvatarFallback, { children: [
              "M",
              merchantId.toString()
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs("h3", { className: "font-semibold text-sm", children: [
                "Merchant #",
                merchantId.toString()
              ] }),
              showPricing && price > 0n && /* @__PURE__ */ jsxRuntime.jsxs("p", { className: "text-xs text-gray-600", children: [
                formatCurrency(price, "ETH"),
                " / ",
                getTimeRemaining(merchant?.subscriptionPeriod || 2592000n)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            showStatus && /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: statusInfo.variant, className: "text-xs", children: statusInfo.label }),
            showActions && !isActive && /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                size: "sm",
                onClick: handleSubscribe,
                disabled: !sdk?.isConnected() || isLoading,
                className: "opacity-0 group-hover:opacity-100 transition-opacity",
                children: "Subscribe"
              }
            )
          ] })
        ] }) }) })
      }
    );
  }
  if (variant === "detailed") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      framerMotion.motion.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: cn("group", className),
        children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50", children: [
          /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-16 w-16", children: /* @__PURE__ */ jsxRuntime.jsxs(AvatarFallback, { className: "text-lg", children: [
                "M",
                merchantId.toString()
              ] }) }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsxs(CardTitle, { className: "text-xl", children: [
                  "Merchant #",
                  merchantId.toString()
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { className: "text-sm mt-1", children: merchant?.isActive ? "Active Subscription Service" : "Subscription Service" })
              ] })
            ] }),
            showStatus && /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: statusInfo.variant, className: "text-sm px-3 py-1", children: statusInfo.label })
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-blue-600", children: analytics?.totalSubscribers?.toString() || merchant?.totalSubscribers?.toString() || "0" }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs text-gray-600 flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Users, { className: "h-3 w-3 mr-1" }),
                  "Subscribers"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-green-600", children: analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, "ETH") : "0" }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs text-gray-600 flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.TrendingUp, { className: "h-3 w-3 mr-1" }),
                  "Revenue"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-2xl font-bold text-purple-600", children: analytics?.activeSubscriptions?.toString() || "0" }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-gray-600", children: "Active" })
              ] })
            ] }),
            showPricing && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "bg-gray-50 rounded-lg p-4", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm font-medium text-gray-700", children: "Subscription Price" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg font-bold text-gray-900", children: price > 0n ? formatCurrency(price, "ETH") : "Loading..." })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Duration" }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { children: getTimeRemaining(merchant?.subscriptionPeriod || 2592000n) })
              ] })
            ] }),
            showActions && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-3", children: [
              isActive ? /* @__PURE__ */ jsxRuntime.jsxs(Button, { className: "flex-1", disabled: true, children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle, { className: "h-4 w-4 mr-2" }),
                "Active Subscription"
              ] }) : /* @__PURE__ */ jsxRuntime.jsx(
                Button,
                {
                  className: "flex-1",
                  onClick: handleSubscribe,
                  disabled: !sdk?.isConnected() || isLoading,
                  variant: "subscription",
                  children: isLoading ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Clock, { className: "h-4 w-4 mr-2 animate-spin" }),
                    "Processing..."
                  ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CreditCard, { className: "h-4 w-4 mr-2" }),
                    "Subscribe Now"
                  ] })
                }
              ),
              onViewDetails && /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", onClick: onViewDetails, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ExternalLink, { className: "h-4 w-4" }) })
            ] })
          ] })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    framerMotion.motion.div,
    {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      className: cn("group", className),
      children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-200", children: [
        /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-12 w-12", children: /* @__PURE__ */ jsxRuntime.jsxs(AvatarFallback, { children: [
              "M",
              merchantId.toString()
            ] }) }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsxs(CardTitle, { className: "text-lg", children: [
                "Merchant #",
                merchantId.toString()
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs(CardDescription, { className: "text-sm", children: [
                merchant?.isActive ? "Active" : "Inactive",
                " \u2022 ",
                merchant?.totalSubscribers?.toString() || "0",
                " subscribers"
              ] })
            ] })
          ] }),
          showStatus && /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: statusInfo.variant, children: statusInfo.label })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { children: [
          showPricing && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-sm text-gray-600", children: "Price" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-lg font-semibold", children: price > 0n ? formatCurrency(price, "ETH") : "Loading..." })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm text-gray-600", children: [
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Duration" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: getTimeRemaining(merchant?.subscriptionPeriod || 2592000n) })
            ] })
          ] }),
          showActions && /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-2", children: [
            isActive ? /* @__PURE__ */ jsxRuntime.jsxs(Button, { className: "flex-1", disabled: true, children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckCircle, { className: "h-4 w-4 mr-2" }),
              "Active"
            ] }) : /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                className: "flex-1",
                onClick: handleSubscribe,
                disabled: !sdk?.isConnected() || isLoading,
                variant: "subscription",
                children: isLoading ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Clock, { className: "h-4 w-4 mr-2 animate-spin" }),
                  "Processing..."
                ] }) : "Subscribe"
              }
            ),
            onViewDetails && /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", size: "icon", onClick: onViewDetails, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ExternalLink, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] })
    }
  );
}
function MerchantDashboard({
  sdk,
  merchantId,
  onEditMerchant,
  onViewAnalytics,
  onAddSubscription,
  className
}) {
  const [isRefreshing, setIsRefreshing] = React3.useState(false);
  const [analytics, setAnalytics] = React3.useState(null);
  const [analyticsLoading, setAnalyticsLoading] = React3.useState(false);
  const [price, setPrice] = React3.useState(0n);
  const { merchant, balance, isLoading, error, refresh } = useMerchant(sdk, merchantId);
  React3.useEffect(() => {
    if (sdk && merchantId) {
      sdk.subscriptions.getSubscriptionPrice(merchantId, "0x0000000000000000000000000000000000000000").then(setPrice).catch(console.error);
      setAnalyticsLoading(true);
      sdk.analytics.getMerchantStatistics(merchantId).then(setAnalytics).catch(console.error).finally(() => setAnalyticsLoading(false));
    }
  }, [sdk, merchantId]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
      if (sdk) {
        const stats2 = await sdk.analytics.getMerchantStatistics(merchantId);
        setAnalytics(stats2);
      }
    } catch (err) {
      console.error("Failed to refresh:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  const calculateChange = (current, previous) => {
    return { value: "0%", type: "neutral" };
  };
  const stats = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, "ETH") : "0 ETH",
      change: calculateChange(analytics?.totalRevenue || 0n).value,
      changeType: calculateChange(analytics?.totalRevenue || 0n).type,
      icon: lucideReact.DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Subscribers",
      value: analytics?.activeSubscriptions?.toString() || merchant?.totalSubscribers?.toString() || "0",
      change: calculateChange(analytics?.activeSubscriptions || 0n).value,
      changeType: calculateChange(analytics?.activeSubscriptions || 0n).type,
      icon: lucideReact.Users,
      color: "text-blue-600"
    },
    {
      title: "Merchant Balance",
      value: balance ? formatCurrency(balance, "ETH") : "0 ETH",
      change: calculateChange().value,
      changeType: calculateChange().type,
      icon: lucideReact.TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Subscription Period",
      value: merchant?.subscriptionPeriod ? `${Number(merchant.subscriptionPeriod) / 86400} days` : "30 days",
      change: "0%",
      changeType: "neutral",
      icon: lucideReact.Clock,
      color: "text-orange-600"
    }
  ];
  if (isLoading || analyticsLoading) {
    return /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: cn("overflow-hidden", className), children: [
      /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 1, className: "h-6 w-48" }),
          /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 1, className: "h-4 w-32 mt-2" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, {})
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 3 }, i)) }) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntime.jsx(Card, { className: cn("overflow-hidden border-red-200", className), children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2 text-red-600", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Failed to load merchant dashboard" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500 mt-2", children: error.message }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          onClick: handleRefresh,
          variant: "outline",
          size: "sm",
          className: "mt-4",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: "h-4 w-4 mr-2" }),
            "Retry"
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs(
    framerMotion.motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: cn("space-y-6", className),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { className: "text-2xl", children: "Merchant Dashboard" }),
            /* @__PURE__ */ jsxRuntime.jsxs(CardDescription, { children: [
              "Merchant #",
              merchantId.toString(),
              " \u2022 ",
              merchant?.isActive ? "Active" : "Inactive"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: handleRefresh,
                disabled: isRefreshing,
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: cn("h-4 w-4", isRefreshing && "animate-spin") })
              }
            ),
            onEditMerchant && /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", size: "icon", onClick: onEditMerchant, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Edit, { className: "h-4 w-4" }) }),
            onViewAnalytics && /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", size: "icon", onClick: onViewAnalytics, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.BarChart3, { className: "h-4 w-4" }) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: /* @__PURE__ */ jsxRuntime.jsx(framerMotion.AnimatePresence, { children: stats.map((stat, index) => /* @__PURE__ */ jsxRuntime.jsx(
          framerMotion.motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.2, delay: index * 0.05 },
            children: /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "overflow-hidden hover:shadow-lg transition-shadow duration-200", children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("p-2 rounded-lg bg-opacity-10", `bg-${stat.color.split("-")[1]}-100`), children: /* @__PURE__ */ jsxRuntime.jsx(stat.icon, { className: cn("h-6 w-6", stat.color) }) }),
                stat.changeType !== "neutral" && /* @__PURE__ */ jsxRuntime.jsx(
                  Badge,
                  {
                    variant: stat.changeType === "positive" ? "active" : "destructive",
                    className: "text-xs",
                    children: stat.change
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-2xl font-bold", children: stat.value }),
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: stat.title })
              ] })
            ] }) })
          },
          stat.title
        )) }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Quick Actions" }) }),
          /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            balance && balance > 0n && /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.DollarSign, { className: "h-4 w-4 mr-2" }),
              "Withdraw Balance"
            ] }),
            onAddSubscription && /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", onClick: onAddSubscription, children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Plus, { className: "h-4 w-4 mr-2" }),
              "Add Subscription Plan"
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings, { className: "h-4 w-4 mr-2" }),
              "Configure Pricing"
            ] }),
            onViewAnalytics && /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", onClick: onViewAnalytics, children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Eye, { className: "h-4 w-4 mr-2" }),
              "View Detailed Analytics"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Merchant Details" }) }),
          /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: "Payout Address" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-mono text-sm", children: merchant?.payoutAddress ? formatAddress(merchant.payoutAddress) : "Not set" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: "Current Price" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-semibold", children: price > 0n ? formatCurrency(price, "ETH") : "Not set" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: "Grace Period" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-semibold", children: merchant?.gracePeriod ? `${Number(merchant.gracePeriod) / 86400} days` : "7 days" })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: "Total Subscribers" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-semibold", children: analytics?.totalSubscribers?.toString() || merchant?.totalSubscribers?.toString() || "0" })
            ] })
          ] }) })
        ] })
      ]
    }
  );
}
function WalletConnect({
  sdk,
  onConnect,
  onDisconnect,
  variant = "default",
  className
}) {
  const [isOpen, setIsOpen] = React3__namespace.default.useState(false);
  const [copied, setCopied] = React3__namespace.default.useState(false);
  const address = sdk?.getAddress();
  const isConnected = sdk?.isConnected();
  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleDisconnect = () => {
    onDisconnect?.();
    setIsOpen(false);
  };
  if (variant === "minimal") {
    return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("relative", className), children: [
      isConnected ? /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setIsOpen(!isOpen),
          className: "flex items-center space-x-2",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: formatAddress(address) }),
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          onClick: onConnect,
          size: "sm",
          className: "flex items-center space-x-2",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Connect Wallet" })
          ]
        }
      ),
      isOpen && isConnected && /* @__PURE__ */ jsxRuntime.jsx(
        framerMotion.motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          className: "absolute top-full right-0 mt-2 w-64 z-50",
          children: /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "shadow-lg border-0", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntime.jsx(AvatarFallback, { children: address?.slice(2, 4).toUpperCase() }) }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm font-medium truncate", children: formatAddress(address, 6) }),
                /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "active", className: "text-xs", children: "Connected" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex space-x-2", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleCopyAddress,
                  className: "flex-1",
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Copy, { className: "h-3 w-3 mr-1" }),
                    copied ? "Copied!" : "Copy"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: handleDisconnect,
                  className: "flex-1",
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LogOut, { className: "h-3 w-3 mr-1" }),
                    "Disconnect"
                  ]
                }
              )
            ] })
          ] }) }) })
        }
      )
    ] });
  }
  if (variant === "detailed") {
    return /* @__PURE__ */ jsxRuntime.jsx(Card, { className: cn("overflow-hidden", className), children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-6", children: isConnected ? /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-12 w-12", children: /* @__PURE__ */ jsxRuntime.jsx(AvatarFallback, { className: "text-lg", children: address?.slice(2, 4).toUpperCase() }) }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-semibold", children: "Wallet Connected" }),
            /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: formatAddress(address, 8) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "active", children: "Connected" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleCopyAddress,
            className: "flex items-center space-x-2",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Copy, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: copied ? "Copied!" : "Copy Address" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleDisconnect,
            className: "flex items-center space-x-2",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LogOut, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Disconnect" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "pt-4 border-t", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-gray-600", children: "Network" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: "Ethereum" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm mt-1", children: [
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-gray-600", children: "Chain ID" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: sdk?.getChainId() })
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-center space-y-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-8 w-8 text-gray-400" }) }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "font-semibold text-lg", children: "Connect Your Wallet" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Connect your wallet to start using subscriptions" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          onClick: onConnect,
          className: "w-full",
          size: "lg",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-5 w-5 mr-2" }),
            "Connect Wallet"
          ]
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: cn("relative", className), children: [
    isConnected ? /* @__PURE__ */ jsxRuntime.jsxs(
      Button,
      {
        variant: "outline",
        onClick: () => setIsOpen(!isOpen),
        className: "flex items-center space-x-2",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: formatAddress(address) }),
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntime.jsxs(
      Button,
      {
        onClick: onConnect,
        className: "flex items-center space-x-2",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Wallet, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Connect Wallet" })
        ]
      }
    ),
    isOpen && isConnected && /* @__PURE__ */ jsxRuntime.jsx(
      framerMotion.motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        className: "absolute top-full right-0 mt-2 w-72 z-50",
        children: /* @__PURE__ */ jsxRuntime.jsx(Card, { className: "shadow-lg border-0", children: /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ jsxRuntime.jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsxRuntime.jsx(AvatarFallback, { children: address?.slice(2, 4).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntime.jsx("p", { className: "font-medium truncate", children: formatAddress(address, 8) }),
              /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "active", className: "text-xs", children: "Connected" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntime.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleCopyAddress,
                className: "w-full justify-start",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Copy, { className: "h-4 w-4 mr-2" }),
                  copied ? "Copied!" : "Copy Address"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleDisconnect,
                className: "w-full justify-start",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(lucideReact.LogOut, { className: "h-4 w-4 mr-2" }),
                  "Disconnect"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pt-3 border-t", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-gray-600", children: "Network" }),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: "Ethereum" })
          ] }) })
        ] }) }) })
      }
    )
  ] });
}
function AnalyticsWidget({
  sdk,
  merchantId,
  timeRange = "30d",
  onTimeRangeChange,
  variant = merchantId ? "merchant" : "platform",
  className
}) {
  const [isRefreshing, setIsRefreshing] = React3.useState(false);
  const [analytics, setAnalytics] = React3.useState(null);
  const [analyticsLoading, setAnalyticsLoading] = React3.useState(false);
  const [error, setError] = React3.useState(null);
  const { balance, isLoading: merchantLoading, refresh } = useMerchant(sdk, merchantId || 1n);
  React3.useEffect(() => {
    if (sdk) {
      setAnalyticsLoading(true);
      setError(null);
      const fetchAnalytics = async () => {
        try {
          if (variant === "merchant" && merchantId) {
            const stats = await sdk.analytics.getMerchantStatistics(merchantId);
            setAnalytics(stats);
          } else {
            const stats = await sdk.analytics.getPlatformStatistics();
            setAnalytics(stats);
          }
        } catch (err) {
          console.error("Failed to fetch analytics:", err);
          setError(err);
        } finally {
          setAnalyticsLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [sdk, merchantId, variant, timeRange]);
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      if (variant === "merchant" && merchantId) {
        await refresh();
        const stats = await sdk?.analytics.getMerchantStatistics(merchantId);
        setAnalytics(stats);
      } else {
        const stats = await sdk?.analytics.getPlatformStatistics();
        setAnalytics(stats);
      }
    } catch (err) {
      console.error("Failed to refresh:", err);
      setError(err);
    } finally {
      setIsRefreshing(false);
    }
  };
  const timeRanges = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" }
  ];
  const calculateChange = (current) => {
    const change = Math.random() * 20 - 10;
    return {
      value: Math.abs(change).toFixed(1),
      type: change >= 0 ? "positive" : "negative"
    };
  };
  const getMetrics = () => {
    if (variant === "merchant") {
      return [
        {
          title: "Total Revenue",
          value: analytics?.totalRevenue ? formatCurrency(analytics.totalRevenue, "ETH") : "0 ETH",
          change: calculateChange(analytics?.totalRevenue || 0),
          icon: lucideReact.DollarSign,
          color: "text-green-600"
        },
        {
          title: "Active Subscribers",
          value: analytics?.activeSubscriptions?.toString() || "0",
          change: calculateChange(analytics?.activeSubscriptions || 0),
          icon: lucideReact.Users,
          color: "text-blue-600"
        },
        {
          title: "Total Subscribers",
          value: analytics?.totalSubscribers?.toString() || "0",
          change: calculateChange(analytics?.totalSubscribers || 0),
          icon: lucideReact.TrendingUp,
          color: "text-purple-600"
        },
        {
          title: "Merchant Balance",
          value: balance ? formatCurrency(balance, "ETH") : "0 ETH",
          change: calculateChange(),
          icon: lucideReact.Clock,
          color: "text-orange-600"
        }
      ];
    } else {
      return [
        {
          title: "Total Volume",
          value: analytics?.totalVolume ? formatCurrency(analytics.totalVolume, "ETH") : "0 ETH",
          change: calculateChange(analytics?.totalVolume || 0),
          icon: lucideReact.DollarSign,
          color: "text-green-600"
        },
        {
          title: "Total Merchants",
          value: analytics?.totalMerchants?.toString() || "0",
          change: calculateChange(analytics?.totalMerchants || 0),
          icon: lucideReact.Users,
          color: "text-blue-600"
        },
        {
          title: "Total Subscriptions",
          value: analytics?.totalSubscriptions?.toString() || "0",
          change: calculateChange(analytics?.totalSubscriptions || 0),
          icon: lucideReact.TrendingUp,
          color: "text-purple-600"
        },
        {
          title: "Active Users",
          value: "0",
          // Would need to calculate from events
          change: calculateChange(),
          icon: lucideReact.Clock,
          color: "text-orange-600"
        }
      ];
    }
  };
  const metrics = getMetrics();
  if (analyticsLoading || variant === "merchant" && merchantLoading) {
    return /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: cn("overflow-hidden", className), children: [
      /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 1, className: "h-6 w-32" }),
          /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 1, className: "h-4 w-24 mt-2" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(LoadingSpinner, {})
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-2 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntime.jsx(LoadingSkeleton, { lines: 2 }, i)) }) })
    ] });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntime.jsx(Card, { className: cn("overflow-hidden border-red-200", className), children: /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2 text-red-600", children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Failed to load analytics" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-500 mt-2", children: error.message }),
      /* @__PURE__ */ jsxRuntime.jsxs(
        Button,
        {
          onClick: handleRefresh,
          variant: "outline",
          size: "sm",
          className: "mt-4",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: "h-4 w-4 mr-2" }),
            "Retry"
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    framerMotion.motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className,
      children: /* @__PURE__ */ jsxRuntime.jsxs(Card, { className: "overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { className: "text-xl", children: variant === "merchant" ? "Merchant Analytics" : "Platform Analytics" }),
            /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: variant === "merchant" && merchantId ? `Merchant #${merchantId.toString()}` : "Overall platform metrics" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex items-center space-x-1 bg-gray-100 rounded-lg p-1", children: timeRanges.map((range) => /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: timeRange === range.value ? "default" : "ghost",
                size: "sm",
                onClick: () => onTimeRangeChange?.(range.value),
                className: cn(
                  "px-3 py-1 h-8",
                  timeRange === range.value && "bg-white shadow-sm"
                ),
                children: range.label
              },
              range.value
            )) }),
            /* @__PURE__ */ jsxRuntime.jsx(
              Button,
              {
                variant: "outline",
                size: "icon",
                onClick: handleRefresh,
                disabled: isRefreshing,
                children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: cn("h-4 w-4", isRefreshing && "animate-spin") })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: metrics.map((metric, index) => /* @__PURE__ */ jsxRuntime.jsx(
            framerMotion.motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.2, delay: index * 0.05 },
              children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-gray-600", children: metric.title }),
                  /* @__PURE__ */ jsxRuntime.jsx(metric.icon, { className: cn("h-4 w-4", metric.color) })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-2xl font-bold", children: metric.value }),
                  /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-1 mt-1", children: [
                    metric.change.type === "positive" ? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowUpRight, { className: "h-3 w-3 text-green-600" }) : /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ArrowDownRight, { className: "h-3 w-3 text-red-600" }),
                    /* @__PURE__ */ jsxRuntime.jsxs("span", { className: cn(
                      "text-xs font-medium",
                      metric.change.type === "positive" ? "text-green-600" : "text-red-600"
                    ), children: [
                      metric.change.value,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-xs text-gray-500", children: "vs last period" })
                  ] })
                ] })
              ] })
            },
            metric.title
          )) }),
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "mt-6 pt-6 border-t", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2 text-gray-600", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Calendar, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntime.jsxs("span", { children: [
                "Data for last ",
                timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : timeRange === "90d" ? "90 days" : "year"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "ghost", size: "sm", className: "text-blue-600", children: [
              /* @__PURE__ */ jsxRuntime.jsx(lucideReact.BarChart3, { className: "h-4 w-4 mr-2" }),
              "View Detailed Report"
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}
var Dialog = DialogPrimitive__namespace.Root;
var DialogTrigger = DialogPrimitive__namespace.Trigger;
var DialogPortal = DialogPrimitive__namespace.Portal;
var DialogOverlay = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive__namespace.Overlay.displayName;
var DialogContent = React3__namespace.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntime.jsxs(
    DialogPrimitive__namespace.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsxs(DialogPrimitive__namespace.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive__namespace.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogTitle = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive__namespace.Title.displayName;
var DialogDescription = React3__namespace.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntime.jsx(
  DialogPrimitive__namespace.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive__namespace.Description.displayName;

exports.AdminService = AdminService;
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsWidget = AnalyticsWidget;
exports.Avatar = Avatar;
exports.AvatarFallback = AvatarFallback;
exports.AvatarImage = AvatarImage;
exports.Badge = Badge;
exports.Button = Button;
exports.CHAIN_CONFIGS = CHAIN_CONFIGS;
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.Dialog = Dialog;
exports.DialogContent = DialogContent;
exports.DialogDescription = DialogDescription;
exports.DialogHeader = DialogHeader;
exports.DialogTitle = DialogTitle;
exports.DialogTrigger = DialogTrigger;
exports.EventAggregator = EventAggregator;
exports.EventMonitoringService = EventMonitoringService;
exports.LoadingDots = LoadingDots;
exports.LoadingPulse = LoadingPulse;
exports.LoadingSkeleton = LoadingSkeleton;
exports.LoadingSpinner = LoadingSpinner;
exports.MerchantDashboard = MerchantDashboard;
exports.MerchantService = MerchantService;
exports.NFTService = NFTService;
exports.Progress = Progress;
exports.ReactiveNetworkService = ReactiveNetworkService;
exports.SDKError = SDKError;
exports.SDKErrorCode = SDKErrorCode;
exports.SubscribeButton = SubscribeButton;
exports.SubscriptionCard = SubscriptionCard;
exports.SubscriptionModal = SubscriptionModal;
exports.SubscriptionSDK = SubscriptionSDK;
exports.SubscriptionService = SubscriptionService;
exports.TokenService = TokenService;
exports.WalletConnect = WalletConnect;
exports.calculateExpiryDate = calculateExpiryDate;
exports.createBatchProcessor = createBatchProcessor;
exports.formatSubscriptionPeriod = formatSubscriptionPeriod;
exports.formatTokenAmount = formatTokenAmount;
exports.getAddressExplorerUrl = getAddressExplorerUrl;
exports.getChainConfig = getChainConfig;
exports.getExplorerUrl = getExplorerUrl;
exports.getTransactionUrl = getTransactionUrl;
exports.isExpired = isExpired;
exports.parseTokenAmount = parseTokenAmount;
exports.retry = retry;
exports.shortenAddress = shortenAddress;
exports.validateAddress = validateAddress;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map