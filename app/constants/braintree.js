const isSandbox = true;

export const Braintree = {
  environment: isSandbox ? "braintree.Environment.Sandbox" : "braintree.Environment.Production",
  merchantId: isSandbox ? "m66dhkzh66jhcw6x" : "jdp26m7mh8vbt7cr",
  publicKey: isSandbox ? "gg65yby3954fpxgk" : "yshpvpkqfmvxyyh8",
  privateKey: isSandbox ? "f7e5cdc42eb7f230d80f94fe7db3cc0e" : "1d284ba230be32083c8503eee2d23f08"
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
