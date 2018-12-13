import { API } from './api'

export const Braintree = {
  environment: API.IS_SANDBOX ? "braintree.Environment.Sandbox" : "braintree.Environment.Production",
  merchantId: API.IS_SANDBOX  ? "m66dhkzh66jhcw6x" : "jdp26m7mh8vbt7cr",
  publicKey: API.IS_SANDBOX  ? "gg65yby3954fpxgk" : "yshpvpkqfmvxyyh8",
  privateKey: API.IS_SANDBOX  ? "f7e5cdc42eb7f230d80f94fe7db3cc0e" : "1d284ba230be32083c8503eee2d23f08"
};

// Production Enviorment :

// environment: braintree.Environment.Production,
// merchantId: 'jdp26m7mh8vbt7cr',
// publicKey: 'yshpvpkqfmvxyyh8',
// privateKey: '1d284ba230be32083c8503eee2d23f08'

// ------------------------------------------------------------------------
// SandBox

// BRAINTREE_MERCHANT_ID = 'm66dhkzh66jhcw6x'
// BRAINTREE_PUBLIC_KEY = 'gg65yby3954fpxgk'
// BRAINTREE_PRIVATE_KEY = 'f7e5cdc42ebf230d80f94fe7db3cc0e'
